export function renderSpacecenterTab({ tabContent }) {
  tabContent.innerHTML = '';
  const spacecenterPlaceholder = document.createElement('p');
  spacecenterPlaceholder.textContent = 'spacecenter tab coming soon!';
  tabContent.appendChild(spacecenterPlaceholder);
}
