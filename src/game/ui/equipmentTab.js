// equipmentTab.js
import { state } from '../state.js';
import { equipmentData } from '../data/equipmentData.js';
import { registerUpdateCallback, unregisterUpdateCallback } from '../ui.js';

// 🧩 Store the active category globally so it persists between renders
let activeCategory = null;

// We'll keep a reference to the update function so we can unregister it
let _updateCallback = null;

export function createEquipmentButton(key, tabContent, mainScreen, infoLeft, infoRight) {
  const equipmentState = state.equipment[key];
  const equipmentDef = equipmentData[key];

  if (!equipmentState || !equipmentState.unlocked) return null;

  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.equipmentKey = key; // safe handle to find this button later
  button.style.width = '64px';
  button.style.height = '64px';
  button.style.position = 'relative';
  button.style.border = 'none';
  button.style.padding = '0';
  button.style.cursor = 'pointer';
  button.className = 'kiosk-button';

  const buttonImg = document.createElement('img');
  buttonImg.src = `${KorvkioskData.pluginUrl}${equipmentDef.img}`;
  buttonImg.style.width = '64px';
  buttonImg.style.height = '64px';
  buttonImg.style.display = 'block';
  buttonImg.style.transition = 'opacity 0.2s';
  button.appendChild(buttonImg);

  // Tooltip
  if (equipmentDef.effectDescription) {
    button.title = equipmentDef.effectDescription;
  }

  // --- INFO LEFT: show item description on hover ---
  button.addEventListener('mouseenter', () => {
    if (infoLeft) {
      infoLeft.innerHTML = `
        <div style="font-size:20px; font-weight:bold; text-decoration:underline;">${equipmentDef.name}</div>
        <div style="text-align: center;">${equipmentDef.itemDescription || 'No description available'}</div>
      `;
    }
  });

  button.addEventListener('mouseleave', () => {
    if (infoLeft) {
      infoLeft.innerHTML = `<div style="text-align: center;">Hover over an item for information</div>`;
    }
  });

  // --- FUNCTION: update boogie stats (only if infoRight exists) ---
  function updateBoogieStats() {
    if (!infoRight) return;
    const b = state.boogie;

    const damageText = b.damageTypes && b.damageTypes.size > 0
      ? Array.from(b.damageTypes).join(', ')
      : 'None';

    infoRight.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        height: 100%;
        text-align: left;
      ">
        <div>HP: ${Math.floor(b.currentHP)} / ${Math.floor(b.maxHP)}</div>
        <div>Attack: ${b.attackPower}</div>
        <div>Defense: ${b.defense}</div>
        <div>Damage Types: ${damageText}</div>
        <div>Status Effects: ${b.statusEffects.length > 0 ? b.statusEffects.join(', ') : 'None'}</div>
      </div>
    `;
  }

  // --- Equip/unequip visual updates ---
  function updateButtonVisual() {
    buttonImg.style.opacity = equipmentState.equipped ? '1' : '0.4';
  }

  function updateSlotImage() {
    const slotDiv = document.querySelector(`#slot-${equipmentDef.slot} img`);
    if (!slotDiv) return;

    if (equipmentState.equipped) {
      slotDiv.src = `${KorvkioskData.pluginUrl}${equipmentDef.img}`;
      slotDiv.style.opacity = '1';
    } else {
      slotDiv.src = `${KorvkioskData.pluginUrl}src/game/Assets/img/boogie/duelframe0.png`;
      slotDiv.style.opacity = '0.5';
    }
  }

  // initial visuals
  updateButtonVisual();
  updateSlotImage();
  updateBoogieStats();

  // --- CLICK HANDLER ---
  button.addEventListener('click', () => {
    // If currently equipped -> unequip
    if (equipmentState.equipped) {
      equipmentState.equipped = false;
      if (equipmentDef.onUnequip) equipmentDef.onUnequip(state);

      // update visuals for this button + slot + boogie stats
      updateButtonVisual();
      updateSlotImage();
      updateBoogieStats();
      return;
    }

    // Unequip other items in the same slot
    for (const k in equipmentData) {
      const itemState = state.equipment[k];
      if (!itemState) continue;
      if (itemState.equipped && equipmentData[k].slot === equipmentDef.slot) {
        itemState.equipped = false;
        if (equipmentData[k].onUnequip) equipmentData[k].onUnequip(state);

        // reset the visual on the corresponding slot
        const otherSlotImg = document.querySelector(`#slot-${equipmentData[k].slot} img`);
        if (otherSlotImg) {
          otherSlotImg.src = `${KorvkioskData.pluginUrl}src/game/Assets/img/boogie/duelframe0.png`;
          otherSlotImg.style.opacity = '0.5';
        }

        // update the unequipped button visual if it's present in DOM
        const unequippedButton = document.querySelector(`button[data-equipment-key="${k}"] img`);
        if (unequippedButton) unequippedButton.style.opacity = '0.4';
      }
    }

    // Equip this item
    equipmentState.equipped = true;
    if (key === 'korv1' && state.skills && !state.skills.throw?.unlocked) {
      if (!state.skills.throw) state.skills.throw = { unlocked: true, level: 1 };
      else state.skills.throw.unlocked = true;
    }
    if (equipmentDef.onEquip) equipmentDef.onEquip(state);

    // update visuals (current button, slot, and boogie stats)
    updateButtonVisual();
    updateSlotImage();
    updateBoogieStats();
  });

  return button;
}

