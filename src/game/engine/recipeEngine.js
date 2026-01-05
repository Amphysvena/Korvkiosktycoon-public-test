// engine/recipesEngine.js
import { state } from '../state.js';
import { recipeData } from '../data/recipeData.js';

export function startRecipeCraft(key) {
  const r = state.recipes[key];
  const def = recipeData[key];
  if (!r || !def) return;
  if (r.crafting || r.completed) return;

  r.crafting = true;
  r.remainingTime = def.duration; // seconds
}

export function updateRecipes(delta) {
  const dt = delta / 1000;

  for (const key in state.recipes) {
    const r = state.recipes[key];
    if (!r.crafting) continue;

    r.remainingTime -= dt;

    if (r.remainingTime <= 0) {
      r.remainingTime = 0;
      r.crafting = false;
      r.completed = true;

      unlockRecipeRewards(key);
    }
  }
}

export function resumeActiveRecipes() {
  // Nothing to resume anymore
}

function unlockRecipeRewards(key) {
  if (key === 'recipe1') {
    state.equipment.korv2.unlocked = true;
    if (state.kiosk?.korv2) state.kiosk.korv2.unlocked = true;
  }

  if (key === 'recipe2') {
    state.equipment.korv3.unlocked = true;
    if (state.kiosk?.korv3) state.kiosk.korv3.unlocked = true;
  }
}
