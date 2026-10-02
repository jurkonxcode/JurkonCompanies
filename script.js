/*
 * =====================================================
 * JURKONCOMPANIES
 * MAIN GAME CONTROLLER v0.3
 * =====================================================
 *
 * Tugas:
 * - Bootstrap game
 * - Start Journey
 * - Starter Company
 * - Screen navigation
 * - Update HUD
 * - Tutorial
 * - Map
 *
 * UI hanya membaca GameState.
 * Game logic tetap berada di engine masing-masing.
 * =====================================================
 */


/* =====================================================
   SCREEN SYSTEM
   ===================================================== */

function showScreen(screenId) {

    const screens =
        document.querySelectorAll(".screen");

    screens.forEach(screen => {

        screen.classList.remove("active");

        if (screen.id === screenId) {
            screen.classList.add("active");
        }

    });

    setCurrentScreen(screenId);

    updateAllUI();
}


/* =====================================================
   NOTIFICATION
   ===================================================== */

function showNotification(message) {

    const notification =
        document.getElementById("notification");

    if (!notification) return;

    notification.textContent = message;

    notification.classList.add("show");

    setTimeout(() => {

        notification.classList.remove("show");

    }, 2500);
}


/* =====================================================
   COMPANY UI
   ===================================================== */

function updateCompanyUI() {

    const company =
        GameState.company;

    const companyName =
        document.getElementById(
            "hqCompanyName"
        );

    const companyLevel =
        document.getElementById(
            "hqCompanyLevel"
        );

    const cash =
        document.getElementById(
            "hqCash"
        );

    if (companyName) {
        companyName.textContent =
            company.name || "Perusahaan";
    }

    if (companyLevel) {
        companyLevel.textContent =
            `Level ${company.level}`;
    }

    if (cash) {
        cash.textContent =
            `$${Number(company.cash || 0).toLocaleString()}`;
    }
}


/* =====================================================
   HQ UI
   ===================================================== */

function updateHQUI() {

    const buildingCount =
        document.getElementById(
            "buildingCount"
        );

    const inventoryCount =
        document.getElementById(
            "inventoryCount"
        );

    const playerLevel =
        document.getElementById(
            "playerLevel"
        );

    const playerExperience =
        document.getElementById(
            "playerExperience"
        );

    const experienceProgress =
        document.getElementById(
            "experienceProgress"
        );

    if (buildingCount) {

        buildingCount.textContent =
            GameState.buildings.length;
    }

    if (inventoryCount) {

        const totalInventory =
            Object.values(
                GameState.inventory
            ).reduce(
                (total, amount) =>
                    total + Number(amount || 0),
                0
            );

        inventoryCount.textContent =
            totalInventory;
    }

    if (playerLevel) {

        playerLevel.textContent =
            GameState.player.level;
    }

    if (playerExperience) {

        playerExperience.textContent =
            GameState.player.experience;
    }

    if (experienceProgress) {

        const level =
            GameState.player.level;

        const required =
            level * 100;

        const current =
            GameState.player.experience;

        const percent =
            required > 0
                ? Math.min(
                    100,
                    (current / required) * 100
                )
                : 0;

        experienceProgress.style.width =
            `${percent}%`;
    }

    updateBuildingList();
}


/* =====================================================
   BUILDING LIST
   ===================================================== */

function updateBuildingList() {

    const list =
        document.getElementById(
            "buildingList"
        );

    if (!list) return;

    list.innerHTML = "";

    GameState.buildings.forEach(
        building => {

            const item =
                document.createElement("div");

            item.className =
                "building-list-item";

            const name =
                getBuildingDisplayName(
                    building.type
                );

            item.innerHTML = `
                <strong>${name}</strong>
                <span>Level ${building.level}</span>
            `;

            list.appendChild(item);
        }
    );
}


function getBuildingDisplayName(type) {

    const names = {

        hq:
            "Headquarters",

        exchange:
            "Exchange",

        farm:
            "Farm",

        grocery_store:
            "Grocery Store"

    };

    return names[type] || type;
}


/* =====================================================
   TUTORIAL UI
   ===================================================== */

