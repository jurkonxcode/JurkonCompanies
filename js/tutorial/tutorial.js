// JurkonCompanies
// Tutorial Engine
// Version: 0.2

const TutorialEngine = {

    steps: [

        {
            id: "welcome",

            title: "Selamat datang",

            description:
                "Selamat datang di JurkonCompanies. Mari kita bangun bisnis pertamamu.",

            objective:
                "Mulai perjalanan bisnis."
        },


        {
            id: "company",

            title: "Perusahaanmu",

            description:
                "Setiap bisnis dimulai dari sebuah perusahaan. Buat perusahaan pertamamu.",

            objective:
                "Buat perusahaan."
        },


        {
            id: "building",

            title: "Bangun Farm",

            description:
                "Untuk memproduksi Apple, perusahaanmu membutuhkan Farm.",

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
                "Sekarang semua bahan sudah tersedia. Jalankan produksi Apple.",

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
                "Bisnis tidak berhenti ketika barang selesai diproduksi. Sekarang jual Apple.",

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


    // =========================
    // START
    // =========================

    start() {

        GameState.newPlayer.tutorialStarted =
            true;

        GameState.newPlayer.tutorialCompleted =
            false;

        GameState.newPlayer.tutorialStep =
            0;

        console.log(
            "JurkonCompanies Tutorial dimulai."
        );

        this.showCurrentStep();
    },


    // =========================
    // CURRENT STEP
    // =========================

    getCurrentStep() {

        return this.steps[
            GameState.newPlayer.tutorialStep
        ];
    },


    // =========================
    // DISPLAY
    // =========================

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
    },


    // =========================
    // NEXT STEP
    // =========================

    nextStep() {

        const currentStep =
            this.getCurrentStep();

        if (!currentStep) {
            return;
        }

        if (
            !this.canAdvance(
                currentStep.id
            )
        ) {

            console.log(
                "Objective belum selesai."
            );

            return;
        }


        GameState.newPlayer.tutorialStep++;


        if (
            GameState.newPlayer.tutorialStep
            >= this.steps.length
        ) {

            this.complete();

            return;
        }


        this.showCurrentStep();
    },


    // =========================
    // OBJECTIVES
    // =========================

    canAdvance(stepId) {

        switch (stepId) {


            case "welcome":

                return true;


            case "company":

                return (
                    GameState.company.id !== null
                );


            case "building":

                return GameState.buildings.some(
                    building =>
                        building.type === "farm"
                );


            case "buy_seed":

                return (
                    getInventory("seed") >= 1
                );


            case "buy_water":

                return (
                    getInventory("water") >= 3
                );


            case "production":

                return (
                    GameState.newPlayer
                        .firstProductionCompleted
                );


            case "inventory":

                return (
                    getInventory("apple") >= 1
                );


            case "market":

                return (
                    GameState.newPlayer
                        .firstMarketTransactionCompleted
                );


            case "complete":

                return true;


            default:

                return false;
        }
    },


    // =========================
    // COMPLETE
    // =========================

    complete() {

        GameState.newPlayer.tutorialCompleted =
            true;

        GameState.newPlayer.onboardingCompleted =
            true;

        console.log(
            "JurkonCompanies Tutorial selesai."
        );

        GameEvents.emit(
            "tutorial.completed"
        );
    },


    // =========================
    // PRODUCTION
    // =========================

    completeFirstProduction() {

        GameState.newPlayer
            .firstProductionCompleted =
            true;

        console.log(
            "Tutorial: produksi pertama selesai."
        );
    },


    // =========================
    // MARKET
    // =========================

    completeFirstMarketTransaction() {

        GameState.newPlayer
            .firstMarketTransactionCompleted =
            true;

        console.log(
            "Tutorial: transaksi pasar pertama selesai."
        );
    }

};
