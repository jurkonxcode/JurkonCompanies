// JurkonCompanies
// Core Game State
// Version: 0.2

const GameState = {

    version: "0.2.0",

    // =========================
    // PLAYER
    // =========================

    player: {
        id: null,
        name: null,
        level: 1,
        experience: 0
    },


    // =========================
    // COMPANY
    // =========================

    company: {
        id: null,
        name: null,
        cash: 500,
        level: 1
    },


    // =========================
    // BUILDINGS
    // =========================

    buildings: [],


    // =========================
    // INVENTORY
    // =========================

    inventory: {},


    // =========================
    // NEW PLAYER EXPERIENCE
    // =========================

    newPlayer: {

        tutorialStarted: false,

        tutorialCompleted: false,

        tutorialStep: 0,

        firstProductionCompleted: false,

        firstPurchaseCompleted: false,

        firstSaleCompleted: false,

        firstMarketTransactionCompleted: false,

        firstQuestCompleted: false,

        beginnerBoostActive: false,

        onboardingCompleted: false
    },


    // =========================
    // REWARDS
    // =========================

    rewards: {

        received: [],

        pending: []
    },


    // =========================
    // SESSION
    // =========================

    session: {

        currentScreen: "welcome",

        initialized: false,

        lastSavedAt: null
    }

};


// =========================
// STATE ACCESS
// =========================

function getGameState() {

    return GameState;

}


// =========================
// NEW PLAYER PROGRESS
// =========================

function getNewPlayerProgress() {

    return GameState.newPlayer;

}


// =========================
// TUTORIAL PROGRESS
// =========================

function setTutorialStep(step) {

    if (step < 0) {
        return;
    }

    GameState.newPlayer.tutorialStep = step;
}


function completeTutorial() {

    GameState.newPlayer.tutorialCompleted = true;

    GameState.newPlayer.tutorialStep = 0;
}


function completeOnboarding() {

    GameState.newPlayer.onboardingCompleted = true;
}


// =========================
// SESSION
// =========================

function setCurrentScreen(screenId) {

    GameState.session.currentScreen = screenId;
}


function markInitialized() {

    GameState.session.initialized = true;

}


// =========================
// DEBUG
// =========================

function debugGameState() {

    console.log(
        "JurkonCompanies GameState:",
        GameState
    );

}
