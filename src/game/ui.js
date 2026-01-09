import { state } from './state.js';
import { renderKioskTab } from './ui/kioskTab.js';
import { renderResearchTab } from './ui/researchTab.js';
import { renderEquipmentTab } from './ui/equipmentTab.js';
import { renderBoogieTab } from './ui/boogieTab.js';
import { renderSkillsTab } from './ui/skillsTab.js';
import { renderRecipesTab } from './ui/recipesTab.js';
import { renderBuildingsTab } from './ui/buildingsTab.js';
import { renderFactoryTab } from './ui/factoryTab.js';
import { renderArtifactsTab } from './ui/artifactsTab.js';
import { renderSpacecenterTab } from './ui/spacecenterTab.js';
import { renderSettingsTab } from './ui/settingsTab.js';

// ========== Global update callback registry ========== make sure every tab and future tab uses this to update
const updateCallbacks = new Set();

export function registerUpdateCallback(fn) {
  updateCallbacks.add(fn);
}

export function unregisterUpdateCallback(fn) {
  updateCallbacks.delete(fn);
}

// One global interval running every second - make sure every tab and future tab uses this to update
setInterval(() => {
  updateCallbacks.forEach(fn => {
    try {
      fn();
    } catch (e) {
      console.error("Error in update callback:", e);
    }
  });
}, 1000 / 30); //30 herz

const tabs = [
  { id: 'kiosk', name: 'Kiosk', render: renderKioskTab, unlocked: true, icon: `${KorvkioskData.pluginUrl}src/game/assets/img/kiosk/kiosk frame 0.png`},
  { id: 'research', name: 'Research', render: renderResearchTab, unlocked: true, icon: `${KorvkioskData.pluginUrl}src/game/assets/img/research/beaker-frame-0.png`},
  { id: 'equipment', name: 'Equipment', render: renderEquipmentTab, unlocked: true, icon: `${KorvkioskData.pluginUrl}src/game/assets/img/equipment/equipment frame 0.png`},
  { id: 'boogie', name: 'Boogie', render: renderBoogieTab, unlocked: true, icon: `${KorvkioskData.pluginUrl}src/game/assets/img/boogie/duelframe0.png` },
  { id: 'skills', name: 'Skills', render: renderSkillsTab, unlocked: true, icon: `${KorvkioskData.pluginUrl}src/game/assets/img/skills/skill 1 - Throw.png` },
  { id: 'recipes', name: 'Recipes', render: renderRecipesTab, unlocked: true, icon: `${KorvkioskData.pluginUrl}src/game/assets/img/recept/recipe-frame-0-.png` },
  { id: 'buildings', name: 'Buildings', render: renderBuildingsTab, unlocked: true, icon: `${KorvkioskData.pluginUrl}src/game/assets/img/building/building upgrade frame 0.png` },
  { id: 'factory', name: 'Factory', render: renderFactoryTab, unlocked: true, icon: `${KorvkioskData.pluginUrl}src/game/assets/img/fabrik/fabrik frame 0.png` },
  { id: 'artifacts', name: 'Artifacts', render: renderArtifactsTab, unlocked: true, icon: `${KorvkioskData.pluginUrl}src/game/assets/img/artifacts/artifacts frame 0.png` },
  { id: 'spacecenter', name: 'Spacecenter', render: renderSpacecenterTab, unlocked: true, icon: `${KorvkioskData.pluginUrl}src/game/assets/img/spacecenter/spacecenter frame 0.png` },
  { id: 'settings', name: 'Settings', render: renderSettingsTab, unlocked: true, icon: `${KorvkioskData.pluginUrl}src/game/assets/img/inställningar/settings frame 0.png` }
];

// Store references for global use
let activeTabId = null;
let korvCounterEl;
let tabButtons;

// *** NEW: store the current tab's cleanup function ***
let currentTabCleanup = null;

