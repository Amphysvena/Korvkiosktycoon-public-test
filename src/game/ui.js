import { renderKioskTab } from './ui/kioskTab.js';
//import { renderResearchTab, isUnlocked as isResearchTabUnlocked } from './ui/researchTab.js';
import { renderResearchTab } from './ui/researchTab.js';
import { renderEquipmentTab } from './ui/equipmentTab.js';
import { renderBoogieTab } from './ui/boogieTab.js';
import { renderSkillsTab } from './ui/skillsTab.js';
import { renderRecipesTab } from './ui/recipesTab.js';
import { renderBuildingsTab } from './ui/buildingsTab.js';
import { renderFactoryTab } from './ui/factoryTab.js';
import { renderArtifactsTab } from './ui/artifactsTab.js';
import { renderSpacecenterTab } from './ui/spacecenterTab.js'
import { renderSettingsTab } from './ui/settingsTab.js';

const tabs = [
  { id: 'kiosk', name: 'Kiosk', render: renderKioskTab, unlocked: true },
  //{ id: 'research', name: 'Research', render: renderResearchTab, unlocked: isResearchTabUnlocked() },
  {id: 'research', name: 'Research', render: renderResearchTab, unlocked: true },
  {id: 'equipment', name: 'Equipment', render: renderEquipmentTab, unlocked: true},
  {id: 'boogie',     name: 'Boogie',     render: renderBoogieTab,    unlocked: true },
  {id: 'skills',     name: 'Skills',     render: renderSkillsTab,    unlocked: true },
  {id: 'recipes',    name: 'Recipes',    render: renderRecipesTab,   unlocked: true },
  {id: 'buildings',  name: 'Buildings',  render: renderBuildingsTab, unlocked: true },
  {id: 'factory',    name: 'Factory',    render: renderFactoryTab,   unlocked: true },
  {id: 'artifacts',  name: 'Artifacts',  render: renderArtifactsTab, unlocked: true },
  {id: 'spacecenter',  name: 'Spacecenter',  render: renderSpacecenterTab, unlocked: true },
  {id: 'settings',   name: 'Settings',   render: renderSettingsTab,  unlocked: true }

];

// Store references for global use
let korvCounterEl;
let tabButtons;  // moved outside initUI so updateTabs can access

export function initUI() {
  // Main container: 600x1200
  const container = document.createElement('div');
  container.id = 'game-ui';
  container.style.width = '1200px';
  container.style.height = '600px';
  container.style.border = '2px solid #444';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.background = '#f0f0f0';
  container.style.position = 'relative'; // allow positioning if needed

  // Korv counter — floating text in upper-right corner
  korvCounterEl = document.createElement('div');
  korvCounterEl.id = 'korv-counter';
  korvCounterEl.textContent = 'Korv: 0';
  korvCounterEl.style.position = 'absolute';
  korvCounterEl.style.top = '10px';
  korvCounterEl.style.right = '10px';
  korvCounterEl.style.color = '#D2B04C'; // mustard color
  korvCounterEl.style.fontWeight = 'bold';
  korvCounterEl.style.fontSize = '20px';
  korvCounterEl.style.fontFamily = 'monospace, sans-serif';
  korvCounterEl.style.userSelect = 'none';
  korvCounterEl.style.pointerEvents = 'none'; // so it doesn’t interfere with clicks

  // Main screen area (450px)
  const mainScreen = document.createElement('div');
  mainScreen.className = 'main-screen';
  mainScreen.style.height = '400px';
  mainScreen.style.flexShrink = '0';
  mainScreen.style.padding = '10px';
  mainScreen.style.borderBottom = '2px solid #ccc';
  mainScreen.style.background = '#fff';
  mainScreen.style.overflow = 'hidden';

  // Tab buttons area (150px)
  tabButtons = document.createElement('div'); // no const here, assign to outer variable
  tabButtons.className = 'tab-buttons';
  tabButtons.style.height = '50px';
  tabButtons.style.flexShrink = '0';
  tabButtons.style.display = 'flex';
  tabButtons.style.justifyContent = 'flex-start';
  tabButtons.style.alignItems = 'center';
  tabButtons.style.background = '#ddd';
  tabButtons.style.borderBottom = '2px solid #999';

  // Tab content area (fills remaining space)
  const tabContent = document.createElement('div');
  tabContent.className = 'tab-content';
  tabContent.style.flexGrow = '1';
  tabContent.style.padding = '10px';
  tabContent.style.overflow = 'auto';
  tabContent.style.background = '#fafafa';

  // Assemble layout
  container.appendChild(mainScreen);    // Tab visuals
  container.appendChild(tabButtons);    // Tab buttons
  container.appendChild(tabContent);    // Tab content
  container.appendChild(korvCounterEl); // floating korv counter on top

  document.body.appendChild(container);

  // Build tab buttons
  tabs
    .filter(tab => tab.unlocked) // Only show unlocked
    .forEach(tab => {
      const btn = document.createElement('button');
      btn.textContent = tab.name;
      btn.onclick = () => switchTab(tab.id);
      btn.id = `btn-${tab.id}`;
      btn.style.padding = '5px 10px';
      btn.style.fontSize = '16px';
      btn.style.cursor = 'pointer';
      tabButtons.appendChild(btn);
    });

  function switchTab(tabId) {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      tabContent.innerHTML = '';
      mainScreen.innerHTML = '';
      tab.render({ tabContent, mainScreen });
    }
    highlightTab(tabId);
  }

  function highlightTab(activeId) {
    tabs.forEach(tab => {
      const btn = document.getElementById(`btn-${tab.id}`);
      if (btn) {
        btn.classList.toggle('active', tab.id === activeId);
      }
    });
  }

  // Start with the first tab
  switchTab(tabs[0].id);
}

function updateTabs() {
  tabs.forEach(tab => {
    if (tab.id === 'research') {
      tab.unlocked = isResearchTabUnlocked();
    }
  });

  // Clear old buttons
  tabButtons.innerHTML = '';
  
  // Rebuild buttons only for unlocked tabs
  tabs.filter(tab => tab.unlocked).forEach(tab => {
    const btn = document.createElement('button');
    btn.textContent = tab.name;
    btn.onclick = () => {
      // You might want to switch tab here, but tabContent and mainScreen are inside initUI()
      // So you may need to expose switchTab or rework this if needed
    };
    btn.id = `btn-${tab.id}`;
    btn.style.padding = '10px 20px';
    btn.style.fontSize = '16px';
    btn.style.cursor = 'pointer';
    tabButtons.appendChild(btn);
  });
}

// Call this from engine to update korv counter and tabs
export function updateKorvCounter(amount) {
  if (korvCounterEl) {
    korvCounterEl.textContent = `Korv: ${amount}`;
  }
  updateTabs();
}
