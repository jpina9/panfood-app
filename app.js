const aliases = {

    "hambuguer":"hambúrguer",
    "hamburguer":"hambúrguer",

    "coca cola":"refrigerante",
    "coca-cola":"refrigerante",

    "big mac":"hambúrguer",

    "bk":"hambúrguer",

    "mcdonalds":"hambúrguer"
};

const localFoods = {

    "atum":{
        protein:25,
        fat:1,
        sugar:0,
        fiber:0
    },

    "frango":{
        protein:30,
        fat:3,
        sugar:0,
        fiber:0
    },

    "salada":{
        protein:1,
        fat:0,
        sugar:1,
        fiber:5
    },

    "ameixa":{
        protein:1,
        fat:0,
        sugar:10,
        fiber:2
    },

    "hambúrguer":{
        protein:18,
        fat:18,
        sugar:2,
        fiber:1
    },

    "pizza":{
        protein:12,
        fat:15,
        sugar:4,
        fiber:1
    },

    "refrigerante":{
        protein:0,
        fat:0,
        sugar:35,
        fiber:0
    }
};

loadProfile();
renderWeights();

function showPage(page){

    document.getElementById(
        "homePage"
    ).style.display =
        page === "home"
        ? "block"
        : "none";

    document.getElementById(
        "profilePage"
    ).style.display =
        page === "profile"
        ? "block"
        : "none";
}

function saveProfile(){

    const profile = {

        weight:Number(
            document.getElementById(
                "weight"
            ).value
        ),

        targetWeight:Number(
            document.getElementById(
                "targetWeight"
            ).value
        ),

        triglycerides:Number(
            document.getElementById(
                "triglycerides"
            ).value
        ),

        hdl:Number(
            document.getElementById(
                "hdl"
            ).value
        ),

        pancreatitis:
        document.getElementById(
            "pancreatitis"
        ).checked
    };

    localStorage.setItem(
        "panfood_profile",
        JSON.stringify(profile)
    );

    alert(
        "Perfil guardado."
    );
}

function loadProfile(){

    const profile =
        JSON.parse(
            localStorage.getItem(
                "panfood_profile"
            )
        );

    if(!profile) return;

    weight.value =
        profile.weight || "";

    targetWeight.value =
        profile.targetWeight || "";

    triglycerides.value =
        profile.triglycerides || "";

    hdl.value =
        profile.hdl || "";

    pancreatitis.checked =
        profile.pancreatitis || false;
}

function addWeight(){

    const value =
        Number(
            document.getElementById(
                "newWeight"
            ).value
        );

    if(!value) return;

    let history =
        JSON.parse(
            localStorage.getItem(
                "panfood_weights"
            )
        ) || [];

    history.push({

        date:
        new Date()
        .toLocaleDateString(),

        weight:value

    });

    localStorage.setItem(

        "panfood_weights",

        JSON.stringify(history)

    );

    renderWeights();
}

function renderWeights(){

    const history =
        JSON.parse(
            localStorage.getItem(
                "panfood_weights"
            )
        ) || [];

    weightHistory.innerHTML =
        history
        .map(x => `
            <li>
                ${x.date}
                -
                ${x.weight} kg
            </li>
        `)
        .join("");
}

async function searchFood(foodName){

    try{

        const response =
        await fetch(
            `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(foodName)}&search_simple=1&json=1`
        );

        const data =
            await response.json();

        if(
            !data.products ||
            data.products.length === 0
        ){
            return null;
        }

        const product =
            data.products[0];

        return {

            protein:
            Number(product.nutriments?.proteins_100g) || 0,

            fat:
            Number(product.nutriments?.fat_100g) || 0,

            sugar:
            Number(product.nutriments?.sugars_100g) || 0,

            fiber:
            Number(product.nutriments?.fiber_100g) || 0
        };

    }catch{

        return null;
    }
}

async function analyzeMeal(){

    const profile =
        JSON.parse(
            localStorage.getItem(
                "panfood_profile"
            )
        );

    if(!profile){

        result.innerHTML =
        `
        <p class="result-bad">
        Configure primeiro o Perfil.
        </p>
        `;

        return;
    }

    let score = 10;

    const text =
        meal.value
        .toLowerCase();

    let foodName =
        aliases[text] || text;

    let food =
        localFoods[foodName];

    if(!food){

        food =
        await searchFood(
            foodName
        );
    }

    if(!food){

        result.innerHTML = `
            <p class="result-bad">
            Não consegui identificar esse alimento.
            </p>
        `;

        return;
    }

    if(
        profile.triglycerides > 200 &&
        food.sugar > 10
    ){

        score -= 3;
    }

    if(
        profile.pancreatitis &&
        food.fat > 20
    ){

        score -= 3;
    }

    if(food.protein > 15){

        score += 1;
    }

    if(food.fiber > 3){

        score += 1;
    }

    score =
        Math.max(
            0,
            Math.min(
                10,
                score
            )
        );

    let className;
    let recommendation;

    if(score >= 8){

        className =
            "result-good";

        recommendation =
            "✅ Recomendado";

    }else if(score >= 5){

        className =
            "result-medium";

        recommendation =
            "⚠️ Moderado";

    }else{

        className =
            "result-bad";

        recommendation =
            "❌ Evitar";
    }

    result.innerHTML = `

        <h3 class="${className}">
            ${recommendation}
        </h3>

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

    `;
}