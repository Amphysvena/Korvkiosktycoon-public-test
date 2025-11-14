//import UIs from ui.js
import { initUI } from './ui.js';
//import regen logic from boogie
import { startBoogieRegen } from './engine/boogieEngine.js';

export function startGame() {
  initUI();
  startBoogieRegen();
}