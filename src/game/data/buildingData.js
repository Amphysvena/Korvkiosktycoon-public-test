export const buildingData = {
    lagerhus: {
        name: 'Lagerhus',
        img: '',
        effectDescription: 'Storage house for your cold dogs.',
        itemDescription: 'Storage house for your cold dogs',
        cost: 1000,
        duration: 600,
        onBuild: (state) => {
            korvtak += 1000

        },
    }
}