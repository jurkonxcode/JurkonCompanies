// JurkonCompanies
// Asset System
// Version: 0.1

const AssetEngine = {

    getCash() {
        return GameState.company.cash;
    },

    addCash(amount) {

        if (amount <= 0) {
            return false;
        }

        GameState.company.cash += amount;

        return true;
    },

    removeCash(amount) {

        if (amount <= 0) {
            return false;
        }

        if (
            GameState.company.cash < amount
        ) {
            return false;
        }

        GameState.company.cash -= amount;

        return true;
    },

    getInventoryQuantity(productId) {

        return getInventory(productId);
    },

    addInventory(
        productId,
        quantity
    ) {

        if (quantity <= 0) {
            return false;
        }

        addInventory(
            productId,
            quantity
        );

        return true;
    },

    removeInventory(
        productId,
        quantity
    ) {

        if (quantity <= 0) {
            return false;
        }

        return removeInventory(
            productId,
            quantity
        );
    },

    hasInventory(
        productId,
        quantity
    ) {

        return hasInventory(
            productId,
            quantity
        );
    },

    getBuildingAssets() {

        return GameState.buildings;
    },

    getAllAssets() {

        return {

            cash: this.getCash(),

            inventory:
                GameState.inventory,

            buildings:
                GameState.buildings
        };
    }
};
