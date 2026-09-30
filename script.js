/*
 * =====================================================
 * JURKONCOMPANIES
 * MAIN GAME BOOTSTRAP
 * =====================================================
 *
 * Tugas file ini:
 *
 * - Menghubungkan UI dengan Game Engine
 * - Memulai game
 * - Membuat Starter Company
 * - Memulai Tutorial
 * - Menghubungkan event game dengan UI
 *
 * UI BUKAN sumber data utama.
 * Semua data berasal dari GameState dan Game Engine.
 * =====================================================
 */


// =====================================================
// UI SCREEN
// =====================================================

function showScreen(screenId) {

    document.querySelectorAll(".screen").forEach(
        screen => {
            screen.classList.remove("active");
        }
    );

    const target =
        document.getElementById(screenId);

    if (!target) {

        console.warn(
            "Screen tidak ditemukan:",
            screenId
        );

        return;
    }

    target.classList.add("active");

    GameState.session.currentScreen =
        screenId;
}


// =====================================================
// NOTIFICATION
// =====================================================

function showNotification(message) {

    console.log(
        "[Notification]",
        message
    );

    const notification =
        document.getElementById(
            "notification"
        );

    if (!notification) {
        return;
    }

    notification.textContent =
        message;

    notification.classList.add(
        "show"
    );

    setTimeout(
        () => {

            notification.classList.remove(
                "show"
            );

        },
        2500
    );
}


// =====================================================
// UPDATE BASIC UI
// =====================================================

function updateCompanyUI() {

    const company =
        CompanyEngine.getCompany();

    const companyDisplay =
        document.getElementById(
            "companyDisplay"
        );

    if (companyDisplay) {

        companyDisplay.textContent =
            company.name || "Perusahaan";
    }


    const cashDisplay =
        document.getElementById(
            "cashDisplay"
        );

    if (cashDisplay) {

        cashDisplay.textContent =
            `$${company.cash.toLocaleString()}`;
    }
}


// =====================================================
// UPDATE HQ
// =====================================================

function updateHQUI() {

    const company =
        CompanyEngine.getCompany();

    const companyName =
        document.getElementById(
            "companyDisplay"
        );

    if (companyName) {

        companyName.textContent =
            company.name;
    }


    const cash =
        document.getElementById(
            "cashDisplay"
        );

    if (cash) {

        cash.textContent =
            `$${company.cash.toLocaleString()}`;
    }


    const level =
        document.getElementById(
            "companyLevel"
        );

    if (level) {

        level.textContent =
            company.level;
    }


    const playerLevel =
        document.getElementById(
            "playerLevel"
        );

    if (playerLevel) {

        playerLevel.textContent =
            GameState.player.level;
    }
}


// =====================================================
// UPDATE TUTORIAL UI
// =====================================================

function updateTutorialUI() {

    if (
        typeof TutorialEngine ===
        "undefined"
    ) {
        return;
    }


    const step =
        TutorialEngine.getCurrentStep();

    if (!step) {
        return;
    }


    const icon =
        document.getElementById(
            "tutorialIcon"
        );

    if (icon) {

        icon.textContent =
            step.icon || "🏢";
    }


    const title =
        document.getElementById(
            "tutorialTitle"
        );

    if (title) {

        title.textContent =
            step.title;
    }


    const text =
        document.getElementById(
            "tutorialText"
        );

    if (text) {

        text.textContent =
            step.description;
    }


    const objective =
        document.getElementById(
            "tutorialObjective"
        );

    if (objective) {

        objective.textContent =
            step.objective;
    }


    const progress =
        document.getElementById(
            "tutorialStep"
        );

    if (progress) {

        const progressData =
            TutorialEngine.getProgress();

        progress.textContent =
            `${progressData.currentStep + 1} / ${progressData.totalSteps}`;
    }
}


// =====================================================
// MULAI PERJALANAN
// =====================================================

function startJourney() {

    console.log(
        "================================"
    );

    console.log(
        "JURKONCOMPANIES START"
    );

    console.log(
        "Memulai perjalanan perusahaan..."
    );


    try {

        // -------------------------------------------------
        // 1. Buat PLAYER
        // -------------------------------------------------

        if (
            !GameState.player.id
        ) {

            createPlayer(
                "Founder"
            );

            console.log(
                "Player dibuat:",
                GameState.player
            );
        }


        // -------------------------------------------------
        // 2. Buat STARTER COMPANY
        // -------------------------------------------------

        if (
            typeof StarterCompanyEngine ===
            "undefined"
        ) {

            throw new Error(
                "StarterCompanyEngine belum tersedia."
            );
        }


        const starterResult =
            StarterCompanyEngine.create();


        if (
            !starterResult.success
        ) {

            throw new Error(
                "Gagal membuat Starter Company."
            );
        }


        console.log(
            "Starter Company siap:",
            starterResult
        );


        // -------------------------------------------------
        // 3. Update UI
        // -------------------------------------------------

        updateCompanyUI();

        updateHQUI();


        // -------------------------------------------------
        // 4. Mulai Tutorial
        // -------------------------------------------------

        if (
            typeof TutorialEngine !==
            "undefined"
        ) {

            TutorialEngine.start();

        } else {

            console.warn(
                "TutorialEngine tidak ditemukan."
            );

            showScreen("hq");
        }


        console.log(
            "================================"
        );

    } catch (error) {

        console.error(
            "Gagal memulai JurkonCompanies:",
            error
        );

        alert(
            "Game gagal dimulai. Buka Console untuk melihat detail error."
        );
    }
}


