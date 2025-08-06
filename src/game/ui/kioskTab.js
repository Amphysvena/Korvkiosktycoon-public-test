export function renderKioskTab(container) {
  const kioskContainer = document.createElement('div');  
  kioskContainer.id = 'kiosk-container';
  
  // koktKorvknapp-ui
  const koktKorvButton = document.createElement('button');
  koktKorvButton.id = 'koktKorvbutton';
  koktKorvButton.innerHTML = `
  <img src="${KorvkioskData.pluginUrl}src/game/Assets/img/equipment/Korvknappar/korv1.png" alt="Korv" style="width: 64px; height: 64px;">
`;

  kioskContainer.appendChild(koktKorvButton);
  container.appendChild(kioskContainer); 

  // Hook up the button logic
  koktKorvButton.addEventListener('click', () => {
    handlekoktKorvClick();
  });
}







//pseudocode

// Visuell "Gör korv" knapp som ökar korv med 1 visuellt i upperscreen

//Visuell "Gör korv med ketchup, senap" knapp, Korv + 10 i upperscreen

// Visuell "Gör korv med allt" knapp som syns och kan tryckas på när Unlock recipe 2: Korv med allt är uppnått. Korv + 50 i upperscreen

