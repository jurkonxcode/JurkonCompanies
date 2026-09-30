// JurkonCompanies
// Inventory System
// Version: 0.1

function getInventory(productId) {
    return GameState.inventory[productId] || 0;
}

function addInventory(productId, quantity) {
    if (quantity <= 0) return;

    if (!GameState.inventory[productId]) {
        GameState.inventory[productId] = 0;
    }

    GameState.inventory[productId] += quantity;
}

function removeInventory(productId, quantity) {
    if (quantity <= 0) return false;

    const currentAmount = getInventory(productId);

    if (currentAmount < quantity) {
        return false;
    }

    GameState.inventory[productId] -= quantity;

    return true;
}

function hasInventory(productId, quantity) {
    return getInventory(productId) >= quantity;
}
