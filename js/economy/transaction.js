// JurkonCompanies
// Financial Transaction Engine
// Version: 0.1

const TransactionEngine = {

    history: [],

    record(transaction) {

        const entry = {

            id: crypto.randomUUID(),

            type:
                transaction.type,

            category:
                transaction.category || "general",

            amount:
                transaction.amount || 0,

            productId:
                transaction.productId || null,

            quantity:
                transaction.quantity || 0,

            companyId:
                GameState.company.id,

            timestamp:
                Date.now(),

            metadata:
                transaction.metadata || {}
        };

        this.history.push(entry);

        GameEvents.emit(
            "transaction.recorded",
            {
                transaction: entry
            }
        );

        return entry;
    },

    getHistory() {

        return this.history;
    },

    getByType(type) {

        return this.history.filter(
            transaction =>
                transaction.type === type
        );
    },

    getTotalByType(type) {

        return this
            .getByType(type)
            .reduce(
                (total, transaction) =>
                    total + transaction.amount,
                0
            );
    },

    clear() {

        this.history = [];
    }
};
