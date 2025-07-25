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

// "Gör korv" knapp som ökar korv med 1

//"Gör korv med ketchup, senap" knapp som syns och kan tryckas på när Unlock recipe 1: korv med bröd ketchup senap är uppnått. korv + 10

// "Gör korv med allt" knapp som syns och kan tryckas på när Unlock recipe 2: Korv med allt är uppnått. Korv + 50

