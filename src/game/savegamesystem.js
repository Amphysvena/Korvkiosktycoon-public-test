// savegamesystem.js
import { state } from './state.js';
import { updateKorvCounter } from './ui.js';
import { resumeActiveResearch } from './engine/researchEngine.js';

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
 * Deep-merge source into target in-place, but:
 * - For plain objects: recurse and merge keys
 * - For arrays: replace the target array with the source array
 * - For primitives: replace
 *
 * This preserves any default keys on target that are missing from source.
 */
function deepMerge(target, source) {
  if (!source || typeof source !== 'object') {
    return source;
  }

  // If source is an Array, return a shallow copy of source (overwrite)
  if (Array.isArray(source)) {
    return source.slice();
  }

  // If target is not object, create a new object
  if (!target || typeof target !== 'object' || Array.isArray(target)) {
    target = {};
  }

  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = target[key];

    // Special-case: serialized Set (from our export) => restore Set
    if (srcVal && srcVal.__type === 'Set' && Array.isArray(srcVal.values)) {
      target[key] = new Set(srcVal.values);
      continue;
    }

    // If both are plain objects, recurse
    if (srcVal && typeof srcVal === 'object' && !Array.isArray(srcVal)) {
      target[key] = deepMerge(tgtVal, srcVal);
      continue;
    }

    // For arrays and primitives: overwrite
    target[key] = Array.isArray(srcVal) ? srcVal.slice() : srcVal;
  }

  return target;
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
      // Parse JSON (results may include our {__type:'Set', values: [...] } sentinel objects)
      const data = JSON.parse(e.target.result);

      // Deep-merge parsed data into the live state so defaults are preserved
      deepMerge(state, data);

      // Ensure boogie.damageTypes is a Set (in case save used plain array or sentinel)
      if (state.boogie) {
        if (Array.isArray(state.boogie.damageTypes)) {
          state.boogie.damageTypes = new Set(state.boogie.damageTypes);
        } else if (state.boogie.damageTypes && state.boogie.damageTypes.__type === 'Set') {
          state.boogie.damageTypes = new Set(state.boogie.damageTypes.values || []);
        } else if (!(state.boogie.damageTypes instanceof Set)) {
          // fallback: initialize empty Set
          state.boogie.damageTypes = new Set();
        }
      }

      // Update UI elements that depend on state
      if (state.korv !== undefined) updateKorvCounter(state.korv);

      // 🔹 Resume any research that was active
      resumeActiveResearch();

      console.log("Save loaded and merged into current state:", state);
    } catch (err) {
      console.error("Invalid save file", err);
    }
  };
  reader.readAsText(file);
}
