import { handlekoktKorvClick, handleCheatKorvClick } from '../engine/kioskEngine.js';
import { state } from '../state.js';
import { kioskData } from '../data/kioskData.js';
import { researchData } from '../data/researchData.js'; // <-- to read passive sources

export function renderKioskTab({ tabContent, mainScreen, infoLeft, infoRight }) {
  // ── Remove previous centering wrapper if present ──
  const prevCenter = document.getElementById('mainscreen-centering');
  if (prevCenter) prevCenter.remove();

  // ── Centering container ──
  const centering = document.createElement('div');
  centering.id = 'mainscreen-centering';
  centering.style.display = 'flex';
  centering.style.justifyContent = 'center';
  centering.style.alignItems = 'flex-start';
  centering.style.height = '100%';
  centering.style.width = '100%';

  // ── Wrapper for base GIF and overlays ──
  const wrapper = document.createElement('div');
  wrapper.id = 'mainscreen-wrapper';
  wrapper.style.position = 'relative';
  wrapper.style.width = '740px';
  wrapper.style.height = '400px';

  const baseImg = document.createElement('img');
  baseImg.src = `${KorvkioskData.pluginUrl}src/game/Assets/img/kiosk/korvkioskmainscreen-inprogress.gif`;
  baseImg.style.display = 'block';
  baseImg.style.width = '740px';
  baseImg.style.height = '400px';
  wrapper.appendChild(baseImg);

  // ── Optional overlays ──
  const imagesToShow = [];
  if (state.research.autoFry && state.research.autoFry.unlocked && !state.autoFryActive) {
    imagesToShow.push(`${KorvkioskData.pluginUrl}src/game/Assets/img/kiosk/autofry.png`);
  }
  if (state.autoFryActive) {
    imagesToShow.push(`${KorvkioskData.pluginUrl}src/game/Assets/img/kiosk/autofryactive.gif`);
  }

  imagesToShow.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.style.position = 'absolute';
    img.style.top = '0';
    img.style.left = '0';
    img.style.width = '740px';
    img.style.height = '400px';
    img.style.pointerEvents = 'none';
    wrapper.appendChild(img);
  });

  centering.appendChild(wrapper);
  mainScreen.appendChild(centering);

  // ── Kiosk buttons container ──
  const kioskContainer = document.createElement('div');
  kioskContainer.id = 'kiosk-container';

  for (const key in kioskData) {
    const item = kioskData[key];

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'kiosk-button';
    btn.innerHTML = `
      <img src="${KorvkioskData.pluginUrl}${item.img}" 
           alt="${item.name}" style="width:64px; height:64px;">
    `;

    // Hook up button logic
    if (key === 'korv1') btn.addEventListener('click', handlekoktKorvClick);
    if (key === 'fuskkorv') btn.addEventListener('click', handleCheatKorvClick);

    // Hover info on left panel
    btn.addEventListener('mouseenter', () => {
      if (!infoLeft) return;
      infoLeft.innerHTML = `
        <div style="font-size: 20px; font-weight: bold; text-decoration: underline; color: black;">
          ${item.name}
        </div>
        <div style="margin-top: 8px; font-size: 16px;">
          ${item.description}
        </div>
      `;
    });
    btn.addEventListener('mouseleave', () => {
      if (!infoLeft) return;
      infoLeft.innerHTML = '';
    });

    kioskContainer.appendChild(btn);
  }

  tabContent.appendChild(kioskContainer);

  // ── Right Panel: Passive income stats ──
  function updateKioskStats() {
    if (!infoRight) return;

    let totalPerSecond = 0;

    // Sum passive sources from researchData
    for (const key in researchData) {
      const r = researchData[key];
      if (r.toggleable && state[r.toggleable]) {
        if (r.effectAmount && r.effectInterval) {
          totalPerSecond += r.effectAmount / (r.effectInterval / 1000);
        }
      }
    }

    // TODO: Later add factories, buildings, other passive sources

    infoRight.innerHTML = `
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Kiosk Stats</div>
      <div>Passive Income: ${totalPerSecond.toFixed(2)} korv/sec</div>
    `;
  }

  updateKioskStats();
}



// pseudocode

// Visuell "Gör korv med ketchup, senap" knapp, Korv + 10 i upperscreen

// Visuell "Gör korv med allt" knapp som syns och kan tryckas på när Unlock recipe 2: Korv med allt är uppnått. Korv + 50 i upperscreen
