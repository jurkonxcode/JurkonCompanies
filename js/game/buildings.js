// JurkonCompanies
// Building System
// Version: 0.1

function createBuilding(type) {
    const building = {
        id: crypto.randomUUID(),
        type: type,
        level: 1,
        status: "idle",
        production: null,
        createdAt: Date.now()
    };

    GameState.buildings.push(building);

    return building;
}

function getBuilding(buildingId) {
    return GameState.buildings.find(
        building => building.id === buildingId
    );
}

function getAllBuildings() {
    return GameState.buildings;
}
