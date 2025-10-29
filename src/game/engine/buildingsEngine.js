// engine/buildingsEngine.js
import { state } from '../state.js';
import { buildingData } from '../data/buildingData.js';

export function startBuildingConstruction(key, updateButton, updateMainScreenCount) {
  const b = state.buildings[key];
  const def = buildingData[key];
  if (!b || !def) return;
  if (b.constructing) return;

  b.constructing = true;
  b.remainingTime = def.duration;

  // Avoid duplicate timers
  if (b._activeTimer) clearInterval(b._activeTimer);

  b._activeTimer = setInterval(() => {
    b.remainingTime--;
    if (updateButton) updateButton();

    if (b.remainingTime <= 0) {
      clearInterval(b._activeTimer);
      b._activeTimer = null;
      b.constructing = false;
      b.count++;
      if (def.onBuild) def.onBuild(state);
      console.log(`${key} constructed! Count: ${b.count}`);
      if (updateButton) updateButton();
      if (updateMainScreenCount) updateMainScreenCount();
    }
  }, 1000);
}

export function resumeActiveBuildings() {
  for (const key in state.buildings) {
    const b = state.buildings[key];
    const def = buildingData[key];
    if (!b.constructing) continue;
    if (b._activeTimer) continue;

    startBuildingConstruction(key); // same logic, no UI callback
  }
}
