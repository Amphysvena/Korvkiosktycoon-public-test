export function renderBuildingsTab({ tabContent }) {
  tabContent.innerHTML = '';
  const buildingsPlaceholder = document.createElement('p');
  buildingsPlaceholder.textContent = 'Buildings tab coming soon!';
  tabContent.appendChild(buildingsPlaceholder);
}

//Plats där man bygger byggnader, i denna version är det bara planerat att låsa upp lagerhus, men inte implementera byggandet av den.
//Förmodligen introduktion av nästa valuta efter korv. 

//Ikon för lagerhus, ej klickbar ännu
