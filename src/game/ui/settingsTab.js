export function renderSettingsTab({ tabContent }) {
  tabContent.innerHTML = '';
  const settingsPlaceholder = document.createElement('p');
  settingsPlaceholder.textContent = 'Settings tab coming soon!';
  tabContent.appendChild(settingsPlaceholder);
}