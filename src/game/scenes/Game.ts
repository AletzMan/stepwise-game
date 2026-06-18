import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import * as Phaser from 'phaser';
import { Command, LevelData, TileInfo, TILE, BLOCKED_TILES, getLevel } from '../levels';
import { ERRORS } from '../data/errors';

const HEIGHT_STEP = 16;

export class Game extends Scene {
    explorerPos: { x: number; y: number; z: number };
    direction: number;
    isRunning: boolean;
    shouldStop: boolean;
    explorer: Phaser.GameObjects.Sprite;
    shadow: Phaser.GameObjects.Ellipse;
    goalTiles: Set<string>;
    activatedGoals: Set<string>;
    currentLevel: LevelData | null;
    mapObjects: Phaser.GameObjects.GameObject[];
    executionSpeed: number;
    idleFloatingTween: Phaser.Tweens.Tween | null;
    introAnimating: boolean;
    cameraAngle: number;
    isRotating: boolean;
    isTopDown: boolean;

    constructor() {
        super('Game');
        this.explorerPos = { x: 0, y: 0, z: 0 };
        this.direction = 0;
        this.isRunning = false;
        this.shouldStop = false;
        this.goalTiles = new Set();
        this.activatedGoals = new Set();
        this.currentLevel = null;
        this.mapObjects = [];
        this.executionSpeed = 0.5;
        this.idleFloatingTween = null;
        this.introAnimating = false;
        this.cameraAngle = 0;
        this.isRotating = false;
        this.isTopDown = false;
    }

    preload() {
        this.load.spritesheet('explorer', '/assets/sprite-sheet.png', { frameWidth: 64, frameHeight: 96 });
        this.load.spritesheet('tiles', '/assets/tiles.png', { frameWidth: 64, frameHeight: 96 });
    }

    create() {
        this.createAnimations();

        // Limpiar listeners previos del EventBus para evitar duplicados
        // cuando la escena se destruye y recrea (por navegación entre rutas)
        EventBus.removeAllListeners('load-level');
        EventBus.removeAllListeners('run-program');
        EventBus.removeAllListeners('stop-program');
        EventBus.removeAllListeners('reset-level');
        EventBus.removeAllListeners('set-speed');
        EventBus.removeAllListeners('rotate-camera');
        EventBus.removeAllListeners('toggle-topdown');

        // Escuchar eventos desde la interfaz de React
        EventBus.on('load-level', (levelId: number) => {
            this.loadLevel(levelId);
        });

        EventBus.on('run-program', (data: {
            main: { cmd: Command; value?: number }[];
            f1: { cmd: Command; value?: number }[];
            f2: { cmd: Command; value?: number }[];
            f3: { cmd: Command; value?: number }[];
        }) => {
            this.runProgram(data.main, data.f1, data.f2, data.f3);
        });

        EventBus.on('stop-program', () => {
            this.stopProgram();
        });

        EventBus.on('reset-level', () => {
            if (this.currentLevel) {
                this.resetExplorerPosition();
                this.isRunning = false;
            }
        });

        EventBus.on('set-speed', (speed: number) => {
            this.executionSpeed = speed;
            if (this.explorer && this.explorer.anims) {
                this.explorer.anims.timeScale = speed;
            }
        });

        EventBus.on('rotate-camera', (steps: number) => {
            this.rotateCamera(steps);
        });

        EventBus.on('toggle-topdown', (topDown: boolean) => {
            this.setTopDown(topDown);
        });

        // Limpiar listeners del EventBus cuando la escena se apague
        this.events.on('shutdown', () => {
            EventBus.removeAllListeners('load-level');
            EventBus.removeAllListeners('run-program');
            EventBus.removeAllListeners('stop-program');
            EventBus.removeAllListeners('reset-level');
            EventBus.removeAllListeners('set-speed');
            EventBus.removeAllListeners('rotate-camera');
            EventBus.removeAllListeners('toggle-topdown');
        });

        // Cargar el nivel correspondiente según el pathname de la URL o usar 1 por defecto
        const pathParts = window.location.pathname.split('/');
        const urlLevelId = parseInt(pathParts[pathParts.length - 1], 10);
        const startLevelId = !isNaN(urlLevelId) ? urlLevelId : 1;

        this.loadLevel(startLevelId);

        EventBus.emit('current-scene-ready', this);
    }

