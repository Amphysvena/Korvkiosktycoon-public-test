export function renderEquipmentTab({ tabContent }) {
  tabContent.innerHTML = '';
  const equipmentPlaceholder = document.createElement('p');
  equipmentPlaceholder.textContent = 'Equipment tab coming soon!';
  tabContent.appendChild(equipmentPlaceholder);
}

//Pseudokod

//Equip interface har slots: 
// - Primary Hand
// - Secondary Hand
// - Korvlåda
// - Hatt
// - en simpel gubbe med 4 rutor som man kan klicka på. Klicka på rutan så kommer det upp val för att equippa tillgängliga equips 

//bilder på alla tillgängliga equipment med kort beskriving i upperscreen om man markerar ett equip