import { state } from '../state.js';
import { researchData } from '../data/researchData.js';
import { registerUpdateCallback, unregisterUpdateCallback } from '../gameLoop.js';  // adjust path if needed

// Flag to track if the global update callback is registered
let isUpdateCallbackRegistered = false;

// Update callback function reference for unregistering if needed
let updateCallback = null;

// Check unlocks (your existing function)
export function researchUnlock() {
  for (const key in researchData) {
    const research = researchData[key];
    const researchState = state.research[key];

    if (!researchState.unlocked && research.criteria(state)) {
      researchState.unlocked = true;
      console.log(`${research.name} unlocked!`);
    }
  }
}

// Start research by key
export function startResearch(key) {
  const researchState = state.research[key];
  const researchDef = researchData[key];
  if (!researchState || !researchDef) return;

  if (!researchState.researching && !researchState.completed) {
    if (state.korv < researchDef.cost) {
      console.log(`Not enough korv to start ${researchDef.name} research!`);
      return;
    }

    state.korv -= researchDef.cost;
    researchState.researching = true;
    researchState.remainingTime = researchDef.duration;
    researchState.lastUpdated = Date.now();

    console.log(`${researchDef.name} research started! ${researchDef.cost} korv deducted.`);

    // Register global update callback if not already
    if (!isUpdateCallbackRegistered) {
      updateCallback = (delta) => updateResearchTimers(delta);
      registerUpdateCallback(updateCallback);
      isUpdateCallbackRegistered = true;
    }
  }
}

// The global update callback that ticks all active researches
function updateResearchTimers(deltaMs) {
  const deltaSeconds = deltaMs / 1000;
  let anyResearchActive = false;

  for (const key in state.research) {
    const rs = state.research[key];
    const def = researchData[key];

    if (rs.researching && !rs.completed) {
      anyResearchActive = true;
      rs.remainingTime -= deltaSeconds;
      if (rs.remainingTime <= 0) {
        rs.remainingTime = 0;
        rs.researching = false;
        rs.completed = true;

        console.log(`${def.name} research complete!`);

        if (!def.toggleable && typeof def.effect === "function") {
          def.effect(state);
        }
      }
    }
  }

  // If no research active, unregister this update callback to save CPU
  if (!anyResearchActive && isUpdateCallbackRegistered) {
    unregisterUpdateCallback(updateCallback);
    isUpdateCallbackRegistered = false;
    updateCallback = null;
  }
}

// Resume active research timers (after loading)
export function resumeActiveResearch() {
  let anyResearchActive = false;

  for (const key in state.research) {
    const researchState = state.research[key];
    const researchDef = researchData[key];

    if (researchState.researching && !researchState.completed) {
      // If lastUpdated is missing or invalid, set it now
      if (typeof researchState.lastUpdated !== 'number') {
        researchState.lastUpdated = Date.now();
      }

      // Calculate elapsed time
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - researchState.lastUpdated) / 1000);
      if (elapsedSeconds > 0) {
        researchState.remainingTime -= elapsedSeconds;
        if (researchState.remainingTime <= 0) {
          researchState.remainingTime = 0;
          researchState.researching = false;
          researchState.completed = true;

          console.log(`${researchDef.name} research complete on load!`);

          if (!researchDef.toggleable && typeof researchDef.effect === "function") {
            researchDef.effect(state);
          }
          continue; // no need to track further
        }
      }

      // Update lastUpdated to now
      researchState.lastUpdated = now;

      anyResearchActive = true;
    }
  }

  // Register global update callback if any research is active
  if (anyResearchActive && !isUpdateCallbackRegistered) {
    updateCallback = (delta) => updateResearchTimers(delta);
    registerUpdateCallback(updateCallback);
    isUpdateCallbackRegistered = true;
  }
}
function updateResearchPassiveEffects(deltaMs) {
  for (const key in researchData) {
    const def = researchData[key];
    const rs = state.research[key];

    if (!rs.completed) continue;
    if (!def.effectInterval || typeof def.effect !== "function") continue;

    if (def.toggleable && !state[def.toggleable]) continue;

    rs._accumulator += deltaMs;

    while (rs._accumulator >= def.effectInterval) {
      rs._accumulator -= def.effectInterval;
      def.effect(state);
    }
  }
}

// Cheat code to finish all research timers
export function finishAllResearchTimers() {
  console.log("Cheat: setting all active research timers to 1 second left");
  for (const key in state.research) {
    const rs = state.research[key];
    if (rs.researching && !rs.completed) {
      rs.remainingTime = 1;
      rs.lastUpdated = Date.now();
      console.log(`${key} set to 1 second remaining`);
    }
  }
}

export function updateResearch(deltaMs) {
  updateResearchTimers(deltaMs);
  updateResearchPassiveEffects(deltaMs);
}
