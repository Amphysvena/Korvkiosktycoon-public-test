//Eftersom act 1 (testversion av spelet) inte har implementerat stridssystemet så ska här istället användas simpla checkboxes om man har rätt equipment för rätt fiende
// Simple unlock system for Act 1
export const boogieEnemies = {
  byråkrat: {
    name: 'Byråkrat',
    img: 'boogie 1 - byråkrat.png',
    description: "En byråkrat kommer med sitt prat.",
    unlockCondition: (state) => state.equipment.korv1?.equipped === true, 
    winCondition: (state) => state.boogie.damageTypes.has('normal'),      
    drops: ['ketchup', 'topphatt'],
    victoryUnlocks: ['ärkekrat']
  },

  ärkekrat: {
    name: 'Ärkekrat',
    img: 'boogie 2 - ärkekrat.png',
    description: "Han kom gående på gaten.",
    unlockCondition: (state) => state.boogie.defeatedEnemies.has('byråkrat'), // ✅ check victory
    winCondition: (state) => state.boogie.damageTypes.has('heat') && state.boogie.damageTypes.has('cold'),
    drops: ['senap', 'recipe1'],
    victoryUnlocks: []
  },
  // ...other enemies
};