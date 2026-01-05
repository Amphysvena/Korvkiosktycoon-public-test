import { registerUpdateCallback, unregisterUpdateCallback } from '../ui.js';

let _updateCallback = null;

export function renderSpacecenterTab({ tabContent }) {
  tabContent.innerHTML = '';

  const spacecenterPlaceholder = document.createElement('p');
  spacecenterPlaceholder.textContent = 'Spacecenter tab coming soon!';
  spacecenterPlaceholder.style.textAlign = 'center';
  spacecenterPlaceholder.style.marginTop = '20px';

  tabContent.appendChild(spacecenterPlaceholder);

  _updateCallback = () => {
    // Placeholder for future updates
  };

  registerUpdateCallback(_updateCallback);

  return function cleanup() {
    if (_updateCallback) {
      unregisterUpdateCallback(_updateCallback);
      _updateCallback = null;
    }
  };
}
