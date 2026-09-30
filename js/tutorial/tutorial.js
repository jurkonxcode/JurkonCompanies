// JurkonCompanies
// Tutorial Engine
// Version: 0.1

const TutorialEngine = {

    steps: [
        {
            id: "welcome",
            title: "Selamat datang",
            description:
                "Mari kita mulai membangun perusahaanmu.",
            objective: "Mulai perjalanan bisnis."
        },

        {
            id: "company",
            title: "Perusahaanmu",
            description:
                "Setiap bisnis dimulai dari sebuah perusahaan.",
            objective: "Buat perusahaan."
        },

        {
            id: "building",
            title: "Bangun fasilitas",
            description:
                "Perusahaan membutuhkan fasilitas untuk berproduksi.",
            objective: "Bangun fasilitas produksi."
        },

        {
            id: "production",
            title: "Produksi",
            description:
                "Gunakan fasilitasmu untuk menghasilkan produk.",
            objective: "Selesaikan produksi pertamamu."
        },

        {
            id: "inventory",
            title: "Gudang",
            description:
                "Produk yang selesai diproduksi akan masuk ke gudang.",
            objective: "Periksa inventory."
        },

        {
            id: "market",
            title: "Pasar",
            description:
                "Produk dapat dijual melalui pasar.",
            objective: "Lakukan transaksi pasar pertamamu."
        },

        {
            id: "complete",
            title: "Kamu siap!",
            description:
                "Dasar-dasar perusahaan sudah kamu pelajari.",
            objective: "Selesaikan onboarding."
        }
    ],


    start() {

        GameState.newPlayer.tutorialStarted = true;

        GameState.newPlayer.tutorialCompleted = false;

        GameState.newPlayer.tutorialStep = 0;

        console.log("Tutorial dimulai.");

        this.showCurrentStep();
    },


    getCurrentStep() {

        return this.steps[
            GameState.newPlayer.tutorialStep
        ];
    },


    showCurrentStep() {

        const step = this.getCurrentStep();

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


    canAdvance(stepId) {

        switch (stepId) {

            case "welcome":
                return true;

            case "company":
                return (
                    GameState.company.id !== null
                );

            case "building":
                return (
                    GameState.buildings.length > 0
                );

            case "production":
                return (
                    GameState.newPlayer
                        .firstProductionCompleted
                );

            case "inventory":
                return (
                    Object.keys(
                        GameState.inventory
                    ).length > 0
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


    complete() {

        GameState.newPlayer.tutorialCompleted =
            true;

        GameState.newPlayer.onboardingCompleted =
            true;

        console.log(
            "Tutorial selesai."
        );
    },


    completeFirstProduction() {

        GameState.newPlayer
            .firstProductionCompleted = true;

        console.log(
            "Tutorial: produksi pertama selesai."
        );
    },


    completeFirstMarketTransaction() {

        GameState.newPlayer
            .firstMarketTransactionCompleted = true;

        console.log(
            "Tutorial: transaksi pasar pertama selesai."
        );
    }

};
