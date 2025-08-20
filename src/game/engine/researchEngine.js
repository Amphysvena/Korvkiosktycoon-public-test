//older unlock code
/*export function isResearchTabUnlocked() {
  return state.korv >= 10;
}*/
import { state } from '../state.js';

// Check if Auto-Fry should unlock
export function checkAutoFryUnlock() {
  const autoFry = state.research.autoFry;
  if (!autoFry.unlocked && state.korv >= 10) {
    autoFry.unlocked = true;
    console.log("Auto-Fry unlocked!");
  }
}

// Internal: starts the countdown for a research item
function startResearchCountdown(researchItem) {
  const interval = setInterval(() => {
    researchItem.remainingTime--;

    if (researchItem.remainingTime <= 0) {
      clearInterval(interval);
      researchItem.remainingTime = 0;
      researchItem.researching = false;
      researchItem.completed = true;
      console.log("Auto-Fry research complete!");
    }
  }, 1000);
}

// Start Auto-Fry research from scratch
export function startAutoFryResearch() {
  const autoFry = state.research.autoFry;

  if (!autoFry.researching && !autoFry.completed) {
    if (state.korv < 10) {
      console.log("Not enough korv to start Auto-Fry research!");
      return;
    }

    state.korv -= 10;
    autoFry.researching = true;
    autoFry.remainingTime = 30;

    console.log("Auto-Fry research started! 10 korv deducted.");

    startResearchCountdown(autoFry);
  }
}

// Resume any active research timers (used after loading save)
export function resumeActiveResearch() {
  const autoFry = state.research.autoFry;
  if (autoFry.researching && !autoFry.completed) {
    startResearchCountdown(autoFry);
    console.log("Resuming Auto-Fry research timer...");
  }
}

// Add korv automatically if Auto-Fry is active and research completed
setInterval(() => {
  if (state.autoFryActive && state.research.autoFry.completed) {
    state.korv += 1;

    // Optional: clamp to max korv
    if (state.korv > state.korvtak) state.korv = state.korvtak;
  }
}, 5000);




// 1 När det finns 10 korv i lagret(state.js?) så blir Auto-Fry synlig och köpbar. En knapp som kan tryckas på. Kostar 10 korv. Ökar korv med +1 per 5 sek

// 2 När det finns 100 korv i lagret så blir Korvlådan Plastlåda synlig och köpbar. Kostar 100 korv. Ger spelaren Equipment Plastlåda och ökar korvlager max till 1000

// 3 När det finns 750 korv i lagret så blir Korvlådan Fisklåda synlig och köpbar, kostar 750 korv. Ger spelaren Equipment fisklåda och ökar korvlager max till 7500.

// 4 När Recipe 2 Korv med allt uppnåtts så blir Condiments Machine synlig och köpbar, kostar 10000 korv. Ökar korv med +50 per 5 sek

//dvs koden som aktiverar AutoFry ska ge en permanent bonus i korvinkomst, i state.js?  
//koden som aktiverar Condiments Machine ska ge en permanent bonus i korvinkomst, i state.js?
//Korvlådorna ska unlockas till equipment och korvlager ska öka sitt tak, i state.js?