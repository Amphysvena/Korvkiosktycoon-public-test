import { handlekoktKorvClick } from '../engine/kioskEngine.js';
import { handleCheatKorvClick } from  '../engine/kioskEngine.js';

// ui.js calls this as renderKioskTab({ tabContent, mainScreen })
export function renderKioskTab({ tabContent, mainScreen }) {
    mainScreen.innerHTML = `
    <div style="display:flex; justify-content:center; align-items:center; height:100%;">
      <img src="${KorvkioskData.pluginUrl}src/game/Assets/img/kiosk/korvkioskmainscreen-inprogress.gif"
           alt="Bubbling Beaker"
           style="max-height:auto; max-width:auto;">
    </div>
  `;

  // Clear old kiosk container if it exists (prevents duplicates)
  /*const existing = document.getElementById('kiosk-container');
  if (existing) {
    existing.remove(); // 🔹 Safely remove any leftover kiosk container
  }*/

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

  //cheat button for testing
const koktKorvCheatButton = document.createElement('button');
koktKorvCheatButton.type = 'button';
koktKorvCheatButton.id = 'koktKorvCheatButton';
koktKorvCheatButton.style.width = '64px';
koktKorvCheatButton.style.height = '64px';
koktKorvCheatButton.style.position = 'center';
koktKorvCheatButton.style.border = 'none';
koktKorvCheatButton.style.padding = '0';
koktKorvCheatButton.style.cursor = 'pointer';

// Add the same image as the original button
const buttonImg = document.createElement('img');
buttonImg.src = `${KorvkioskData.pluginUrl}src/game/Assets/img/equipment/Korvknappar/korv1.png`;
buttonImg.style.width = '64px';
buttonImg.style.height = '64px';
buttonImg.style.display = 'block';
koktKorvCheatButton.appendChild(buttonImg);

// Add the +1000 text under the image
const textDiv = document.createElement('div');
textDiv.textContent = '+1000';
textDiv.style.textAlign = 'center';
textDiv.style.fontSize = '10px';
koktKorvCheatButton.appendChild(textDiv);

// Hook up the click event to your cheat function
koktKorvCheatButton.addEventListener('click', handleCheatKorvClick);

// Append to the container
kioskContainer.appendChild(koktKorvCheatButton);
} //cheat button code end










//pseudocode

// Visuell "Gör korv" knapp som ökar korv med 1 visuellt i upperscreen

//Visuell "Gör korv med ketchup, senap" knapp, Korv + 10 i upperscreen

// Visuell "Gör korv med allt" knapp som syns och kan tryckas på när Unlock recipe 2: Korv med allt är uppnått. Korv + 50 i upperscreen

