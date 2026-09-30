// JurkonCompanies
// Player System
// Version: 0.1

function createPlayer(name) {
    GameState.player.id = crypto.randomUUID();
    GameState.player.name = name;
    GameState.player.level = 1;
    GameState.player.experience = 0;

    return GameState.player;
}

function addExperience(amount) {
    if (amount <= 0) return;

    GameState.player.experience += amount;

    checkPlayerLevel();
}

function checkPlayerLevel() {
    const requiredExperience = GameState.player.level * 100;

    while (GameState.player.experience >= requiredExperience) {
        GameState.player.experience -= requiredExperience;
        GameState.player.level++;

        console.log(
            `Player naik ke level ${GameState.player.level}`
        );
    }
}
