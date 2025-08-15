//import { isAutoFryUnlocked } from './ResearchEngine.js';
//implement later

//olderunlock code
//import { isResearchTabUnlocked } from '../engine/researchEngine.js';

export function renderResearchTab({ tabContent }) {
  tabContent.innerHTML = '';

  if (isAutoFryUnlocked()) {
    // render Auto-Fry button
  } else {
    tabContent.innerHTML = '<p>No research available yet.</p>';
  }
}

//older unlock code
/*export function isUnlocked() {
  // delegate to ResearchEngine
  return isResearchTabUnlocked();
}*/  


//pseudokod

// 1 När det finns 10 korv i lagret(state.js?) så blir Auto-Fry synlig och köpbar. En knapp som kan tryckas på. Kostar 10 korv. Ökar korv med +1 per 5 sek

// 2 När det finns 100 korv i lagret så blir Korvlådan Plastlåda synlig och köpbar. Kostar 100 korv. Ger spelaren Equipment Plastlåda och ökar korvlager max till 1000

// 3 När det finns 750 korv i lagret så blir Korvlådan Fisklåda synlig och köpbar, kostar 750 korv. Ger spelaren Equipment fisklåda och ökar korvlager max till 7500.

// 4 När Recipe 2 Korv med allt uppnåtts så blir Condiments Machine synlig och köpbar, kostar 10000 korv. Ökar korv med +50 per 5 sek

//dvs bilder och ett sätt att visa dom när de redan har använts. 