    loadLevel(levelId: number) {
        const level = getLevel(levelId);
        if (!level) return;

        this.currentLevel = level;
        this.shouldStop = true; // Detener cualquier ejecución actual
        this.isRunning = false;
        this.isRotating = false;
        this.cameraAngle = 0;
        this.tweens.killAll(); // Finalizar todos los movimientos activos
        this.activatedGoals = new Set();

        // Limpiar el mapa existente
        this.mapObjects.forEach(obj => obj.destroy());
        this.mapObjects = [];
        this.goalTiles = new Set();

        // Destruir el explorer existente si está presente
        if (this.explorer) {
            this.explorer.destroy();
        }
        if (this.shadow) {
            this.shadow.destroy();
        }

        // Configurar la posición del explorer
        this.explorerPos = {
            x: level.startPos.x,
            y: level.startPos.y,
            z: level.map[level.startPos.y][level.startPos.x].h,
        };
        this.direction = level.startDirection;

        // Asignar los objetivos (ahora solo como Set)
        this.goalTiles = new Set();

        // Crear el mapa
        // Crear el mapa con animación de bloques cayendo
        const introDuration = this.createMap(level.map, true);


        // Crear el explorer (oculto inicialmente para la animación de intro)
        const startPos = this.cartToIso(this.explorerPos.x, this.explorerPos.y, this.explorerPos.z);

        this.shadow = this.add.ellipse(startPos.x, startPos.y, 24, 12, 0x000000, 0.25);
        this.shadow.setDepth(this.getDepth(this.explorerPos.x, this.explorerPos.y, this.explorerPos.z, 0.1)).setOrigin(0.55, -0.78);
        this.shadow.setAlpha(0);

        this.explorer = this.add.sprite(startPos.x, startPos.y, 'explorer').setOrigin(0.55, 0.68);
        this.explorer.setDepth(this.getDepth(this.explorerPos.x, this.explorerPos.y, this.explorerPos.z, 1));
        this.explorer.setScale(0.55);
        this.explorer.setAlpha(0);

        // Reproducir la animación de reposo (idle)
        const visualDirection = this.getVisualDirection();
        const dirKey = ['se', 'sw', 'nw', 'ne'][visualDirection];
        const idleFrame = visualDirection * 4;
        this.explorer.setFrame(idleFrame);
        this.explorer.play(`idle-${dirKey}`, true);
        if (this.explorer.anims) {
            this.explorer.anims.timeScale = this.executionSpeed;
        }

        // Mostrar explorer y sombra después de que los bloques terminen de caer
        this.introAnimating = true;
        this.time.delayedCall(introDuration, () => {
            if (this.explorer && this.explorer.active) {
                this.tweens.add({
                    targets: [this.explorer, this.shadow],
                    alpha: 1,
                    duration: 350,
                    ease: 'Quad.easeOut',
                });
            }
            this.introAnimating = false;
        });

        this.shouldStop = false; // Permitir una nueva ejecución

        EventBus.emit('level-loaded', {
            id: level.id,
            name: `Level ${level.id}`,
            description: level.description,
            availableCommands: level.availableCommands,
            mainSlots: level.mainSlots,
            f1Slots: level.f1Slots,
            f2Slots: level.f2Slots,
            f3Slots: level.f3Slots,
        });
    }

    async runProgram(main: { cmd: Command, value?: number }[], f1: { cmd: Command, value?: number }[], f2: { cmd: Command, value?: number }[], f3: { cmd: Command, value?: number }[]) {
        if (this.isRunning || this.introAnimating) return;

        // Reiniciar el estado del nivel sin volver a cargar los elementos visuales
        this.resetExplorerPosition();

        this.isRunning = true;
        this.shouldStop = false;
        this.activatedGoals = new Set();

        // Restablecer los elementos visuales de las casillas objetivo
        for (const key of this.goalTiles) {
            const [x, y] = key.split(',').map(Number);
            const z = this.currentLevel!.map[y][x].h;
            const block = this.children.getByName(`${x},${y},${z}`) as Phaser.GameObjects.Image;
            if (block) {
                block.setFrame(this.currentLevel!.map[y][x].t);
                if (this.currentLevel!.map[y][x].t === TILE.BLUE) {
                    this.updateGoalBeam(x, y, z, 0x00aaff);
                } else {
                    this.updateGoalBeam(x, y, z, null);
                }
            }
        }

        EventBus.emit('execution-start');

        try {
            await this.executeCommandList(main, f1, f2, f3, 0);

            if (!this.shouldStop) {
                // Verificar si todos los objetivos están activados
                const totalGoals = this.goalTiles.size;
                const allActivated = totalGoals > 0 && this.activatedGoals.size === totalGoals;

                if (allActivated) {
                    EventBus.emit('level-complete', this.currentLevel?.id);
                } else {
                    EventBus.emit('execution-complete', { success: false, message: 'Not all goals activated' });
                }
            }
        } catch (err) {
            if (!this.shouldStop) {
                EventBus.emit('execution-fail', (err as Error).message);
            }
        }

        this.isRunning = false;
        this.updateRotation();
        EventBus.emit('execution-end');
    }

