// engine/recipeEngine.js
import { state } from '../state.js';
import { recipeData } from '../data/recipeData.js';

export function startRecipeCraft(key, updateButton) {
  const r = state.recipes[key];
  const def = recipeData[key];
  if (!r || !def) return;
  if (r.crafting) return;

  r.crafting = true;
  r.remainingTime = def.duration;
  r.completed = false;

  // Clear existing timer if any
  if (r._activeTimer) clearInterval(r._activeTimer);

  r._activeTimer = setInterval(() => {
    r.remainingTime--;

    if (updateButton) updateButton();

    if (r.remainingTime <= 0) {
      clearInterval(r._activeTimer);
      r._activeTimer = null;
      r.crafting = false;
      r.completed = true;
      r.remainingTime = 0;

      // Unlock rewards after crafting completes
      if (key === 'recipe1') {
        if (!state.equipment.korv2.unlocked) {
          state.equipment.korv2.unlocked = true;
          console.log('Korv2 unlocked via Recipe 1!');
        }
        if (state.kiosk && state.kiosk.korv2) {
          state.kiosk.korv2.unlocked = true;
          console.log('Korv2 kiosk item unlocked!');
        }
      }

      if (key === 'recipe2') {
        if (!state.equipment.korv3.unlocked) {
          state.equipment.korv3.unlocked = true;
          console.log('Korv3 unlocked via Recipe 2!');
        }
        if (state.kiosk && state.kiosk.korv3) {
          state.kiosk.korv3.unlocked = true;
          console.log('Korv3 kiosk item unlocked!');
        }
      }

      if (updateButton) updateButton();
    }
  }, 1000);
}

export function resumeActiveRecipes() {
  for (const key in state.recipes) {
    const r = state.recipes[key];
    if (!r.crafting) continue;
    if (r._activeTimer) continue;

    startRecipeCraft(key); // No UI callback here
  }
}