// Helper to render equipment buttons filtered by category
function renderEquipmentButtons(categoryKey, equipmentButtonContainer, tabContent, mainScreen, infoLeft, infoRight) {
  equipmentButtonContainer.innerHTML = '';

  for (const key in equipmentData) {
    const equipment = equipmentData[key];
    const stateItem = state.equipment[key];
    if (!stateItem || !stateItem.unlocked) continue;
    if (equipment.slot !== categoryKey) continue;

    const btn = createEquipmentButton(key, tabContent, mainScreen, infoLeft, infoRight);
    if (btn) equipmentButtonContainer.appendChild(btn);
  }
}

// Main Equipment Tab render function
export function renderEquipmentTab({ tabContent, mainScreen, infoLeft, infoRight, categoryOverride = null }) {
  // clear screens
  mainScreen.innerHTML = '';
  tabContent.innerHTML = '';

  // --- ensure equipmentTab has its own infoRight ---
  if (!infoRight) {
    infoRight = document.createElement('div');
    infoRight.id = 'equipment-info-right';
    infoRight.style.border = '1px solid #444';
    infoRight.style.padding = '8px';
    infoRight.style.minWidth = '150px';
    tabContent.appendChild(infoRight);
  }

  // --- CENTER INTERFACE ---
  const equipmentContainer = document.createElement('div');
  equipmentContainer.style.width = '740px';
  equipmentContainer.style.height = '400px';
  equipmentContainer.style.display = 'grid';
  equipmentContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
  equipmentContainer.style.justifyItems = 'center';
  equipmentContainer.style.alignItems = 'center';
  equipmentContainer.style.gap = '20px';
  equipmentContainer.style.border = 'solid';

  const wrapper = document.createElement('div');
  wrapper.style.width = '100%';
  wrapper.style.height = '100%';
  wrapper.style.display = 'flex';
  wrapper.style.justifyContent = 'center';
  wrapper.style.alignItems = 'center';
  wrapper.appendChild(equipmentContainer);
  mainScreen.appendChild(wrapper);

  // --- SLOTS ---
  const slots = [
    { name: 'Primary Hand', key: 'primaryHand' },
    { name: 'Secondary Hand', key: 'secondaryHand' },
    { name: 'Hatt', key: 'hatt' },
    { name: 'Korvlåda', key: 'korvBox' }
  ];

  slots.forEach(slot => {
    const slotDiv = document.createElement('div');
    slotDiv.id = `slot-${slot.key}`;
    slotDiv.style.display = 'flex';
    slotDiv.style.flexDirection = 'column';
    slotDiv.style.alignItems = 'center';

    const label = document.createElement('p');
    label.textContent = slot.name;
    label.style.margin = '0 0 8px 0';
    label.style.fontWeight = 'bold';
    slotDiv.appendChild(label);

    const img = document.createElement('img');
    img.alt = slot.name;
    img.style.width = '64px';
    img.style.height = '64px';
    img.style.border = '2px solid #444';
    img.style.borderRadius = '8px';

    let equippedItem = Object.keys(state.equipment).find(
      k => state.equipment[k]?.equipped && equipmentData[k]?.slot === slot.key
    );

    if (equippedItem) {
      img.src = `${KorvkioskData.pluginUrl}${equipmentData[equippedItem].img}`;
      img.style.opacity = '1';
    } else {
      img.src = `${KorvkioskData.pluginUrl}src/game/Assets/img/boogie/duelframe0.png`;
      img.style.opacity = '0.5';
    }

    slotDiv.appendChild(img);
    equipmentContainer.appendChild(slotDiv);
  });

  // --- Helper function to update all slot images instantly ---
  function updateAllSlotImages() {
    for (const slot of slots) {
      const slotImg = document.querySelector(`#slot-${slot.key} img`);
      if (!slotImg) continue;

      const equippedItemKey = Object.keys(state.equipment).find(
        key => state.equipment[key]?.equipped && equipmentData[key]?.slot === slot.key
      );

      if (equippedItemKey) {
        slotImg.src = `${KorvkioskData.pluginUrl}${equipmentData[equippedItemKey].img}`;
        slotImg.style.opacity = '1';
      } else {
        slotImg.src = `${KorvkioskData.pluginUrl}src/game/Assets/img/boogie/duelframe0.png`;
        slotImg.style.opacity = '0.5';
      }
    }
  }

  // --- CATEGORY BUTTONS ---
  if (!activeCategory) activeCategory = slots[0].key;
  if (categoryOverride) activeCategory = categoryOverride;

  const categoryContainer = document.createElement('div');
  categoryContainer.style.display = 'flex';
  categoryContainer.style.justifyContent = 'space-around';
  categoryContainer.style.alignItems = 'flex-start';
  categoryContainer.style.height = '40px';
  categoryContainer.style.marginBottom = '8px';

  const equipmentButtonContainer = document.createElement('div');
  equipmentButtonContainer.style.display = 'flex';
  equipmentButtonContainer.style.flexWrap = 'wrap';
  equipmentButtonContainer.style.justifyContent = 'left';
  equipmentButtonContainer.style.gap = '5px';
  equipmentButtonContainer.style.marginTop = '1px';

  slots.forEach(slot => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = slot.name;
    btn.style.flex = '1';
    btn.style.margin = '0 5px';
    btn.style.padding = '8px';
    btn.style.cursor = 'pointer';
    btn.style.fontWeight = activeCategory === slot.key ? 'bold' : 'normal';

    btn.addEventListener('click', () => {
      activeCategory = slot.key;
      renderEquipmentButtons(activeCategory, equipmentButtonContainer, tabContent, mainScreen, infoLeft, infoRight);
      Array.from(categoryContainer.children).forEach(b => b.style.fontWeight = 'normal');
      btn.style.fontWeight = 'bold';

      // Update slot images immediately after category change
      updateAllSlotImages();
    });

    categoryContainer.appendChild(btn);
  });

  tabContent.appendChild(categoryContainer);
  tabContent.appendChild(equipmentButtonContainer);

  // --- INITIAL RENDER ---
  renderEquipmentButtons(activeCategory, equipmentButtonContainer, tabContent, mainScreen, infoLeft, infoRight);

  if (infoLeft) infoLeft.innerHTML = 'Select an item for info';

  // Update slot images immediately on initial render
  updateAllSlotImages();

  // --- Register an update callback so this tab's dynamic visuals refresh via ui.js loop ---
  _updateCallback = () => {
    // Keep slot images and boogie stats in sync
    // update slot images (in case equip state changed elsewhere)
    for (const k in equipmentData) {
      const def = equipmentData[k];
      const slotImg = document.querySelector(`#slot-${def.slot} img`);
      if (!slotImg) continue;
      const equippedItem = Object.keys(state.equipment).find(
        key => state.equipment[key]?.equipped && equipmentData[key]?.slot === def.slot
      );
      if (equippedItem) {
        slotImg.src = `${KorvkioskData.pluginUrl}${equipmentData[equippedItem].img}`;
        slotImg.style.opacity = '1';
      } else {
        slotImg.src = `${KorvkioskData.pluginUrl}src/game/Assets/img/boogie/duelframe0.png`;
        slotImg.style.opacity = '0.5';
      }
    }

    // refresh boogie stats if infoRight exists
    if (infoRight) {
      const b = state.boogie;
      const damageText = b.damageTypes && b.damageTypes.size > 0
        ? Array.from(b.damageTypes).join(', ')
        : 'None';

      infoRight.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          height: 100%;
          text-align: left;
        ">
          <div>HP: ${Math.floor(b.currentHP)} / ${Math.floor(b.maxHP)}</div>
          <div>Attack: ${b.attackPower}</div>
          <div>Defense: ${b.defense}</div>
          <div>Damage Types: ${damageText}</div>
          <div>Status Effects: ${b.statusEffects.length > 0 ? b.statusEffects.join(', ') : 'None'}</div>
        </div>
      `;
    }
  };

  registerUpdateCallback(_updateCallback);

  // Return cleanup function so ui.js can call it on tab switch
  return function cleanup() {
    if (_updateCallback) {
      unregisterUpdateCallback(_updateCallback);
      _updateCallback = null;
    }
  };
}
