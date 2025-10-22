import Decimal from 'break_infinity.js';
import { researchData } from './data/researchData.js';
import { recipeData } from './data/recipeData.js';

export const state = {
  korv: 0,
  korvtak: 250,

  research: {
    
  },

  equipment: {
    //korvlådor
    plasticBox: { unlocked: false, equipped: false },
    fishBox: { unlocked: false, equipped: false},
    //korv and primary hand
    korv1: { unlocked: false, equipped: false },
    korv2: { unlocked: false, equipped: false },
    korv3: { unlocked: false, equipped: false },
    // Track which weapons are allowed to be equipped
    allowedKorvWeapons: [],
    //Secondary Hand
    ketchup: {unlocked: false, equipped: false},
    senap: {unlocked: false, equipped: false},
    bostongurka: {unlocked: false, equipped: false},
    //hattar
    topphatt: {unlocked: false, equipped: false},
    pilgrimshatt: {unlocked: false, equipped: false},

    // Equipped slots
    equippedPrimary: null,
    equippedSecondary: null
  },

  // Boogie stats
  boogie: {
    maxHP: 3,
    currentHP: 3,
    damageTypes: new Set (),
    attackPower: 0,
    defense: 0,
    statusEffects: [], // e.g., poison, burn, freeze
    defeatedEnemies: new Set() 
  },

  skills: {
    throw: { unlocked: false, level: 1 },
  },

  recipes: {

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

for (const key in recipeData) {
  state.recipes[key] = {
    unlocked: false,
    crafting: false,
    remainingTime: 0,
    completed: false
  };
}


//pseudokod

//track character boogie stats - i början finns endast 3 max HP
//uppdateras från equipment slots i equipment.js
