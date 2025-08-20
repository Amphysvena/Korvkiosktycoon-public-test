import { state } from './state.js';
import { updateKorvCounter } from './ui.js';
import { resumeActiveResearch } from './engine/researchEngine.js';

// Export save to file
export function exportSave() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
  const dl = document.createElement('a');
  dl.setAttribute('href', dataStr);
  dl.setAttribute('download', 'korvkiosk_save.json');
  dl.click();
}

// Import save from file
export function importSave(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);

      // Merge save into current state
      Object.assign(state, data);

      // Update UI elements that depend on state
      if (state.korv !== undefined) updateKorvCounter(state.korv);

      // 🔹 Resume any research that was active
      resumeActiveResearch();

      console.log("Save loaded:", state);
    } catch (err) {
      console.error("Invalid save file", err);
    }
  };
  reader.readAsText(file);
}

