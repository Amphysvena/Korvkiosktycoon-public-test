import { registerUpdateCallback, unregisterUpdateCallback } from '../ui.js';

let _updateCallback = null;

export function renderArtifactsTab({ tabContent }) {
  tabContent.innerHTML = '';

  const artifactsPlaceholder = document.createElement('p');
  artifactsPlaceholder.textContent = 'Artifacts tab coming soon!';
  artifactsPlaceholder.style.textAlign = 'center';
  artifactsPlaceholder.style.marginTop = '20px';

  tabContent.appendChild(artifactsPlaceholder);

  // Setup update callback for future dynamic content
  _updateCallback = () => {
    // No dynamic updates yet
  };

  registerUpdateCallback(_updateCallback);

  return function cleanup() {
    if (_updateCallback) {
      unregisterUpdateCallback(_updateCallback);
      _updateCallback = null;
    }
  };
}