function updateTutorialUI() {

    const label =
        document.getElementById(
            "tutorialStepLabel"
        );

    const title =
        document.getElementById(
            "tutorialTitle"
        );

    const description =
        document.getElementById(
            "tutorialDescription"
        );

    const objective =
        document.getElementById(
            "tutorialObjective"
        );

    if (!label ||
        !title ||
        !description ||
        !objective) {

        return;
    }

    /*
     * TutorialEngine bisa berasal dari
     * versi lama maupun versi baru.
     */

    if (
        typeof TutorialEngine !==
        "undefined" &&
        typeof TutorialEngine.getCurrentStep ===
        "function"
    ) {

        const step =
            TutorialEngine.getCurrentStep();

        if (step) {

            label.textContent =
                step.label ||
                `Langkah ${GameState.newPlayer.tutorialStep}`;

            title.textContent =
                step.title ||
                "Tutorial";

            description.textContent =
                step.description ||
                "";

            objective.textContent =
                step.objective ||
                "";

            return;
        }
    }

    /*
     * Fallback agar UI tidak kosong
     * jika TutorialEngine lama.
     */

    label.textContent =
        "Personal Assistant";

    title.textContent =
        "Selamat datang di JurkonCompanies";

    description.textContent =
        "Personal Assistant akan membimbing perjalanan bisnis pertamamu.";

    objective.textContent =
        "Ikuti instruksi berikutnya untuk memulai.";
}


/* =====================================================
   START JOURNEY
   ===================================================== */

async function startJourney() {

    console.log(
        "================================"
    );

    console.log(
        "JURKONCOMPANIES: START JOURNEY"
    );

    console.log(
        "================================"
    );

    try {

        /*
         * Pastikan player tersedia.
         */

        if (!GameState.player.id) {

            createPlayer("Founder");

            console.log(
                "Player berhasil dibuat."
            );
        }


        /*
         * Pastikan starter company tersedia.
         */

        if (
            typeof StarterCompanyEngine !==
            "undefined"
        ) {

            const result =
                StarterCompanyEngine.create();

            console.log(
                "Starter company:",
                result
            );

        } else {

            /*
             * Fallback jika starter engine
             * belum termuat.
             */

            if (!GameState.company.id) {

                CompanyEngine.createCompany();

                createBuilding("hq");
                createBuilding("exchange");
                createBuilding("farm");
                createBuilding("grocery_store");
            }
        }


        /*
         * Beginner boost.
         */

        GameState.newPlayer
            .beginnerBoostActive = true;


        /*
         * Tandai tutorial dimulai.
         */

        GameState.newPlayer
            .tutorialStarted = true;


        /*
         * Update UI sebelum masuk tutorial.
         */

        updateAllUI();


        /*
         * Mulai Tutorial Engine.
         */

        if (
            typeof TutorialEngine !==
            "undefined" &&
            typeof TutorialEngine.start ===
            "function"
        ) {

            TutorialEngine.start();

        } else {

            /*
             * Fallback jika tutorial engine
             * belum tersedia.
             */

            showScreen("tutorialScreen");

            updateTutorialUI();
        }


        /*
         * Jika TutorialEngine tidak berpindah
         * screen sendiri, pastikan tutorial tampil.
         */

        const tutorialScreen =
            document.getElementById(
                "tutorialScreen"
            );

        if (
            tutorialScreen &&
            !tutorialScreen.classList.contains(
                "active"
            )
        ) {

            showScreen("tutorialScreen");
        }


        updateAllUI();

        showNotification(
            "Perusahaanmu berhasil dibuat."
        );

        console.log(
            "Start Journey berhasil."
        );

    } catch (error) {

        console.error(
            "START JOURNEY ERROR:",
            error
        );

        showNotification(
            "Terjadi kesalahan saat memulai perjalanan."
        );
    }
}


/* =====================================================
   TUTORIAL NEXT
   ===================================================== */

function nextTutorial() {

    try {

        if (
            typeof TutorialEngine !==
            "undefined" &&
            typeof TutorialEngine.next ===
            "function"
        ) {

            TutorialEngine.next();

            updateAllUI();

            return;
        }

        /*
         * Fallback.
         */

        const step =
            GameState.newPlayer.tutorialStep;

        GameState.newPlayer.tutorialStep =
            step + 1;

        updateTutorialUI();

    } catch (error) {

        console.error(
            "NEXT TUTORIAL ERROR:",
            error
        );
    }
}


/* =====================================================
   SKIP TUTORIAL
   ===================================================== */

