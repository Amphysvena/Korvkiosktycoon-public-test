// savegamesystem.js
import { state } from './state.js';
import { updateKorvCounter, refreshCurrentTab } from './ui.js';
import { resumeActiveResearch } from './engine/researchEngine.js';
import { resumeActiveRecipes } from './engine/recipeEngine.js';
import { resumeActiveBuildings } from './engine/buildingsEngine.js';

/**
 * JSON replacer to serialize Sets with a tag so we can restore them later.
 */
function jsonReplacer(key, value) {
  if (value instanceof Set) {
    return { __type: 'Set', values: Array.from(value) };
  }
  return value;
}

/**
 * Replace all keys in target with keys from source, fully overwriting it.
 */
function replaceState(target, source) {
  // Remove all existing keys in target
  for (const key in target) {
    delete target[key];
  }

  // Copy all keys from source into target (shallow copy)
  for (const key in source) {
    target[key] = source[key];
  }
}

// Export save to file (with replacer to preserve Sets)
export function exportSave() {
  try {
    const json = JSON.stringify(state, jsonReplacer, 2);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json);
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', 'korvkiosk_save.json');
    dl.click();
  } catch (err) {
    console.error("Failed to export save:", err);
  }
}

// Import save from file
export function importSave(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);

      // Fully replace the in-memory state instead of merging
      replaceState(state, data);

      // --- Restore Sets inside boogie object ---
      if (state.boogie) {
        // Restore damageTypes
        if (Array.isArray(state.boogie.damageTypes)) {
          state.boogie.damageTypes = new Set(state.boogie.damageTypes);
        } else if (state.boogie.damageTypes && state.boogie.damageTypes.__type === 'Set') {
          state.boogie.damageTypes = new Set(state.boogie.damageTypes.values || []);
        } else if (!(state.boogie.damageTypes instanceof Set)) {
          state.boogie.damageTypes = new Set();
        }

        // ✅ Restore defeatedEnemies too
        if (Array.isArray(state.boogie.defeatedEnemies)) {
          state.boogie.defeatedEnemies = new Set(state.boogie.defeatedEnemies);
        } else if (state.boogie.defeatedEnemies && state.boogie.defeatedEnemies.__type === 'Set') {
          state.boogie.defeatedEnemies = new Set(state.boogie.defeatedEnemies.values || []);
        } else if (!(state.boogie.defeatedEnemies instanceof Set)) {
          state.boogie.defeatedEnemies = new Set();
        }
      }

      // --- Ensure research timers have valid lastUpdated timestamps ---
      for (const key in state.research) {
        const rs = state.research[key];
        if (rs.researching && !rs.completed) {
          if (typeof rs.lastUpdated !== 'number') {
            rs.lastUpdated = Date.now();
          }
        }
      }

      // --- Update UI elements that depend on state ---
      if (state.korv !== undefined) updateKorvCounter(state.korv);

      // --- Resume any active timers ---
      resumeActiveResearch();
      resumeActiveRecipes();
      resumeActiveBuildings();

      // --- Refresh the active tab ---
      refreshCurrentTab();

      console.log("✅ Save loaded, Sets restored, and timers resumed.");
    } catch (err) {
      console.error("❌ Invalid save file:", err);
    }
  };
  reader.readAsText(file);
}
