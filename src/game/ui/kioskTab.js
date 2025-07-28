export function renderKiosk(container) {
  const p = document.createElement('p');
  p.textContent = "På gatan igen...";
  container.appendChild(p);

  const btn = document.createElement('button');
  btn.textContent = "Gör korv";
  btn.onclick = () => alert("🌭 +1 Sausage!");
  container.appendChild(btn);
}

//pseudocode

// Visuell "Gör korv" knapp som ökar korv med 1 visuellt i upperscreen

//Visuell "Gör korv med ketchup, senap" knapp, Korv + 10 i upperscreen

// Visuell "Gör korv med allt" knapp som syns och kan tryckas på när Unlock recipe 2: Korv med allt är uppnått. Korv + 50 i upperscreen

