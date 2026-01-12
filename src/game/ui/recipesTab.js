import { state } from '../state.js';
import { recipeData } from '../data/recipeData.js';
import { registerUpdateCallback, unregisterUpdateCallback } from '../ui.js';
import { startRecipeCraft } from '../engine/recipeEngine.js';

let _updateCallback = null;

//button img source helper
function recipeAsset(path) {
  return new URL(`../${path}`, import.meta.url).href;
}

export function renderRecipesTab({ tabContent, mainScreen, infoLeft, infoRight }) {
  // ── Setup main background image ──
  mainScreen.innerHTML = `
    <div style="display:flex; justify-content:center; align-items:center; height:100%;">
      <img src="${recipeAsset('assets/img/recept/recipesmainscreen.png')}"
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
  tabContent.appendChild(recipeContainer);

  // Store references to update functions for buttons
  const buttonsMap = new Map();

  // ── Helper: create recipe button ──
  function createRecipeButton(key) {
    const recipeState = state.recipes[key];
    const recipeDef = recipeData[key];
    if (!recipeState.unlocked) return null;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'kiosk-button';
    button.style.position = 'relative';
    button.style.margin = '5px';

    button.innerHTML = `
      <img src="${recipeAsset(recipeDef.img)}"
       alt="${recipeDef.name}" 
       style="width:64px; height:64px;">
    `;

    const timerText = document.createElement('div');
    timerText.style.position = 'absolute';
    timerText.style.bottom = '-20px';
    timerText.style.width = '100%';
    timerText.style.textAlign = 'center';
    timerText.style.fontSize = '14px';
    button.appendChild(timerText);

    // Update visuals for button (called on each tick)
    function updateButton() {
      if (recipeState.crafting) {
        button.disabled = true;
        button.style.opacity = '0.5';
        
        const secondsLeft = Math.ceil(recipeState.remainingTime);
        timerText.textContent = `${secondsLeft}s`;
        updateRightPanelTimer(key, secondsLeft);

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

    // Hover info for left panel
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

    // Click logic: start crafting if affordable, not crafting or completed
    button.addEventListener('click', () => {
      if (state.korv >= recipeDef.cost && !recipeState.crafting && !recipeState.completed) {
        state.korv -= recipeDef.cost;
        startRecipeCraft(key, updateButton);
        updateButton();
      }
    });

    // Right panel timer display helpers
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

    // Store update function to refresh UI each tick
    buttonsMap.set(key, updateButton);

    // Initial update of button visuals
    updateButton();

    return button;
  }

  // Render all unlocked recipes
  for (const key in recipeData) {
    const btn = createRecipeButton(key);
    if (btn) recipeContainer.appendChild(btn);
  }

  // ── Global update callback to refresh UI every tick ──
  _updateCallback = () => {
    for (const key in state.recipes) {
      const updateFn = buttonsMap.get(key);
      if (updateFn) updateFn();
    }
  };

  registerUpdateCallback(_updateCallback);

  // Cleanup on tab close / switch
  return function cleanup() {
    if (_updateCallback) {
      unregisterUpdateCallback(_updateCallback);
      _updateCallback = null;
    }
  };
}
