// JurkonCompanies
// Game Data Loader
// Version: 0.1

const GameData = {

    products: {},
    buildings: {},
    recipes: {},

    loaded: false,

    async load() {

        try {

            const [
                productsResponse,
                buildingsResponse,
                recipesResponse
            ] = await Promise.all([

                fetch("data/products.json"),
                fetch("data/buildings.json"),
                fetch("data/recipes.json")

            ]);

            if (!productsResponse.ok) {
                throw new Error(
                    "Gagal memuat products.json"
                );
            }

            if (!buildingsResponse.ok) {
                throw new Error(
                    "Gagal memuat buildings.json"
                );
            }

            if (!recipesResponse.ok) {
                throw new Error(
                    "Gagal memuat recipes.json"
                );
            }

            this.products =
                await productsResponse.json();

            this.buildings =
                await buildingsResponse.json();

            this.recipes =
                await recipesResponse.json();

            this.loaded = true;

            GameEvents.emit(
                "data.loaded",
                {
                    products: this.products,
                    buildings: this.buildings,
                    recipes: this.recipes
                }
            );

            console.log(
                "JurkonCompanies game data berhasil dimuat."
            );

            return true;

        } catch (error) {

            console.error(
                "Game data gagal dimuat:",
                error
            );

            this.loaded = false;

            return false;
        }
    },

    getProduct(productId) {
        return this.products[productId] || null;
    },

    getBuilding(buildingType) {
        return this.buildings[buildingType] || null;
    },

    getRecipe(productId) {
        return this.recipes[productId] || null;
    }
};