// =====================================================
// TUTORIAL NEXT
// =====================================================

function nextTutorial() {

    if (
        typeof TutorialEngine ===
        "undefined"
    ) {
        return;
    }


    const result =
        TutorialEngine.nextStep();


    if (result === false) {

        showNotification(
            "Selesaikan objective terlebih dahulu."
        );

        return;
    }


    updateTutorialUI();

    updateCompanyUI();

    updateHQUI();


    const currentStepId =
        TutorialEngine.getCurrentStepId();


    // -------------------------------------------------
    // Tutorial selesai
    // -------------------------------------------------

    if (
        GameState.newPlayer
            .tutorialCompleted
    ) {

        showNotification(
            "Tutorial selesai. Selamat membangun perusahaan!"
        );

        updateHQUI();

        showScreen("hq");

        return;
    }


    // -------------------------------------------------
    // Tetap di tutorial
    // -------------------------------------------------

    showScreen("tutorial");

    console.log(
        "Tutorial step:",
        currentStepId
    );
}


// =====================================================
// SKIP TUTORIAL
// =====================================================
//
// Untuk sekarang hanya digunakan sebagai compatibility.
// Nantinya beginner tutorial dapat dibuat tidak bisa
// dilewati sampai milestone tertentu.
// =====================================================

function skipTutorial() {

    console.log(
        "Tutorial skip diminta."
    );

    if (
        typeof TutorialEngine !==
        "undefined"
    ) {

        TutorialEngine.complete();
    }

    updateCompanyUI();

    updateHQUI();

    showScreen("hq");
}


// =====================================================
// CREATE COMPANY — COMPATIBILITY
// =====================================================
//
// Form nama perusahaan tidak lagi digunakan pada awal
// onboarding.
//
// Fungsi ini dipertahankan agar HTML lama tidak error.
// Pada versi berikutnya fungsi ini akan digunakan untuk
// rename company setelah tutorial.
// =====================================================

function createCompany() {

    const input =
        document.getElementById(
            "companyName"
        );


    if (!input) {

        showScreen("hq");

        return;
    }


    const name =
        input.value.trim();


    if (!name) {

        alert(
            "Nama perusahaan tidak boleh kosong."
        );

        return;
    }


    const result =
        CompanyEngine.renameCompany(
            name
        );


    if (!result.success) {

        alert(
            result.error
        );

        return;
    }


    updateCompanyUI();

    updateHQUI();

    showScreen("hq");
}


// =====================================================
// BUILD FARM — COMPATIBILITY / DEBUG
// =====================================================
//
// Farm sebenarnya sudah dibuat oleh Starter Company.
// Fungsi ini tetap ada untuk sementara karena UI lama
// masih mungkin mempunyai tombol Build Farm.
// =====================================================

function buildFarm() {

    const existingFarm =
        GameState.buildings.find(
            building =>
                building.type === "farm"
        );


    if (existingFarm) {

        showNotification(
            "Farm sudah tersedia."
        );

        return existingFarm;
    }


    const farm =
        createBuilding(
            "farm"
        );


    showNotification(
        "Farm berhasil dibuat."
    );


    updateHQUI();

    return farm;
}


// =====================================================
// TUTORIAL ACTION
// =====================================================
//
// Digunakan oleh tombol utama tutorial.
// Untuk sekarang action akan mengikuti step yang sedang
// aktif. Engine tutorial tetap menjadi sumber kebenaran.
// =====================================================

function tutorialAction() {

    if (
        typeof TutorialEngine ===
        "undefined"
    ) {
        return;
    }


    const stepId =
        TutorialEngine.getCurrentStepId();


    console.log(
        "Tutorial action:",
        stepId
    );


    switch (stepId) {

        case "welcome":

            nextTutorial();

            break;


        case "building":

            if (
                GameState.buildings.some(
                    building =>
                        building.type === "farm"
                )
            ) {

                nextTutorial();

            } else {

                buildFarm();
            }

            break;


        case "buy_seed":

            showScreen("exchange");

            showNotification(
                "Beli Seed melalui Exchange."
            );

            break;


        case "buy_water":

            showScreen("exchange");

            showNotification(
                "Beli Water melalui Exchange."
            );

            break;


        case "production":

            showScreen("hq");

            showNotification(
                "Jalankan produksi Apple di Farm."
            );

            break;


        case "inventory":

            showScreen("warehouse");

            break;


        case "market":

            showScreen("exchange");

            break;


        case "complete":

            showScreen("hq");

            break;


        default:

            nextTutorial();

            break;
    }
}


