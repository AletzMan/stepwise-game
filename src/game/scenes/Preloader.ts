import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  Cargamos esta imagen en nuestra escena de Boot, así que podemos mostrarla aquí
        this.add.image(512, 384, 'background');

        //  Una barra de progreso simple. Este es el contorno de la barra.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  Esta es la barra de progreso en sí. Aumentará de tamaño desde la izquierda según el % de progreso.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Utilizar el evento 'progress' emitido por LoaderPlugin para actualizar la barra de carga
        this.load.on('progress', (progress: number) => {

            //  Actualizar la barra de progreso (nuestra barra tiene 464px de ancho, así que 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Cargar los recursos para el juego - Reemplázalos con tus propios recursos
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');
    }

    create ()
    {
        //  Cuando se hayan cargado todos los recursos, suele valer la pena crear objetos globales aquí que el resto del juego pueda usar.
        //  Por ejemplo, puedes definir animaciones globales aquí para poder usarlas en otras escenas.

        //  Ir a MainMenu. También podrías cambiar esto por una transición de escena, como un desvanecimiento de cámara.
        this.scene.start('Game');
    }
}
