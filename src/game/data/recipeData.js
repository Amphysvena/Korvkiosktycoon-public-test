//Ärkekrat besegrad = 
// Recipe 1 för korv med bröd, ketchup, senap unlocked. Kostar 750 korv. Ges efter 1 minut av forskning när man tryckt på knappen och betalat 750 korv. Timer syns över knappen

//Överförmyndare besegrad = 
// Recipe 2 för korv med allt unlocked. Kostar 10000 korv. Ges efter 15 minuter av forskning när man tryckt på knappen och betalat 10000 korv. Timer syns över knappen

export const recipeData = {
    recipe1: {
        name: 'Recipe for sausage with ketchup and mustard.',
        description: 'Esoteric knowledge concerning ancient sausage techniques. It seems to be over 400 years old.',
        img: 'src/game/assets/img/recept/recipe-frame-0-.png',
        cost: 750,
        duration: 60, 
                
    },

    recipe2: {
        name: 'Recipe for sausage with everything on it.',
        description: 'Esoteric knowledge concerning secret sausage techniques. It seems to be over 70 years old.',
        img: 'src/game/assets/img/recept/recipe-frame-0-.png',
        cost: 1, //10000 ändra tillbaka senare
        duration: 10, //900, ändra tillbaka senare
                
    }
};