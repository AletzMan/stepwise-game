import { DriveStep } from "driver.js";

export const TUTORIAL_STEPS: DriveStep[] = [
    {
        element: '#header',
        popover: {
            title: "welcome",
            description: 'Bienvenido a Stepwise, Juego de lógica y programación para aprender a programar de forma divertida.',
            side: "bottom",
            align: 'center'
        }
    },

];


export const TUTORIAL_CONFIG = {
    showProgress: true,
    animate: true,
    smoothScroll: true,
    popoverClass: 'reboot-tutorial-popover',
    popoverOffset: 12,
    progressText: '{{current}} DE {{total}}',
    nextBtnText: 'CONTINUAR',
    prevBtnText: 'REGRESAR',
    doneBtnText: 'LISTO',
};