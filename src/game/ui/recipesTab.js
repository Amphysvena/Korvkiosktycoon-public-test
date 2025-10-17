import { state } from '../state.js';
import { recipeData } from '../data/recipeData.js';

export function renderRecipesTab({ tabContent, mainScreen, infoLeft, infoRight }) {
  // ── Setup main background image ──
  mainScreen.innerHTML = `
    <div style="display:flex; justify-content:center; align-items:center; height:100%;">
      <img src="${KorvkioskData.pluginUrl}src/game/Assets/img/recept/recipesmainscreen.gif"
           style="max-height:auto; max-width:auto;">
    </div>
  `;

  // ── Clear tab and info panels ──
  tabContent.innerHTML = '';
  if (infoLeft) infoLeft.innerHTML = '';
  if (infoRight) infoRight.innerHTML = '<div style="font-size:18px; font-weight:bold;">Active Recipes</div>';

  // ── Create container ──
  const recipeContainer = document.createElement('div');
  recipeContainer.id = 'recipe-container';

  // ── Helper: Create recipe button ──
  function createRecipeButton(key) {
    const recipeState = state.recipes[key];
    const recipeDef = recipeData[key];
    if (!recipeState.unlocked) return null;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'kiosk-button';
    button.style.position = 'relative';
    button.style.margin = '5px';

    // Image
    button.innerHTML = `
      <img src="${KorvkioskData.pluginUrl}${recipeDef.img}" 
           alt="${recipeDef.name}" 
           style="width:64px; height:64px;">
    `;

    // Timer text
    const timerText = document.createElement('div');
    timerText.style.position = 'absolute';
    timerText.style.bottom = '-20px';
    timerText.style.width = '100%';
    timerText.style.textAlign = 'center';
    timerText.style.fontSize = '14px';
    button.appendChild(timerText);

    // ── Update visuals ──
    function updateButton() {
      if (recipeState.crafting) {
        button.disabled = true;
        button.style.opacity = '0.5';
        timerText.textContent = `${recipeState.remainingTime}s`;
        updateRightPanelTimer(key, recipeState.remainingTime);
      } else if (!recipeState.completed) {
        button.disabled = false;
        button.style.opacity = '1';
        timerText.textContent = `${recipeDef.cost} korv`;
        removeRightPanelTimer(key);
      } else {
        button.disabled = true;
        button.style.opacity = '0.5';
        timerText.textContent = '✓';
        removeRightPanelTimer(key);
      }
    }

    // ── Hover info (left panel) ──
    button.addEventListener('mouseenter', () => {
      if (infoLeft) {
        infoLeft.innerHTML = `
          <div style="text-align: center;">
            <div style="font-size: 20px; font-weight: bold; text-decoration: underline;">
              ${recipeDef.name}
            </div>
            <div style="margin-top: 8px; font-size: 16px;">
              ${recipeDef.description || 'No description yet.'}
            </div>
            <div style="margin-top: 8px; font-size: 14px;">
              Cost: ${recipeDef.cost} korv<br>
              Duration: ${recipeDef.duration}s
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
      if (state.korv >= recipeDef.cost && !recipeState.crafting && !recipeState.completed) {
        state.korv -= recipeDef.cost;
        startRecipeCraft(key);
        updateButton();
      }
    });

    // ── Start crafting ──
    function startRecipeCraft(key) {
      recipeState.crafting = true;
      recipeState.remainingTime = recipeDef.duration;

      const timer = setInterval(() => {
        recipeState.remainingTime--;
        updateButton();

        if (recipeState.remainingTime <= 0) {
          clearInterval(timer);
          recipeState.crafting = false;
          recipeState.completed = true;
          updateButton();
          console.log(`${key} completed!`);
        }
      }, 1000);
    }

    // ── Right panel timer display ──
    function updateRightPanelTimer(key, remainingTime) {
      if (!infoRight) return;
      let timerRow = document.getElementById(`recipe-timer-${key}`);
      if (!timerRow) {
        timerRow = document.createElement('div');
        timerRow.id = `recipe-timer-${key}`;
        timerRow.style.fontSize = '14px';
        timerRow.style.marginTop = '4px';
        infoRight.appendChild(timerRow);
      }
      const name = recipeDef.name || key;
      timerRow.textContent = `${name}: ${remainingTime}s`;
    }

    function removeRightPanelTimer(key) {
      const row = document.getElementById(`recipe-timer-${key}`);
      if (row) row.remove();
    }

    updateButton();
    return button;
  }

  // ── Render all unlocked recipes ──
  for (const key in recipeData) {
    const btn = createRecipeButton(key);
    if (btn) recipeContainer.appendChild(btn);
  }

  tabContent.appendChild(recipeContainer);
}

//pseudokod

//Ärkekrat besegrad = 
// Recipe 1 för korv med bröd, ketchup, senap unlocked. Kostar 750 korv. Ges efter 1 minut av forskning när man tryckt på knappen och betalat 750 korv. Timer syns över knappen

//Överförmyndare besegrad = 
// Recipe 2 för korv med allt unlocked. Kostar 10000 korv. Ges efter 15 minuter av forskning när man tryckt på knappen och betalat 10000 korv. Timer syns över knappen
