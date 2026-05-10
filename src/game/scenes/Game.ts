import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import * as Phaser from 'phaser';

// Definimos la estructura de los datos del mapa
interface TileInfo {
    h: number; // Altura (Z)
    t: number; // Tipo (Frame del tile)
}

const MAP_DATA: TileInfo[][] = [
    [{ h: 0, t: 1 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 1, t: 2 }, { h: 2, t: 2 }, { h: 3, t: 2 }, { h: 4, t: 2 }],
    [{ h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }],
    [{ h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }],
    [{ h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }],
    [{ h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }],
    [{ h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }],
    [{ h: 0, t: 3 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }, { h: 0, t: 0 }]
];

const TILE = { GRIS: 0, MORADO: 1, AMARILLO: 2, AZUL: 3, AGUA: 4, MADERA: 5 };
const HEIGHT_STEP = 16;

export class Game extends Scene {
    robotPos: { x: number; y: number; z: number };
    direction: number;
    isMoving: boolean;
    robot: Phaser.GameObjects.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    keySpace: Phaser.Input.Keyboard.Key;
    casillasMeta: Record<string, Phaser.GameObjects.Image>;

    constructor() {
        super('Game');
        this.robotPos = { x: 0, y: 0, z: 0 };
        this.direction = 0;
        this.isMoving = false;
        this.casillasMeta = {}; // IMPORTANTE: Inicializar
    }

