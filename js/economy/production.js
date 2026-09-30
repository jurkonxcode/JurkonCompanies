// JurkonCompanies
// Production Engine
// Version: 0.1

const ProductionEngine = {

    jobs: [],

    /**
     * Ambil recipe berdasarkan product ID.
     * Untuk sementara recipe berasal dari window.GameRecipes
     * yang nanti akan di-load dari data/recipes.json.
     */
    getRecipe(productId) {

        if (
            typeof GameRecipes === "undefined" ||
            !GameRecipes[productId]
        ) {
            console.error(
                `Recipe tidak ditemukan: ${productId}`
            );

            return null;
        }

        return GameRecipes[productId];
    },

    /**
     * Cari building berdasarkan ID.
     */
    getBuilding(buildingId) {

        if (
            typeof getBuilding !== "function"
        ) {
            console.error(
                "Building system belum tersedia."
            );

            return null;
        }

        return getBuilding(buildingId);
    },

    /**
     * Memeriksa apakah building dapat melakukan produksi.
     */
    canProduce(buildingId, productId) {

        const building =
            this.getBuilding(buildingId);

        if (!building) {
            return {
                success: false,
                reason: "Building tidak ditemukan."
            };
        }

        const recipe =
            this.getRecipe(productId);

        if (!recipe) {
            return {
                success: false,
                reason: "Recipe tidak ditemukan."
            };
        }

        if (
            building.type !== recipe.building
        ) {
            return {
                success: false,
                reason:
                    "Building tidak dapat membuat produk ini."
            };
        }

        if (
            building.status !== "idle"
        ) {
            return {
                success: false,
                reason:
                    "Building sedang digunakan."
            };
        }

        for (
            const productId in recipe.inputs
        ) {

            const required =
                recipe.inputs[productId];

            if (
                !hasInventory(
                    productId,
                    required
                )
            ) {
                return {
                    success: false,
                    reason:
                        `Inventory ${productId} tidak cukup.`
                };
            }
        }

        return {
            success: true
        };
    },

    /**
     * Memulai production job.
     */
    startProduction(
        buildingId,
        productId
    ) {

        const validation =
            this.canProduce(
                buildingId,
                productId
            );

        if (!validation.success) {

            console.warn(
                validation.reason
            );

            return null;
        }

        const building =
            this.getBuilding(buildingId);

        const recipe =
            this.getRecipe(productId);

        /*
         * Konsumsi semua input
         * sebelum job dimulai.
         */
        for (
            const inputId in recipe.inputs
        ) {

            const quantity =
                recipe.inputs[inputId];

            const removed =
                removeInventory(
                    inputId,
                    quantity
                );

            if (!removed) {

                console.error(
                    "Gagal mengonsumsi input produksi."
                );

                return null;
            }
        }

        const now =
            Date.now();

        const duration =
            recipe.productionTime * 1000;

        const job = {

            id:
                crypto.randomUUID(),

            buildingId:
                buildingId,

            productId:
                productId,

            quantity:
                recipe.quantity,

            startedAt:
                now,

            completesAt:
                now + duration,

            status:
                "running"
        };

        this.jobs.push(job);

        building.status =
            "producing";

        building.production =
            job;

        GameEvents.emit(
            "production.started",
            {
                job: job,
                building: building,
                recipe: recipe
            }
        );

        console.log(
            "Production dimulai:",
            job
        );

        return job;
    },

    /**
     * Menyelesaikan production job.
     */
    completeProduction(jobId) {

        const job =
            this.jobs.find(
                item =>
                    item.id === jobId
            );

        if (!job) {
            return false;
        }

        if (
            job.status !== "running"
        ) {
            return false;
        }

        const building =
            this.getBuilding(
                job.buildingId
            );

        if (!building) {
            return false;
        }

        const recipe =
            this.getRecipe(
                job.productId
            );

        if (!recipe) {
            return false;
        }

        /*
         * Masukkan hasil produksi
         * ke inventory.
         */
        addInventory(
            job.productId,
            job.quantity
        );

        job.status =
            "completed";

        job.completedAt =
            Date.now();

        building.status =
            "idle";

        building.production =
            null;

        /*
         * Tandai produksi pertama
         * untuk onboarding.
         */
        if (
            GameState.newPlayer
                .firstProductionCompleted === false
        ) {

            GameState.newPlayer
                .firstProductionCompleted = true;

            if (
                typeof TutorialEngine !==
                "undefined"
            ) {

                TutorialEngine
                    .completeFirstProduction();
            }
        }

        GameEvents.emit(
            "production.completed",
            {
                job: job,
                building: building,
                recipe: recipe
            }
        );

        console.log(
            "Production selesai:",
            job
        );

        return true;
    },

    /**
     * Memeriksa semua production job.
     *
     * Nanti fungsi ini akan menjadi
     * fondasi offline/background simulation.
     */
    update() {

        const now =
            Date.now();

        this.jobs
            .filter(
                job =>
                    job.status === "running"
            )
            .forEach(
                job => {

                    if (
                        now >=
                        job.completesAt
                    ) {

                        this.completeProduction(
                            job.id
                        );
                    }
                }
            );
    },

    /**
     * Ambil semua job produksi.
     */
    getJobs() {

        return this.jobs;
    },

    /**
     * Ambil job berdasarkan building.
     */
    getJobForBuilding(
        buildingId
    ) {

        return this.jobs.find(
            job =>
                job.buildingId ===
                buildingId &&
                job.status === "running"
        );
    }
};
