import { state } from '../state.js';
import { researchUnlock, startResearch } from '../engine/researchEngine.js';
import { researchData } from '../data/researchData.js';
import { finishAllResearchTimers } from '../engine/researchEngine.js'; // cheat code 

export function renderResearchTab({ tabContent }) {
  tabContent.innerHTML = '';

  // Check unlocks
  researchUnlock();

  // Helper to create a button for any research
  function createResearchButton(key) {
    const researchState = state.research[key];
    const researchDef = researchData[key];

    if (!researchState.unlocked) return null; // skip if not unlocked yet

    const button = document.createElement('button');
    button.style.width = '64px';
    button.style.height = '64px';
    button.style.position = 'relative';
    button.style.border = 'none';
    button.style.padding = '0';
    button.style.cursor = 'pointer';

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

    function updateButton() {
      if (researchState.researching) {
        button.disabled = true;
        buttonImg.style.opacity = '0.5';
        timerText.textContent = `${researchState.remainingTime}s`;
      } else if (!researchState.completed) {
        button.disabled = false;
        buttonImg.style.opacity = '0.5';
        timerText.textContent = `${researchDef.duration}s`;
      } else {
        // Handle toggleable researches differently
        const toggleable = researchDef.toggleable;
        button.disabled = false;
        if (toggleable) {
          buttonImg.style.opacity = state[toggleable] ? '1' : '0.5';
          timerText.textContent = state[toggleable] ? 'ON' : 'OFF';
        } else {
          // Non-toggleable: greyed out or permanent effect
          buttonImg.style.opacity = '0.5';
          timerText.textContent = '✓';
        }
      }
    }

    button.addEventListener('click', () => {
      if (!researchState.researching && !researchState.completed) {
        startResearch(key);
      } else if (researchState.completed && researchDef.toggleable) {
        state[researchDef.toggleable] = !state[researchDef.toggleable];
      }
      updateButton();
    });

    setInterval(updateButton, 1000);
    updateButton();

    return button;
  }

  // Loop through all researches in researchData
  for (const key in researchData) {
    const btn = createResearchButton(key);
    if (btn) tabContent.appendChild(btn);
  }
  // Cheat button for instantly finishing all research
const finishResearchButton = document.createElement('button');
finishResearchButton.type = 'button';
finishResearchButton.id = 'finishResearchButton';
finishResearchButton.textContent = 'Finish Research';
finishResearchButton.style.width = '120px';
finishResearchButton.style.height = '40px';
finishResearchButton.style.marginLeft = '10px';

finishResearchButton.addEventListener('click', finishAllResearchTimers);

tabContent.appendChild(finishResearchButton);
// end of cheat button code
}


//pseudokod

// 2 När det finns 100 korv i lagret så blir Korvlådan Plastlåda synlig och köpbar. Kostar 100 korv. Ger spelaren Equipment Plastlåda och ökar korvlager max till 1000

// 3 När det finns 750 korv i lagret så blir Korvlådan Fisklåda synlig och köpbar, kostar 750 korv. Ger spelaren Equipment fisklåda och ökar korvlager max till 7500.

// 4 När Recipe 2 Korv med allt uppnåtts så blir Condiments Machine synlig och köpbar, kostar 10000 korv. Ökar korv med +50 per 5 sek

//dvs bilder och ett sätt att visa dom när de redan har använts. 