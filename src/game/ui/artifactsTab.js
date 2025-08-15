export function renderArtifactsTab({ tabContent }) {
  tabContent.innerHTML = '';
  const artifactsPlaceholder = document.createElement('p');
  artifactsPlaceholder.textContent = 'Artifacts tab coming soon!';
  tabContent.appendChild(artifactsPlaceholder);
}