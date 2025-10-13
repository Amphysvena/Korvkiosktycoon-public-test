import { state } from '../state.js';
import { researchUnlock, startResearch, finishAllResearchTimers } from '../engine/researchEngine.js';
import { researchData } from '../data/researchData.js';

export function renderResearchTab({ tabContent, mainScreen, infoLeft, infoRight }) {
  // ── Setup main background image ──
  mainScreen.innerHTML = `
    <div style="display:flex; justify-content:center; align-items:center; height:100%;">
      <img src="${KorvkioskData.pluginUrl}src/game/Assets/img/research/researchmainscreen.gif"
           style="max-height:auto; max-width:auto;">
    </div>
  `;

  // ── Clear tab and info panels ──
  tabContent.innerHTML = '';
  if (infoLeft) infoLeft.innerHTML = '';
  if (infoRight) infoRight.innerHTML = '<div style="font-size:18px; font-weight:bold;">Active Research</div>';

  // ── Unlock logic ──
  researchUnlock();

  // ── Research container (like kioskContainer) ──
  const researchContainer = document.createElement('div');
  researchContainer.id = 'research-container';
  
  // ── Helper: Create a research button ──
  function createResearchButton(key) {
    const researchState = state.research[key];
    const researchDef = researchData[key];
    if (!researchState.unlocked) return null;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'kiosk-button'; // ✅ reuse kiosk styling

    // Button image
    button.innerHTML = `
      <img src="${KorvkioskData.pluginUrl}src/game/Assets/img/research/${researchDef.img}" 
           alt="${researchDef.name}" 
           style="width:64px; height:64px;">
    `;

    // Timer text overlay
    const timerText = document.createElement('div');
    timerText.style.position = 'absolute';
    timerText.style.bottom = '-20px';
    timerText.style.width = '100%';
    timerText.style.textAlign = 'center';
    timerText.style.fontSize = '14px';
    button.style.position = 'relative';
    button.appendChild(timerText);

    // ── Update visuals ──
    function updateButton() {
      if (researchState.researching) {
        button.disabled = true;
        button.style.opacity = '0.5';
        timerText.textContent = `${researchState.remainingTime}s`;
        updateRightPanelTimer(key, researchState.remainingTime);
      } else if (!researchState.completed) {
        button.disabled = false;
        button.style.opacity = '0.5';
        timerText.textContent = `${researchDef.duration}s`;
        removeRightPanelTimer(key);
      } else {
        const toggleable = researchDef.toggleable;
        button.disabled = false;
        if (toggleable) {
          button.style.opacity = state[toggleable] ? '1' : '0.5';
          timerText.textContent = state[toggleable] ? 'ON' : 'OFF';
        } else {
          button.style.opacity = '0.5';
          timerText.textContent = '✓';
        }
        removeRightPanelTimer(key);
      }
    }

    // ── Hover info (left panel) ──
    button.addEventListener('mouseenter', () => {
      if (infoLeft) {
        infoLeft.innerHTML = `
          <div style="text-align: center;">
            <div style="font-size: 20px; font-weight: bold; text-decoration: underline;">
              ${researchDef.name}
            </div>
            <div style="margin-top: 8px; font-size: 16px;">
              ${researchDef.description || 'No description yet.'}
            </div>
            <div style="margin-top: 8px; font-size: 14px;">
              Duration: ${researchDef.duration}s
            </div>
          </div>
        `;
      }
    });
    button.addEventListener('mouseleave', () => {
      if (infoLeft) infoLeft.innerHTML = '';
    });

    // ── Click logic ──
    button.addEventListener('click', () => {
      if (!researchState.researching && !researchState.completed) {
        startResearch(key);
      } else if (researchState.completed && researchDef.toggleable) {
        state[researchDef.toggleable] = !state[researchDef.toggleable];
      }
      updateButton();
    });

    // ── Update loop ──
    setInterval(updateButton, 1000);
    updateButton();

    return button;
  }

  // ── Right panel: Timer list ──
  function updateRightPanelTimer(key, remainingTime) {
    if (!infoRight) return;
    let timerRow = document.getElementById(`timer-${key}`);
    if (!timerRow) {
      timerRow = document.createElement('div');
      timerRow.id = `timer-${key}`;
      timerRow.style.fontSize = '14px';
      timerRow.style.marginTop = '4px';
      infoRight.appendChild(timerRow);
    }
    const name = researchData[key].name || key;
    timerRow.textContent = `${name}: ${remainingTime}s`;
  }

  function removeRightPanelTimer(key) {
    const row = document.getElementById(`timer-${key}`);
    if (row) row.remove();
  }

  // ── Render all unlocked researches ──
  for (const key in researchData) {
    const btn = createResearchButton(key);
    if (btn) researchContainer.appendChild(btn);
  }

  // ── Cheat button ──
  const finishResearchButton = document.createElement('button');
  finishResearchButton.type = 'button';
  finishResearchButton.id = 'finishResearchButton';
  finishResearchButton.textContent = 'Finish Research';
  finishResearchButton.className = 'kiosk-button'; // ✅ match style
  finishResearchButton.style.width = '120px';
  finishResearchButton.style.height = '40px';
  finishResearchButton.style.fontSize = '14px';
  finishResearchButton.addEventListener('click', finishAllResearchTimers);

  researchContainer.appendChild(finishResearchButton);
  tabContent.appendChild(researchContainer);
}


//pseudokod

// 2 När det finns 100 korv i lagret så blir Korvlådan Plastlåda synlig och köpbar. Kostar 100 korv. Ger spelaren Equipment Plastlåda och ökar korvlager max till 1000

// 3 När det finns 750 korv i lagret så blir Korvlådan Fisklåda synlig och köpbar, kostar 750 korv. Ger spelaren Equipment fisklåda och ökar korvlager max till 7500.

// 4 När Recipe 2 Korv med allt uppnåtts så blir Condiments Machine synlig och köpbar, kostar 10000 korv. Ökar korv med +50 per 5 sek

//dvs bilder och ett sätt att visa dom när de redan har använts. 