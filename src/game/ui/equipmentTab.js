import { state } from '../state.js';
import { equipmentData } from '../data/equipmentData.js';

//creates buttons for equipment when they are unlocked
export function createEquipmentButton(key, tabContent, mainScreen) {
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
  buttonImg.style.transition = 'opacity 0.2s'; // smooth fade
  button.appendChild(buttonImg);

  // Tooltip
  if (equipmentDef.effectDescription) {
    button.title = equipmentDef.effectDescription;
  }

  // Helper to update button visual (opacity)
  function updateButtonVisual() {
    buttonImg.style.opacity = equipmentState.equipped ? '1' : '0.4';
  }

  // Helper to update the corresponding slot image
  function updateSlotImage() {
    const slotDiv = document.querySelector(`#slot-${equipmentDef.slot} img`);
    if (!slotDiv) return;

    if (equipmentState.equipped) {
      slotDiv.src = `${KorvkioskData.pluginUrl}${equipmentDef.img}`;
      slotDiv.style.opacity = '1';
    } else {
      slotDiv.src = `${KorvkioskData.pluginUrl}src/game/Assets/img/boogie/duelframe0.png`; // placeholder
      slotDiv.style.opacity = '0.5';
    }
  }

  // Initial update
  updateButtonVisual();
  updateSlotImage();

  // Click behavior: equip / unequip
  button.addEventListener('click', () => {
    // If already equipped, unequip it
    if (equipmentState.equipped) {
      equipmentState.equipped = false;
      if (equipmentDef.onUnequip) equipmentDef.onUnequip(state);
      updateButtonVisual();
      updateSlotImage();
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

    // Refresh the equipment tab so newly unlocked items appear
    renderEquipmentTab({ tabContent, mainScreen });

    updateButtonVisual();
    updateSlotImage();
  });

  return button;
}

// helper to render equipment buttons filtered by category
function renderEquipmentButtons(categoryKey, equipmentButtonContainer, tabContent, mainScreen) {
  // Clear previous
  equipmentButtonContainer.innerHTML = '';

  // Add all buttons for this category
  for (const key in equipmentData) {
    const equipment = equipmentData[key];
    const stateItem = state.equipment[key];

    if (!stateItem || !stateItem.unlocked) continue;
    if (equipment.slot !== categoryKey) continue;

    const btn = createEquipmentButton(key, tabContent, mainScreen);
    if (btn) equipmentButtonContainer.appendChild(btn);
  }
}

// Main Equipment Tab render function
export function renderEquipmentTab({ tabContent, mainScreen }) {
  // Clear previous content
  mainScreen.innerHTML = '';
  tabContent.innerHTML = '';

  // Create the equipment container (740x400) and center it
  const equipmentContainer = document.createElement('div');
  equipmentContainer.style.width = '740px';
  equipmentContainer.style.height = '400px';
  equipmentContainer.style.display = 'grid';
  equipmentContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
  equipmentContainer.style.justifyItems = 'center';
  equipmentContainer.style.alignItems = 'center';
  equipmentContainer.style.gap = '20px';

  // Centering wrapper inside mainScreen
  const wrapper = document.createElement('div');
  wrapper.style.width = '100%';
  wrapper.style.height = '100%';
  wrapper.style.display = 'flex';
  wrapper.style.justifyContent = 'center';
  wrapper.style.alignItems = 'center';
  wrapper.appendChild(equipmentContainer);
  mainScreen.appendChild(wrapper);

  // Create slot placeholders with ids
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

    // --- NEW: Only use placeholder if nothing is equipped ---
    let equippedItem = Object.keys(state.equipment).find(
      key => state.equipment[key]?.equipped && equipmentData[key]?.slot === slot.key
    );

    if (equippedItem) {
      // show the equipped item's image if found
      img.src = `${KorvkioskData.pluginUrl}${equipmentData[equippedItem].img}`;
      img.style.opacity = '1';
    } else {
      // fallback placeholder
      img.src = `${KorvkioskData.pluginUrl}src/game/Assets/img/boogie/duelframe0.png`;
      img.style.opacity = '0.5';
    }

    slotDiv.appendChild(img);
    equipmentContainer.appendChild(slotDiv);
  });

  // --- NEW: Category buttons in tabContent ---
  let activeCategory = slots[0].key; // default selected
  const categoryContainer = document.createElement('div');
  categoryContainer.style.display = 'flex';
  categoryContainer.style.justifyContent = 'space-around';
  categoryContainer.style.alignItems = 'flex-start'; // keep buttons top-aligned
  categoryContainer.style.height = '40px';
  categoryContainer.style.marginBottom = '8px'; // spacing before equipment buttons

  // container for equipment buttons
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
      renderEquipmentButtons(activeCategory, equipmentButtonContainer, tabContent, mainScreen);
      // update styles
      Array.from(categoryContainer.children).forEach(b => b.style.fontWeight = 'normal');
      btn.style.fontWeight = 'bold';
    });

    categoryContainer.appendChild(btn);
  });

  tabContent.appendChild(categoryContainer);
  tabContent.appendChild(equipmentButtonContainer);

  // Initial render of equipment buttons
  renderEquipmentButtons(activeCategory, equipmentButtonContainer, tabContent, mainScreen);
}

//Pseudokod

//Equip interface har slots: 
// - Primary Hand
// - Secondary Hand
// - Korvlåda
// - Hatt
// - en simpel gubbe med 4 rutor som man kan klicka på. Klicka på rutan så kommer det upp val för att equippa tillgängliga equips 

//bilder på alla tillgängliga equipment med kort beskriving i upperscreen om man markerar ett equip
