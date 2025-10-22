import { state } from '../state.js';
import { boogieEnemies } from '../data/boogieEnemiesforact1.js';

export function renderBoogieTab({ tabContent, mainScreen, infoLeft, infoRight }) {
  // Clear previous content
  tabContent.innerHTML = '';

  const enemyContainer = document.createElement('div');
  enemyContainer.style.display = 'flex';
  enemyContainer.style.flexWrap = 'wrap';
  enemyContainer.style.gap = '10px';
  enemyContainer.style.justifyContent = 'flex-start';
  enemyContainer.style.alignItems = 'flex-start';
  enemyContainer.style.padding = '10px';

  for (const key in boogieEnemies) {
    const enemy = boogieEnemies[key];

    // Only show if unlocked
    if (!enemy.unlockCondition(state)) continue;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'kiosk-button';

    // ✅ Always take image directly from data file
    btn.innerHTML = `
      <img src="${KorvkioskData.pluginUrl}src/game/Assets/img/boogie/${enemy.img}" 
           alt="${enemy.name}" 
           style="width:64px; height:64px;">
    `;

    // Hover info (left panel)
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

    // Click logic: check winCondition
    btn.addEventListener('click', () => {
      if (enemy.winCondition(state)) {
        console.log(`You defeated ${enemy.name}!`);

        // ✅ Record victory
        state.boogie.defeatedEnemies.add(key);

        // ✅ Give drops (unlock equipment or recipes, building permissions)
        enemy.drops.forEach(dropKey => {
          if (state.equipment[dropKey] && !state.equipment[dropKey].unlocked) {
            state.equipment[dropKey].unlocked = true;
            console.log(`${dropKey} unlocked!`);
          } else if (state.recipes[dropKey] && !state.recipes[dropKey].unlocked) {
            state.recipes[dropKey].unlocked = true;
            console.log(`${dropKey} recipe unlocked!`);
          }
        // ✅ Check if it’s a building permission
            else if (state.buildings[dropKey] && !state.buildings[dropKey].unlocked) {
            state.buildings[dropKey].unlocked = true;
            console.log(`${dropKey} building unlocked!`);
}
        });

        // ✅ Log new enemies unlocked
        if (enemy.victoryUnlocks) {
          enemy.victoryUnlocks.forEach(nextEnemyKey => {
            const nextEnemy = boogieEnemies[nextEnemyKey];
            if (nextEnemy) console.log(`New enemy unlocked: ${nextEnemy.name}`);
          });
        }

        // ✅ Refresh tab to show newly unlocked enemies
        renderBoogieTab({ tabContent, mainScreen, infoLeft, infoRight });
      } else {
        console.log(`You cannot defeat ${enemy.name} yet. Equip the right damage type.`);
      }
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

