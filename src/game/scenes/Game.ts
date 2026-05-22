import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import * as Phaser from 'phaser';
import { Command, LevelData, TileInfo, TILE, BLOCKED_TILES, getLevel } from '../levels';

const HEIGHT_STEP = 16;

export class Game extends Scene {
    robotPos: { x: number; y: number; z: number };
    direction: number;
    isRunning: boolean;
    shouldStop: boolean;
    robot: Phaser.GameObjects.Sprite;
    shadow: Phaser.GameObjects.Ellipse;
    goalTiles: Set<string>;
    activatedGoals: Set<string>;
    currentLevel: LevelData | null;
    mapObjects: Phaser.GameObjects.Image[];
    executionSpeed: number;
    idleFloatingTween: Phaser.Tweens.Tween | null;

    constructor() {
        super('Game');
        this.robotPos = { x: 0, y: 0, z: 0 };
        this.direction = 0;
        this.isRunning = false;
        this.shouldStop = false;
        this.goalTiles = new Set();
        this.activatedGoals = new Set();
        this.currentLevel = null;
        this.mapObjects = [];
        this.executionSpeed = 0.5;
        this.idleFloatingTween = null;
    }

    preload() {
        this.load.spritesheet('robot', '/assets/sprite-sheet.png', { frameWidth: 64, frameHeight: 96 });
        this.load.spritesheet('tiles', '/assets/tiles.png', { frameWidth: 64, frameHeight: 96 });
    }

    create() {
        this.createAnimations();

        // Escuchar eventos desde la interfaz de React
        EventBus.on('load-level', (levelId: number) => {
            this.loadLevel(levelId);
        });

        EventBus.on('run-program', (data: {
            main: Command[];
            f1: Command[];
            f2: Command[];
            f3: Command[];
        }) => {
            this.runProgram(data.main, data.f1, data.f2, data.f3);
        });

        EventBus.on('stop-program', () => {
            this.stopProgram();
        });

        EventBus.on('reset-level', () => {
            if (this.currentLevel) {
                this.loadLevel(this.currentLevel.id);
            }
        });

        EventBus.on('set-speed', (speed: number) => {
            this.executionSpeed = speed;
            if (this.robot && this.robot.anims) {
                this.robot.anims.timeScale = speed;
            }
        });

        // Cargar el nivel 1 por defecto
        this.loadLevel(1);

        EventBus.emit('current_scene', 'Game');
    }

    loadLevel(levelId: number) {
        const level = getLevel(levelId);
        if (!level) return;

        this.currentLevel = level;
        this.shouldStop = true; // Detener cualquier ejecución actual
        this.isRunning = false;
        this.tweens.killAll(); // Finalizar todos los movimientos activos
        this.activatedGoals = new Set();

        // Limpiar el mapa existente
        this.mapObjects.forEach(obj => obj.destroy());
        this.mapObjects = [];
        this.goalTiles = new Set();

        // Destruir el robot existente si está presente
        if (this.robot) {
            this.robot.destroy();
        }
        if (this.shadow) {
            this.shadow.destroy();
        }

        // Configurar la posición del robot
        this.robotPos = {
            x: level.startPos.x,
            y: level.startPos.y,
            z: level.map[level.startPos.y][level.startPos.x].h,
        };
        this.direction = level.startDirection;

        // Asignar los objetivos (ahora solo como Set)
        this.goalTiles = new Set();

        // Crear el mapa
        this.createMap(level.map);


        // Crear el robot
        const startPos = this.cartToIso(this.robotPos.x, this.robotPos.y, this.robotPos.z);

        this.shadow = this.add.ellipse(startPos.x, startPos.y, 24, 12, 0x000000, 0.25);
        this.shadow.setDepth(((this.robotPos.x + this.robotPos.y) * 100) + 0.1).setOrigin(0.55, -0.78);

        this.robot = this.add.sprite(startPos.x, startPos.y, 'robot').setOrigin(0.55, 0.68);
        this.robot.setDepth(((this.robotPos.x + this.robotPos.y) * 100) + 1);
        this.robot.setScale(0.55);

        // Reproducir la animación de reposo (idle)
        const dirKey = ['se', 'sw', 'nw', 'ne'][this.direction];
        const idleFrame = this.direction * 4;
        this.robot.setFrame(idleFrame);
        this.robot.play(`idle-${dirKey}`, true);
        if (this.robot.anims) {
            this.robot.anims.timeScale = this.executionSpeed;
        }


        this.shouldStop = false; // Permitir una nueva ejecución

        EventBus.emit('level-loaded', {
            id: level.id,
            name: level.name,
            description: level.description,
            availableCommands: level.availableCommands,
            mainSlots: level.mainSlots,
            f1Slots: level.f1Slots,
            f2Slots: level.f2Slots,
            f3Slots: level.f3Slots,
        });
    }

