import { initUI } from './ui.js';
import { startBoogieRegen } from './engine/boogieEngine.js';

export function startGame() {
  initUI();
  startBoogieRegen();  
}