import { state } from '../state.js';
import { skillData } from '../data/skillsData.js';

export function renderSkillsTab({ tabContent, mainScreen, infoLeft, infoRight }) {
  // ── Clear tab area ──
  tabContent.innerHTML = '';

  // ── Clear info boxes ──
  if (infoLeft) infoLeft.innerHTML = '';
  if (infoRight)
    infoRight.innerHTML = '<div style="font-size:18px; font-weight:bold;">Unlocked Skills</div>';

  // ── Skills container ──
  const skillsContainer = document.createElement('div');


  tabContent.appendChild(skillsContainer);

  // ── Create a button for each unlocked skill ──
  for (const [key, skillState] of Object.entries(state.skills)) {
    if (!skillState.unlocked) continue;
    const skillDef = skillData[key];
    if (!skillDef) continue;

    // --- Create button identical to kiosk style ---
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'kiosk-button'; // 🔥 reuses same styling
    btn.innerHTML = `
      <img src="${KorvkioskData.pluginUrl}src/game/Assets/img/skills/${skillDef.img}" 
           alt="${skillDef.name}" 
           style="width:64px; height:64px;">
    `;

    // --- Hover info ---
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

    // --- Click action (placeholder for later combat logic) ---
    btn.addEventListener('click', () => {
      console.log(`Used skill: ${skillDef.name}`);
      // TODO: skill logic (e.g., throw attack animation)
    });

    skillsContainer.appendChild(btn);
  }

  // ── Empty state message ──
  if (skillsContainer.children.length === 0) {
    const noSkills = document.createElement('p');
    noSkills.textContent = 'No skills unlocked yet!';
    noSkills.style.textAlign = 'center';
    tabContent.appendChild(noSkills);
  }
}
