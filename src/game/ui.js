import { renderKioskTab } from './ui/kioskTab.js';
import { renderResearchTab } from './ui/researchTab.js';

const tabs = [
  { id: 'kiosk', name: 'Kiosk', render: renderKioskTab },
  { id: 'research', name: 'Research', render: renderResearchTab },
  ];

export function initUI() {
  const container = document.createElement('div');
  container.id = 'game-ui';
  container.innerHTML = `
    <div class="tab-buttons"></div>
    <div class="tab-content"></div>
  `;
  document.body.appendChild(container);

  const tabButtons = container.querySelector('.tab-buttons');
  const tabContent = container.querySelector('.tab-content');

  tabs.forEach(tab => {
    const btn = document.createElement('button');
    btn.textContent = tab.name;
    btn.onclick = () => switchTab(tab.id);
    btn.id = `btn-${tab.id}`;
    tabButtons.appendChild(btn);
  });

  function switchTab(tabId) {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      tabContent.innerHTML = ''; // Clear content
      tab.render(tabContent);    // Render current tab
    }
    highlightTab(tabId);
  }

  function highlightTab(activeId) {
    tabs.forEach(tab => {
      const btn = document.getElementById(`btn-${tab.id}`);
      btn.classList.toggle('active', tab.id === activeId);
    });
  }

  // Start with first tab
  switchTab(tabs[0].id);
}