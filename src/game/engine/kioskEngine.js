//pseudokod

//"Gör korv" knapp +1 korv när det trycks på i kioskTab

//"Gör korv med ketchup, senap" knapp som syns och kan tryckas på när Unlock recipe 1: korv med bröd ketchup senap är uppnått. korv + 10

//"Gör korv med allt" knapp som syns och kan tryckas på när Unlock recipe 2: Korv med allt är uppnått. Korv + 50

import { state } from '../state.js';

import { updateKorvCounter } from '../ui.js';

export function handlekoktKorvClick() {
  if (state.korv === undefined) state.korv = 0; // safety check

  if (state.korv < state.korvtak) {
    state.korv += 1;
    updateKorvCounter(state.korv);
  } else {
    console.log("Korvtak reached! No more korv can be added.");
  }
}

//cheatkorvbutton logic for testing. 
export function handleCheatKorvClick() {
  state.korv += 1000;
  if (state.korv > state.korvtak) state.korv = state.korvtak;
}
