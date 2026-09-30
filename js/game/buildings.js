// JurkonCompanies
// Building System
// Version: 0.2

function createBuilding(type) {

    if (!type || type.trim() === "") {

        throw new Error(
            "Tipe building tidak boleh kosong."
        );

    }


    const building = {

        id: crypto.randomUUID(),

        type: type,

        level: 1,

        status: "idle",

        production: null,

        createdAt: Date.now()

    };


    GameState.buildings.push(building);


    // ==========================================
    // EVENT
    // ==========================================

    GameEvents.emit(
        "building.created",
        {
            building: building
        }
    );


    return building;

}


function getBuilding(buildingId) {

    return GameState.buildings.find(
        building =>
            building.id === buildingId
    );

}


function getAllBuildings() {

    return GameState.buildings;

}