// =====================================================
// PRODUCTION EVENTS
// =====================================================

GameEvents.on(
    "production.started",
    data => {

        if (!data || !data.job) {
            return;
        }


        const product =
            GameData.getProduct(
                data.job.productId
            );


        const name =
            product
                ? product.name
                : data.job.productId;


        showNotification(
            `${name} sedang diproduksi.`
        );


        updateHQUI();
    }
);


GameEvents.on(
    "production.completed",
    data => {

        if (!data || !data.job) {
            return;
        }


        const product =
            GameData.getProduct(
                data.job.productId
            );


        const name =
            product
                ? product.name
                : data.job.productId;


        showNotification(
            `Produksi selesai: ${name} × ${data.job.quantity}`
        );


        updateHQUI();

        updateTutorialUI();
    }
);


// =====================================================
// STARTER COMPANY EVENT
// =====================================================

GameEvents.on(
    "starter.company.created",
    data => {

        console.log(
            "Starter Company Event:",
            data
        );


        updateCompanyUI();

        updateHQUI();
    }
);


// =====================================================
// COMPANY CASH EVENT
// =====================================================

GameEvents.on(
    "company.cash.changed",
    data => {

        console.log(
            "Cash berubah:",
            data
        );


        updateCompanyUI();

        updateHQUI();
    }
);


// =====================================================
// MARKET EVENTS
// =====================================================

GameEvents.on(
    "economy.purchase.completed",
    data => {

        console.log(
            "Purchase:",
            data
        );


        updateCompanyUI();

        updateHQUI();

        updateTutorialUI();
    }
);


GameEvents.on(
    "economy.sale.completed",
    data => {

        console.log(
            "Sale:",
            data
        );


        updateCompanyUI();

        updateHQUI();

        updateTutorialUI();
    }
);


GameEvents.on(
    "market.purchase.completed",
    data => {

        console.log(
            "Market purchase:",
            data
        );


        updateCompanyUI();

        updateHQUI();

        updateTutorialUI();
    }
);


// =====================================================
// TUTORIAL EVENTS
// =====================================================

GameEvents.on(
    "tutorial.started",
    data => {

        console.log(
            "Tutorial started:",
            data
        );


        updateTutorialUI();

        showScreen(
            "tutorial"
        );
    }
);


GameEvents.on(
    "tutorial.step.changed",
    data => {

        console.log(
            "Tutorial step changed:",
            data
        );


        updateTutorialUI();
    }
);


GameEvents.on(
    "tutorial.objective.completed",
    data => {

        console.log(
            "Tutorial objective completed:",
            data
        );


        updateTutorialUI();
    }
);


GameEvents.on(
    "tutorial.completed",
    data => {

        console.log(
            "================================"
        );

        console.log(
            "TUTORIAL SELESAI"
        );

        console.log(
            data
        );

        console.log(
            "================================"
        );


        updateCompanyUI();

        updateHQUI();


        showNotification(
            "Tutorial selesai!"
        );
    }
);


// =====================================================
// DOM READY
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "JurkonCompanies DOM siap."
        );


        // -------------------------------------------------
        // Load Game Data
        // -------------------------------------------------

        if (
            typeof GameData !==
            "undefined"
        ) {

            await GameData.load();

        } else {

            console.error(
                "GameData tidak ditemukan."
            );
        }


        // -------------------------------------------------
        // Tombol Mulai Perjalanan
        // -------------------------------------------------

        const startButton =
            document.getElementById(
                "startButton"
            );


        if (startButton) {

            startButton.addEventListener(
                "click",
                startJourney
            );

            console.log(
                "Start button siap."
            );

        } else {

            console.warn(
                "startButton tidak ditemukan."
            );
        }


        // -------------------------------------------------
        // Tombol Tutorial Next
        // -------------------------------------------------

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


        // -------------------------------------------------
        // Tombol Tutorial Action
        // -------------------------------------------------

        const actionButton =
            document.getElementById(
                "tutorialActionButton"
            );


        if (actionButton) {

            actionButton.addEventListener(
                "click",
                tutorialAction
            );
        }


        // -------------------------------------------------
        // Tombol Skip Tutorial
        // -------------------------------------------------

        const skipButton =
            document.getElementById(
                "skipTutorial"
            );


        if (skipButton) {

            skipButton.addEventListener(
                "click",
                skipTutorial
            );
        }


        // -------------------------------------------------
        // Initial UI
        // -------------------------------------------------

        updateCompanyUI();

        updateHQUI();

        updateTutorialUI();


        // -------------------------------------------------
        // Pastikan Welcome tampil
        // -------------------------------------------------

        if (
            !GameState.company.id
        ) {

            showScreen(
                "welcome"
            );

        } else {

            showScreen(
                "hq"
            );
        }


        // -------------------------------------------------
        // Game Initialized
        // -------------------------------------------------

        markInitialized();


        console.log(
            "================================"
        );

        console.log(
            "JURKONCOMPANIES READY"
        );

        console.log(
            "GameState:",
            GameState
        );

        console.log(
            "================================"
        );
    }
);
