const TutorialEngine = {

    steps: [

        {
            id: "welcome",

            title: "Selamat datang",

            description:
                "Selamat datang di JurkonCompanies. Mari kita mulai membangun bisnis pertamamu.",

            objective:
                "Mulai perjalanan bisnis."
        },


        {
            id: "building",

            title: "Bangun Farm",

            description:
                "Perusahaanmu sudah siap. Sekarang kita membutuhkan Farm untuk memproduksi Apple.",

            objective:
                "Bangun satu Farm."
        },


        {
            id: "buy_seed",

            title: "Beli Seed",

            description:
                "Farm membutuhkan Seed sebagai salah satu bahan produksi.",

            objective:
                "Beli 1 Seed."
        },


        {
            id: "buy_water",

            title: "Beli Water",

            description:
                "Produksi Apple juga membutuhkan Water.",

            objective:
                "Beli 3 Water."
        },


        {
            id: "production",

            title: "Produksi Apple",

            description:
                "Semua bahan sudah tersedia. Sekarang jalankan produksi Apple pertamamu.",

            objective:
                "Selesaikan produksi Apple pertamamu."
        },


        {
            id: "inventory",

            title: "Warehouse",

            description:
                "Apple yang selesai diproduksi akan masuk ke Warehouse perusahaan.",

            objective:
                "Pastikan Apple berada di inventory."
        },


        {
            id: "market",

            title: "Jual Apple",

            description:
                "Bisnis tidak berhenti ketika barang selesai diproduksi. Sekarang jual Apple pertamamu.",

            objective:
                "Lakukan penjualan Apple pertamamu."
        },


        {
            id: "complete",

            title: "Bisnis pertamamu selesai!",

            description:
                "Kamu baru saja menyelesaikan satu siklus bisnis JurkonCompanies.",

            objective:
                "Lanjutkan mengembangkan perusahaanmu."
        }

    ],


    start() {

        GameState.newPlayer.tutorialStarted =
            true;

        GameState.newPlayer.tutorialCompleted =
            false;

        GameState.newPlayer.tutorialStep =
            0;


        /*
         * Perusahaan beginner dibuat
         * secara otomatis.
         *
         * Pemain belum diminta
         * memasukkan nama perusahaan.
         */

        if (!GameState.company.id) {

            CompanyEngine.createCompany();

            console.log(
                "Perusahaan beginner dibuat:",
                GameState.company.name
            );
        }


        console.log(
            "JurkonCompanies Tutorial dimulai."
        );


        GameEvents.emit(
            "tutorial.started",
            {
                step:
                    this.getCurrentStep()
            }
        );


        this.showCurrentStep();
    },


    getCurrentStep() {

        return this.steps[
            GameState.newPlayer.tutorialStep
        ];
    },


    getCurrentStepId() {

        const step =
            this.getCurrentStep();

        if (!step) {
            return null;
        }

        return step.id;
    },


    showCurrentStep() {

        const step =
            this.getCurrentStep();


        if (!step) {
            return;
        }


        console.log(
            `[Tutorial] ${step.title}`
        );

        console.log(
            step.description
        );

        console.log(
            `Objective: ${step.objective}`
        );


        GameEvents.emit(
            "tutorial.step.changed",
            {
                step:
                    step,

                stepIndex:
                    GameState.newPlayer
                        .tutorialStep
            }
        );
    },


    nextStep() {

        const currentStep =
            this.getCurrentStep();


        if (!currentStep) {
            return;
        }


        /*
         * Objective harus selesai
         * sebelum tutorial dapat maju.
         */

        if (
            !this.canAdvance(
                currentStep.id
            )
        ) {

            console.log(
                "Objective belum selesai."
            );

            GameEvents.emit(
                "tutorial.objective.incomplete",
                {
                    step:
                        currentStep
                }
            );

            return false;
        }


        GameState.newPlayer.tutorialStep++;


        /*
         * Semua step selesai.
         */

        if (
            GameState.newPlayer.tutorialStep
            >= this.steps.length
        ) {

            this.complete();

            return true;
        }


        this.showCurrentStep();

        return true;
    },


    canAdvance(stepId) {

        switch (stepId) {


            /*
             * STEP 1
             * Welcome
             */

            case "welcome":

                return true;


            /*
             * STEP 2
             * Farm
             */

            case "building":

                return GameState.buildings.some(
                    building =>
                        building.type === "farm"
                );


            /*
             * STEP 3
             * Seed
             */

            case "buy_seed":

                return (
                    getInventory("seed") >= 1
                );


            /*
             * STEP 4
             * Water
             */

            case "buy_water":

                return (
                    getInventory("water") >= 3
                );


            /*
             * STEP 5
             * Production
             */

            case "production":

                return (
                    GameState
                        .newPlayer
                        .firstProductionCompleted
                );


            /*
             * STEP 6
             * Warehouse
             */

            case "inventory":

                return (
                    getInventory("apple") >= 1
                );


            /*
             * STEP 7
             * Market
             */

            case "market":

                return (
                    GameState
                        .newPlayer
                        .firstMarketTransactionCompleted
                );


            /*
             * STEP 8
             * Complete
             */

            case "complete":

                return true;


            default:

                return false;
        }
    },


    complete() {

        GameState.newPlayer
            .tutorialCompleted = true;

        GameState.newPlayer
            .onboardingCompleted = true;


        /*
         * Tutorial selesai.
         *
         * Setelah ini kita nantinya
         * akan membuka fitur rename company.
         */

        console.log(
            "JurkonCompanies Tutorial selesai."
        );


        GameEvents.emit(
            "tutorial.completed",
            {
                company:
                    GameState.company
            }
        );
    },


    completeFirstProduction() {

        GameState.newPlayer
            .firstProductionCompleted = true;


        console.log(
            "Tutorial: produksi pertama selesai."
        );


        GameEvents.emit(
            "tutorial.objective.completed",
            {
                objective:
                    "first_production"
            }
        );
    },


    completeFirstMarketTransaction() {

        GameState.newPlayer
            .firstMarketTransactionCompleted = true;


        console.log(
            "Tutorial: transaksi pasar pertama selesai."
        );


        GameEvents.emit(
            "tutorial.objective.completed",
            {
                objective:
                    "first_market_transaction"
            }
        );
    },


    reset() {

        GameState.newPlayer
            .tutorialStarted = false;

        GameState.newPlayer
            .tutorialCompleted = false;

        GameState.newPlayer
            .tutorialStep = 0;

        GameState.newPlayer
            .firstProductionCompleted = false;

        GameState.newPlayer
            .firstPurchaseCompleted = false;

        GameState.newPlayer
            .firstSaleCompleted = false;

        GameState.newPlayer
            .firstMarketTransactionCompleted = false;

        console.log(
            "Tutorial di-reset."
        );
    },


    getProgress() {

        return {
            currentStep:
                GameState.newPlayer
                    .tutorialStep,

            totalSteps:
                this.steps.length,

            completed:
                GameState.newPlayer
                    .tutorialCompleted,

            currentStepId:
                this.getCurrentStepId()
        };
    }

};


