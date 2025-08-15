export function renderFactoryTab({ tabContent }) {
  tabContent.innerHTML = '';
  const factoryPlaceholder = document.createElement('p');
  factoryPlaceholder.textContent = 'Factory tab coming soon!';
  tabContent.appendChild(factoryPlaceholder);
}