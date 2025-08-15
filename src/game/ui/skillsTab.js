export function renderSkillsTab({ tabContent }) {
  tabContent.innerHTML = '';
  const skillsPlaceholder = document.createElement('p');
  skillsPlaceholder.textContent = 'Skills tab coming soon!';
  tabContent.appendChild(skillsPlaceholder);
}

//pseudokod

//Equip varmkorbröd första gången: Unlock skill throw 
// (gör inget nu, det är första skillen men i första versionen av spelet så finns enbart detta så skapa enbart en skill som heter Throw)