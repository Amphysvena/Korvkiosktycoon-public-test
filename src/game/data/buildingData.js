export const buildingData = {
    lagerhus: {
        name: 'Lagerhus',
        img: 'src/game/Assets/img/building/building 1 - lagerhus.png',
        effectDescription: 'Storage house for your cold dogs.',
        itemDescription: 'Storage house for your cold dogs',
        baseCost: 1000,
        growthRate: 1.1,
        duration: 5, //ändra till 600
        effect: (state) => {
        state.korvtak += 1000;

        },
    }
}