function skipTutorial() {

    try {

        GameState.newPlayer
            .tutorialCompleted = true;

        GameState.newPlayer
            .onboardingCompleted = true;

        GameState.newPlayer
            .tutorialStep = 0;

        showScreen("hqScreen");

        updateAllUI();

        if (
            typeof MapRenderer !==
            "undefined"
        ) {

            MapRenderer.render();
        }

        showNotification(
            "Tutorial dilewati."
        );

    } catch (error) {

        console.error(
            "SKIP TUTORIAL ERROR:",
            error
        );
    }
}


/* =====================================================
   RENAME COMPANY
   ===================================================== */

function renameCompanyFromUI() {

    const input =
        document.getElementById(
            "companyNameInput"
        );

    if (!input) return;

    const newName =
        input.value.trim();

    if (!newName) {

        showNotification(
            "Masukkan nama perusahaan."
        );

        return;
    }

    const result =
        CompanyEngine.renameCompany(
            newName
        );

    if (!result.success) {

        showNotification(
            result.error
        );

        return;
    }

    updateAllUI();

    showNotification(
        "Nama perusahaan berhasil diubah."
    );

    showScreen("hqScreen");
}


/* =====================================================
   OLD COMPATIBILITY: createCompany
   ===================================================== */

function createCompany() {

    /*
     * Pada sistem baru perusahaan dibuat
     * otomatis saat Start Journey.
     *
     * Fungsi ini dipertahankan agar kode
     * prototype lama tidak error.
     */

    if (GameState.company.id) {

        console.log(
            "Company sudah tersedia."
        );

        return GameState.company;
    }

    return CompanyEngine.createCompany();
}


/* =====================================================
   OLD COMPATIBILITY: BUILD FARM
   ===================================================== */

function buildFarm() {

    /*
     * Farm starter sudah tersedia.
     */

    const existingFarm =
        GameState.buildings.find(
            building =>
                building.type === "farm"
        );

    if (existingFarm) {

        showNotification(
            "Farm starter sudah tersedia."
        );

        return existingFarm;
    }

    const farm =
        createBuilding("farm");

    updateAllUI();

    showNotification(
        "Farm berhasil dibuat."
    );

    return farm;
}


/* =====================================================
   TUTORIAL ACTION
   ===================================================== */

function tutorialAction() {

    try {

        if (
            typeof TutorialEngine !==
            "undefined" &&
            typeof TutorialEngine.action ===
            "function"
        ) {

            TutorialEngine.action();

            updateAllUI();

            return;
        }

        nextTutorial();

    } catch (error) {

        console.error(
            "TUTORIAL ACTION ERROR:",
            error
        );
    }
}


/* =====================================================
   UPDATE ALL UI
   ===================================================== */

function updateAllUI() {

    updateCompanyUI();

    updateHQUI();

    updateTutorialUI();

    updateWarehouseUI();

    updateExchangeUI();
}


/* =====================================================
   WAREHOUSE UI
   ===================================================== */

function updateWarehouseUI() {

    const warehouseList =
        document.getElementById(
            "warehouseList"
        );

    if (!warehouseList) return;

    warehouseList.innerHTML = "";

    const inventory =
        GameState.inventory;

    const productIds =
        Object.keys(inventory);

    if (productIds.length === 0) {

        warehouseList.innerHTML = `
            <div class="empty-state">
                Warehouse masih kosong.
            </div>
        `;

        return;
    }

    productIds.forEach(
        productId => {

            const quantity =
                inventory[productId];

            const product =
                GameData.getProduct(
                    productId
                );

            const name =
                product
                    ? product.name
                    : productId;

            const item =
                document.createElement("div");

            item.className =
                "warehouse-item";

            item.innerHTML = `
                <strong>${name}</strong>
                <span>${quantity}</span>
            `;

            warehouseList.appendChild(item);
        }
    );
}


/* =====================================================
   EXCHANGE UI
   ===================================================== */

function updateExchangeUI() {

    const exchangeList =
        document.getElementById(
            "exchangeList"
        );

    if (!exchangeList) return;

    if (
        typeof MarketEngine ===
        "undefined"
    ) {

        return;
    }

    const listings =
        MarketEngine.getActiveListings();

    exchangeList.innerHTML = "";

    if (!listings.length) {

        exchangeList.innerHTML = `
            <div class="empty-state">
                Belum ada listing aktif.
            </div>
        `;

        return;
    }

    listings.forEach(
        listing => {

            const product =
                GameData.getProduct(
                    listing.productId
                );

            const name =
                product
                    ? product.name
                    : listing.productId;

            const item =
                document.createElement("div");

            item.className =
                "exchange-item";

            item.innerHTML = `
                <strong>${name}</strong>
                <span>
                    ${listing.quantity} ×
                    $${listing.unitPrice}
                </span>
            `;

            exchangeList.appendChild(item);
        }
    );
}