export function initUI() {
  // Center the game container
  document.body.style.display = 'flex';
  document.body.style.justifyContent = 'center';
  document.body.style.alignItems = 'center';
  document.body.style.height = '100vh';
  document.body.style.margin = '0';
  document.body.style.background = '#eee';

  // Main container: 1200x600
  const container = document.createElement('div');
  container.id = 'game-ui';
  container.style.width = '1200px';
  container.style.height = '600px';
  container.style.border = '2px solid #444';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.background = '#f0f0f0';
  container.style.position = 'relative';

  // Korv counter — floating text
  korvCounterEl = document.createElement('div');
  korvCounterEl.id = 'korv-counter';
  korvCounterEl.textContent = 'Korv: 0';
  korvCounterEl.style.position = 'absolute';
  korvCounterEl.style.top = '10px';
  korvCounterEl.style.right = '10px';
  korvCounterEl.style.color = '#D2B04C';
  korvCounterEl.style.fontWeight = 'bold';
  korvCounterEl.style.fontSize = '20px';
  korvCounterEl.style.fontFamily = 'monospace, sans-serif';
  korvCounterEl.style.userSelect = 'none';
  korvCounterEl.style.pointerEvents = 'none';

  // ─── Top mainScreen container (400px) ───
  const mainScreenContainer = document.createElement('div');
  mainScreenContainer.style.width = '1200px';
  mainScreenContainer.style.height = '400px';
  mainScreenContainer.style.display = 'flex';
  mainScreenContainer.style.justifyContent = 'center';
  mainScreenContainer.style.alignItems = 'center';
  mainScreenContainer.style.background = '#000';
  mainScreenContainer.style.position = 'relative';

  // Left info slot
  const infoLeft = document.createElement('div');
  infoLeft.id = 'info-left';
  infoLeft.style.width = '230px';
  infoLeft.style.height = '100%';
  infoLeft.style.background = '#e5e5e5';
  infoLeft.style.padding = '10px';
  infoLeft.style.boxSizing = 'border-box';
  infoLeft.style.overflowY = 'auto';
  infoLeft.style.fontFamily = 'Arial, sans-serif';
  infoLeft.style.fontSize = '20px';
  infoLeft.style.color = 'black';
  infoLeft.style.fontWeight = 'bold';

  infoLeft.style.display = 'flex';
  infoLeft.style.flexDirection = 'column';
  infoLeft.style.justifyContent = 'center';
  infoLeft.style.alignItems = 'center';

  // Center interface (mainScreen, 740px)
  const mainScreen = document.createElement('div'); // keep existing name
  mainScreen.className = 'main-screen';
  mainScreen.style.width = '740px';
  mainScreen.style.height = '100%';
  mainScreen.style.background = '#e5e5e5';
  mainScreen.style.display = 'flex';
  mainScreen.style.justifyContent = 'center';
  mainScreen.style.alignItems = 'center';
  mainScreen.style.overflow = 'hidden';

  // Right info slot
  const infoRight = document.createElement('div');
  infoRight.id = 'info-right';
  infoRight.style.width = '230px';
  infoRight.style.height = '100%';
  infoRight.style.background = '#e5e5e5';
  infoRight.style.color = '#c41313ff';
  infoRight.style.padding = '10px';
  infoRight.style.boxSizing = 'border-box';
  infoRight.style.overflowY = 'auto';
  infoRight.style.fontFamily = 'Arial, sans-serif';
  infoRight.style.fontSize = '20px';
  infoRight.style.color = 'black';
  infoRight.style.fontWeight = 'bold';

  infoRight.style.display = 'flex';
  infoRight.style.flexDirection = 'column';
  infoRight.style.justifyContent = 'center';
  infoRight.style.alignItems = 'center';

  // Append left, center, right to mainScreenContainer
  mainScreenContainer.appendChild(infoLeft);
  mainScreenContainer.appendChild(mainScreen);
  mainScreenContainer.appendChild(infoRight);

  // Tab buttons area (50px)
  tabButtons = document.createElement('div');
  tabButtons.className = 'tab-buttons';
  tabButtons.style.height = '50px';
  tabButtons.style.flexShrink = '0';
  tabButtons.style.display = 'flex';
  tabButtons.style.justifyContent = 'flex-start';
  tabButtons.style.alignItems = 'center';
  tabButtons.style.background = '#ddd';
  tabButtons.style.borderBottom = '2px solid #999';

  // Tab content area (remaining 150px)
  const tabContent = document.createElement('div');
  tabContent.className = 'tab-content';
  tabContent.style.flexGrow = '1';
  tabContent.style.padding = '10px';
  tabContent.style.overflow = 'auto';
  tabContent.style.background = '#fafafa';

  // Assemble container
  container.appendChild(mainScreenContainer);
  container.appendChild(tabButtons);
  container.appendChild(tabContent);
  container.appendChild(korvCounterEl);

  document.body.appendChild(container);

  // Build tab buttons
  tabs.filter(tab => tab.unlocked).forEach(tab => {
    const btn = document.createElement('button');
    btn.id = `btn-${tab.id}`;
    btn.style.padding = '0px 10px';
    btn.style.fontSize = '16px';
    btn.style.cursor = 'pointer';
    btn.innerHTML = `
      <img src="${tab.icon}" alt="${tab.name}" style="width:32px; height:32px; vertical-align:middle; margin-right:5px;">
      ${tab.name}
    `;
    btn.onclick = () => switchTab(tab.id);
    tabButtons.appendChild(btn);
  });

  // *** Updated switchTab to run cleanup before switching and store new cleanup ***
  function switchTab(tabId) {
    // Run previous tab cleanup if any
    if (currentTabCleanup) {
      currentTabCleanup();
      currentTabCleanup = null;
    }

    activeTabId = tabId;  // Keep track of active tab

    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      tabContent.innerHTML = '';
      mainScreen.innerHTML = '';
      infoLeft.innerHTML = '';
      infoRight.innerHTML = '';

      // Capture possible cleanup function returned by render()
      const cleanup = tab.render({
        tabContent,
        mainScreen,
        infoLeft,
        infoRight
      });

      if (typeof cleanup === 'function') {
        currentTabCleanup = cleanup;
      }
    }
    highlightTab(tabId);
  }

  function highlightTab(activeId) {
    tabs.forEach(tab => {
      const btn = document.getElementById(`btn-${tab.id}`);
      if (btn) btn.classList.toggle('active', tab.id === activeId);
    });
  }

  // Start with first tab
  switchTab(tabs[0].id);
}

function updateTabs() {
  tabs.forEach(tab => {});
  tabButtons.innerHTML = '';
  tabs.filter(tab => tab.unlocked).forEach(tab => {
    const btn = document.createElement('button');
    btn.textContent = tab.name;
    btn.id = `btn-${tab.id}`;
    btn.style.padding = '10px 20px';
    btn.style.fontSize = '16px';
    btn.style.cursor = 'pointer';
    tabButtons.appendChild(btn);
  });
}

registerUpdateCallback(updateKorvCounter);

export function updateKorvCounter() {
  if (korvCounterEl) {
    korvCounterEl.textContent = `Korv: ${state.korv} / ${state.korvtak}`;
  }
}

export function refreshCurrentTab() {
  const tab = tabs.find(t => t.id === activeTabId);
  if (!tab) return;

  tab.render({
    tabContent: document.querySelector('.tab-content'),
    mainScreen: document.querySelector('.main-screen'),
    infoLeft: document.getElementById('info-left'),
    infoRight: document.getElementById('info-right')
  });
}
