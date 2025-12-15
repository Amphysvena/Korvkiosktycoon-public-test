import { initUI } from './ui.js';
import { registerUpdateCallback } from './gameLoop.js';
import { updateBoogie } from './engine/boogieEngine.js';
import { updateSkills } from './engine/skillsEngine.js';
import { updateRecipes } from './engine/recipeEngine.js'
import { updateBuildings } from './engine/buildingsEngine.js';


export function startGame() {
  initUI();

  // Register boogie update with the global game loop
  registerUpdateCallback(updateBoogie);
  registerUpdateCallback(updateSkills);
  registerUpdateCallback(updateRecipes);
  registerUpdateCallback(updateBuildings);
}