    async executeCommandList(
        commands: { cmd: Command, value?: number }[],
        f1: { cmd: Command, value?: number }[],
        f2: { cmd: Command, value?: number }[],
        f3: { cmd: Command, value?: number }[],
        depth: number,
        currentSlot: 'main' | 'f1' | 'f2' | 'f3' = 'main',
        stack: { slot: string; index: number }[] = []
    ) {
        if (depth > 15) {
            throw new Error('Maximum recursion depth exceeded');
        }

        for (let i = 0; i < commands.length; i++) {
            if (this.shouldStop) return;

            const instruction = commands[i];
            const cmd = instruction.cmd;
            const currentFrame = { slot: currentSlot, index: i };
            const newStack = [...stack, currentFrame];

            EventBus.emit('execution-step', {
                command: cmd,
                index: i,
                depth,
                stack: newStack
            });

            if (cmd === 'REPEAT') {
                const count = instruction.value || 1;
                const previousCommands = commands.slice(0, i);
                for (let r = 0; r < count; r++) {
                    await this.executeCommandList(previousCommands, f1, f2, f3, depth + 1, currentSlot, newStack);
                    if (this.shouldStop) break;
                }
            } else if (cmd === 'F1') {
                await this.executeCommandList(f1, f1, f2, f3, depth + 1, 'f1', newStack);
            } else if (cmd === 'F2') {
                await this.executeCommandList(f2, f1, f2, f3, depth + 1, 'f2', newStack);
            } else if (cmd === 'F3') {
                await this.executeCommandList(f3, f1, f2, f3, depth + 1, 'f3', newStack);
            } else {
                await this.executeSingleCommand(cmd);
            }
        }
    }

    async executeSingleCommand(cmd: Command) {
        if (this.shouldStop) return;

        switch (cmd) {
            case 'WALK':
                await this.executeMovement('WALK');
                break;
            case 'JUMP':
                await this.executeMovement('JUMP');
                break;
            case 'TURN_LEFT':
                this.direction = (this.direction + 3) % 4;
                this.updateRotation();
                await this.delay(250 / this.executionSpeed);
                break;
            case 'TURN_RIGHT':
                this.direction = (this.direction + 1) % 4;
                this.updateRotation();
                await this.delay(250 / this.executionSpeed);
                break;
            case 'ACTIVATE':
                await this.executeActivate();
                break;
            case 'PICK':
                await this.executePick();
                break;
        }
    }

    getValidFloorHeights(tileInfo: TileInfo): number[] {
        if (tileInfo.t === TILE.WOOD && tileInfo.h > 0) {
            if (tileInfo.h >= 2) {
                return [0, tileInfo.h];
            } else {
                return [tileInfo.h];
            }
        }
        return [tileInfo.h];
    }

    async executeMovement(type: 'WALK' | 'JUMP') {
        if (!this.currentLevel || this.shouldStop) return;

        const map = this.currentLevel.map;
        let nextX = this.explorerPos.x;
        let nextY = this.explorerPos.y;

        if (this.direction === 0) nextX++;
        else if (this.direction === 1) nextY++;
        else if (this.direction === 2) nextX--;
        else if (this.direction === 3) nextY--;

        // Validate bounds
        if (nextX < 0 || nextY < 0 || nextX >= map[0].length || nextY >= map.length) {
            throw new Error(ERRORS.ERR_OUT_OF_BOUNDS);
        }

        // Check for blocked tiles
        if (BLOCKED_TILES.includes(map[nextY][nextX].t)) {
            throw new Error(ERRORS.ERR_PATH_BLOCKED);
        }

        const currentZ = this.explorerPos.z;
        const validHeights = this.getValidFloorHeights(map[nextY][nextX]);
        let targetZ = -1;

        if (type === 'WALK') {
            if (validHeights.includes(currentZ)) {
                targetZ = currentZ;
                await this.animateMovement(nextX, nextY, targetZ, 'walk');
            } else {
                throw new Error(ERRORS.ERR_INVALID_MOVE);
            }
        } else {
            // JUMP (SALTO) — permitir cambio de altura de exactamente 1
            const possibleJumpHeights = validHeights.filter(h => Math.abs(currentZ - h) === 1);
            if (possibleJumpHeights.length > 0) {
                targetZ = Math.max(...possibleJumpHeights);
                await this.animateMovement(nextX, nextY, targetZ, 'jump');
            } else {
                throw new Error(ERRORS.ERR_INVALID_JUMP);
            }
        }
    }

