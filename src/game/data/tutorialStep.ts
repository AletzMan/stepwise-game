import { DriveStep } from "driver.js";

export const TUTORIAL_STEPS_LVL1: DriveStep[] = [
    {
        element: '#header',
        popover: {
            title: "welcome",
            side: "bottom",
            align: 'center'
        }
    },
    {
        element: '#command-palette',
        popover: {
            title: "commands",
            side: "bottom",
            align: 'center'
        }
    },
    {
        element: '#command-palette',
        popover: {
            title: "commandsTwo",
            side: "bottom",
            align: 'center'
        }
    },
    {
        element: '#queue-main',
        popover: {
            title: "sequence",
            side: "bottom",
            align: 'center'
        }
    },
    {
        element: '#queue-main',
        popover: {
            title: "sequenceDrag",
            side: "bottom",
            align: 'center'
        }
    },
    {
        element: '#control-buttons',
        popover: {
            title: "controlButtons",
            side: "bottom",
            align: 'center'
        }
    },
    {
        element: '#speed-buttons',
        popover: {
            title: "speed",
            side: "bottom",
            align: 'center'
        }
    },
    {
        element: '#phaser-canvas',
        popover: {
            title: "canvas",
            side: "bottom",
            align: 'center'
        }
    },

];

export const TUTORIAL_STEPS_LVL11: DriveStep[] = [
    {
        element: '#command-palette',
        popover: {
            title: "functions",
            side: "bottom",
            align: 'center'
        }
    },
    {
        element: '#command-palette',
        popover: {
            title: "functionsTwo",
            side: "bottom",
            align: 'center'
        }
    },

];

export const TUTORIAL_STEPS_LVL21: DriveStep[] = [
    {
        element: '#command-palette',
        popover: {
            title: "functions",
            side: "bottom",
            align: 'center'
        }
    },
    {
        element: '#command-palette',
        popover: {
            title: "functionsTwo",
            side: "bottom",
            align: 'center'
        }
    },

];

export const TUTORIAL_STEPS_LVL26: DriveStep[] = [
    {
        element: '#command-palette',
        popover: {
            title: "pick",
            side: "bottom",
            align: 'center'
        }
    },
    {
        element: '#command-palette',
        popover: {
            title: "pickTwo",
            side: "bottom",
            align: 'center'
        }
    },

];

export const TUTORIAL_STEPS_LVL31: DriveStep[] = [
    {
        element: '#command-palette',
        popover: {
            title: "repeat",
            side: "bottom",
            align: 'center'
        }
    },
    {
        element: '#command-palette',
        popover: {
            title: "repeatTwo",
            side: "bottom",
            align: 'center'
        }
    },

];


export const TUTORIAL_CONFIG = {
    showProgress: true,
    animate: true,
    smoothScroll: true,
    popoverClass: 'stepwise-tutorial-popover',
    popoverOffset: 12,
    progressText: '{{current}} DE {{total}}',
    nextBtnText: 'CONTINUAR',
    prevBtnText: 'REGRESAR',
    doneBtnText: 'LISTO',
};