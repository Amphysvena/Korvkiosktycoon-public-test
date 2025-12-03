//Researchdata defining unlock requirements and stats
export const researchData = {
  autoFry: {
  name: "AutoFry",
  img: "Research1-Autofry.png",
  description: "AI-controlled sausage fryer.",
  cost: 10,
  duration: 30,
  effectAmount: 1, //the amount to display in kiosktab. It is divided by effectInterval
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
    state.equipment.plasticBox.unlocked = true; 
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
    state.equipment.fishBox.unlocked = true; 
  }
 
  },

  condimentsMachine : {
    name: "Condiments Machine",
    img: "Research4-Condimentmachine.png",
    description: "A machine that applies condiments to sausages. Faster, more powerful and accurate than any human.",
    cost: 1500,
    duration: 360,
    effectAmount: 50, //the amount to display in kiosktab. It is divided by effectInterval
    toggleable: 'condimentsMachineActive',
    criteria: (state) => state.recipes.recipe2?.completed === true,
    effectInterval: 1000, // 1000 ms = 1 second
    
    effect: (state) => {
      // Add 50 korv per second when active
      if (state.condimentsMachineActive) {
        state.korv += 50;
        if (state.korv > state.korvtak) state.korv = state.korvtak;
      }
    }
  } 
}; 