    async executeActivate() {
        if (this.shouldStop) return;
        const key = `${this.explorerPos.x},${this.explorerPos.y}`;
        const currentTileInfo = this.currentLevel!.map[this.explorerPos.y][this.explorerPos.x];

        // Reproducir la animación correspondiente
        await this.animateMovement(this.explorerPos.x, this.explorerPos.y, this.explorerPos.z, 'activate');

        // Verificar si se encuentra sobre una casilla objetivo y es un TILE.BLUE
        if (this.goalTiles.has(key) && currentTileInfo.t === TILE.BLUE) {
            this.activatedGoals.add(key);

            const [x, y] = key.split(',').map(Number);
            const z = currentTileInfo.h;
            const block = this.children.getByName(`${x},${y},${z}`) as Phaser.GameObjects.Image;
            if (block) {
                block.setFrame(TILE.YELLOW);
                this.updateGoalBeam(x, y, z, 0xffff00);
            }

            // Verificar si el nivel está completado
            const totalGoals = this.goalTiles.size;
            const allActivated = totalGoals > 0 && this.activatedGoals.size === totalGoals;
            if (allActivated) {
                this.shouldStop = true;
                EventBus.emit('level-complete', this.currentLevel?.id);
            }
        }
    }

    async executePick() {
        if (this.shouldStop) return;
        const key = `${this.explorerPos.x},${this.explorerPos.y}`;
        const currentTileInfo = this.currentLevel!.map[this.explorerPos.y][this.explorerPos.x];

        // Reproducir la animación correspondiente
        await this.animateMovement(this.explorerPos.x, this.explorerPos.y, this.explorerPos.z, 'pick');

        // Verificar si se encuentra sobre una casilla objetivo y es un TILE.GRAIN
        if (this.goalTiles.has(key) && currentTileInfo.t === TILE.GRAIN) {
            this.activatedGoals.add(key);

            const [x, y] = key.split(',').map(Number);
            const z = currentTileInfo.h;
            const block = this.children.getByName(`${x},${y},${z}`) as Phaser.GameObjects.Image;
            if (block) {
                block.setFrame(TILE.GEM);
            }

            // Verificar si el nivel está completado
            const totalGoals = this.goalTiles.size;
            const allActivated = totalGoals > 0 && this.activatedGoals.size === totalGoals;
            if (allActivated) {
                this.shouldStop = true;
                EventBus.emit('level-complete', this.currentLevel?.id);
            }
        }
    }

    stopProgram() {
        this.shouldStop = true;
        this.isRunning = false;
        this.tweens.killAll(); // Importante: Detener todas las interpolaciones (tweens) activas
        this.idleFloatingTween = null;
        this.updateRotation();
    }

    resetExplorerPosition() {
        if (!this.currentLevel) return;

        const level = this.currentLevel;
        this.shouldStop = true;
        this.tweens.killAll();

        this.explorerPos = {
            x: level.startPos.x,
            y: level.startPos.y,
            z: level.map[level.startPos.y][level.startPos.x].h,
        };
        this.direction = level.startDirection;
        this.activatedGoals = new Set();

        // Restablecer los elementos visuales de las casillas objetivo
        for (const key of this.goalTiles) {
            const [x, y] = key.split(',').map(Number);
            const z = this.currentLevel!.map[y][x].h;
            const block = this.children.getByName(`${x},${y},${z}`) as Phaser.GameObjects.Image;
            if (block) {
                block.setFrame(this.currentLevel!.map[y][x].t);
                if (this.currentLevel!.map[y][x].t === TILE.BLUE) {
                    this.updateGoalBeam(x, y, z, 0x00aaff);
                } else {
                    this.updateGoalBeam(x, y, z, null);
                }
            }
        }

        // Restablecer el aspecto visual del explorer
        const startPos = this.cartToIso(this.explorerPos.x, this.explorerPos.y, this.explorerPos.z);
        if (this.shadow) {
            this.shadow.setPosition(startPos.x, startPos.y);
            this.shadow.setDepth(this.getDepth(this.explorerPos.x, this.explorerPos.y, this.explorerPos.z, 0.1));
            this.shadow.setScale(1);
            if (this.isTopDown) this.shadow.setAlpha(0);
        }
        if (this.explorer && this.explorer.active) {
            this.explorer.setPosition(startPos.x, startPos.y);
            this.explorer.setDepth(this.getDepth(this.explorerPos.x, this.explorerPos.y, this.explorerPos.z, 1));

            const visualDirection = this.getVisualDirection();
            const dirKey = ['se', 'sw', 'nw', 'ne'][visualDirection];
            const idleFrame = visualDirection * 4;
            if (this.explorer.anims) {
                this.explorer.anims.stop();
            }
            this.explorer.setFrame(idleFrame);
            this.explorer.play(`idle-${dirKey}`, true);
            if (this.explorer.anims) {
                this.explorer.anims.timeScale = this.executionSpeed;
            }
        }

        this.shouldStop = false;
    }

    delay(ms: number): Promise<void> {
        return new Promise(resolve => {
            this.time.delayedCall(ms, resolve);
        });
    }

