export function renderRecipesTab({ tabContent }) {
  tabContent.innerHTML = '';
  const recipesPlaceholder = document.createElement('p');
  recipesPlaceholder.textContent = 'Recipes tab coming soon!';
  tabContent.appendChild(recipesPlaceholder);
}

//pseudokod

//Ärkekrat besegrad = 
// Recipe 1 för korv med bröd, ketchup, senap unlocked. Kostar 750 korv. Ges efter 1 minut av forskning när man tryckt på knappen och betalat 750 korv. Timer syns över knappen

//Överförmyndare besegrad = 
// Recipe 2 för korv med allt unlocked. Kostar 10000 korv. Ges efter 15 minuter av forskning när man tryckt på knappen och betalat 10000 korv. Timer syns över knappen