    preload() {
        this.load.spritesheet('robot', 'assets/sprite-sheet.png', { frameWidth: 64, frameHeight: 96 });
        // Cargamos los tiles como spritesheet para usar los frames (0, 1, 2...)
        this.load.spritesheet('tiles', 'assets/tiles.png', { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        this.crearMapa();

        // Accedemos a .h para la altura inicial
        this.robotPos.z = MAP_DATA[0][0].h;
        const startPos = this.cartToIso(0, 0, this.robotPos.z);

        this.robot = this.add.sprite(startPos.x, startPos.y, 'robot').setOrigin(0.5, 0.95);
        this.robot.setDepth(2000);
        this.robot.setScale(0.8);

        this.crearAnimaciones();

        this.cursors = this.input.keyboard!.createCursorKeys();
        this.keySpace = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        EventBus.emit('current_scene', 'Game');
    }

    update() {
        if (this.isMoving) return;

        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.ejecutarAccion('WALK');
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
            this.direction = (this.direction + 3) % 4;
            this.actualizarGiro();
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            this.direction = (this.direction + 1) % 4;
            this.actualizarGiro();
        } else if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {
            this.ejecutarAccion('JUMP');
        }
    }

    async ejecutarAccion(tipo: 'WALK' | 'JUMP') {
        this.isMoving = true;

        let nextX = this.robotPos.x;
        let nextY = this.robotPos.y;

        if (this.direction === 0) nextX++;
        else if (this.direction === 1) nextY++;
        else if (this.direction === 2) nextX--;
        else if (this.direction === 3) nextY--;

        if (nextX < 0 || nextY < 0 || nextX >= MAP_DATA[0].length || nextY >= MAP_DATA.length) {
            this.isMoving = false;
            return;
        }

        // Acceso correcto a la propiedad .h
        const currentZ = MAP_DATA[this.robotPos.y][this.robotPos.x].h;
        const targetZ = MAP_DATA[nextY][nextX].h;

        if (tipo === 'WALK') {
            if (currentZ === targetZ) {
                await this.animarMovimiento(nextX, nextY, targetZ, 'walk');
            } else {
                console.log("¡Obstáculo! Usa JUMP");
            }
        } else if (tipo === 'JUMP') {
            await this.animarMovimiento(nextX, nextY, targetZ, 'jump');
        }

        this.isMoving = false;
    }

    async animarMovimiento(nx: number, ny: number, nz: number, tipoAnim: 'walk' | 'jump') {
        const dirKey = ['se', 'sw', 'nw', 'ne'][this.direction];
        this.robot.play(`${tipoAnim}-${dirKey}`, true);

        // Guardamos ambos depths
        const depthActual = ((this.robotPos.x + this.robotPos.y) * 100) + 1;
        const depthDestino = ((nx + ny) * 100) + 1;

        // Guardamos la posición inicial en pantalla
        const startX = this.robot.x;
        const startY = this.robot.y;

        // Calculamos la posición final en pantalla
        const screenPos = this.cartToIso(nx, ny, nz);

        // Altura máxima del arco
        const jumpHeight = tipoAnim === 'jump' ? 10 : 0;

        return new Promise<void>((resolve) => {
            this.tweens.add({
                targets: this.robot,
                x: screenPos.x,
                y: screenPos.y,
                duration: 400,
                ease: 'Linear',
                onUpdate: (tween) => {
                    const progress = tween.progress;

                    // 1. Aplicamos el arco de salto si es necesario
                    if (tipoAnim === 'jump') {
                        const arc = Math.sin(Math.PI * progress) * jumpHeight;
                        this.robot.y = (startY + (screenPos.y - startY) * progress) - arc;
                    }

                    // --- 2. EL ARREGLO MÁGICO DEL DEPTH ---
                    // Si va a menos de la mitad del camino, conserva el depth de origen.
                    // Si ya cruzó la mitad, adquiere el depth de destino.
                    if (progress < 0.4) {
                        this.robot.setDepth(depthActual);
                    } else {
                        this.robot.setDepth(depthDestino);
                    }
                },
                onComplete: () => {
                    this.robotPos = { x: nx, y: ny, z: nz };
                    this.robot.setDepth(depthDestino);
                    this.robot.play(`idle-${dirKey}`);
                    resolve();
                }
            });
        });
    }

    cartToIso(x: number, y: number, z: number) {
        const tx = (x - y) * (64 / 2) + 400;
        // Formula: PosY_base - (Z * Altura_bloque)
        const ty = (x + y) * (32 / 2) + 150 - (z * HEIGHT_STEP);
        return { x: tx, y: ty };
    }

    crearMapa() {
        for (let y = 0; y < MAP_DATA.length; y++) {
            for (let x = 0; x < MAP_DATA[y].length; x++) {
                const info = MAP_DATA[y][x];

                for (let z = 0; z <= info.h; z++) {
                    const pos = this.cartToIso(x, y, z);
                    const frameDeseado = (z === info.h) ? info.t : TILE.GRIS;

                    const bloque = this.add.image(pos.x, pos.y, 'tiles', frameDeseado);
                    //bloque.setDepth(x + y + z);
                    bloque.setDepth((x + y) * 100);

                    if (z === info.h && info.t === TILE.MORADO) {
                        this.casillasMeta[`${x},${y}`] = bloque;
                    }
                }
            }
        }
    }

    actualizarGiro() {
        const dirKey = ['se', 'sw', 'nw', 'ne'][this.direction];
        this.robot.play(`idle-${dirKey}`); // Corregido de this.player a this.robot
    }

    crearAnimaciones() {
        const dirs = ['se', 'sw', 'nw', 'ne'];
        dirs.forEach((dir, i) => {
            const startFrameWalk = dir === 'se' ? 20 : dir === 'sw' ? 25 : dir === 'nw' ? 30 : 35;
            const startFrameJump = dir === 'se' ? 40 : dir === 'sw' ? 45 : dir === 'nw' ? 50 : 55;

            this.anims.create({
                key: `idle-${dir}`,
                frames: [{ key: 'robot', frame: i }]
            });
            this.anims.create({
                key: `walk-${dir}`,
                frames: this.anims.generateFrameNumbers('robot', { start: startFrameWalk, end: startFrameWalk + 3 }),
                frameRate: 13,
                repeat: -1
            });
            this.anims.create({
                key: `jump-${dir}`,
                frames: this.anims.generateFrameNumbers('robot', { start: startFrameJump, end: startFrameJump + 5 }),
                frameRate: 10
            });
        });
    }
}