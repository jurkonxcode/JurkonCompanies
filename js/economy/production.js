// JurkonCompanies
// Production Engine
// Version: 0.2

const ProductionEngine = {

    jobs: [],

    /*
     * ==========================================
     * DATA
     * ==========================================
     */

    getRecipe(productId) {

        if (
            !GameData.loaded
        ) {
            console.error(
                "Game data belum dimuat."
            );

            return null;
        }

        return GameData.getRecipe(
            productId
        );
    },

    getBuilding(buildingId) {

        return GameState.buildings.find(
            building =>
                building.id === buildingId
        ) || null;
    },

    getBuildingDefinition(buildingType) {

        if (
            !GameData.loaded
        ) {
            return null;
        }

        return GameData.getBuilding(
            buildingType
        );
    },


    /*
     * ==========================================
     * VALIDATION
     * ==========================================
     */

    canProduce(
        buildingId,
        productId
    ) {

        const building =
            this.getBuilding(
                buildingId
            );

        if (!building) {

            return {
                success: false,
                reason:
                    "Building tidak ditemukan."
            };
        }

        const recipe =
            this.getRecipe(
                productId
            );

        if (!recipe) {

            return {
                success: false,
                reason:
                    "Recipe tidak ditemukan."
            };
        }

        if (
            building.type !==
            recipe.building
        ) {

            return {
                success: false,
                reason:
                    "Building tidak dapat membuat produk ini."
            };
        }

        if (
            building.status !==
            "idle"
        ) {

            return {
                success: false,
                reason:
                    "Building sedang digunakan."
            };
        }

        for (
            const inputId in recipe.inputs
        ) {

            const required =
                recipe.inputs[inputId];

            if (
                !hasInventory(
                    inputId,
                    required
                )
            ) {

                return {
                    success: false,
                    reason:
                        `Inventory ${inputId} tidak cukup.`
                };
            }
        }

        return {
            success: true
        };
    },


    /*
     * ==========================================
     * MODIFIERS
     * ==========================================
     */

    getProductionModifiers(
        building,
        recipe
    ) {

        const modifiers = {

            outputMultiplier: 1,

            timeMultiplier: 1,

            efficiencyMultiplier: 1
        };


        /*
         * Beginner Boost
         */

        if (
            GameState.newPlayer
                .beginnerBoostActive === true &&

            recipe.modifiers &&

            recipe.modifiers
                .beginnerBoostEligible === true
        ) {

            modifiers.outputMultiplier *= 2;
        }


        /*
         * Building level
         */

        const definition =
            this.getBuildingDefinition(
                building.type
            );

        if (
            definition &&
            definition.production &&
            recipe.modifiers &&
            recipe.modifiers
                .buildingLevelAffectsOutput
        ) {

            const outputPerLevel =
                definition.production
                    .outputPerLevel || 0;

            const levelBonus =
                (
                    building.level - 1
                ) *
                outputPerLevel;

            modifiers.outputMultiplier *=
                1 + levelBonus;
        }


        return modifiers;
    },


    /*
     * ==========================================
     * OUTPUT CALCULATION
     * ==========================================
     */

    calculateOutput(
        building,
        recipe,
        modifiers
    ) {

        const baseQuantity =
            recipe.quantity;

        const finalQuantity =
            baseQuantity *
            modifiers.outputMultiplier;

        /*
         * Untuk sementara kita menjaga
         * quantity integer.
         *
         * Sistem fractional production
         * dapat ditambahkan nanti.
         */

        return Math.max(
            1,
            Math.floor(
                finalQuantity
            )
        );
    },


    /*
     * ==========================================
     * PRODUCTION TIME
     * ==========================================
     */

    calculateProductionTime(
        recipe,
        modifiers
    ) {

        const baseTime =
            recipe.productionTime;

        return Math.max(
            1,
            baseTime *
            modifiers.timeMultiplier
        );
    },


    /*
     * ==========================================
     * START PRODUCTION
     * ==========================================
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

        if (
            !validation.success
        ) {

            console.warn(
                validation.reason
            );

            GameEvents.emit(
                "production.failed",
                {
                    buildingId,
                    productId,
                    reason:
                        validation.reason
                }
            );

            return null;
        }


        const building =
            this.getBuilding(
                buildingId
            );

        const recipe =
            this.getRecipe(
                productId
            );


        /*
         * Ambil modifier
         */

        const modifiers =
            this.getProductionModifiers(
                building,
                recipe
            );


        /*
         * Hitung hasil
         */

        const outputQuantity =
            this.calculateOutput(
                building,
                recipe,
                modifiers
            );


        /*
         * Hitung waktu
         */

        const durationSeconds =
            this.calculateProductionTime(
                recipe,
                modifiers
            );


        /*
         * Konsumsi input
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
                    "Input produksi gagal dikonsumsi."
                );

                return null;
            }
        }


        const now =
            Date.now();


        const job = {

            id:
                crypto.randomUUID(),

            buildingId:
                buildingId,

            productId:
                productId,

            quantity:
                outputQuantity,

            startedAt:
                now,

            durationSeconds:
                durationSeconds,

            completesAt:
                now +
                durationSeconds * 1000,

            status:
                "running",

            modifiers:
                modifiers
        };


        this.jobs.push(
            job
        );


        building.status =
            "producing";

        building.production =
            job;


        GameEvents.emit(
            "production.started",
            {
                job,
                building,
                recipe
            }
        );


        console.log(
            "Production dimulai:",
            job
        );


        return job;
    },


    /*
     * ==========================================
     * COMPLETE
     * ==========================================
     */

    completeProduction(
        jobId
    ) {

        const job =
            this.jobs.find(
                item =>
                    item.id ===
                    jobId
            );

        if (!job) {
            return false;
        }

        if (
            job.status !==
            "running"
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
         * Masukkan hasil
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
         * First production
         */

        if (
            GameState.newPlayer
                .firstProductionCompleted === false
        ) {

            GameState.newPlayer
                .firstProductionCompleted =
                true;

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
                job,
                building,
                recipe
            }
        );


        console.log(
            "Production selesai:",
            job
        );


        return true;
    },


    /*
     * ==========================================
     * UPDATE
     * ==========================================
     */

    update() {

        const now =
            Date.now();

        this.jobs
            .filter(
                job =>
                    job.status ===
                    "running"
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


    /*
     * ==========================================
     * OFFLINE / RESUME
     * ==========================================
     */

    resume() {

        this.update();
    },


    /*
     * ==========================================
     * QUERIES
     * ==========================================
     */

    getJobs() {

        return this.jobs;
    },

    getRunningJobs() {

        return this.jobs.filter(
            job =>
                job.status ===
                "running"
        );
    },

    getJobForBuilding(
        buildingId
    ) {

        return this.jobs.find(
            job =>
                job.buildingId ===
                buildingId &&

                job.status ===
                "running"
        ) || null;
    },

    getRemainingSeconds(
        jobId
    ) {

        const job =
            this.jobs.find(
                item =>
                    item.id ===
                    jobId
            );

        if (!job) {
            return 0;
        }

        const remaining =
            job.completesAt -
            Date.now();

        return Math.max(
            0,
            Math.ceil(
                remaining / 1000
            )
        );
    }
};


/*
 * ==========================================
 * GLOBAL UPDATE LOOP
 * ==========================================
 */

setInterval(
    () => {

        ProductionEngine.update();

    },
    1000
);


/*
 * ==========================================
 * EVENTS
 * ==========================================
 */

GameEvents.on(
    "production.started",
    data => {

        console.log(
            `Production ${data.job.productId} dimulai.`
        );
    }
);


GameEvents.on(
    "production.completed",
    data => {

        console.log(
            `Production ${data.job.productId} selesai.`
        );
    }
);
