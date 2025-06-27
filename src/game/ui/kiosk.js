export function renderKiosk(container) {
  const p = document.createElement('p');
  p.textContent = "På gatan igen...";
  container.appendChild(p);

  const btn = document.createElement('button');
  btn.textContent = "Gör korv";
  btn.onclick = () => alert("🌭 +1 Sausage!");
  container.appendChild(btn);
}
