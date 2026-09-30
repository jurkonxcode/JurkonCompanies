/*
 * =====================================================
 * JURKONCOMPANIES
 * STARTER COMPANY ENGINE
 * =====================================================
 *
 * Bertanggung jawab membuat kondisi awal
 * perusahaan pemain baru.
 *
 * Starter setup:
 *
 * $500 Cash
 * HQ
 * Exchange
 * Farm
 * Grocery Store
 *
 * Nama perusahaan dibuat otomatis.
 * Pemain akan menggantinya setelah tutorial.
 * =====================================================
 */


const StarterCompanyEngine = {


    /*
     * -------------------------------------------------
     * STARTER CASH
     * -------------------------------------------------
     */

    startingCash: 500,


    /*
     * -------------------------------------------------
     * STARTER BUILDINGS
     * -------------------------------------------------
     */

    startingBuildings: [
        {
            type: "hq"
        },

        {
            type: "exchange"
        },

        {
            type: "farm"
        },

        {
            type: "grocery_store"
        }
    ],


    /*
     * -------------------------------------------------
     * RANDOM COMPANY NAME
     * -------------------------------------------------
     */

    companyNames: [

        "Nusantara Trading",

        "Garuda Industries",

        "Cakrawala Commerce",

        "Samudra Trading",

        "Mandala Industries",

        "Archipelago Goods",

        "Sagara Commerce",

        "Bumi Industries",

        "Jaya Trading",

        "Merapi Commerce"

    ],


    /*
     * -------------------------------------------------
     * GENERATE COMPANY NAME
     * -------------------------------------------------
     */

    generateCompanyName() {

        const index =
            Math.floor(
                Math.random() *
                this.companyNames.length
            );


        return this.companyNames[index];
    },


    /*
     * -------------------------------------------------
     * CREATE STARTER COMPANY
     * -------------------------------------------------
     */

    create() {

        /*
         * Jangan membuat starter company
         * dua kali pada session yang sama.
         */

        if (
            GameState.company.id !== null
        ) {

            console.warn(
                "Starter company sudah tersedia."
            );

            return {
                success: true,
                existing: true,
                company:
                    GameState.company
            };
        }


        /*
         * -------------------------------------------------
         * COMPANY
         * -------------------------------------------------
         */

        const companyName =
            this.generateCompanyName();


        CompanyEngine.createCompany(
            companyName
        );


        /*
         * Pastikan cash sesuai
         * starter setup.
         */

        GameState.company.cash =
            this.startingCash;


        GameState.company.level =
            1;


        /*
         * -------------------------------------------------
         * BUILDINGS
         * -------------------------------------------------
         *
         * Starter buildings dibuat
         * langsung tanpa biaya konstruksi.
         */

        this.createStarterBuildings();


        /*
         * -------------------------------------------------
         * STARTER FLAGS
         * -------------------------------------------------
         */

        GameState.newPlayer
            .tutorialStarted = false;

        GameState.newPlayer
            .tutorialCompleted = false;

        GameState.newPlayer
            .tutorialStep = 0;

        GameState.newPlayer
            .onboardingCompleted = false;


        /*
         * -------------------------------------------------
         * EVENT
         * -------------------------------------------------
         */

        GameEvents.emit(
            "starter.company.created",
            {
                company:
                    GameState.company,

                buildings:
                    GameState.buildings,

                cash:
                    GameState.company.cash
            }
        );


        console.log(
            "================================"
        );

        console.log(
            "JURKON STARTER COMPANY"
        );

        console.log(
            "Company:",
            GameState.company.name
        );

        console.log(
            "Cash:",
            GameState.company.cash
        );

        console.log(
            "Buildings:",
            GameState.buildings
        );

        console.log(
            "================================"
        );


        return {
            success: true,
            existing: false,
            company:
                GameState.company,
            buildings:
                GameState.buildings,
            cash:
                GameState.company.cash
        };
    },


    /*
     * -------------------------------------------------
     * CREATE STARTER BUILDINGS
     * -------------------------------------------------
     */

    createStarterBuildings() {

        this.startingBuildings.forEach(
            buildingData => {

                const building =
                    createBuilding(
                        buildingData.type
                    );


                /*
                 * Tandai sebagai
                 * starter building.
                 */

                building.isStarterBuilding =
                    true;


                /*
                 * Starter building
                 * langsung aktif.
                 */

                building.status =
                    "idle";


                /*
                 * HQ dan Exchange bukan
                 * production buildings.
                 */

                if (
                    buildingData.type === "hq"
                ) {

                    building.category =
                        "headquarters";
                }


                if (
                    buildingData.type === "exchange"
                ) {

                    building.category =
                        "market";
                }


                if (
                    buildingData.type === "farm"
                ) {

                    building.category =
                        "production";
                }


                if (
                    buildingData.type ===
                    "grocery_store"
                ) {

                    building.category =
                        "retail";
                }


                GameEvents.emit(
                    "starter.building.created",
                    {
                        building:
                            building
                    }
                );
            }
        );
    },


    /*
     * -------------------------------------------------
     * CHECK STARTER COMPANY
     * -------------------------------------------------
     */

    exists() {

        return (
            GameState.company.id !== null
        );
    },


    /*
     * -------------------------------------------------
     * GET STARTER BUILDINGS
     * -------------------------------------------------
     */

    getStarterBuildings() {

        return GameState.buildings.filter(
            building =>
                building.isStarterBuilding === true
        );
    },


    /*
     * -------------------------------------------------
     * RESET STARTER STATE
     * -------------------------------------------------
     *
     * Hanya digunakan untuk development/testing.
     * Jangan dipakai oleh pemain normal.
     * -------------------------------------------------
     */

    resetForTesting() {

        GameState.company.id = null;

        GameState.company.name = null;

        GameState.company.cash =
            0;

        GameState.company.level =
            1;


        GameState.buildings = [];


        GameState.inventory = {};


        GameState.newPlayer
            .tutorialStarted = false;

        GameState.newPlayer
            .tutorialCompleted = false;

        GameState.newPlayer
            .tutorialStep = 0;

        GameState.newPlayer
            .firstProductionCompleted =
                false;

        GameState.newPlayer
            .firstPurchaseCompleted =
                false;

        GameState.newPlayer
            .firstSaleCompleted =
                false;

        GameState.newPlayer
            .firstMarketTransactionCompleted =
                false;

        GameState.newPlayer
            .onboardingCompleted =
                false;


        console.log(
            "Starter company state di-reset."
        );
    },


    /*
     * -------------------------------------------------
     * DEBUG
     * -------------------------------------------------
     */

    debug() {

        console.log(
            "===== STARTER COMPANY ====="
        );

        console.log(
            "Exists:",
            this.exists()
        );

        console.log(
            "Company:",
            GameState.company
        );

        console.log(
            "Buildings:",
            this.getStarterBuildings()
        );

        console.log(
            "Cash:",
            GameState.company.cash
        );

        console.log(
            "==========================="
        );
    }

};
