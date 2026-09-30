// JurkonCompanies
// Core Game State
// Version: 0.1

const GameState = {
    version: "0.1.0",

    player: {
        id: null,
        name: null,
        level: 1,
        experience: 0
    },

    company: {
        id: null,
        name: null,
        cash: 500,
        level: 1
    },

    buildings: [],

    inventory: {},

    session: {
        currentScreen: "welcome",
        initialized: false
    }
};

function getGameState() {
    return GameState;
}
