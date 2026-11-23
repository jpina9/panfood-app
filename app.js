const foods = {

    "atum": {
        protein:25,
        sugar:0,
        fat:1,
        fiber:0
    },

    "frango": {
        protein:30,
        sugar:0,
        fat:3,
        fiber:0
    },

    "salada": {
        protein:1,
        sugar:1,
        fat:0,
        fiber:4
    },

    "ameixa": {
        protein:1,
        sugar:10,
        fat:0,
        fiber:2
    },

    "refrigerante": {
        protein:0,
        sugar:35,
        fat:0,
        fiber:0
    },

    "arroz branco": {
        protein:2,
        sugar:0,
        fat:0,
        fiber:0
    },

    "pá de porco": {
        protein:22,
        sugar:0,
        fat:18,
        fiber:0
    }
};

loadProfile();
renderWeights();

function saveProfile(){

    const profile = {

        weight:Number(
            document.getElementById("weight").value
        ),

        targetWeight:Number(
            document.getElementById("targetWeight").value
        ),

        triglycerides:Number(
            document.getElementById("triglycerides").value
        )
    };

    localStorage.setItem(
        "panfood_profile",
        JSON.stringify(profile)
    );

    alert("Perfil guardado");
}

function loadProfile(){

    const profile =
        JSON.parse(
            localStorage.getItem(
                "panfood_profile"
            )
        );

    if(!profile) return;

    document.getElementById("weight")
        .value = profile.weight || "";

    document.getElementById("targetWeight")
        .value = profile.targetWeight || "";

    document.getElementById("triglycerides")
        .value = profile.triglycerides || "";
}

function analyzeMeal(){

    const profile =
        JSON.parse(
            localStorage.getItem("panfood_profile")
        ) || {};

    const meal =
        document
        .getElementById("meal")
        .value
        .toLowerCase()
        .split(",");

    let score = 10;

    let comments = [];

    meal.forEach(item => {

        item = item.trim();

        const food = foods[item];

        if(!food) return;

        if(
            profile.triglycerides > 200 &&
            food.sugar > 10
        ){
            score -= 3;
            comments.push(
                item + ": muito açúcar"
            );
        }

        if(food.protein > 15){
            score += 1;
        }

        if(food.fiber > 3){
            score += 1;
        }
    });

    score =
        Math.min(10,
        Math.max(0,score));

    let recommendation;

    if(score >= 8){

        recommendation =
            "✅ Recomendado";

    }else if(score >= 5){

        recommendation =
            "⚠️ Moderado";

    }else{

        recommendation =
            "❌ Evitar";
    }

    document.getElementById("result")
        .innerHTML = `
            <h3>${recommendation}</h3>
            <p>Pontuação: ${score}/10</p>
            <p>${comments.join("<br>")}</p>
        `;
}

function addWeight(){

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

function renderWeights(){

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