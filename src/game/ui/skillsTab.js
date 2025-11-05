import { state } from '../state.js';
import { skillData } from '../data/skillsData.js';
import { registerUpdateCallback, unregisterUpdateCallback } from '../ui.js';

let _updateCallback = null;

export function renderSkillsTab({ tabContent, mainScreen, infoLeft, infoRight }) {
  tabContent.innerHTML = '';

  if (infoLeft) infoLeft.innerHTML = '';
  if (infoRight)
    infoRight.innerHTML = '<div style="font-size:18px; font-weight:bold;">Unlocked Skills To be changed</div>';

  const skillsContainer = document.createElement('div');
  
  tabContent.appendChild(skillsContainer);

  for (const [key, skillState] of Object.entries(state.skills)) {
    if (!skillState.unlocked) continue;
    const skillDef = skillData[key];
    if (!skillDef) continue;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'kiosk-button';
    btn.innerHTML = `
      <img src="${KorvkioskData.pluginUrl}src/game/Assets/img/skills/${skillDef.img}" 
           alt="${skillDef.name}" 
           style="width:64px; height:64px;">
    `;

    btn.addEventListener('mouseenter', () => {
      if (infoLeft) {
        infoLeft.innerHTML = `
          <div style="text-align: center;">
            <div style="font-size: 20px; font-weight: bold; text-decoration: underline;">
              ${skillDef.name}
            </div>
            <div style="margin-top: 8px; font-size: 16px;">
              ${skillDef.description}
            </div>
            <div style="margin-top: 8px;">Level: ${skillState.level}</div>
          </div>
        `;
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (infoLeft) infoLeft.innerHTML = '';
    });

    skillsContainer.appendChild(btn);
  }

  if (skillsContainer.children.length === 0) {
    const noSkills = document.createElement('p');
    noSkills.textContent = 'No skills unlocked yet!';
    noSkills.style.textAlign = 'center';
    tabContent.appendChild(noSkills);
  }

  // Minimal update callback just to keep UI reactive
  _updateCallback = () => {
    // No UI changes needed now, but this keeps the tab active & ready for future updates
  };

  registerUpdateCallback(_updateCallback);

  return function cleanup() {
    if (_updateCallback) {
      unregisterUpdateCallback(_updateCallback);
      _updateCallback = null;
    }
  };
}
