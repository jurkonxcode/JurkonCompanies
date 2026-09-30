const tutorials = [
    {
        icon: "🏢",
        title: "Selamat Datang",
        text: "Selamat datang di JurkonCompanies. Kamu akan memulai perjalanan sebagai pemilik perusahaan baru."
    },
    {
        icon: "💰",
        title: "Kelola Keuangan",
        text: "Uang adalah sumber daya penting. Gunakan modalmu untuk membangun fasilitas dan mengembangkan perusahaan."
    },
    {
        icon: "🏭",
        title: "Bangun Produksi",
        text: "Pabrik memungkinkan perusahaanmu mengubah bahan baku menjadi produk yang dapat dijual."
    },
    {
        icon: "📦",
        title: "Kelola Inventory",
        text: "Produk yang selesai dibuat akan masuk ke inventory. Dari sana kamu dapat menjualnya ke pasar."
    },
    {
        icon: "📈",
        title: "Bangun Perusahaan",
        text: "Gunakan keuntungan untuk memperbesar kapasitas produksi dan mengembangkan perusahaanmu."
    }
];

let currentTutorial = 0;


function showScreen(id) {

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");
}


function startTutorial() {

    currentTutorial = 0;

    updateTutorial();

    showScreen("tutorial");
}


function updateTutorial() {

    const tutorial = tutorials[currentTutorial];

    document.getElementById("tutorialIcon").textContent =
        tutorial.icon;

    document.getElementById("tutorialTitle").textContent =
        tutorial.title;

    document.getElementById("tutorialText").textContent =
        tutorial.text;

    document.getElementById("tutorialStep").textContent =
        `${currentTutorial + 1} / ${tutorials.length}`;
}


function nextTutorial() {

    currentTutorial++;

    if (currentTutorial >= tutorials.length) {

        showScreen("createCompany");

        return;
    }

    updateTutorial();
}


function skipTutorial() {

    showScreen("createCompany");
}


function createCompany() {

    const input = document.getElementById("companyName");

    const name = input.value.trim();

    if (name === "") {

        alert("Masukkan nama perusahaan terlebih dahulu.");

        return;
    }

    document.getElementById("companyDisplay").textContent =
        name;

    showScreen("hq");
}
GameEvents.on(
    "production.started",
    data => {

        const product =
            GameData.getProduct(
                data.job.productId
            );

        const name =
            product
                ? product.name
                : data.job.productId;

        if (
            typeof showNotification ===
            "function"
        ) {

            showNotification(
                `${name} sedang diproduksi.`
            );
        }
    }
);


GameEvents.on(
    "production.completed",
    data => {

        const product =
            GameData.getProduct(
                data.job.productId
            );

        const name =
            product
                ? product.name
                : data.job.productId;

        if (
            typeof showNotification ===
            "function"
        ) {

            showNotification(
                `Produksi selesai: ${name} × ${data.job.quantity}`
            );
        }
    }
);
setTimeout(() => {
    runEconomyVisualTest();
}, 1000);
