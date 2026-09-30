// JurkonCompanies
// Economy Engine Test
// Version: 0.1

function runEconomyTest() {

    console.log(
        "===== JURKON ECONOMY TEST ====="
    );

    // Reset test state
    GameState.company.id = "test-company";
    GameState.company.name = "Test Company";
    GameState.company.cash = 500;

    GameState.inventory = [];

    TransactionEngine.clear();

    console.log(
        "Initial Cash:",
        GameState.company.cash
    );


    // =========================
    // TEST 1
    // BUY SEED
    // =========================

    const seedPurchase =
        EconomyEngine.buyProduct(
            "seed",
            1,
            20
        );

    console.log(
        "Seed Purchase:",
        seedPurchase
    );


    // =========================
    // TEST 2
    // BUY WATER
    // =========================

    const waterPurchase =
        EconomyEngine.buyProduct(
            "water",
            3,
            10
        );

    console.log(
        "Water Purchase:",
        waterPurchase
    );


    // =========================
    // TEST 3
    // CHECK INVENTORY
    // =========================

    console.log(
        "Seed:",
        getInventory("seed")
    );

    console.log(
        "Water:",
        getInventory("water")
    );


    // =========================
    // TEST 4
    // CHECK CASH
    // =========================

    console.log(
        "Cash after purchases:",
        AssetEngine.getCash()
    );


    // =========================
    // TEST 5
    // FINANCIAL SUMMARY
    // =========================

    console.log(
        "Financial Summary:",
        EconomyEngine.getFinancialSummary()
    );


    console.log(
        "===== TEST COMPLETE ====="
    );
}
