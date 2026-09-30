const CompanyEngine = {

    randomNames: [
        "Nusantara Trading",
        "Garuda Industries",
        "Archipelago Goods",
        "Jaya Commerce",
        "Mandala Industries",
        "Cakrawala Trading",
        "Sagara Foods",
        "Merapi Industries",
        "Samudra Commerce",
        "Bumi Resources"
    ],

    generateRandomName() {
        const index = Math.floor(
            Math.random() * this.randomNames.length
        );

        return this.randomNames[index];
    },

    createCompany(companyName = null) {

        if (
            companyName !== null &&
            companyName.trim() === ""
        ) {
            throw new Error(
                "Nama perusahaan tidak boleh kosong."
            );
        }

        const finalName =
            companyName &&
            companyName.trim() !== ""
                ? companyName.trim()
                : this.generateRandomName();

        GameState.company.id =
            crypto.randomUUID();

        GameState.company.name =
            finalName;

        GameState.company.cash =
            500;

        GameState.company.level =
            1;

        GameEvents.emit(
            "company.created",
            {
                company: GameState.company
            }
        );

        return GameState.company;
    },

    renameCompany(newName) {

        if (
            !newName ||
            newName.trim() === ""
        ) {
            return {
                success: false,
                error:
                    "Nama perusahaan tidak boleh kosong."
            };
        }

        GameState.company.name =
            newName.trim();

        GameEvents.emit(
            "company.renamed",
            {
                company: GameState.company
            }
        );

        return {
            success: true,
            company: GameState.company
        };
    },

    getCompany() {
        return GameState.company;
    },

    addCash(amount) {

        if (amount <= 0) {
            return false;
        }

        GameState.company.cash += amount;

        GameEvents.emit(
            "company.cash.changed",
            {
                cash:
                    GameState.company.cash,
                amount:
                    amount,
                type:
                    "income"
            }
        );

        return true;
    },

    removeCash(amount) {

        if (amount <= 0) {
            return false;
        }

        if (
            GameState.company.cash <
            amount
        ) {
            return false;
        }

        GameState.company.cash -= amount;

        GameEvents.emit(
            "company.cash.changed",
            {
                cash:
                    GameState.company.cash,
                amount:
                    amount,
                type:
                    "expense"
            }
        );

        return true;
    },

    getCash() {
        return GameState.company.cash;
    }
};


// Backward compatibility
function createCompany(companyName = null) {
    return CompanyEngine.createCompany(
        companyName
    );
}

function addCash(amount) {
    return CompanyEngine.addCash(amount);
}

function removeCash(amount) {
    return CompanyEngine.removeCash(amount);
}

function getCash() {
    return CompanyEngine.getCash();
}
