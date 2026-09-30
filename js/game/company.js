
// JurkonCompanies
// Company System
// Version: 0.1

function createCompany(companyName) {
    if (!companyName || companyName.trim() === "") {
        throw new Error("Nama perusahaan tidak boleh kosong.");
    }

    GameState.company.id = crypto.randomUUID();
    GameState.company.name = companyName.trim();
    GameState.company.cash = 500;
    GameState.company.level = 1;

    return GameState.company;
}

function addCash(amount) {
    GameState.company.cash += amount;
}

function removeCash(amount) {
    if (amount <= 0) return true;

    if (GameState.company.cash < amount) {
        return false;
    }

    GameState.company.cash -= amount;

    return true;
}

function getCash() {
    return GameState.company.cash;
}
