export const boogieEnemies = {
  byråkrat: {
    name: 'Byråkrat',
    img: 'boogie 1 - byråkrat.png',
    description: "En byråkrat kommer med sitt prat.",
    unlockCondition: (state) => state.equipment.korv1?.unlocked === true, 
    winCondition: (state) => !!state.boogie.damageTypes['normal'],      
    drops: ['ketchup', 'topphatt'],
    victoryUnlocks: ['ärkekrat']
  },

  ärkekrat: {
    name: 'Ärkekrat',
    img: 'boogie 2 -  ärkekrat.png',
    description: "Han kom gående på gaten.",
    unlockCondition: (state) => state.boogie.defeatedEnemies.has('byråkrat'),
    winCondition: (state) => !!state.boogie.damageTypes['heat'] && !!state.boogie.damageTypes['cold'],
    drops: ['senap', 'recipe1'],
    victoryUnlocks: []
  },

  överförmyndare: {
    name: 'Överförmyndare',
    img: 'boogie 3 - överförmyndare.png',
    description: "A man with a grim hat. He seems to hate the swedish cold weather and he seems to scoff at what swedish people call castles.",
    unlockCondition: (state) => state.boogie.defeatedEnemies.has('ärkekrat'),
    winCondition: (state) => !!state.boogie.damageTypes['cold'] && !!state.boogie.damageTypes['pungent'],
    drops: ['bostongurka', 'recipe2', 'pilgrimshatt', 'lagerhus'],
    victoryUnlocks: []
  },
  // ...other enemies
};