    async runProgram(main: Command[], f1: Command[], f2: Command[], f3: Command[]) {
        if (this.isRunning) return;

        // Reiniciar el estado del nivel sin volver a cargar los elementos visuales
        this.resetRobotPosition();

        this.isRunning = true;
        this.shouldStop = false;
        this.activatedGoals = new Set();

        // Restablecer los elementos visuales de las casillas objetivo
        for (const key of this.goalTiles) {
            const [x, y] = key.split(',').map(Number);
            const z = this.currentLevel!.map[y][x].h;
            const block = this.children.getByName(`${x},${y},${z}`) as Phaser.GameObjects.Image;
            if (block) {
                block.setFrame(TILE.BLUE);
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
        commands: Command[],
        f1: Command[],
        f2: Command[],
        f3: Command[],
        depth: number,
        currentSlot: 'main' | 'f1' | 'f2' | 'f3' = 'main',
        stack: { slot: string; index: number }[] = []
    ) {
        if (depth > 15) {
            throw new Error('Maximum recursion depth exceeded');
        }

        for (let i = 0; i < commands.length; i++) {
            if (this.shouldStop) return;

            const cmd = commands[i];
            const currentFrame = { slot: currentSlot, index: i };
            const newStack = [...stack, currentFrame];

            EventBus.emit('execution-step', { 
                command: cmd, 
                index: i, 
                depth,
                stack: newStack
            });

            if (cmd === 'F1') {
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
        }
    }

    async executeMovement(type: 'WALK' | 'JUMP') {
        if (!this.currentLevel || this.shouldStop) return;

        const map = this.currentLevel.map;
        let nextX = this.robotPos.x;
        let nextY = this.robotPos.y;

        if (this.direction === 0) nextX++;
        else if (this.direction === 1) nextY++;
        else if (this.direction === 2) nextX--;
        else if (this.direction === 3) nextY--;

        // Validate bounds
        if (nextX < 0 || nextY < 0 || nextX >= map[0].length || nextY >= map.length) {
            throw new Error('Cannot move out of bounds!');
        }

        // Check for blocked tiles
        if (BLOCKED_TILES.includes(map[nextY][nextX].t)) {
            throw new Error('Path is blocked by an obstacle!');
        }

        const currentZ = map[this.robotPos.y][this.robotPos.x].h;
        const targetZ = map[nextY][nextX].h;

        if (type === 'WALK') {
            if (currentZ === targetZ) {
                await this.animateMovement(nextX, nextY, targetZ, 'walk');
            } else {
                throw new Error('Cannot walk: height difference detected!');
            }
        } else {
            // JUMP (SALTO) — permitir cambio de altura de exactamente 1
            if (Math.abs(currentZ - targetZ) === 1) {
                await this.animateMovement(nextX, nextY, targetZ, 'jump');
            } else {
                throw new Error('Cannot jump: height difference must be exactly 1 level!');
            }
        }
    }

    async executeActivate() {
        if (this.shouldStop) return;
        const key = `${this.robotPos.x},${this.robotPos.y}`;

        // Reproducir la animación de activación
        await this.animateMovement(this.robotPos.x, this.robotPos.y, this.robotPos.z, 'activate');

        // Verificar si se encuentra sobre una casilla objetivo 
        if (this.goalTiles.has(key)) {
            this.activatedGoals.add(key);

            const [x, y] = key.split(',').map(Number);
            const z = this.currentLevel!.map[y][x].h;
            const block = this.children.getByName(`${x},${y},${z}`) as Phaser.GameObjects.Image;
            if (block) {
                block.setFrame(TILE.YELLOW);
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

    resetRobotPosition() {
        if (!this.currentLevel) return;

        const level = this.currentLevel;
        this.shouldStop = true;
        this.tweens.killAll();

        this.robotPos = {
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
                block.setFrame(TILE.BLUE);
            }
        }

        // Restablecer el aspecto visual del robot
        const startPos = this.cartToIso(this.robotPos.x, this.robotPos.y, this.robotPos.z);
        if (this.shadow) {
            this.shadow.setPosition(startPos.x, startPos.y);
            this.shadow.setDepth(((this.robotPos.x + this.robotPos.y) * 100) + 0.1);
            this.shadow.setScale(1);
        }
        if (this.robot) {
            this.robot.setPosition(startPos.x, startPos.y);
            this.robot.setDepth(((this.robotPos.x + this.robotPos.y) * 100) + 1);

            const dirKey = ['se', 'sw', 'nw', 'ne'][this.direction];
            const idleFrame = this.direction * 4;
            this.robot.stop();
            this.robot.setFrame(idleFrame);
            this.robot.play(`idle-${dirKey}`, true);
            if (this.robot.anims) {
                this.robot.anims.timeScale = this.executionSpeed;
            }
        }

        this.shouldStop = false;
    }

    delay(ms: number): Promise<void> {
        return new Promise(resolve => {
            this.time.delayedCall(ms, resolve);
        });
    }

    async animateMovement(nextX: number, nextY: number, nextZ: number, animType: 'walk' | 'jump' | 'activate') {
        if (!this.robot || !this.robot.active) return;

        this.stopIdleFloating();

        const dirKey = ['se', 'sw', 'nw', 'ne'][this.direction];
        const animKey = `${animType}-${dirKey}`;

        // Caminar continúa fluidamente por las casillas, pero saltar y activar deben reiniciarse
        if (animType === 'walk') {
            this.robot.play(animKey, true);
        } else {
            this.robot.play(animKey);
        }

        if (this.robot.anims) {
            this.robot.anims.timeScale = this.executionSpeed;
        }

        // Para la activación, solo reproducir la animación sin movimiento
        if (animType === 'activate') {
            return new Promise<void>((resolve) => {
                this.time.delayedCall(200 / this.executionSpeed, () => {
                    if (this.shouldStop || !this.robot || !this.robot.active) {
                        resolve();
                        return;
                    }
                    const idleFrame = this.direction * 4;
                    this.robot.stop();
                    this.robot.setFrame(idleFrame);
                    this.robot.play(`idle-${dirKey}`, true);
                    if (this.robot.anims) {
                        this.robot.anims.timeScale = this.executionSpeed;
                    }
                    //this.startIdleFloating();
                    resolve();
                });
            });
        }

        // Almacenar ambas profundidades (depths)
        const currentDepth = ((this.robotPos.x + this.robotPos.y) * 100) + 1;
        const targetDepth = ((nextX + nextY) * 100) + 1;

        const currentShadowDepth = ((this.robotPos.x + this.robotPos.y) * 100) + 0.1;
        const targetShadowDepth = ((nextX + nextY) * 100) + 0.1;

        // Almacenar la posición inicial en pantalla
        const startY = this.robot.y;

        // Calcular la posición final en pantalla
        const screenPos = this.cartToIso(nextX, nextY, nextZ);

        // Altura máxima del arco
        const jumpHeight = animType === 'jump' ? 10 : 0;

        return new Promise<void>((resolve) => {
            if (this.shouldStop) {
                resolve();
                return;
            }

            const targets = this.shadow ? [this.robot, this.shadow] : [this.robot];

            this.tweens.add({
                targets: targets,
                x: screenPos.x,
                y: screenPos.y,
                duration: 400 / this.executionSpeed,
                ease: 'Linear',
                onUpdate: (tween) => {
                    if (!this.robot || !this.robot.active) return;
                    const progress = tween.progress;

                    // Aplicar arco de salto si es necesario
                    if (animType === 'jump') {
                        const arc = Math.sin(Math.PI * progress) * jumpHeight;
                        this.robot.y = (startY + (screenPos.y - startY) * progress) - arc;
                        if (this.shadow) {
                            this.shadow.setScale(1 - (Math.sin(Math.PI * progress) * 0.3));
                        }
                    }

                    // Gestión de la profundidad (depth)
                    if (progress < 0.1) {
                        this.robot.setDepth(currentDepth);
                        if (this.shadow) this.shadow.setDepth(currentShadowDepth);
                    } else if (progress > 0.9) {
                        this.robot.setDepth(targetDepth);
                        if (this.shadow) this.shadow.setDepth(targetShadowDepth);
                    } else {
                        this.robot.setDepth(Math.max(currentDepth, targetDepth));
                        if (this.shadow) this.shadow.setDepth(Math.max(currentShadowDepth, targetShadowDepth));
                    }
                },
                onComplete: () => {
                    if (this.shouldStop || !this.robot || !this.robot.active) {
                        resolve();
                        return;
                    }
                    this.robotPos = { x: nextX, y: nextY, z: nextZ };
                    this.robot.setDepth(targetDepth);
                    if (this.shadow) {
                        this.shadow.setDepth(targetShadowDepth);
                        this.shadow.setScale(1);
                    }

                    resolve();
                }
            });
        });
    }

    cartToIso(x: number, y: number, z: number) {
        const tileW = 64;
        const tileH = 32;
        const hw = tileW / 2;
        const hh = tileH / 2;

        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        const mapW = this.currentLevel ? this.currentLevel.map[0].length : 7;
        const mapH = this.currentLevel ? this.currentLevel.map.length : 7;

        const mapCenterX = (mapW - 1) / 2;
        const mapCenterY = (mapH - 1) / 2;

        const offsetX = cx - (mapCenterX - mapCenterY) * hw;
        const offsetY = cy - (mapCenterX + mapCenterY) * hh;

        const tx = (x - y) * hw + offsetX;
        const ty = (x + y) * hh + offsetY - (z * HEIGHT_STEP);

        return { x: tx, y: ty };
    }

    createMap(mapData: TileInfo[][]) {
        for (let y = 0; y < mapData.length; y++) {
            for (let x = 0; x < mapData[y].length; x++) {
                const tileInfo = mapData[y][x];

                for (let z = 0; z <= tileInfo.h; z++) {
                    const pos = this.cartToIso(x, y, z);
                    const isGoal = z === tileInfo.h && tileInfo.t === TILE.BLUE;
                    let targetFrame = (z === tileInfo.h) ? tileInfo.t : TILE.GRAY;

                    const block = this.add.image(pos.x, pos.y, 'tiles', targetFrame);
                    block.setName(`${x},${y},${z}`);
                    block.setDepth((x + y) * 100);
                    this.mapObjects.push(block);

                    if (isGoal) {
                        this.goalTiles.add(`${x},${y}`);
                    }
                }
            }
        }
    }

    updateRotation() {
        if (!this.robot || !this.robot.active) return;
        const dirKey = ['se', 'sw', 'nw', 'ne'][this.direction];
        const idleFrame = this.direction * 4;
        this.robot.stop();
        this.robot.setFrame(idleFrame);
        this.robot.play(`idle-${dirKey}`, true);
        if (this.robot.anims) {
            this.robot.anims.timeScale = this.executionSpeed;
        }
    }


    private stopIdleFloating() {
        if (this.idleFloatingTween) {
            this.idleFloatingTween.stop();
            this.idleFloatingTween = null;

            // Volver a la posición base
            const basePos = this.cartToIso(this.robotPos.x, this.robotPos.y, this.robotPos.z);
            if (this.robot) {
                this.robot.y = basePos.y;
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

            this.anims.create({
                key: `idle-${dir}`,
                frames: this.anims.generateFrameNumbers('robot', { start: startFrameIdle, end: startFrameIdle + 3 }),
                frameRate: 4,
                repeatDelay: 6000,
                repeat: -1,
                delay: 100
            });
            this.anims.create({
                key: `walk-${dir}`,
                frames: this.anims.generateFrameNumbers('robot', { start: startFrameWalk, end: startFrameWalk + 4 }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: `jump-${dir}`,
                frames: this.anims.generateFrameNumbers('robot', { start: startFrameJump, end: startFrameJump + 4 }),
                frameRate: 12.5
            });
            this.anims.create({
                key: `activate-${dir}`,
                frames: this.anims.generateFrameNumbers('robot', { start: startFrameActivate, end: startFrameActivate + 1 }),
                frameRate: 10
            });
        });
    }
}