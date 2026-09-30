
// JurkonCompanies
// Screen Manager
// Version: 0.1

function showScreen(screenId) {
    GameState.session.currentScreen = screenId;

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    const target = document.getElementById(screenId);

    if (target) {
        target.classList.add("active");
    }
}
