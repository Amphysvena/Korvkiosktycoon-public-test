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
  r.lastUpdated = Date.now();
}

export function updateRecipes(delta) {
  const now = Date.now();

  for (const key in state.recipes) {
    const r = state.recipes[key];
    if (!r.crafting) continue;

    const elapsed = (now - r.lastUpdated) / 1000;
    if (elapsed <= 0) continue;

    r.remainingTime -= elapsed;
    r.lastUpdated = now;

    if (r.remainingTime <= 0) {
      r.remainingTime = 0;
      r.crafting = false;
      r.completed = true;

      unlockRecipeRewards(key);
    }
  }
}

export function resumeActiveRecipes() {
  const now = Date.now();

  for (const key in state.recipes) {
    const r = state.recipes[key];
    if (!r.crafting || r.completed) continue;

    // Ensure timestamp exists
    if (typeof r.lastUpdated !== 'number') {
      r.lastUpdated = now;
    }
  }
}

function unlockRecipeRewards(key) {
  if (key === 'recipe1') {
    if (!state.equipment.korv2.unlocked) {
      state.equipment.korv2.unlocked = true;
    }
    if (state.kiosk?.korv2) {
      state.kiosk.korv2.unlocked = true;
    }
  }

  if (key === 'recipe2') {
    if (!state.equipment.korv3.unlocked) {
      state.equipment.korv3.unlocked = true;
    }
    if (state.kiosk?.korv3) {
      state.kiosk.korv3.unlocked = true;
    }
  }
}
