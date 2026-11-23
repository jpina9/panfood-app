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

    history.push({
        weight: weight,
        date: new Date()
            .toLocaleDateString("pt-PT")
    });

    localStorage.setItem(
        "panfood_weights",
        JSON.stringify(history)
    );

    document.getElementById(
        "newWeight"
    ).value = "";

    renderWeights();
};

function renderWeights() {

    const list =
        document.getElementById(
            "weightHistory"
        );

    if (!list) return;

    const history =
        JSON.parse(
            localStorage.getItem(
                "panfood_weights"
            )
        ) || [];

    list.innerHTML =
        history
            .map(item => `
                <li>
                    ${item.date}
                    - 
                    ${item.weight} kg
                </li>
            `)
            .join("");
}

// ======================
// OPEN FOOD FACTS
// ======================

async function searchFood(foodName) {

    try {

        const response =
            await fetch(
                `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(foodName)}&search_simple=1&json=1`
            );

        const data =
            await response.json();

        if (
            !data.products ||
            data.products.length === 0
        ) {
            return null;
        }

        const product =
            data.products[0];

        return {

            protein:
                Number(
                    product.nutriments?.proteins_100g
                ) || 0,

            fat:
                Number(
                    product.nutriments?.fat_100g
                ) || 0,

            sugar:
                Number(
                    product.nutriments?.sugars_100g
                ) || 0,

            fiber:
                Number(
                    product.nutriments?.fiber_100g
                ) || 0,

            productName:
                product.product_name ||
                foodName
        };

    } catch (error) {

        console.error(error);

        return null;
    }
}

// ======================
// ANÁLISE
// ======================

window.analyzeMeal = async function () {

    const result =
        document.getElementById("result");

    const profile =
        JSON.parse(
            localStorage.getItem(
                "panfood_profile"
            )
        );

    if (!profile) {

        result.innerHTML = `
            <p>
                Configure primeiro o perfil.
            </p>
        `;

        return;
    }

    const meal =
        document
            .getElementById("meal")
            .value
            .trim();

    if (!meal) {

        result.innerHTML = `
            <p>
                Introduza uma refeição.
            </p>
        `;

        return;
    }

    result.innerHTML = `
        <div class="card">
            🤖 A analisar refeição...
        </div>
    `;

    try {

        const response =
            await fetch(
                "https://panfood.jpina9.workers.dev",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        meal,
                        profile
                    })
                }
            );

        const data =
            await response.json();

        if (!data.success) {

            result.innerHTML = `
                <div class="card">
                    ❌ Erro:
                    ${data.error}
                </div>
            `;

            return;
        }

        result.innerHTML = `
            <div class="card">

                <h3>
                    🤖 Análise IA
                </h3>

                <div style="
                    white-space: pre-wrap;
                    line-height: 1.6;
                ">
${data.analysis}
                </div>

            </div>
        `;

    } catch (error) {

        console.error(error);

        result.innerHTML = `
            <div class="card">

                <h3>
                    ❌ Erro
                </h3>

                <p>
                    Não foi possível contactar o serviço de IA.
                </p>

            </div>
        `;
    }
};

    if (!food) {

        result.innerHTML = `
            <h3>❌ Não encontrado</h3>
            <p>
                Não encontrei informação suficiente.
            </p>
        `;

        return;
    }

    let score = 10;

    let reasons = [];

    if (
        profile.triglycerides > 200 &&
        food.sugar > 10
    ) {

        score -= 3;

        reasons.push(
            "Açúcar elevado"
        );
    }

    if (
        profile.pancreatitis &&
        food.fat > 20
    ) {

        score -= 3;

        reasons.push(
            "Gordura elevada"
        );
    }

    if (food.protein > 15) {

        score += 1;

        reasons.push(
            "Boa proteína"
        );
    }

    if (food.fiber > 3) {

        score += 1;

        reasons.push(
            "Boa fibra"
        );
    }

    score =
        Math.max(
            0,
            Math.min(score, 10)
        );

    let recommendation;

    if (score >= 8) {

        recommendation =
            "✅ Recomendado";

    } else if (score >= 5) {

        recommendation =
            "⚠️ Moderado";

    } else {

        recommendation =
            "❌ Evitar";
    }

    result.innerHTML = `
        <h3>${recommendation}</h3>

        <p>
            Pontuação:
            ${score}/10
        </p>

        <p>
            Proteína:
            ${food.protein}
        </p>

        <p>
            Gordura:
            ${food.fat}
        </p>

        <p>
            Açúcar:
            ${food.sugar}
        </p>

        <p>
            Fibra:
            ${food.fiber}
        </p>

        <hr>

        <p>
            ${reasons.join("<br>")}
        </p>
    `;
};