/* =====================================================
   MAP
   ===================================================== */

function initializeMap() {

    if (
        typeof MapRenderer ===
        "undefined"
    ) {

        console.warn(
            "MapRenderer belum tersedia."
        );

        return;
    }

    try {

        MapRenderer.init(
            "companyMap"
        );

    } catch (error) {

        console.error(
            "MAP INIT ERROR:",
            error
        );
    }
}


/* =====================================================
   EVENT LISTENERS
   ===================================================== */

function setupGameEvents() {

    GameEvents.on(
        "company.created",
        () => {

            updateAllUI();
        }
    );


    GameEvents.on(
        "company.renamed",
        () => {

            updateAllUI();
        }
    );


    GameEvents.on(
        "company.cash.changed",
        () => {

            updateAllUI();
        }
    );


    GameEvents.on(
        "building.created",
        () => {

            updateAllUI();

            if (
                typeof MapRenderer !==
                "undefined" &&
                MapRenderer.canvas
            ) {

                MapRenderer.render();
            }
        }
    );


    GameEvents.on(
        "production.completed",
        () => {

            updateAllUI();
        }
    );


    GameEvents.on(
        "economy.purchase.completed",
        () => {

            updateAllUI();
        }
    );


    GameEvents.on(
        "economy.sale.completed",
        () => {

            updateAllUI();
        }
    );


    GameEvents.on(
        "market.purchase.completed",
        () => {

            updateAllUI();
        }
    );


    GameEvents.on(
        "market.sale.listed",
        () => {

            updateAllUI();
        }
    );

}


/* =====================================================
   DOM EVENTS
   ===================================================== */

function setupDOMEvents() {

    const startButton =
        document.getElementById(
            "startJourneyButton"
        );

    if (startButton) {

        startButton.addEventListener(
            "click",
            startJourney
        );

        console.log(
            "Start Journey button aktif."
        );

    } else {

        console.warn(
            "startJourneyButton tidak ditemukan."
        );
    }


    const nextButton =
        document.getElementById(
            "tutorialNextButton"
        );

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            nextTutorial
        );
    }


    const skipButton =
        document.getElementById(
            "skipTutorialButton"
        );

    if (skipButton) {

        skipButton.addEventListener(
            "click",
            skipTutorial
        );
    }


    const tutorialActionButton =
        document.getElementById(
            "tutorialActionButton"
        );

    if (tutorialActionButton) {

        tutorialActionButton.addEventListener(
            "click",
            tutorialAction
        );
    }


    const buildFarmButton =
        document.getElementById(
            "buildFarmButton"
        );

    if (buildFarmButton) {

        buildFarmButton.addEventListener(
            "click",
            buildFarm
        );
    }


    /*
     * Bottom navigation.
     */

    const navButtons =
        document.querySelectorAll(
            "[data-screen]"
        );

    navButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const screenId =
                        button.dataset.screen;

                    if (screenId) {

                        showScreen(
                            screenId
                        );
                    }
                }
            );
        }
    );
}


/* =====================================================
   BOOTSTRAP
   ===================================================== */

async function initializeGame() {

    console.log(
        "================================"
    );

    console.log(
        "JURKONCOMPANIES BOOT"
    );

    console.log(
        "================================"
    );


    /*
     * Load game data.
     */

    if (
        typeof GameData !==
        "undefined"
    ) {

        const loaded =
            await GameData.load();

        if (!loaded) {

            console.warn(
                "Game data gagal dimuat."
            );
        }
    }


    /*
     * Setup event system.
     */

    setupGameEvents();


    /*
     * Setup DOM buttons.
     */

    setupDOMEvents();


    /*
     * Initial UI.
     */

    updateAllUI();


    /*
     * Pastikan welcome screen
     * menjadi screen pertama.
     */

    showScreen("welcomeScreen");


    /*
     * Tandai initialized.
     */

    markInitialized();


    console.log(
        "JurkonCompanies berhasil diinisialisasi."
    );

}


/* =====================================================
   START
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeGame
);
