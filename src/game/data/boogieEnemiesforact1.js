//Eftersom act 1 (testversion av spelet) inte har implementerat stridssystemet så ska här istället användas simpla checkboxes om man har rätt equipment för rätt fiende
// Simple unlock system for Act 1
export const boogieEnemies = {
  byråkrat: {
    name: 'Byråkrat',
    img: 'boogie 1 - byråkrat.png',
    description: "En byråkrat kommer med sitt prat.",
    unlockCondition: (state) => state.equipment.korv1?.equipped === true, // ✅ unlock when korv1 is equipped
    winCondition: (state) => state.boogie.damageTypes.has('normal'),      // placeholder
    drops: ['ketchup', 'topphatt'],
    victoryUnlocks: ['ärkekrat']
  },
  // ...other enemies
};