import Decimal from 'break_infinity.js';
import { researchData } from './data/researchData.js';

export const state = {
  korv: 0,
  korvtak: 250,

  research: {
    autoFry: { unlocked: false, researching: false, remainingTime: 0, completed: false }
  },

  equipment: {
    plasticBox: { unlocked: false, equipped: false },
    korv1: { unlocked: false, equipped: false },
    // Track which weapons are allowed to be equipped
    allowedKorvWeapons: [],

    // Equipped slots
    equippedPrimary: null,
    equippedSecondary: null
  },

  autoFryActive: false // toggleable after research is done
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
