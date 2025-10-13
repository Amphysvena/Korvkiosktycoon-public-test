import { state } from '../state.js';
import { boogieEnemies } from '../data/boogieEnemiesforact1.js';

export function renderBoogieTab({ tabContent, mainScreen, infoLeft, infoRight }) {
  tabContent.innerHTML = '';

  // Container for enemies
  const enemyContainer = document.createElement('div');
  enemyContainer.style.display = 'flex';
  enemyContainer.style.flexWrap = 'wrap';
  enemyContainer.style.gap = '10px';
  enemyContainer.style.justifyContent = 'flex-start';
  enemyContainer.style.alignItems = 'flex-start';
  enemyContainer.style.padding = '10px';

  // Loop through all enemies and check unlock condition
  for (const key in boogieEnemies) {
    const enemy = boogieEnemies[key];

    if (!enemy.unlockCondition(state)) continue; // skip locked

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'kiosk-button'; // ✅ reuse styling

    btn.innerHTML = `
      <img src="${KorvkioskData.pluginUrl}src/game/Assets/img/boogie/${enemy.img}" 
           alt="${enemy.name}" 
           style="width:64px; height:64px;">
    `;

    // Hover info
    btn.addEventListener('mouseenter', () => {
      if (infoLeft) {
        infoLeft.innerHTML = `
          <div style="text-align:center;">
            <div style="font-size:20px; font-weight:bold; text-decoration:underline;">
              ${enemy.name}
            </div>
            <div style="margin-top:8px; font-size:16px;">
              ${enemy.description}
            </div>
          </div>
        `;
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (infoLeft) infoLeft.innerHTML = '';
    });

    // Click placeholder (for future combat)
    btn.addEventListener('click', () => {
      console.log(`Encountered enemy: ${enemy.name}`);
      // Later: trigger combat or checkbox simulation
    });

    enemyContainer.appendChild(btn);
  }

  tabContent.appendChild(enemyContainer);
}


//pseudokod

//Equip varmkorbröd första gången:Boogie tab unlock

//Equip varmkorbröd första gången: Låser upp första motståndaren i Boogie tab. Byråkrat

//Knappar på tillgängliga motståndare.
//Om de trycks på få upp ruta där det står "Vill du utmana X?" "Ja/Nej"
//Visa resultat från valen beroende på vad som sker i boogieEngine (Om jag vinner)

//Skicka eventuell visuell information till UpperscreenTab.js

