import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  La escena de Boot se utiliza típicamente para cargar cualquier recurso que requieras para el Preloader, como el logo del juego o el fondo.
        //  Cuanto menor sea el tamaño de archivo de los recursos, mejor, ya que la escena de Boot en sí no tiene un preloader.

        this.load.image('background', 'assets/bg.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
