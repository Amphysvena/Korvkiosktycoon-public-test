//Eftersom act 1 (testversion av spelet) inte har implementerat stridssystemet så ska här istället användas simpla checkboxes om man har rätt equipment för rätt fiende

//
/*skapa ett objekt som ser ut ungefär såhär: 
    export const boogieEnemies = {
  byråkrat: {
    unlockCondition: () => gameState.equips.koktkorvbrödEquipped,
    winCondition: () => gameState.equips.koktkorvbrödEquipped,
    drops: ['ketchup', 'topphatt'],
    nextUnlocks: ['ärkekrat']
  },
  // ...other enemies
};
*/