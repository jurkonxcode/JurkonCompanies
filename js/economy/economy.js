// JurkonCompanies
// Economy Orchestrator
// Version: 0.1

const EconomyEngine = {

    // =========================
    // BUY PRODUCT
    // =========================

    buyProduct(productId, quantity, unitPrice) {

        if (!productId) {
            return {
                success: false,
                error: "Product ID tidak valid."
            };
        }

        if (quantity <= 0) {
            return {
                success: false,
                error: "Quantity harus lebih dari 0."
            };
        }

        if (unitPrice <= 0) {
            return {
                success: false,
                error: "Harga harus lebih dari 0."
            };
        }

        const totalCost =
            quantity * unitPrice;

        // Cek cash
        if (
            !AssetEngine.removeCash(
                totalCost
            )
        ) {
            return {
                success: false,
                error: "Cash tidak mencukupi."
            };
        }

        // Masukkan barang ke inventory
        AssetEngine.addInventory(
            productId,
            quantity
        );

        // Catat transaksi
        const transaction =
            TransactionEngine.record({

                type: "purchase",

                category: "inventory",

                amount: totalCost,

                productId: productId,

                quantity: quantity,

                metadata: {
                    unitPrice: unitPrice
                }
            });

        GameEvents.emit(
            "economy.purchase.completed",
            {
                productId: productId,
                quantity: quantity,
                unitPrice: unitPrice,
                totalCost: totalCost,
                transaction: transaction
            }
        );

        return {
            success: true,
            productId: productId,
            quantity: quantity,
            unitPrice: unitPrice,
            totalCost: totalCost,
            transaction: transaction
        };
    },


    // =========================
    // SELL PRODUCT
    // =========================

    sellProduct(
        productId,
        quantity,
        unitPrice
    ) {

        if (!productId) {
            return {
                success: false,
                error: "Product ID tidak valid."
            };
        }

        if (quantity <= 0) {
            return {
                success: false,
                error: "Quantity harus lebih dari 0."
            };
        }

        if (unitPrice <= 0) {
            return {
                success: false,
                error: "Harga harus lebih dari 0."
            };
        }

        // Cek inventory
        if (
            !AssetEngine.hasInventory(
                productId,
                quantity
            )
        ) {
            return {
                success: false,
                error: "Inventory tidak mencukupi."
            };
        }

        // Ambil barang
        if (
            !AssetEngine.removeInventory(
                productId,
                quantity
            )
        ) {
            return {
                success: false,
                error: "Gagal mengambil inventory."
            };
        }

        const totalRevenue =
            quantity * unitPrice;

        // Cash hasil penjualan
        AssetEngine.addCash(
            totalRevenue
        );

        // Catat transaksi
        const transaction =
            TransactionEngine.record({

                type: "sale",

                category: "revenue",

                amount: totalRevenue,

                productId: productId,

                quantity: quantity,

                metadata: {
                    unitPrice: unitPrice
                }
            });

        GameEvents.emit(
            "economy.sale.completed",
            {
                productId: productId,
                quantity: quantity,
                unitPrice: unitPrice,
                totalRevenue: totalRevenue,
                transaction: transaction
            }
        );

        return {
            success: true,
            productId: productId,
            quantity: quantity,
            unitPrice: unitPrice,
            totalRevenue: totalRevenue,
            transaction: transaction
        };
    },


    // =========================
    // GET FINANCIAL SUMMARY
    // =========================

    getFinancialSummary() {

        const transactions =
            TransactionEngine.getHistory();

        let revenue = 0;
        let expenses = 0;

        transactions.forEach(
            transaction => {

                if (
                    transaction.category ===
                    "revenue"
                ) {
                    revenue +=
                        transaction.amount;
                }

                if (
                    transaction.category ===
                    "inventory"
                ) {
                    expenses +=
                        transaction.amount;
                }
            }
        );

        return {

            cash:
                AssetEngine.getCash(),

            revenue:
                revenue,

            expenses:
                expenses,

            profit:
                revenue - expenses
        };
    },


    // =========================
    // DEBUG
    // =========================

    debug() {

        console.log(
            "===== JURKON ECONOMY ====="
        );

        console.log(
            "Cash:",
            AssetEngine.getCash()
        );

        console.log(
            "Inventory:",
            GameState.inventory
        );

        console.log(
            "Transactions:",
            TransactionEngine.getHistory()
        );

        console.log(
            "Financial Summary:",
            this.getFinancialSummary()
        );

        console.log(
            "=========================="
        );
    }
};
