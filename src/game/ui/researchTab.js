import { state } from '../state.js';
import { checkAutoFryUnlock, startAutoFryResearch } from '../engine/researchEngine.js';

export function renderResearchTab({ tabContent }) {
  tabContent.innerHTML = '';

  const autoFry = state.research.autoFry;

  // Check if it should unlock this render
  checkAutoFryUnlock();

  if (!autoFry.unlocked) return; // invisible until unlocked

  // Create button
  const button = document.createElement('button');
  button.style.width = '64px';
  button.style.height = '64px';
  button.style.position = 'relative';
  button.style.border = 'none';
  button.style.padding = '0';
  button.style.cursor = 'pointer';

  // Add the PNG as an <img> for reliable display
  const buttonImg = document.createElement('img');
  buttonImg.src = `${KorvkioskData.pluginUrl}src/game/Assets/img/research/Research1-Autofry.png`;
  buttonImg.style.width = '64px';
  buttonImg.style.height = '64px';
  buttonImg.style.display = 'block';
  buttonImg.style.opacity = autoFry.completed ? '1' : '0.5';
  button.appendChild(buttonImg);

  // Timer / status text under button
  const timerText = document.createElement('div');
  timerText.style.position = 'absolute';
  timerText.style.bottom = '-20px';
  timerText.style.width = '100%';
  timerText.style.textAlign = 'center';
  timerText.style.fontSize = '14px';
  button.appendChild(timerText);

  function updateButton() {
    if (autoFry.researching) {
      button.disabled = true;
      buttonImg.style.opacity = '0.5';
      timerText.textContent = `${autoFry.remainingTime}s`;
    } else if (!autoFry.completed) {
      button.disabled = false;
      buttonImg.style.opacity = '0.5';
      timerText.textContent = '30s';
    } else {
      button.disabled = false;
      buttonImg.style.opacity = state.autoFryActive ? '1' : '0.5';
      timerText.textContent = state.autoFryActive ? 'ON' : 'OFF';
    }
  }

  button.addEventListener('click', () => {
    if (!autoFry.researching && !autoFry.completed) {
      startAutoFryResearch();
    } else if (autoFry.completed) {
      state.autoFryActive = !state.autoFryActive; // toggle
    }
    updateButton();
  });

  tabContent.appendChild(button);

  // Refresh every second for countdown and opacity
  setInterval(updateButton, 1000);
  updateButton();
}




/*export function isUnlocked() {
  // delegate to ResearchEngine
  return isResearchTabUnlocked();
}*/  


//pseudokod

// 2 När det finns 100 korv i lagret så blir Korvlådan Plastlåda synlig och köpbar. Kostar 100 korv. Ger spelaren Equipment Plastlåda och ökar korvlager max till 1000

// 3 När det finns 750 korv i lagret så blir Korvlådan Fisklåda synlig och köpbar, kostar 750 korv. Ger spelaren Equipment fisklåda och ökar korvlager max till 7500.

// 4 När Recipe 2 Korv med allt uppnåtts så blir Condiments Machine synlig och köpbar, kostar 10000 korv. Ökar korv med +50 per 5 sek

//dvs bilder och ett sätt att visa dom när de redan har använts. 