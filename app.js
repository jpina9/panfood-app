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

  "refrigerante": {
    protein: 0,
    fat: 0,
    sugar: 35,
    fiber: 0
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
  }
};

const aliases = {

  "hamburguer": "hambúrguer",
  "hambuguer": "hambúrguer",

  "coca cola": "refrigerante",
  "coca-cola": "refrigerante",

  "big mac": "hambúrguer",

  "mcdonalds": "hambúrguer"
};

window.onload = () => {

  loadProfile();

  renderWeights();

};

function showPage(page){

  const home =
    document.getElementById("homePage");

  const profile =
    document.getElementById("profilePage");

  if(page === "home"){

    home.style.display = "block";
    profile.style.display = "none";

  }else{

    home.style.display = "none";
    profile.style.display = "block";

  }
}

function saveProfile(){

  const profile = {

    weight:
      Number(
        document.getElementById(
          "weight"
        ).value
      ),

    targetWeight:
      Number(
        document.getElementById(
          "targetWeight"
        ).value
      ),

    triglycerides:
      Number(
        document.getElementById(
          "triglycerides"
        ).value
      ),

    hdl:
      Number(
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

  document.getElementById(
    "hdl"
  ).value =
    profile.hdl || "";

  document.getElementById(
    "pancreatitis"
  ).checked =
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

  document.getElementById(
    "weightHistory"
  ).innerHTML =
    history.map(item => `
      <li>
      ${item.date}
      -
      ${item.weight} kg
      </li>
    `).join("");
}

async function analyzeMeal(){

  const profile =
    JSON.parse(
      localStorage.getItem(
        "panfood_profile"
      )
    );

  const result =
    document.getElementById(
      "result"
    );

  if(!profile){

    result.innerHTML =
      "<p>Configure primeiro o perfil.</p>";

    return;
  }

  let foodName =
    document
      .getElementById("meal")
      .value
      .trim()
      .toLowerCase();

  foodName =
    aliases[foodName] ||
    foodName;

  let food =
    foods[foodName];

  if(!food){

    result.innerHTML = `
      <h3>⚠️ Alimento desconhecido</h3>
      <p>
      Ainda não existe na base de dados.
      </p>
    `;

    return;
  }

  let score = 10;

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
      Math.min(score,10)
    );

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

  result.innerHTML = `
    <h3>${recommendation}</h3>

    <p>Pontuação: ${score}/10</p>

    <p>Proteína: ${food.protein}</p>
    <p>Gordura: ${food.fat}</p>
    <p>Açúcar: ${food.sugar}</p>
    <p>Fibra: ${food.fiber}</p>
  `;
}
