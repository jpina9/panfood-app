const foods = {

    atum: {
        name: "Atum",
        protein: 25,
        sugar: 0,
        fat: 1,
        fiber: 0
    },

    frango: {
        name: "Frango",
        protein: 30,
        sugar: 0,
        fat: 3,
        fiber: 0
    },

    salada: {
        name: "Salada",
        protein: 1,
        sugar: 1,
        fat: 0,
        fiber: 4
    },

    ameixa: {
        name: "Ameixa",
        protein: 1,
        sugar: 10,
        fat: 0,
        fiber: 2
    },

    refrigerante: {
        name: "Refrigerante",
        protein: 0,
        sugar: 35,
        fat: 0,
        fiber: 0
    },

    "arroz branco": {
        name: "Arroz Branco",
        protein: 2,
        sugar: 0,
        fat: 0,
        fiber: 0
    }
};

const aliases = {

    "hamburguer": "hambúrguer",
    "hambuguer": "hambúrguer",

    "coca cola": "refrigerante",
    "coca-cola": "refrigerante",

    "big mac": "hambúrguer",
    "whopper": "hambúrguer",

    "pizza": "pizza",
    "francesinha": "francesinha",
    "kebab": "kebab"
};

const categories = {

    "hambúrguer": {
        name: "Hambúrguer",
        protein: 18,
        sugar: 2,
        fat: 18,
        fiber: 0
    },

    "pizza": {
        name: "Pizza",
        protein: 12,
        sugar: 4,
        fat: 15,
        fiber: 1
    },

    "kebab": {
        name: "Kebab",
        protein: 20,
        sugar: 2,
        fat: 15,
        fiber: 1
    },

    "francesinha": {
        name: "Francesinha",
        protein: 30,
        sugar: 3,
        fat: 28,
        fiber: 1
    }
};

loadProfile();
renderWeights();

function saveProfile() {

    const profile = {

        weight: Number(
            document.getElementById(
                "weight"
            ).value
        ),

        targetWeight: Number(
            document.getElementById(
                "targetWeight"
            ).value
        ),

        triglycerides: Number(
            document.getElementById(
                "triglycerides"
            ).value
        )
    };

    localStorage.setItem(
        "panfood_profile",
        JSON.stringify(profile)
    );

    alert("Perfil guardado");
}

function loadProfile() {

    const profile =
        JSON.parse(
            localStorage.getItem(
                "panfood_profile"
            )
        );

    if (!profile) return;

    document.getElementById(
        "weight"
    ).value =
        profile.weight || "";

    document.getElementById(
        "targetWeight"
    ).value =
        profile.targetWeight || "";

    document.getElementById(
        "triglycerides"
    ).value =
        profile.triglycerides || "";
}

async function searchOpenFoodFacts(foodName) {

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

            name:
                product.product_name ||
                foodName,

            protein:
                Number(
                    product.nutriments?.proteins_100g
                ) || 0,

            sugar:
                Number(
                    product.nutriments?.sugars_100g
                ) || 0,

            fat:
                Number(
                    product.nutriments?.fat_100g
                ) || 0,

            fiber:
                Number(
                    product.nutriments?.fiber_100g
                ) || 0
        };

    } catch {

        return null;
    }
}

async function analyzeMeal() {

    const profile =
        JSON.parse(
            localStorage.getItem(
                "panfood_profile"
            )
        ) || {};

    const resultDiv =
        document.getElementById(
            "result"
        );

    resultDiv.innerHTML =
        "🔍 A analisar...";

    let score = 10;

    let comments = [];

    const items =
        document
            .getElementById("meal")
            .value
            .split(",");

    for (let item of items) {

        item =
            item.trim().toLowerCase();

        item =
            aliases[item] || item;

        let food =
            foods[item];

        if (!food) {

            food =
                categories[item];
        }

        if (!food) {

            food =
                await searchOpenFoodFacts(
                    item
                );
        }

        if (!food) {

            score -= 2;

            comments.push(
                `❓ ${item}: desconhecido`
            );

            continue;
        }

        if (
            profile.triglycerides > 200 &&
            food.sugar > 10
        ) {

            score -= 3;

            comments.push(
                `⚠️ ${food.name}: açúcar elevado`
            );
        }

        if (
            food.fat > 20
        ) {

            score -= 2;

            comments.push(
                `⚠️ ${food.name}: gordura elevada`
            );
        }

        if (
            food.protein > 15
        ) {

            score += 1;

            comments.push(
                `✅ ${food.name}: boa proteína`
            );
        }

        if (
            food.fiber > 3
        ) {

            score += 1;

            comments.push(
                `✅ ${food.name}: boa fibra`
            );
        }
    }

    score =
        Math.max(
            0,
            Math.min(10, score)
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

    resultDiv.innerHTML = `
        <h3>${recommendation}</h3>

        <p>
        Pontuação: ${score}/10
        </p>

        <div>
        ${comments.join("<br>")}
        </div>
    `;
}

function addWeight() {

    const weight =
        document.getElementById(
            "newWeight"
        ).value;

    let history =
        JSON.parse(
            localStorage.getItem(
                "panfood_weights"
            )
        ) || [];

    history.push(weight);

    localStorage.setItem(
        "panfood_weights",
        JSON.stringify(history)
    );

    renderWeights();
}

function renderWeights() {

    const history =
        JSON.parse(
            localStorage.getItem(
                "panfood_weights"
            )
        ) || [];

    document.getElementById(
        "weightHistory"
    ).innerHTML =
        history
            .map(
                w => `<li>${w} kg</li>`
            )
            .join("");
}