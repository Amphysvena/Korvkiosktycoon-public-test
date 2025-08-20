import { exportSave, importSave } from '../savegamesystem.js';

export function renderSettingsTab({ tabContent }) {
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
}