    async animateMovement(nextX: number, nextY: number, nextZ: number, animType: 'walk' | 'jump' | 'activate' | 'pick') {
        if (!this.explorer || !this.explorer.active) return;

        this.stopIdleFloating();

        const visualDirection = this.getVisualDirection();
        const dirKey = ['se', 'sw', 'nw', 'ne'][visualDirection];
        const animKey = `${animType}-${dirKey}`;

        // Caminar continúa fluidamente por las casillas, pero saltar y activar deben reiniciarse
        if (animType === 'walk') {
            this.explorer.play(animKey, true);
        } else {
            this.explorer.play(animKey);
        }

        if (this.explorer.anims) {
            this.explorer.anims.timeScale = this.executionSpeed;
        }

        // Para la activación o recogida, solo reproducir la animación sin movimiento
        if (animType === 'activate' || animType === 'pick') {
            const delayMs = animType === 'pick' ? 900 : 200;
            return new Promise<void>((resolve) => {
                this.time.delayedCall(delayMs / this.executionSpeed, () => {
                    if (this.shouldStop || !this.explorer || !this.explorer.active) {
                        resolve();
                        return;
                    }
                    const visualDirection = this.getVisualDirection();
                    const idleFrame = visualDirection * 4;
                    this.explorer.stop();
                    this.explorer.setFrame(idleFrame);
                    this.explorer.play(`idle-${dirKey}`, true);
                    if (this.explorer.anims) {
                        this.explorer.anims.timeScale = this.executionSpeed;
                    }
                    resolve();
                });
            });
        }

        // Almacenar ambas profundidades (depths)
        const currentDepth = this.getDepth(this.explorerPos.x, this.explorerPos.y, this.explorerPos.z, 1);
        const targetDepth = this.getDepth(nextX, nextY, nextZ, 1);

        const currentShadowDepth = this.getDepth(this.explorerPos.x, this.explorerPos.y, this.explorerPos.z, 0.1);
        const targetShadowDepth = this.getDepth(nextX, nextY, nextZ, 0.1);

        // Almacenar la posición inicial en pantalla
        const startY = this.explorer.y;

        // Calcular la posición final en pantalla
        const screenPos = this.cartToIso(nextX, nextY, nextZ);

        // Altura máxima del arco
        const jumpHeight = animType === 'jump' ? 10 : 0;

        return new Promise<void>((resolve) => {
            if (this.shouldStop) {
                resolve();
                return;
            }

            const targets = this.shadow ? [this.explorer, this.shadow] : [this.explorer];

            this.tweens.add({
                targets: targets,
                x: screenPos.x,
                y: screenPos.y,
                duration: 400 / this.executionSpeed,
                ease: 'Linear',
                onUpdate: (tween) => {
                    if (!this.explorer || !this.explorer.active) return;
                    const progress = tween.progress;

                    // Aplicar arco de salto si es necesario
                    if (animType === 'jump') {
                        const arc = Math.sin(Math.PI * progress) * jumpHeight;
                        this.explorer.y = (startY + (screenPos.y - startY) * progress) - arc;
                        if (this.shadow) {
                            this.shadow.setScale(1 - (Math.sin(Math.PI * progress) * 0.3));
                        }
                    }

                    // Gestión de la profundidad (depth)
                    if (progress < 0.1) {
                        this.explorer.setDepth(currentDepth);
                        if (this.shadow) this.shadow.setDepth(currentShadowDepth);
                    } else if (progress > 0.9) {
                        this.explorer.setDepth(targetDepth);
                        if (this.shadow) this.shadow.setDepth(targetShadowDepth);
                    } else {
                        this.explorer.setDepth(Math.max(currentDepth, targetDepth));
                        if (this.shadow) this.shadow.setDepth(Math.max(currentShadowDepth, targetShadowDepth));
                    }
                },
                onComplete: () => {
                    if (this.shouldStop || !this.explorer || !this.explorer.active) {
                        resolve();
                        return;
                    }
                    this.explorerPos = { x: nextX, y: nextY, z: nextZ };
                    this.explorer.setDepth(targetDepth);
                    if (this.shadow) {
                        this.shadow.setDepth(targetShadowDepth);
                        this.shadow.setScale(1);
                    }

                    resolve();
                }
            });
        });
    }

    getRotatedCoords(x: number, y: number): { rx: number, ry: number } {
        const mapW = this.currentLevel ? this.currentLevel.map[0].length : 7;
        const mapH = this.currentLevel ? this.currentLevel.map.length : 7;
        let rx = x, ry = y;
        if (this.cameraAngle === 1) { // 90 deg CW
            rx = mapH - 1 - y;
            ry = x;
        } else if (this.cameraAngle === 2) { // 180 deg
            rx = mapW - 1 - x;
            ry = mapH - 1 - y;
        } else if (this.cameraAngle === 3) { // 270 deg CW
            rx = y;
            ry = mapW - 1 - x;
        }
        return { rx, ry };
    }

