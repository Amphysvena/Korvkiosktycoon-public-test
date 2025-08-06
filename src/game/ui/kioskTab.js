export function renderKioskTab() {
  const kioskContainer = document.createElement('div');  //Creates a new container div for the Kiosk tab UI elements

  // koktKorvknapp-ui
  const sausageButton = document.createElement('button');
  sausageButton.id = 'koktKorvbutton';
  sausageButton.innerHTML = `<img src="plugins/korvkiosktycoon/src/game/Assets/img/equipment/Korvknappar/korv1.png" alt="Korv" style="width: 64px; height: 64px;">`;

  kioskContainer.appendChild(koktKorvButton);
  document.body.appendChild(kioskContainer); 

  // Hook up the button logic
  koktKorvButton.addEventListener('click', () => {
    handlekoktKorvClick();
  });
}







//pseudocode

// Visuell "Gör korv" knapp som ökar korv med 1 visuellt i upperscreen

//Visuell "Gör korv med ketchup, senap" knapp, Korv + 10 i upperscreen

// Visuell "Gör korv med allt" knapp som syns och kan tryckas på när Unlock recipe 2: Korv med allt är uppnått. Korv + 50 i upperscreen

