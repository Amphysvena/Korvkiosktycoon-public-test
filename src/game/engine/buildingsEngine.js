// engine/buildingsEngine.js
import { state } from '../state.js';
import { buildingData } from '../data/buildingData.js';

/**
 * Called once when player starts a building
 */
export function startBuildingConstruction(key) {
  const b = state.buildings[key];
  const def = buildingData[key];
  if (!b || !def) return;
  if (b.constructing) return;

  b.constructing = true;
  b.remainingTime = def.duration;
}

/**
 * Called every frame by the global game loop
 * delta = milliseconds since last tick
 */
export function updateBuildings(delta) {
  const dt = delta / 1000; // convert ms → seconds

  for (const key in state.buildings) {
    const b = state.buildings[key];
    const def = buildingData[key];

    if (!b?.constructing) continue;

    b.remainingTime -= dt;

    if (b.remainingTime <= 0) {
      b.remainingTime = 0;
      b.constructing = false;
      b.count = (b.count || 0) + 1;

      if (def?.effect) {
        def.effect(state);
      }

      console.log(`${key} constructed! Count: ${b.count}`);
    }
  }
}

/**
 * Called after loading a save
 * Nothing to "resume" anymore — state already contains timers
 */
export function resumeActiveBuildings() {
  // Intentionally empty
}
