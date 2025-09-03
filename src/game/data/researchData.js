//Researchdata defining unlock requirements
export const researchData = {
  autoFry: {
  name: "autoFry",
  cost: 10,
  duration: 30,
  effect: (state) => {
    state.korv += 1;
    if (state.korv > state.korvtak) state.korv = state.korvtak;
  },
    effectInterval: 5000,      // passive effect interval (korv gain)
  criteria: (state) => state.korv >= 10
  },

  plasticBox : {
  name: "plastlåda",
  criteria: (state) => state.korv >= 100  
  },

  fishBox : {
  name: "fisklåda",
  criteria: (state) => state.korv >= 750
  },

  condimentsMachine : {
  name: "condiments machine",
  criteria: (state) => false //placeholder
  }
};
