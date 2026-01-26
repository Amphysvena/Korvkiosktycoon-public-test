import { handlekoktKorvClick, handleKorv2Click, handleKorv3Click, handleCheatKorvClick } from '../engine/kioskEngine.js';
import { state } from '../state.js';
import { kioskData } from '../data/kioskData.js';
import { researchData } from '../data/researchData.js';
import { registerUpdateCallback, unregisterUpdateCallback } from '../ui.js'; // <-- import these

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
  baseImg.src = new URL('../assets/img/kiosk/korvkioskmainscreen-inprogress.gif', import.meta.url).href;
  baseImg.style.display = 'block';
  baseImg.style.width = '740px';
  baseImg.style.height = '400px';
  wrapper.appendChild(baseImg);

  // ── Optional overlays ──
  //auto fry
   const imagesToShow = [];
  if (state.research.autoFry && state.research.autoFry.unlocked && !state.autoFryActive) {
    imagesToShow.push(new URL('../assets/img/kiosk/autofry.png', import.meta.url).href);
  }
  if (state.autoFryActive) {
    imagesToShow.push(new URL('../assets/img/kiosk/autofryactive.gif', import.meta.url).href);
  }

  // Condiments machine
if (state.research.condimentsMachine && state.research.condimentsMachine.unlocked) {
    imagesToShow.push(
    new URL('../assets/img/kiosk/condimentsmachine.png', import.meta.url).href
  );
}

if (state.condimentsMachineActive) {
  imagesToShow.push(new URL('../assets/img/kiosk/condimentsmachineactive.gif', import.meta.url).href); //change to new image when you have created one
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
  kioskContainer.style.display = 'flex';
  kioskContainer.style.flexWrap = 'wrap';
  kioskContainer.style.gap = '10px';
  kioskContainer.style.justifyContent = 'flex-start';
  kioskContainer.style.alignItems = 'flex-start';
  kioskContainer.style.padding = '10px';

  for (const key in kioskData) {
    const item = kioskData[key];

    // Only show if it's unlocked or always available
    if (
      (key === 'korv1' || 
       key === 'fuskkorv') ||
      (key === 'korv2' && state.recipes.recipe1?.completed) ||
      (key === 'korv3' && state.recipes.recipe2?.completed)
    ) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'kiosk-button';

        const imgUrl = new URL(`../${item.img}`, import.meta.url).href;

        btn.innerHTML = `
          <img src="${imgUrl}" 
              alt="${item.name}" 
              style="width:64px; height:64px;">
`;


      if (key === 'korv1') btn.addEventListener('click', handlekoktKorvClick);
      if (key === 'korv2') btn.addEventListener('click', handleKorv2Click);
      if (key === 'korv3') btn.addEventListener('click', handleKorv3Click);
      if (key === 'fuskkorv') btn.addEventListener('click', handleCheatKorvClick);

      // Hover info
      btn.addEventListener('mouseenter', () => {
        if (infoLeft) {
          infoLeft.innerHTML = `
          <div style="text-align: center;">
            <div style="font-size: 20px; font-weight: bold; text-decoration: underline; color: black;">
              ${item.name}
            </div>
            <div style="margin-top: 8px; font-size: 16px;">
              ${item.description}
            </div>
          `;
        }
      });
      btn.addEventListener('mouseleave', () => {
        if (infoLeft) infoLeft.innerHTML = '';
      });

      kioskContainer.appendChild(btn);
    }
  }

  tabContent.appendChild(kioskContainer);

  // ── Right Panel: Passive income stats ──
  function updateKioskStats() {
    if (!infoRight) return;

    let totalPerSecond = 0;

    for (const key in researchData) {
      const r = researchData[key];
      if (r.toggleable && state[r.toggleable]) {
        if (r.effectAmount && r.effectInterval) {
          totalPerSecond += r.effectAmount / (r.effectInterval / 1000);
        }
      }
    }

    infoRight.innerHTML = `
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Kiosk Stats</div>
      <div>Passive Income: ${totalPerSecond.toFixed(2)} korv/sec</div>
    `;
  }

  // Initial render
  updateKioskStats();

  // Register update callback for automatic updates every second
  registerUpdateCallback(updateKioskStats);

  // Return cleanup function to unregister update callback when tab switches away
  return () => {
    unregisterUpdateCallback(updateKioskStats);
  };
}
