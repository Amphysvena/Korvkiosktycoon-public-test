//Researchdata defining unlock requirements
export const researchData = {
  autoFry: {
  name: "autoFry",
  img: "Research1-Autofry.png",
  cost: 10,
  duration: 30,
  effectAmount: 1, 
  effect: (state) => {
    state.korv += 1;
    if (state.korv > state.korvtak) state.korv = state.korvtak;
  },
    effectInterval: 5000,      // passive effect interval (korv gain)
  criteria: (state) => state.korv >= 10,
  toggleable: 'autoFryActive'
  },

  plasticBox : {
  name: "plastlåda",
  img: "Research2-plastlada varmkorv.png",
  cost: 100,
  duration: 60,
  criteria: (state) => state.korv >= 100, 
  effect: (state) => {
    state.korvtak += 900;
    state.equipment.plasticBox.unlocked = true; // make sure this exists
  }
  },

  fishBox : {
  name: "fisklåda",
  img: "Research3-fisklåda.png",
  cost: 750,
  duration: 300,
  criteria: (state) => state.korv >= 750,
  effect: (state) => {
    state.korvtak += 6350;
    state.equipment.fishBox.unlocked = true; // make sure this exists
  }
 
  },

  condimentsMachine : {
  name: "condiments machine",
  img: "Research4-Condimentmachine.png",
  criteria: (state) => false //placeholder
  }
};
