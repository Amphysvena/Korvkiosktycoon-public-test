//older unlock code
/*export function isResearchTabUnlocked() {
  return state.korv >= 10;
}*/
import { state } from '../state.js';
import { researchData } from '../data/researchData.js';

// Check if researches should unlock based on criteria
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

  const interval = setInterval(() => {
    researchState.remainingTime--;

    if (researchState.remainingTime <= 0) {
      clearInterval(interval);
      researchState.remainingTime = 0;
      researchState.researching = false;
      researchState.completed = true;

      console.log(`${researchDef.name} research complete!`);

      // Run one-time effect (if defined)
      if (typeof researchDef.effect === "function") {
        researchDef.effect(state);
      }
    }
  }, 1000);
}

// Start a research by key (e.g. "autoFry", "plasticBox")
export function startResearch(key) {
  const researchState = state.research[key];
  const researchDef = researchData[key];

  if (!researchState.researching && !researchState.completed) {
    if (state.korv < researchDef.cost) {
      console.log(`Not enough korv to start ${researchDef.name} research!`);
      return;
    }

    state.korv -= researchDef.cost;
    researchState.researching = true;
    researchState.remainingTime = researchDef.duration;

    console.log(`${researchDef.name} research started! ${researchDef.cost} korv deducted.`);

    startResearchCountdown(key);
  }
}

// Resume any active research timers (used after loading save)
export function resumeActiveResearch() {
  for (const key in state.research) {
    const researchState = state.research[key];
    if (researchState.researching && !researchState.completed) {
      startResearchCountdown(key);
      console.log(`Resuming ${researchData[key].name} research timer...`);
    }
  }
}

// Setup passive effects for researches with effectInterval
for (const key in researchData) {
  const researchDef = researchData[key];

  if (researchDef.effect && researchDef.effectInterval) {
    setInterval(() => {
      if (state.research[key].completed) {
        researchDef.effect(state);
      }
    }, researchDef.effectInterval);
  }
}



// 2 När det finns 100 korv i lagret så blir Korvlådan Plastlåda synlig och köpbar. Kostar 100 korv. Ger spelaren Equipment Plastlåda och ökar korvlager max till 1000

// 3 När det finns 750 korv i lagret så blir Korvlådan Fisklåda synlig och köpbar, kostar 750 korv. Ger spelaren Equipment fisklåda och ökar korvlager max till 7500.

// 4 När Recipe 2 Korv med allt uppnåtts så blir Condiments Machine synlig och köpbar, kostar 10000 korv. Ökar korv med +50 per 5 sek

//dvs koden som aktiverar AutoFry ska ge en permanent bonus i korvinkomst, i state.js?  
//koden som aktiverar Condiments Machine ska ge en permanent bonus i korvinkomst, i state.js?
//Korvlådorna ska unlockas till equipment och korvlager ska öka sitt tak, i state.js?