import { initUI } from './ui.js';
import { registerUpdateCallback } from './gameLoop.js';
import { updateBoogie } from './engine/boogieEngine.js';
import { updateSkills } from './engine/skillsEngine.js';


export function startGame() {
  initUI();

  // Register boogie update with the global game loop
  registerUpdateCallback(updateBoogie);
  registerUpdateCallback(updateSkills);
}