    getDepth(x: number, y: number, z: number, offset: number = 0): number {
        const { rx, ry } = this.getRotatedCoords(x, y);
        // Priorizar rx+ry (profundidad en pantalla) sobre z (altura)
        return ((rx + ry) * 100) + z * 10 + offset;
    }

    getVisualDirection(): number {
        return (this.direction + this.cameraAngle) % 4;
    }

    cartToIso(x: number, y: number, z: number) {
        const { rx, ry } = this.getRotatedCoords(x, y);

        const tileW = 64;
        const tileH = 32;
        const hw = tileW / 2;
        const hh = tileH / 2;

        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        let curMapW = this.currentLevel ? this.currentLevel.map[0].length : 7;
        let curMapH = this.currentLevel ? this.currentLevel.map.length : 7;
        if (this.cameraAngle === 1 || this.cameraAngle === 3) {
            const temp = curMapW;
            curMapW = curMapH;
            curMapH = temp;
        }

        const mapCenterX = (curMapW - 1) / 2;
        const mapCenterY = (curMapH - 1) / 2;

        const offsetX = cx - (mapCenterX - mapCenterY) * hw;
        const offsetY = cy - (mapCenterX + mapCenterY) * hh;

        const tx = (rx - ry) * hw + offsetX;
        const ty = (rx + ry) * hh + offsetY - (this.isTopDown ? 0 : z * HEIGHT_STEP);

        return { x: tx, y: ty };
    }

    createMap(mapData: TileInfo[][], animate: boolean = false): number {
        const pendingBeams: { x: number; y: number; z: number; color: number }[] = [];
        let maxAnimEnd = 0;

        for (let y = 0; y < mapData.length; y++) {
            for (let x = 0; x < mapData[y].length; x++) {
                const tileInfo = mapData[y][x];

                for (let z = 0; z <= tileInfo.h; z++) {
                    if (tileInfo.t === TILE.WOOD && tileInfo.h > 0) {
                        if (z > 0 && z < tileInfo.h) {
                            continue; // Espacio vacio debajo del WOOD
                        }
                    }

                    const pos = this.cartToIso(x, y, z);
                    const isGoal = z === tileInfo.h && (tileInfo.t === TILE.BLUE || tileInfo.t === TILE.GRAIN);
                    let targetFrame = tileInfo.t;
                    if (z !== tileInfo.h) {
                        targetFrame = z === 0 ? TILE.BROWN : TILE.GRAY;
                    }

                    const block = this.add.image(pos.x, pos.y, 'tiles', targetFrame);
                    block.setName(`${x},${y},${z}`);
                    block.setDepth(this.getDepth(x, y, z, 0));
                    this.mapObjects.push(block);

                    // Animación de caída de bloques
                    if (animate) {
                        const dropHeight = 250 + z * 40;
                        const delay = (x + y) * 55 + z * 35;
                        const duration = 1100;
                        const finalY = pos.y;

                        block.setAlpha(0);
                        block.y = pos.y - dropHeight;

                        this.tweens.add({
                            targets: block,
                            y: finalY,
                            alpha: 1,
                            duration: duration,
                            delay: delay,
                            ease: 'Bounce.easeOut',
                        });

                        maxAnimEnd = Math.max(maxAnimEnd, delay + duration);
                    }

                    if (isGoal) {
                        this.goalTiles.add(`${x},${y}`);
                        if (tileInfo.t === TILE.BLUE) {
                            if (animate) {
                                pendingBeams.push({ x, y, z, color: 0x00aaff });
                            } else {
                                this.updateGoalBeam(x, y, z, 0x00aaff);
                            }
                        }
                    }
                }
            }
        }

        // Mostrar beams de objetivos después de que los bloques aterricen
        if (animate && pendingBeams.length > 0) {
            this.time.delayedCall(maxAnimEnd, () => {
                for (const beam of pendingBeams) {
                    this.updateGoalBeam(beam.x, beam.y, beam.z, beam.color);
                }
            });
        }

        return maxAnimEnd;
    }

    updateRotation() {
        if (!this.explorer || !this.explorer.active) return;
        const visualDirection = this.getVisualDirection();
        const dirKey = ['se', 'sw', 'nw', 'ne'][visualDirection];
        const idleFrame = visualDirection * 4;
        this.explorer.stop();
        this.explorer.setFrame(idleFrame);
        this.explorer.play(`idle-${dirKey}`, true);
        if (this.explorer.anims) {
            this.explorer.anims.timeScale = this.executionSpeed;
        }
    }

