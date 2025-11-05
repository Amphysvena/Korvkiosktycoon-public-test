import { registerUpdateCallback, unregisterUpdateCallback } from '../ui.js';

let _updateCallback = null;

export function renderFactoryTab({ tabContent }) {
  tabContent.innerHTML = '';

  const factoryPlaceholder = document.createElement('p');
  factoryPlaceholder.textContent = 'Factory tab coming soon!';
  factoryPlaceholder.style.textAlign = 'center';
  factoryPlaceholder.style.marginTop = '20px';

  tabContent.appendChild(factoryPlaceholder);

  // Setup update callback to keep consistent with other tabs
  _updateCallback = () => {
    // Currently no dynamic updates, placeholder only
  };

  registerUpdateCallback(_updateCallback);

  return function cleanup() {
    if (_updateCallback) {
      unregisterUpdateCallback(_updateCallback);
      _updateCallback = null;
    }
  };
}
