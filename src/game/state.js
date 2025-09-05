import Decimal from 'break_infinity.js'; // imports the Decimal object from the break_infinity package. It can handle numbers bigger in magnitude than 1e308 
import { researchData } from './data/researchData.js'

export const state = {
  korv: 0,
  korvtak: 250,
  research: {
    autoFry: { unlocked: false, researching: false, remainingTime: 0, completed: false }
  },
  equipment: {
    plasticBox: { unlocked: false, equipped: false }
  }, 
  autoFryActive: false, // toggleable after research is done
};

// Auto-fill state.research from researchData
for (const key in researchData) {
  state.research[key] = {
    unlocked: false,
    researching: false,
    remainingTime: researchData[key].duration,
    completed: false
  };
}
//pseudokod

//track character boogie stats - i början finns endast 1 max HP
//uppdateras från equipment slots i equipment.js

//korv i lager (100 >=) {Plastlåda blir köpbar i research} 

//korv i lager (750 >=) {Fisklåda blir köpbar i research} 

//korvlager tak vid framforskad plastlåda = 1000

//korvlager tak vid framforskad fisklåda = 15000