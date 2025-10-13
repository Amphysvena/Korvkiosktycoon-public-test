import { state } from '../state.js';
import { equipmentData } from '../data/equipmentData.js';

// Creates buttons for equipment when they are unlocked
export function createEquipmentButton(key, tabContent, mainScreen, infoLeft, infoRight) {
  const equipmentState = state.equipment[key];
  const equipmentDef = equipmentData[key];

  if (!equipmentState || !equipmentState.unlocked) return null;

  const button = document.createElement('button');
  button.style.width = '64px';
  button.style.height = '64px';
  button.style.position = 'relative';
  button.style.border = 'none';
  button.style.padding = '0';
  button.style.cursor = 'pointer';

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
    <div style="text-align: center;">${equipmentDef.itemDescription || 'No description available'}</div>`;
  }
});

button.addEventListener('mouseleave', () => {
  if (infoLeft) {
    infoLeft.innerHTML = `
    <div style="text-align: center;">Hover over an item for information</div>`;
    
  }
});

  // --- FUNCTION: update boogie stats (only if infoRight exists) ---
function updateBoogieStats() {
  if (!infoRight) return;
  const b = state.boogie;

  // Convert Set to array and join for display
  const damageText = b.damageTypes && b.damageTypes.size > 0
    ? Array.from(b.damageTypes).join(', ')
    : 'None';

  infoRight.innerHTML = `
  <div style="
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    height: 100%;
    text-align: left;
  ">
    <div>HP: ${b.currentHP} / ${b.maxHP}</div>
    <div>Attack: ${b.attackPower}</div>
    <div>Defense: ${b.defense}</div>
    <div>Damage Types: ${damageText}</div>
    <div>Status Effects: ${b.statusEffects.length > 0 ? b.statusEffects.join(', ') : 'None'}</div>
  </div>
`;
}

  // Initial render of stats
  updateBoogieStats();

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

  updateButtonVisual();
  updateSlotImage();

  // --- CLICK HANDLER ---
  button.addEventListener('click', () => {
    // Unequip if already equipped
    if (equipmentState.equipped) {
      equipmentState.equipped = false;
      if (equipmentDef.onUnequip) equipmentDef.onUnequip(state);
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
        const otherSlotImg = document.querySelector(`#slot-${equipmentData[k].slot} img`);
        if (otherSlotImg) {
          otherSlotImg.src = `${KorvkioskData.pluginUrl}src/game/Assets/img/boogie/duelframe0.png`;
          otherSlotImg.style.opacity = '0.5';
        }
      }
    }

    // Equip this item
    equipmentState.equipped = true;
    if (equipmentDef.onEquip) equipmentDef.onEquip(state);
    renderEquipmentTab({ tabContent, mainScreen, infoLeft, infoRight });
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
export function renderEquipmentTab({ tabContent, mainScreen, infoLeft, infoRight }) {
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
    { name: 'Hatt', key: 'hat' },
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
      key => state.equipment[key]?.equipped && equipmentData[key]?.slot === slot.key
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

  // --- CATEGORY BUTTONS ---
  let activeCategory = slots[0].key;
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
    });

    categoryContainer.appendChild(btn);
  });

  tabContent.appendChild(categoryContainer);
  tabContent.appendChild(equipmentButtonContainer);

  // --- INITIAL RENDER ---
  renderEquipmentButtons(activeCategory, equipmentButtonContainer, tabContent, mainScreen, infoLeft, infoRight);

  // --- DEFAULT INFO LEFT TEXT ---
  if (infoLeft) infoLeft.innerHTML = 'Select an item for info';
}



//Pseudokod

//Equip interface har slots: 
// - Primary Hand
// - Secondary Hand
// - Korvlåda
// - Hatt
// - en simpel gubbe med 4 rutor som man kan klicka på. Klicka på rutan så kommer det upp val för att equippa tillgängliga equips 

//bilder på alla tillgängliga equipment med kort beskriving i upperscreen om man markerar ett equip
