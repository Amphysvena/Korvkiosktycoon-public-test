import { handlekoktKorvClick } from '../engine/kioskEngine.js';
import { handleCheatKorvClick } from  '../engine/kioskEngine.js';
import { state } from '../state.js';

// ui.js calls this as renderKioskTab({ tabContent, mainScreen })
export function renderKioskTab({ tabContent, mainScreen }) {
    // ── Remove previous centering wrapper if present (only refresh that area) ──
    const prevCenter = document.getElementById('mainscreen-centering');
    if (prevCenter) prevCenter.remove();

    // ── Create centering container that mimics your original inline HTML centering ──
    const centering = document.createElement('div');
    centering.id = 'mainscreen-centering';
    // Keep sizing from ui.js, prevent vertical bleed
    centering.style.display = 'flex';
    centering.style.justifyContent = 'center';
    centering.style.alignItems = 'flex-start'; // flush top to avoid bleed
    centering.style.height = '100%';
    centering.style.width = '100%';
    
    // ── Create a wrapper that will hold the base GIF and overlays ──
    const wrapper = document.createElement('div');
    wrapper.id = 'mainscreen-wrapper';
    wrapper.style.position = 'relative';   // overlays positioned relative to this
    wrapper.style.width = '740px';
    wrapper.style.height = '400px';
    
    // Base mainscreen GIF
    const baseImg = document.createElement('img');
    baseImg.src = `${KorvkioskData.pluginUrl}src/game/Assets/img/kiosk/korvkioskmainscreen-inprogress.gif`;
    baseImg.style.display = 'block';   // remove inline spacing
    baseImg.style.width = '740px';
    baseImg.style.height = '400px';
    baseImg.style.margin = '0';
    baseImg.style.padding = '0';
    baseImg.style.border = 'none';
    baseImg.style.boxSizing = 'border-box';
    wrapper.appendChild(baseImg);

    // ── Decide which additional images to show ──
    const imagesToShow = [];

    // Case: autofry researched but not active
    if (state.research.autoFry && state.research.autoFry.unlocked && !state.autoFryActive) {
        imagesToShow.push(`${KorvkioskData.pluginUrl}src/game/Assets/img/kiosk/autofry.png`);
    }

    // Case: autofry active
    if (state.autoFryActive) {
        imagesToShow.push(`${KorvkioskData.pluginUrl}src/game/Assets/img/kiosk/autofryactive.gif`);
    }

    // Append all images as absolute overlays (same size as base GIF)
    imagesToShow.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.style.position = 'absolute';
        img.style.top = '0';
        img.style.left = '0';
        img.style.width = '740px';   // match base image size
        img.style.height = '400px';
        img.style.pointerEvents = 'none'; // don't block clicks
        wrapper.appendChild(img);
    });

    // Put wrapper inside centering container and append to mainScreen
    centering.appendChild(wrapper);
    mainScreen.appendChild(centering);

    // ── Kiosk buttons container ──
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

    // ── Cheat button for testing ──
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

// pseudocode

// Visuell "Gör korv med ketchup, senap" knapp, Korv + 10 i upperscreen

// Visuell "Gör korv med allt" knapp som syns och kan tryckas på när Unlock recipe 2: Korv med allt är uppnått. Korv + 50 i upperscreen
