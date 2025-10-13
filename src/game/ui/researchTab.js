import { state } from '../state.js';
import { researchUnlock, startResearch, finishAllResearchTimers } from '../engine/researchEngine.js';
import { researchData } from '../data/researchData.js';

export function renderResearchTab({ tabContent, mainScreen, infoLeft, infoRight }) {
  // ── Setup main image ──
  mainScreen.innerHTML = `
    <div style="display:flex; justify-content:center; align-items:center; height:100%;">
      <img src="${KorvkioskData.pluginUrl}src/game/Assets/img/research/researchmainscreen.gif"
           style="max-height:auto; max-width:auto;">
    </div>
  `;

  // ── Clear tab area ──
  tabContent.innerHTML = '';

  // ── Clear info boxes ──
  if (infoLeft) infoLeft.innerHTML = '';
  if (infoRight) infoRight.innerHTML = '<div style="font-size:18px; font-weight:bold;">Active Research</div>';

  // ── Check unlocks ──
  researchUnlock();

  // ── Helper: Create a button for each research ──
  function createResearchButton(key) {
    const researchState = state.research[key];
    const researchDef = researchData[key];

    if (!researchState.unlocked) return null; // Skip locked research

    const button = document.createElement('button');
    button.style.width = '64px';
    button.style.height = '64px';
    button.style.position = 'relative';
    button.style.border = 'none';
    button.style.padding = '0';
    button.style.cursor = 'pointer';
    button.style.margin = '4px';

    const buttonImg = document.createElement('img');
    buttonImg.src = `${KorvkioskData.pluginUrl}src/game/Assets/img/research/${researchDef.img}`;
    buttonImg.style.width = '64px';
    buttonImg.style.height = '64px';
    buttonImg.style.display = 'block';
    button.appendChild(buttonImg);

    const timerText = document.createElement('div');
    timerText.style.position = 'absolute';
    timerText.style.bottom = '-20px';
    timerText.style.width = '100%';
    timerText.style.textAlign = 'center';
    timerText.style.fontSize = '14px';
    button.appendChild(timerText);

    // ── Function to update button visuals ──
    function updateButton() {
      if (researchState.researching) {
        button.disabled = true;
        buttonImg.style.opacity = '0.5';
        timerText.textContent = `${researchState.remainingTime}s`;
        updateRightPanelTimer(key, researchState.remainingTime);
      } else if (!researchState.completed) {
        button.disabled = false;
        buttonImg.style.opacity = '0.5';
        timerText.textContent = `${researchDef.duration}s`;
        removeRightPanelTimer(key);
      } else {
        // Handle toggleable researches differently
        const toggleable = researchDef.toggleable;
        button.disabled = false;
        if (toggleable) {
          buttonImg.style.opacity = state[toggleable] ? '1' : '0.5';
          timerText.textContent = state[toggleable] ? 'ON' : 'OFF';
        } else {
          buttonImg.style.opacity = '0.5';
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
          <div style="font-size:20px; font-weight:bold; text-decoration:underline;">${researchDef.name}</div>
          <div style="margin-top:8px; font-size:16px;">${researchDef.description || 'No description yet.'}</div>
          <div style="margin-top:8px; font-size:14px;">Duration: ${researchDef.duration}s</div>
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

    // ── Update visuals every second ──
    setInterval(updateButton, 1000);
    updateButton();

    return button;
  }

  // ── Helper: Manage right panel timers ──
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

  // ── Render all research buttons ──
  for (const key in researchData) {
    const btn = createResearchButton(key);
    if (btn) tabContent.appendChild(btn);
  }

  // ── Cheat button ──
  const finishResearchButton = document.createElement('button');
  finishResearchButton.type = 'button';
  finishResearchButton.id = 'finishResearchButton';
  finishResearchButton.textContent = 'Finish Research';
  finishResearchButton.style.width = '120px';
  finishResearchButton.style.height = '40px';
  finishResearchButton.style.marginLeft = '10px';
  finishResearchButton.addEventListener('click', finishAllResearchTimers);
  tabContent.appendChild(finishResearchButton);
}



//pseudokod

// 2 När det finns 100 korv i lagret så blir Korvlådan Plastlåda synlig och köpbar. Kostar 100 korv. Ger spelaren Equipment Plastlåda och ökar korvlager max till 1000

// 3 När det finns 750 korv i lagret så blir Korvlådan Fisklåda synlig och köpbar, kostar 750 korv. Ger spelaren Equipment fisklåda och ökar korvlager max till 7500.

// 4 När Recipe 2 Korv med allt uppnåtts så blir Condiments Machine synlig och köpbar, kostar 10000 korv. Ökar korv med +50 per 5 sek

//dvs bilder och ett sätt att visa dom när de redan har använts. 