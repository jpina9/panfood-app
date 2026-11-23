// ======================
// CONFIGURAÇÃO
// ======================

const aliases = {
    "hamburguer": "hambúrguer",
    "hambuguer": "hambúrguer",
    "coca cola": "refrigerante",
    "coca-cola": "refrigerante",
    "big mac": "hambúrguer",
    "mcdonalds": "hambúrguer"
};

const foods = {
    "atum": {
        protein: 25,
        fat: 1,
        sugar: 0,
        fiber: 0
    },

    "frango": {
        protein: 30,
        fat: 3,
        sugar: 0,
        fiber: 0
    },

    "salada": {
        protein: 1,
        fat: 0,
        sugar: 1,
        fiber: 5
    },

    "ameixa": {
        protein: 1,
        fat: 0,
        sugar: 10,
        fiber: 2
    },

    "hambúrguer": {
        protein: 18,
        fat: 18,
        sugar: 2,
        fiber: 1
    },

    "pizza": {
        protein: 12,
        fat: 15,
        sugar: 4,
        fiber: 1
    },

    "refrigerante": {
        protein: 0,
        fat: 0,
        sugar: 35,
        fiber: 0
    }
};

// ======================
// ARRANQUE
// ======================

document.addEventListener("DOMContentLoaded", () => {

    loadProfile();

    renderWeights();

});

// ======================
// NAVEGAÇÃO
// ======================

window.showPage = function(page) {

    const homePage =
        document.getElementById("homePage");

    const profilePage =
        document.getElementById("profilePage");

    if (!homePage || !profilePage) {
        console.error("Páginas não encontradas");
        return;
    }

    if (page === "home") {

        homePage.style.display = "block";
        profilePage.style.display = "none";

    } else {

        homePage.style.display = "none";
        profilePage.style.display = "block";
    }
};

// ======================
// PERFIL
// ======================

window.saveProfile = function() {

    const profile = {

        weight: Number(
            document.getElementById("weight").value
        ) || 0,

        targetWeight: Number(
            document.getElementById("targetWeight").value
        ) || 0,

        triglycerides: Number(
            document.getElementById("triglycerides").value
        ) || 0,

        hdl: Number(
            document.getElementById("hdl").value
        ) || 0,

        pancreatitis:
            document.getElementById(
                "pancreatitis"
            ).checked
    };

    localStorage.setItem(
        "panfood_profile",
        JSON.stringify(profile)
    );

    alert("Perfil guardado com sucesso.");
};

function loadProfile() {

    const profile =
        JSON.parse(
            localStorage.getItem(
                "panfood_profile"
            )
        );

    if (!profile) return;

    document.getElementById("weight").value =
        profile.weight || "";

    document.getElementById("targetWeight").value =
        profile.targetWeight || "";

    document.getElementById("triglycerides").value =
        profile.triglycerides || "";

    document.getElementById("hdl").value =
        profile.hdl || "";

    document.getElementById("pancreatitis").checked =
        profile.pancreatitis || false;
}

// ======================
// HISTÓRICO DE PESO
// ======================

window.addWeight = function() {

    const weight =
        Number(
            document.getElementById(
                "newWeight"
            ).value
        );

    if (!weight) return;

    let history =
        JSON.parse(
            localStorage.getItem(
                "panfood_weights"
            )
        ) || [];

   
