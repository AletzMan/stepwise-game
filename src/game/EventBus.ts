import { Events } from 'phaser';

// Usado para emitir eventos entre componentes, HTML y escenas de Phaser
export const EventBus = new Events.EventEmitter();