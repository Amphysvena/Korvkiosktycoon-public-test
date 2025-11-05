import { exportSave, importSave } from '../savegamesystem.js';
import { registerUpdateCallback, unregisterUpdateCallback } from '../ui.js';

let _updateCallback = null;

export function renderSettingsTab({ tabContent }) {
  // Clear previous content to avoid duplicates
  tabContent.innerHTML = '';

  // Create a container for the settings UI
  const container = document.createElement('div');
  container.id = 'settings-container';

  // --- Export button ---
  const saveBtn = document.createElement('button');
  saveBtn.textContent = "Export Save";
  saveBtn.onclick = exportSave;

  // --- Import input ---
  const loadLabel = document.createElement('label');
  loadLabel.textContent = "Import Save: ";
  loadLabel.style.display = "block";
  loadLabel.style.marginTop = "10px";

  const loadInput = document.createElement('input');
  loadInput.type = 'file';
  loadInput.accept = 'application/json';
  loadInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) importSave(file);
  };

  loadLabel.appendChild(loadInput);

  // Put it all together
  container.appendChild(saveBtn);
  container.appendChild(loadLabel);

  // Attach to tab
  tabContent.appendChild(container);

  // Setup an empty update callback (for future use)
  _updateCallback = () => {
    // Currently nothing needed, but this keeps the pattern consistent
  };

  registerUpdateCallback(_updateCallback);

  // Return cleanup function for when switching tabs
  return function cleanup() {
    if (_updateCallback) {
      unregisterUpdateCallback(_updateCallback);
      _updateCallback = null;
    }
    tabContent.innerHTML = '';
  };
}
