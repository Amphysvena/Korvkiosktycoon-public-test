//Researchdata defining unlock requirements
export const researchData = {
  autoFry: {
  name: "AutoFry",
  img: "Research1-Autofry.png",
  description: "AI-controlled sausage fryer.",
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
  name: "Plastlåda",
  img: "Research2-plastlada varmkorv.png",
  description: "Old laundry-box with several compartments.",
  cost: 100,
  duration: 60,
  criteria: (state) => state.korv >= 100, 
  effect: (state) => {
    state.korvtak += 900;
    state.equipment.plasticBox.unlocked = true; // make sure this exists
  }
  },

  fishBox : {
  name: "Fisklåda",
  img: "Research3-fisklåda.png",
  description: "Upgrade the laundry box with a freezing water compartment",
  cost: 750,
  duration: 300,
  criteria: (state) => state.korv >= 750,
  effect: (state) => {
    state.korvtak += 6350;
    state.equipment.fishBox.unlocked = true; // make sure this exists
  }
 
  },

  condimentsMachine : {
  name: "Condiments Machine",
  img: "Research4-Condimentmachine.png",
  criteria: (state) => false //placeholder
  }
};
