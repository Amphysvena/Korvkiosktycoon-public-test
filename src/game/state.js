import Decimal from 'break_infinity.js'; // imports the Decimal object from the break_infinity package. It can handle numbers bigger in magnitude than 1e308 

export const state = {
  korv: 0,
  korvtak: 250
};
//pseudokod

//track character boogie stats - i början finns endast 1 max HP
//uppdateras från equipment slots i equipment.js

//track korv i lager konstant

//korvlager tak vid start = 250

//korv i lager (100 >=) {Plastlåda blir köpbar i research} 

//korv i lager (750 >=) {Fisklåda blir köpbar i research} 

//korvlager tak vid framforskad plastlåda = 1000

//korvlager tak vid framforskad fisklåda = 15000