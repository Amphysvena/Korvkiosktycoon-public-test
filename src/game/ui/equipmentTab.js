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

// Main Equipment Tab render function
export function renderEquipmentTab({ tabContent, mainScreen }) {
  // Clear previous content
  mainScreen.innerHTML = '';

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
    img.src = `${KorvkioskData.pluginUrl}src/game/Assets/img/boogie/duelframe0.png`; // placeholder
    img.alt = slot.name;
    img.style.width = '64px';
    img.style.height = '64px';
    img.style.border = '2px solid #444';
    img.style.borderRadius = '8px';
    img.style.opacity = '0.5';
    slotDiv.appendChild(img);

    equipmentContainer.appendChild(slotDiv);
  });

  // Clear tabContent
  tabContent.innerHTML = '';

  // Automatically generate buttons for all unlocked equipment
  for (const key in equipmentData) {
    const btn = createEquipmentButton(key, tabContent, mainScreen); // pass UI references
    if (btn) tabContent.appendChild(btn);
  }
}

//Pseudokod

//Equip interface har slots: 
// - Primary Hand
// - Secondary Hand
// - Korvlåda
// - Hatt
// - en simpel gubbe med 4 rutor som man kan klicka på. Klicka på rutan så kommer det upp val för att equippa tillgängliga equips 

//bilder på alla tillgängliga equipment med kort beskriving i upperscreen om man markerar ett equip