/*
 * =====================================================
 * TUTORIAL EVENT LISTENERS
 * =====================================================
 */


/*
 * Farm dibuat
 */

GameEvents.on(
    "building.created",
    function (data) {

        if (
            !data ||
            !data.building
        ) {
            return;
        }


        console.log(
            "Tutorial mendeteksi building:",
            data.building.type
        );


        if (
            data.building.type === "farm"
        ) {

            GameEvents.emit(
                "tutorial.objective.completed",
                {
                    objective:
                        "farm_created",

                    building:
                        data.building
                }
            );
        }
    }
);


/*
 * Production selesai
 */

GameEvents.on(
    "production.completed",
    function (data) {

        if (
            !data ||
            !data.job
        ) {
            return;
        }


        if (
            data.job.productId === "apple"
        ) {

            TutorialEngine
                .completeFirstProduction();
        }
    }
);


/*
 * Pembelian selesai
 */

GameEvents.on(
    "economy.purchase.completed",
    function (data) {

        if (!data) {
            return;
        }


        console.log(
            "Tutorial mendeteksi pembelian:",
            data.productId,
            data.quantity
        );


        /*
         * Pembelian Seed pertama.
         */

        if (
            data.productId === "seed" &&
            data.quantity >= 1
        ) {

            GameState.newPlayer
                .firstPurchaseCompleted = true;


            GameEvents.emit(
                "tutorial.objective.completed",
                {
                    objective:
                        "seed_purchased",

                    productId:
                        data.productId,

                    quantity:
                        data.quantity
                }
            );
        }


        /*
         * Water tidak membutuhkan
         * flag khusus untuk sekarang.
         *
         * Objective diperiksa langsung
         * melalui inventory.
         */
    }
);


/*
 * Penjualan Apple selesai
 */

GameEvents.on(
    "economy.sale.completed",
    function (data) {

        if (!data) {
            return;
        }


        if (
            data.productId === "apple"
        ) {

            TutorialEngine
                .completeFirstMarketTransaction();


            GameEvents.emit(
                "tutorial.objective.completed",
                {
                    objective:
                        "apple_sold",

                    productId:
                        data.productId,

                    quantity:
                        data.quantity
                }
            );
        }
    }
);


/*
 * Tutorial selesai
 */

GameEvents.on(
    "tutorial.completed",
    function (data) {

        console.log(
            "Tutorial selesai.",
            data
        );


        /*
         * Rename company akan kita
         * sambungkan di tahap berikutnya.
         */

    }
);
