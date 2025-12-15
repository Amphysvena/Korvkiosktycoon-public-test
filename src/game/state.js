import Decimal from 'break_infinity.js';
import { researchData } from './data/researchData.js';
import { recipeData } from './data/recipeData.js';
import { buildingData } from './data/buildingData.js';

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
    currentHP: 1,
   // Passive regeneration
    baseRegen: 1 / 60,   // ≈0.0166 HP per second → 1 HP per minute

    regenBonuses: {
      flat: 0,           // +X regen per second
    },        // Added by equipment/items/etc.

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

  buildings: {

  },

  // toggleable after research is done
  autoFryActive: false, 
  condimentsMachineActive: false
};

// Auto-fill state.research from researchData
for (const key in researchData) {
  state.research[key] = {
    unlocked: false,
    researching: false,
    remainingTime: researchData[key].duration,
    completed: false,
    _accumulator: 0
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

for (const key in buildingData) {
  state.buildings[key] = {
    unlocked: false,
    constructing: false,
    remainingTime: buildingData[key].duration,
    completed: false
  };
}


//pseudokod

//track character boogie stats - i början finns endast 3 max HP
//uppdateras från equipment slots i equipment.js
