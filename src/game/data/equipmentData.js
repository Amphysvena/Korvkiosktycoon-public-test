import { renderEquipmentTab } from '../ui/equipmentTab.js';

export const equipmentData = {
    //korvlådor
  plasticBox: {
    name: "Plastlåda",
    img: "src/game/Assets/img/equipment/korvlador/Korvlada1-plastladavarmkorv.png",
    effectDescription: "Can cook some basic sausage types.",
    slot: "korvBox", 
    toggleable: null, // permanent effect when equipped
    onEquip: (state) => {
      // Unlock korv1 if not already unlocked
      if (!state.equipment.korv1.unlocked) {
        state.equipment.korv1.unlocked = true;
        console.log("Kokt korv med bröd (korv1) unlocked!");
        }

      // Enable korv1, korv2, korv3 to be equipable
      state.equipment.allowedKorvWeapons = ['korv1', 'korv2', 'korv3'];
    },
    onUnequip: null // change later to force unequip of all allowed weapons. 
  },

  //Primary Hand
  korv1: {
    name: "Kokt korv med bröd",
    img: "src/game/Assets/img/equipment/Korvknappar/korv1.png",
    slot: "primaryHand",
    effectDescription: "A basic sausage with nothing on it.",
    toggleable: true, // can be equipped/unequipped
    onEquip: (state) => {
    state.boogie.equippedDamageType = "normal";
    state.boogie.attackPower = 1; // modify if equipment gives bonus
},
    onUnequip: (state) => {
      // This function runs when unequipped
      state.boogie.equippedDamageType = null; // clear damage type
    }
  }

};


//pseudokod

//I act 1, testversionen av spelet så är equipment bara för simpla checks om man vinner. Så all data i denna fil är främst för framtida bruk.

///Plastlåda 1:
//Boogie (boogie är en duel tab) stats:
// Ammo cap: 10. Korvvapen 1-3 (koktkorvbröd,koktkorvbrödsenapketchup, korvmedallt) ammo regen 1 per 5 sec i strid

//Fisklåda 2: (Boogie stats:
// Ammo cap 100 alla vapen, ammo regen 1 per 5 sec kylskada (25% chans att fienden står still i 1 sekund/ej implementerat)

//Primary Hand: 1. koktkorvbröd
// Boogie stats : 1 normal damage (alla vapen kastas framåt som mål just nu)

//Primaryhand 2. kokt korv med bröd, ketchup senap 
// (Boogie stats 1 normal dmg, 1 senap dmg,1 ketchup dmg)

//Secondary equip 1. ketchup (adds 1 ketchup damage)

//Secondary equip 2. Senap (adds 1 senap damage)

//Secondary equip 3. Bostongurka (Adds 1 HP regen)

//Hatt equip 1. Topphatt (Max HP +10)

//Hatt equip 2. Pilgrimshatt (Max HP +50), 

