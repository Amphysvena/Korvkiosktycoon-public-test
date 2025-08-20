import { handlekoktKorvClick } from '../engine/kioskEngine.js';

// ui.js calls this as renderKioskTab({ tabContent, mainScreen })
export function renderKioskTab({ tabContent }) {
  // Clear old kiosk container if it exists (prevents duplicates)
  const existing = document.getElementById('kiosk-container');
  if (existing) {
    existing.remove(); // 🔹 Safely remove any leftover kiosk container
  }

  // Create kiosk container
  const kioskContainer = document.createElement('div');  
  kioskContainer.id = 'kiosk-container';

  // Create the korv button
  const koktKorvButton = document.createElement('button');
  koktKorvButton.type = 'button';
  koktKorvButton.id = 'koktKorvbutton';
  koktKorvButton.innerHTML = `
    <img src="${KorvkioskData.pluginUrl}src/game/Assets/img/equipment/Korvknappar/korv1.png" 
         alt="Korv" style="width: 64px; height: 64px;">
  `;

  // Hook up the button logic
  koktKorvButton.addEventListener('click', handlekoktKorvClick);

  // Add button to kiosk container
  kioskContainer.appendChild(koktKorvButton);

  // 🔹 Only append kiosk container to the provided tabContent, never mainScreen
  tabContent.appendChild(kioskContainer);
}










//pseudocode

// Visuell "Gör korv" knapp som ökar korv med 1 visuellt i upperscreen

//Visuell "Gör korv med ketchup, senap" knapp, Korv + 10 i upperscreen

// Visuell "Gör korv med allt" knapp som syns och kan tryckas på när Unlock recipe 2: Korv med allt är uppnått. Korv + 50 i upperscreen

