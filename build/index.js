function s(n){const o=document.createElement("div");o.id="kiosk-container";const i=document.createElement("button");i.id="koktKorvbutton",i.innerHTML=`
  <img src="${KorvkioskData.pluginUrl}src/game/Assets/img/equipment/Korvknappar/korv1.png" alt="Korv" style="width: 64px; height: 64px;">
`,o.appendChild(i),n.appendChild(o),i.addEventListener("click",()=>{handlekoktKorvClick()})}function u(n){n.innerHTML="<p>Research new tech here.</p>"}const c=[{id:"kiosk",name:"Kiosk",render:s},{id:"research",name:"Research",render:u}];function l(){const n=document.createElement("div");n.id="game-ui",n.innerHTML=`
    <div class="tab-buttons"></div>
    <div class="tab-content"></div>
  `,document.body.appendChild(n);const o=n.querySelector(".tab-buttons"),i=n.querySelector(".tab-content");c.forEach(e=>{const t=document.createElement("button");t.textContent=e.name,t.onclick=()=>d(e.id),t.id=`btn-${e.id}`,o.appendChild(t)});function d(e){const t=c.find(r=>r.id===e);t&&(i.innerHTML="",t.render(i)),a(e)}function a(e){c.forEach(t=>{document.getElementById(`btn-${t.id}`).classList.toggle("active",t.id===e)})}d(c[0].id)}function k(){l()}document.addEventListener("DOMContentLoaded",()=>{k()});
