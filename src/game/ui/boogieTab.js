// boogieTab.js
import { state } from '../state.js';
import { boogieEnemies } from '../data/boogieEnemiesforact1.js';
import { registerUpdateCallback, unregisterUpdateCallback } from '../ui.js';

let _updateCallback = null;
let activeRenderCleanup = null; // local reference to cleanup for re-renders

export function renderBoogieTab({ tabContent, mainScreen, infoLeft, infoRight }) {
  // Ensure defeatedEnemies is a Set (defensive: savefiles might serialize it differently)
  if (state.boogie) {
    if (Array.isArray(state.boogie.defeatedEnemies)) {
      state.boogie.defeatedEnemies = new Set(state.boogie.defeatedEnemies);
    } else if (state.boogie.defeatedEnemies && state.boogie.defeatedEnemies.__type === 'Set') {
      state.boogie.defeatedEnemies = new Set(state.boogie.defeatedEnemies.values || []);
    } else if (!(state.boogie.defeatedEnemies instanceof Set)) {
      state.boogie.defeatedEnemies = new Set();
    }
  } else {
    state.boogie = { defeatedEnemies: new Set(), damageTypes: new Set(), statusEffects: [], maxHP: 3, currentHP: 3, attackPower: 0, defense: 0 };
  }

  // Clear previous content
  tabContent.innerHTML = '';

  const enemyContainer = document.createElement('div');
  enemyContainer.style.display = 'flex';
  enemyContainer.style.flexWrap = 'wrap';
  enemyContainer.style.gap = '10px';
  enemyContainer.style.justifyContent = 'flex-start';
  enemyContainer.style.alignItems = 'flex-start';
  enemyContainer.style.padding = '10px';

  // Local helper to re-render this tab safely (unregister previous callback first)
  function reRender() {
    if (typeof activeRenderCleanup === 'function') {
      activeRenderCleanup();
      activeRenderCleanup = null;
    }
    renderBoogieTab({ tabContent, mainScreen, infoLeft, infoRight });
  }

  for (const key in boogieEnemies) {
    const enemy = boogieEnemies[key];
    try {
      if (!enemy.unlockCondition(state)) continue;
    } catch (err) {
      console.error(`Error evaluating unlockCondition for ${key}:`, err);
      continue;
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'kiosk-button';

    btn.innerHTML = `
      <img src="${KorvkioskData.pluginUrl}src/game/assets/img/boogie/${enemy.img}" 
           alt="${enemy.name}" 
           style="width:64px; height:64px;">
    `;

    btn.addEventListener('mouseenter', () => {
      if (infoLeft) {
        infoLeft.innerHTML = `
          <div style="text-align:center;">
            <div style="font-size:20px; font-weight:bold; text-decoration:underline;">
              ${enemy.name}
            </div>
            <div style="margin-top:8px; font-size:16px;">
              ${enemy.description}
            </div>
          </div>
        `;
      }
    });
    btn.addEventListener('mouseleave', () => {
      if (infoLeft) infoLeft.innerHTML = '';
    });

    btn.addEventListener('click', () => {
      let canWin = false;
      try {
        canWin = !!enemy.winCondition(state);
      } catch (err) {
        console.error(`Error evaluating winCondition for ${key}:`, err);
        canWin = false;
      }

      if (canWin) {
        console.log(`You defeated ${enemy.name}!`);

        if (!state.boogie.defeatedEnemies || !(state.boogie.defeatedEnemies instanceof Set)) {
          state.boogie.defeatedEnemies = new Set(state.boogie.defeatedEnemies || []);
        }
        state.boogie.defeatedEnemies.add(key);

        (enemy.drops || []).forEach(dropKey => {
          if (state.equipment?.[dropKey] && !state.equipment[dropKey].unlocked) {
            state.equipment[dropKey].unlocked = true;
            console.log(`${dropKey} unlocked!`);
          } else if (state.recipes?.[dropKey] && !state.recipes[dropKey].unlocked) {
            state.recipes[dropKey].unlocked = true;
            console.log(`${dropKey} recipe unlocked!`);
          } else if (state.buildings?.[dropKey] && !state.buildings[dropKey].unlocked) {
            state.buildings[dropKey].unlocked = true;
            console.log(`${dropKey} building unlocked!`);
          }
        });

        if (enemy.victoryUnlocks) {
          enemy.victoryUnlocks.forEach(nextEnemyKey => {
            const nextEnemy = boogieEnemies[nextEnemyKey];
            if (nextEnemy) console.log(`New enemy unlocked: ${nextEnemy.name}`);
          });
        }

        reRender();
      } else {
        console.log(`You cannot defeat ${enemy.name} yet. Equip the right damage type.`);
      }
    });

    enemyContainer.appendChild(btn);
  }

  tabContent.appendChild(enemyContainer);

  if (infoRight && (!infoRight.innerHTML || infoRight.innerHTML.trim() === '')) {
    infoRight.innerHTML = '<div style="font-size:18px; font-weight:bold;">Boogie Stats</div>';
  }

  // Refactored update callback with inline expressions, matching equipmentTab.js style
  _updateCallback = () => {
    if (!infoRight) return;

    const damageKeys = state.boogie?.damageTypes
      ? Object.keys(state.boogie.damageTypes).filter(key => state.boogie.damageTypes[key] > 0)
      : [];

    const damageText = damageKeys.length > 0 ? damageKeys.join(', ') : 'None';

    infoRight.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        height: 100%;
        text-align: left;
      ">
        <div>HP: ${Math.floor(state.boogie?.currentHP ?? 0)} / ${Math.floor(state.boogie?.maxHP ?? 0)}</div>
        <div>Attack: ${state.boogie?.attackPower ?? 0}</div>
        <div>Defense: ${state.boogie?.defense ?? 0}</div>
        <div>Damage Types: ${damageText}</div>
        <div>Status Effects: ${
          Array.isArray(state.boogie?.statusEffects) && state.boogie.statusEffects.length > 0
            ? state.boogie.statusEffects.join(', ')
            : 'None'
        }</div>
      </div>
    `;
  };

  registerUpdateCallback(_updateCallback);

  function cleanup() {
    if (_updateCallback) {
      unregisterUpdateCallback(_updateCallback);
      _updateCallback = null;
    }
  }
  activeRenderCleanup = cleanup;

  _updateCallback();

  return cleanup;
}
