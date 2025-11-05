import { state } from '../state.js';
import { researchData } from '../data/researchData.js';

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

// Internal: countdown timer for a specific research
function startResearchCountdown(key) {
  const researchState = state.research[key];
  const researchDef = researchData[key];
  if (!researchState || !researchDef) return;

  // Clear existing timer to avoid duplicates
  if (researchState._activeTimer) {
    clearInterval(researchState._activeTimer);
  }

  // Save current time as last updated
  researchState.lastUpdated = Date.now();

  researchState._activeTimer = setInterval(() => {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - researchState.lastUpdated) / 1000);
    if (elapsedSeconds <= 0) return; // no time passed

    researchState.remainingTime -= elapsedSeconds;
    if (researchState.remainingTime < 0) researchState.remainingTime = 0;

    researchState.lastUpdated = now;

    if (researchState.remainingTime <= 0) {
      clearInterval(researchState._activeTimer);
      researchState._activeTimer = null;

      researchState.researching = false;
      researchState.completed = true;

      console.log(`${researchDef.name} research complete!`);

      // Run effect only if not toggleable
      if (!researchDef.toggleable && typeof researchDef.effect === "function") {
        researchDef.effect(state);
      }
    }
  }, 1000);
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

    startResearchCountdown(key);
  }
}

// Resume active research timers (after loading)
export function resumeActiveResearch() {
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
          continue; // no need to start timer
        }
      }

      // Update lastUpdated to now
      researchState.lastUpdated = now;

      // Start the countdown timer with updated remainingTime
      startResearchCountdown(key);

      console.log(`Resumed ${researchDef.name} research timer with ${researchState.remainingTime}s remaining.`);
    }
  }
}

// Setup passive effects for researches with effectInterval (unchanged)
for (const key in researchData) {
  const researchDef = researchData[key];

  if (researchDef.effect && researchDef.effectInterval) {
    setInterval(() => {
      const rs = state.research[key];
      if (!rs.completed) return;

      if (researchDef.toggleable && !state[researchDef.toggleable]) return;

      researchDef.effect(state);
    }, researchDef.effectInterval);
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
