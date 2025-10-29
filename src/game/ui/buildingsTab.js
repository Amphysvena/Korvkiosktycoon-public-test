import { state } from '../state.js';
import { buildingData } from '../data/buildingData.js';
import { startBuildingConstruction } from '../engine/buildingsEngine.js'; // ✅ new shared logic

export function renderBuildingsTab({ tabContent, mainScreen, infoLeft, infoRight }) {
  // ── Setup main background image ──
  mainScreen.innerHTML = `
    <div style="display:flex; justify-content:center; align-items:center; height:100%;">
      <img src="${KorvkioskData.pluginUrl}src/game/Assets/img/building/buildingmainscreen.png"
           style="max-height:auto; max-width:auto;">
    </div>
  `;

  // ── Clear tab and info panels ──
  tabContent.innerHTML = '';
  if (infoLeft) infoLeft.innerHTML = '';
  if (infoRight) infoRight.innerHTML = '<div style="font-size:18px; font-weight:bold;">Active Constructions</div>';

  // ── Building container ──
  const buildingContainer = document.createElement('div');
  buildingContainer.id = 'building-container';

  // ── Helper: Create building button ──
  function createBuildingButton(key) {
    const buildingState = state.buildings[key];
    const buildingDef = buildingData[key];
    if (!buildingState.unlocked) return null;

    if (buildingState.count === undefined) buildingState.count = 0;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'kiosk-button';
    button.style.position = 'relative';
    button.style.margin = '5px';

    // Image
    button.innerHTML = `
      <img src="${KorvkioskData.pluginUrl}${buildingDef.img || 'src/game/Assets/img/building/default.png'}" 
           alt="${buildingDef.name}" 
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

    // ── Visual update ──
    function updateButton() {
      if (buildingState.constructing) {
        button.disabled = true;
        button.style.opacity = '0.5';
        timerText.textContent = `${buildingState.remainingTime}s`;
        updateRightPanelTimer(key, buildingState.remainingTime);
      } else {
        button.disabled = false;
        button.style.opacity = '1';
        timerText.textContent = `${buildingDef.cost} korv`;
        removeRightPanelTimer(key);
      }
    }

    // ── Hover info (left panel) ──
    button.addEventListener('mouseenter', () => {
      if (!infoLeft) return;
      infoLeft.innerHTML = `
        <div style="text-align:center;">
          <div style="font-size:20px; font-weight:bold; text-decoration:underline;">
            ${buildingDef.name}
          </div>
          <div style="margin-top:8px; font-size:16px;">
            ${buildingDef.itemDescription || 'No description yet.'}
          </div>
          <div style="margin-top:8px; font-size:14px;">
            Cost: ${buildingDef.cost} korv<br>
            Duration: ${buildingDef.duration}s<br>
            Built: ${buildingState.count}
          </div>
        </div>
      `;
    });
    button.addEventListener('mouseleave', () => {
      if (infoLeft) infoLeft.innerHTML = '';
    });

    // ── Click logic ──
    button.addEventListener('click', () => {
      if (state.korv >= buildingDef.cost && !buildingState.constructing) {
        state.korv -= buildingDef.cost;
        startBuildingConstruction(key, updateButton, updateMainScreenCount); // ✅ use shared logic
        updateButton();
      }
    });

    // ── Right panel timer display ──
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

  // ── Render all unlocked buildings ──
  for (const key in buildingData) {
    const btn = createBuildingButton(key);
    if (btn) buildingContainer.appendChild(btn);
  }

  tabContent.appendChild(buildingContainer);

  // ── Display building count on main screen ──
  function updateMainScreenCount() {
    const totalBuilt = Object.values(state.buildings).reduce(
      (sum, b) => sum + (b.count || 0),
      0
    );
    mainScreen.innerHTML = `
      <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%;">
        <div style="font-size:20px; font-weight:bold;">Buildings Constructed</div>
        <div style="font-size:32px; margin-top:10px;">${totalBuilt}</div>
      </div>
    `;
  }

  updateMainScreenCount();
}
