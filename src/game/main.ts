import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import * as Phaser from 'phaser';

//  Encuentra más información sobre la configuración del juego (Game Config) en:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 768,
    height: 600,
    parent: 'game-container',
    pixelArt: false,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.Center.CENTER_BOTH,
        max: {
            width: 768,
            height: 600,
        },
        width: 768,
        height: 600,
    },
    backgroundColor: '#121820',
    scene: [
        Boot,
        Preloader,
        MainGame
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
