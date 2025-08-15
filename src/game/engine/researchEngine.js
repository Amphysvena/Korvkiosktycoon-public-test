import { state } from '../state.js';

//older unlock code
/*export function isResearchTabUnlocked() {
  return state.korv >= 10;
}*/

export function isAutoFryUnlocked() {
  return state.korv >= 10; // example
}

// 1 När det finns 10 korv i lagret(state.js?) så blir Auto-Fry synlig och köpbar. En knapp som kan tryckas på. Kostar 10 korv. Ökar korv med +1 per 5 sek

// 2 När det finns 100 korv i lagret så blir Korvlådan Plastlåda synlig och köpbar. Kostar 100 korv. Ger spelaren Equipment Plastlåda och ökar korvlager max till 1000

// 3 När det finns 750 korv i lagret så blir Korvlådan Fisklåda synlig och köpbar, kostar 750 korv. Ger spelaren Equipment fisklåda och ökar korvlager max till 7500.

// 4 När Recipe 2 Korv med allt uppnåtts så blir Condiments Machine synlig och köpbar, kostar 10000 korv. Ökar korv med +50 per 5 sek

//dvs koden som aktiverar AutoFry ska ge en permanent bonus i korvinkomst, i state.js?  
//koden som aktiverar Condiments Machine ska ge en permanent bonus i korvinkomst, i state.js?
//Korvlådorna ska unlockas till equipment och korvlager ska öka sitt tak, i state.js?