    updateGoalBeam(x: number, y: number, z: number, color: number | null, animateIn: boolean = false) {
        const beamName = `beam-${x}-${y}`;

        // Buscar y destruir beam existente
        const existing = this.children.getByName(beamName);
        if (existing) {
            existing.setName('destroying-beam'); // Renombrar para evitar que getByName lo encuentre de nuevo
            this.tweens.killTweensOf(existing);
            this.tweens.add({
                targets: existing,
                alpha: 0,
                duration: 200,
                onComplete: () => { existing.destroy(); }
            });
            this.mapObjects = this.mapObjects.filter(o => o !== existing);
        }

        if (color !== null && !this.isTopDown) {
            const graphics = this.add.graphics();
            const pos = this.cartToIso(x, y, z);

            const steps = 40;
            for (let i = steps - 1; i >= 0; i--) {
                const t = i / (steps - 1);

                // Elipse isométrica: ancho y alto (alto es la mitad del ancho)
                const width = 18 + (t * 26);
                const height = width / 2;

                // Posición que sube en el aire (y disminuye)
                const sliceY = pos.y - (-14) - (t * 60);

                // Alpha disminuye conforme sube
                const sliceAlpha = 0.09 * (1 - t);

                graphics.fillStyle(color, sliceAlpha);
                graphics.fillEllipse(pos.x, sliceY, width, height);
            }

            graphics.setBlendMode(Phaser.BlendModes.ADD);
            graphics.setDepth(this.getDepth(x, y, z, 0.5));
            graphics.setName(beamName);

            this.mapObjects.push(graphics);

            this.tweens.add({
                targets: graphics,
                alpha: { from: animateIn ? 0 : 0.5, to: 1 },
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    rotateCamera(steps: number) {
        if (this.isRunning || this.introAnimating || this.isRotating) return;
        this.isRotating = true;

        this.cameraAngle = (this.cameraAngle + steps) % 4;
        if (this.cameraAngle < 0) this.cameraAngle += 4;

        let tweensCount = 0;
        let completedCount = 0;

        const onComplete = () => {
            completedCount++;
            if (completedCount === tweensCount) {
                this.isRotating = false;
                this.updateRotation();
            }
        };

        for (const obj of this.mapObjects) {
            if (obj.name.startsWith('beam-')) {
                obj.destroy();
                continue;
            }

            const parts = obj.name.split(',');
            if (parts.length >= 3) {
                const x = parseInt(parts[0]);
                const y = parseInt(parts[1]);
                const z = parseInt(parts[2]);

                const newPos = this.cartToIso(x, y, z);
                const newDepth = this.getDepth(x, y, z, 0);

                tweensCount++;
                this.tweens.add({
                    targets: obj,
                    x: newPos.x,
                    y: newPos.y,
                    duration: 400,
                    ease: 'Cubic.easeInOut',
                    onUpdate: (tween) => {
                        const targetObj = obj as any;
                        if (tween.progress > 0.5 && targetObj.depth !== newDepth) {
                            targetObj.setDepth(newDepth);
                        }
                    },
                    onComplete: onComplete
                });
            }
        }

        if (this.explorer && this.explorer.active) {
            const newPos = this.cartToIso(this.explorerPos.x, this.explorerPos.y, this.explorerPos.z);
            const newDepth = this.getDepth(this.explorerPos.x, this.explorerPos.y, this.explorerPos.z, 1);
            const newShadowDepth = this.getDepth(this.explorerPos.x, this.explorerPos.y, this.explorerPos.z, 0.1);

            tweensCount += 2;
            this.tweens.add({
                targets: this.explorer,
                x: newPos.x,
                y: newPos.y,
                duration: 400,
                ease: 'Cubic.easeInOut',
                onUpdate: (tween) => {
                    if (tween.progress > 0.5 && this.explorer.depth !== newDepth) {
                        this.explorer.setDepth(newDepth);
                        this.updateRotation();
                    }
                },
                onComplete: onComplete
            });
            this.tweens.add({
                targets: this.shadow,
                x: newPos.x,
                y: newPos.y,
                duration: 400,
                ease: 'Cubic.easeInOut',
                onUpdate: (tween) => {
                    if (tween.progress > 0.5 && this.shadow.depth !== newShadowDepth) {
                        this.shadow.setDepth(newShadowDepth);
                    }
                },
                onComplete: onComplete
            });
        }

        this.time.delayedCall(450, () => {
            this.mapObjects = this.mapObjects.filter(o => o.active);
            for (const key of this.goalTiles) {
                const [x, y] = key.split(',').map(Number);
                const z = this.currentLevel!.map[y][x].h;
                const block = this.children.getByName(`${x},${y},${z}`) as Phaser.GameObjects.Image;
                if (block) {
                    if (block.frame.name === TILE.YELLOW.toString() || (block.frame.name as unknown as number) === TILE.YELLOW) {
                        this.updateGoalBeam(x, y, z, 0xffff00);
                    } else if (block.frame.name === TILE.BLUE.toString() || (block.frame.name as unknown as number) === TILE.BLUE) {
                        this.updateGoalBeam(x, y, z, 0x00aaff);
                    }
                }
            }
        });

        if (tweensCount === 0) this.isRotating = false;
    }

    setTopDown(isTopDown: boolean) {
        if (this.isRunning || this.introAnimating || this.isTopDown === isTopDown) return;
        this.isTopDown = isTopDown;

        for (const obj of this.mapObjects) {
            if (obj.name.startsWith('beam-')) {
                if (isTopDown) {
                    obj.setName('destroying-beam');
                    this.tweens.add({
                        targets: obj,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => { obj.destroy(); }
                    });
                }
                continue;
            }

            const parts = obj.name.split(',');
            if (parts.length >= 3) {
                const x = parseInt(parts[0]);
                const y = parseInt(parts[1]);
                const z = parseInt(parts[2]);

                const newPos = this.cartToIso(x, y, z);

                // Mover a posición aplanada o elevada
                this.tweens.add({
                    targets: obj,
                    x: newPos.x,
                    y: newPos.y,
                    duration: 400,
                    ease: 'Cubic.easeInOut'
                });
            }
        }

        if (this.explorer && this.explorer.active) {
            const newPos = this.cartToIso(this.explorerPos.x, this.explorerPos.y, this.explorerPos.z);

            this.tweens.add({
                targets: this.explorer,
                x: newPos.x,
                y: newPos.y,
                duration: 400,
                ease: 'Cubic.easeInOut'
            });
            this.tweens.add({
                targets: this.shadow,
                x: newPos.x,
                y: newPos.y,
                alpha: isTopDown ? 0 : 0.25,
                duration: 400,
                ease: 'Cubic.easeInOut'
            });
        }

        // Si volvemos a la normalidad, recrear los beams inmediatamente con fade-in
        this.mapObjects = this.mapObjects.filter(o => o.active);
        if (!isTopDown) {
            for (const key of this.goalTiles) {
                const [x, y] = key.split(',').map(Number);
                const z = this.currentLevel!.map[y][x].h;
                const block = this.children.getByName(`${x},${y},${z}`) as Phaser.GameObjects.Image;
                if (block) {
                    if (block.frame.name === TILE.YELLOW.toString() || (block.frame.name as unknown as number) === TILE.YELLOW) {
                        this.updateGoalBeam(x, y, z, 0xffff00, true);
                    } else if (block.frame.name === TILE.BLUE.toString() || (block.frame.name as unknown as number) === TILE.BLUE) {
                        this.updateGoalBeam(x, y, z, 0x00aaff, true);
                    }
                }
            }
        }
    }


    private stopIdleFloating() {
        if (this.idleFloatingTween) {
            this.idleFloatingTween.stop();
            this.idleFloatingTween = null;

            // Volver a la posición base
            const basePos = this.cartToIso(this.explorerPos.x, this.explorerPos.y, this.explorerPos.z);
            if (this.explorer) {
                this.explorer.y = basePos.y;
            }
            if (this.shadow) {
                this.shadow.setScale(1);
            }
        }
    }

    createAnimations() {
        const directions = ['se', 'sw', 'nw', 'ne'];
        directions.forEach((dir) => {
            const startFrameIdle = dir === 'se' ? 0 : dir === 'sw' ? 4 : dir === 'nw' ? 8 : 12;
            const startFrameWalk = dir === 'se' ? 20 : dir === 'sw' ? 25 : dir === 'nw' ? 30 : 35;
            const startFrameJump = dir === 'se' ? 40 : dir === 'sw' ? 45 : dir === 'nw' ? 50 : 55;
            const startFrameActivate = dir === 'se' ? 60 : dir === 'sw' ? 65 : dir === 'nw' ? 70 : 75;
            const startFramePick = dir === 'se' ? 80 : dir === 'sw' ? 85 : dir === 'nw' ? 90 : 95;

            this.anims.create({
                key: `idle-${dir}`,
                frames: this.anims.generateFrameNumbers('explorer', { start: startFrameIdle, end: startFrameIdle + 3 }),
                frameRate: 4,
                repeatDelay: 6000,
                repeat: -1,
                delay: 100
            });
            this.anims.create({
                key: `walk-${dir}`,
                frames: this.anims.generateFrameNumbers('explorer', { start: startFrameWalk, end: startFrameWalk + 4 }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: `jump-${dir}`,
                frames: this.anims.generateFrameNumbers('explorer', { start: startFrameJump, end: startFrameJump + 4 }),
                frameRate: 12.5
            });
            this.anims.create({
                key: `activate-${dir}`,
                frames: this.anims.generateFrameNumbers('explorer', { start: startFrameActivate, end: startFrameActivate + 1 }),
                frameRate: 10
            });
            this.anims.create({
                key: `pick-${dir}`,
                frames: this.anims.generateFrameNumbers('explorer', { start: startFramePick, end: startFramePick + 2 }),
                repeat: 2,
                frameRate: 10
            });
        });
    }
}