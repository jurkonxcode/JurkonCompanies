// JurkonCompanies
// Economy Visual Test
// Version: 0.1

function runEconomyVisualTest() {

    const results = [];

    function pass(name, detail) {
        results.push({
            name: name,
            status: "PASS",
            detail: detail
        });
    }

    function fail(name, detail) {
        results.push({
            name: name,
            status: "FAIL",
            detail: detail
        });
    }

    try {

        // =========================
        // RESET TEST STATE
        // =========================

        GameState.company.id = "test-company";
        GameState.company.name = "Test Company";
        GameState.company.cash = 500;

        GameState.inventory = {};

        TransactionEngine.clear();


        // =========================
        // INITIAL STATE
        // =========================

        const initialCash =
            AssetEngine.getCash();

        if (initialCash === 500) {

            pass(
                "Initial Cash",
                "$500"
            );

        } else {

            fail(
                "Initial Cash",
                "$" + initialCash
            );
        }


        // =========================
        // BUY SEED
        // =========================

        const seedPurchase =
            EconomyEngine.buyProduct(
                "seed",
                1,
                20
            );

        if (seedPurchase.success) {

            pass(
                "Buy Seed",
                "1 Seed purchased for $20"
            );

        } else {

            fail(
                "Buy Seed",
                seedPurchase.error
            );
        }


        // =========================
        // BUY WATER
        // =========================

        const waterPurchase =
            EconomyEngine.buyProduct(
                "water",
                3,
                10
            );

        if (waterPurchase.success) {

            pass(
                "Buy Water",
                "3 Water purchased for $30"
            );

        } else {

            fail(
                "Buy Water",
                waterPurchase.error
            );
        }


        // =========================
        // CHECK INVENTORY
        // =========================

        const seedAmount =
            getInventory("seed");

        const waterAmount =
            getInventory("water");

        if (seedAmount === 1) {

            pass(
                "Seed Inventory",
                "1 Seed"
            );

        } else {

            fail(
                "Seed Inventory",
                seedAmount + " Seed"
            );
        }


        if (waterAmount === 3) {

            pass(
                "Water Inventory",
                "3 Water"
            );

        } else {

            fail(
                "Water Inventory",
                waterAmount + " Water"
            );
        }


        // =========================
        // CHECK CASH
        // =========================

        const finalCash =
            AssetEngine.getCash();

        if (finalCash === 450) {

            pass(
                "Cash After Purchases",
                "$450"
            );

        } else {

            fail(
                "Cash After Purchases",
                "$" + finalCash
            );
        }


        // =========================
        // CHECK TRANSACTIONS
        // =========================

        const transactions =
            TransactionEngine.getHistory();

        if (transactions.length === 2) {

            pass(
                "Transactions",
                "2 transactions recorded"
            );

        } else {

            fail(
                "Transactions",
                transactions.length +
                " transactions recorded"
            );
        }


        // =========================
        // FINANCIAL SUMMARY
        // =========================

        const summary =
            EconomyEngine.getFinancialSummary();

        if (
            summary.expenses === 50 &&
            summary.revenue === 0
        ) {

            pass(
                "Financial Summary",
                "Expenses $50 / Revenue $0"
            );

        } else {

            fail(
                "Financial Summary",
                "Expenses $" +
                summary.expenses +
                " / Revenue $" +
                summary.revenue
            );
        }


    } catch (error) {

        fail(
            "Engine Error",
            error.message
        );
    }


    // =========================
    // CREATE TEST SCREEN
    // =========================

    let existing =
        document.getElementById(
            "economy-test"
        );

    if (!existing) {

        existing =
            document.createElement("div");

        existing.id =
            "economy-test";

        document.body.appendChild(
            existing
        );
    }


    const allPassed =
        results.every(
            result =>
                result.status === "PASS"
        );


    existing.innerHTML = `

        <div style="
            max-width: 600px;
            margin: 40px auto;
            padding: 24px;
            font-family: Arial, sans-serif;
            background: #ffffff;
            color: #222222;
            border: 1px solid #dddddd;
            border-radius: 12px;
        ">

            <h1>
                JurkonCompanies
            </h1>

            <h2>
                Economy Engine Test
            </h2>

            <p>
                Version 0.1
            </p>

            <hr>

            ${results.map(result => `

                <div style="
                    padding: 12px 0;
                    border-bottom: 1px solid #eeeeee;
                ">

                    <strong>
                        ${result.status === "PASS"
                            ? "✓"
                            : "✗"}
                        ${result.name}
                    </strong>

                    <div>
                        ${result.detail}
                    </div>

                </div>

            `).join("")}

            <hr>

            <h2>
                ${
                    allPassed
                    ? "ECONOMY ENGINE: PASS"
                    : "ECONOMY ENGINE: FAIL"
                }
            </h2>

        </div>
    `;
}
