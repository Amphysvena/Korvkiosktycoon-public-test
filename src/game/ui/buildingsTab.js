import { state } from '../state.js';
import { buildingData } from '../data/buildingData.js';
import { startBuildingConstruction } from '../engine/buildingsEngine.js';
import { registerUpdateCallback, unregisterUpdateCallback } from '../ui.js';

let _updateCallback = null;

export function renderBuildingsTab({ tabContent, mainScreen, infoLeft, infoRight }) {
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

  // ── Wrapper for main screen image ──
  const wrapper = document.createElement('div');
  wrapper.id = 'mainscreen-wrapper';
  wrapper.style.position = 'relative';
  wrapper.style.width = '740px';
  wrapper.style.height = '400px';

  const mainImg = document.createElement('img');
  mainImg.src = `${KorvkioskData.pluginUrl}src/game/Assets/img/building/buildingmainscreen.png`;
  mainImg.style.width = '740px';
  mainImg.style.height = '400px';
  mainImg.style.display = 'block';

  wrapper.appendChild(mainImg);
  centering.appendChild(wrapper);
  mainScreen.appendChild(centering);

  // ── Clear tab and info panels ──
  tabContent.innerHTML = '';
  if (infoLeft) infoLeft.innerHTML = '';
  if (infoRight) infoRight.innerHTML = '<div style="font-size:18px; font-weight:bold;">Active Constructions</div>';

  // ── Building container ──
  const buildingContainer = document.createElement('div');
  buildingContainer.id = 'building-container';

  // Helper function to format big numbers (optional)
  function formatCost(num) {
    return num >= 1e6 ? num.toExponential(2).replace('e+', 'E') : num.toLocaleString();
  }

  // ── Helper: create building button ──
  function createBuildingButton(key) {
    const buildingState = state.buildings[key];
    const buildingDef = buildingData[key];
    if (!buildingState?.unlocked) return null;

    if (buildingState.count === undefined) buildingState.count = 0;

    const button = document.createElement('button');
    button.className = 'kiosk-button';
    button.style.position = 'relative';
    button.style.margin = '5px';

    const imgPath = `${KorvkioskData.pluginUrl.replace(/\/$/, '')}/${buildingDef.img || 'src/game/Assets/img/building/default.png'}`;
    button.innerHTML = `<img src="${imgPath}" alt="${buildingDef.name}" style="width:64px; height:64px;">`;

    // Timer text overlay
    const timerText = document.createElement('div');
    timerText.style.position = 'absolute';
    timerText.style.bottom = '-20px';
    timerText.style.width = '100%';
    timerText.style.textAlign = 'center';
    timerText.style.fontSize = '14px';
    button.appendChild(timerText);

    // Function to compute cost dynamically
    function getCurrentCost() {
      return Math.floor(buildingDef.baseCost * Math.pow(buildingDef.growthRate, buildingState.count));
    }

    function updateButton() {
      const cost = getCurrentCost();

      if (buildingState.constructing) {
        button.disabled = true;
        button.style.opacity = '0.5';
        timerText.textContent = `${buildingState.remainingTime}s`;
        updateRightPanelTimer(key, buildingState.remainingTime);
      } else {
        button.disabled = false;
        button.style.opacity = '1';
        timerText.textContent = `${formatCost(cost)} korv`;
        removeRightPanelTimer(key);
      }
    }

    // Hover info
    button.addEventListener('mouseenter', () => {
      if (!infoLeft) return;
      const cost = getCurrentCost();
      infoLeft.innerHTML = `
        <div style="text-align:center;">
          <div style="font-size:20px; font-weight:bold; text-decoration:underline;">${buildingDef.name}</div>
          <div style="margin-top:8px; font-size:16px;">${buildingDef.itemDescription || 'No description yet.'}</div>
          <div style="margin-top:8px; font-size:14px;">
            Cost: ${formatCost(cost)} korv<br>
            Duration: ${buildingDef.duration}s<br>
            Built: ${buildingState.count}
          </div>
        </div>
      `;
    });
    button.addEventListener('mouseleave', () => {
      if (infoLeft) infoLeft.innerHTML = '';
    });

    // Click logic
    button.addEventListener('click', () => {
      const cost = getCurrentCost();
      if (state.korv >= cost && !buildingState.constructing) {
        state.korv -= cost;
        startBuildingConstruction(key, updateButton);
        updateButton();
      }
    });

    // Right panel timer
    function updateRightPanelTimer(key, remainingTime) {
      if (!infoRight) return;
      let timerRow = document.getElementById(`building-timer-${key}`);
      if (!timerRow) {
        timerRow = document.createElement('div');
        timerRow.id = `building-timer-${key}`;
        timerRow.style.fontSize = '14px';
        timerRow.style.marginTop = '4px';
        infoRight.appendChild(timerRow);
      }
      timerRow.textContent = `${buildingDef.name}: ${remainingTime}s`;
    }

    function removeRightPanelTimer(key) {
      const row = document.getElementById(`building-timer-${key}`);
      if (row) row.remove();
    }

    updateButton();
    return button;
  }

  // Render all unlocked buildings
  for (const key in buildingData) {
    const btn = createBuildingButton(key);
    if (btn) buildingContainer.appendChild(btn);
  }

  tabContent.appendChild(buildingContainer);

  // --- Setup update callback for global timer to keep timers and UI fresh ---
  _updateCallback = () => {
    for (const key in buildingData) {
      const buildingState = state.buildings[key];
      if (!buildingState?.unlocked) continue;

      const button = tabContent.querySelector(`button.kiosk-button:nth-child(${Object.keys(buildingData).indexOf(key) + 1})`);
      if (!button) continue;

      const timerText = button.querySelector('div');
      if (!timerText) continue;

      const buildingDef = buildingData[key];
      const cost = Math.floor(buildingDef.baseCost * Math.pow(buildingDef.growthRate, buildingState.count));

      if (buildingState.constructing) {
        button.disabled = true;
        button.style.opacity = '0.5';
        timerText.textContent = `${buildingState.remainingTime}s`;
        const rightPanelTimer = document.getElementById(`building-timer-${key}`);
        if (rightPanelTimer) rightPanelTimer.textContent = `${buildingData[key].name}: ${buildingState.remainingTime}s`;
      } else {
        button.disabled = false;
        button.style.opacity = '1';
        timerText.textContent = `${formatCost(cost)} korv`;
        const rightPanelTimer = document.getElementById(`building-timer-${key}`);
        if (rightPanelTimer) rightPanelTimer.remove();
      }
    }
  };

  registerUpdateCallback(_updateCallback);

  return function cleanup() {
    if (_updateCallback) {
      unregisterUpdateCallback(_updateCallback);
      _updateCallback = null;
    }
  };
}
