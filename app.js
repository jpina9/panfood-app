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

window.showPage = function(page){

    const homePage =
        document.getElementById(
            "homePage"
        );

    const profilePage =
        document.getElementById(
            "profilePage"
        );

    if(page === "home"){

        homePage.style.display =
            "block";

        profilePage.style.display =
            "none";

    }else{

        homePage.style.display =
            "none";

        profilePage.style.display =
            "block";
    }
};

// ======================
// PERFIL
// ======================

window.saveProfile = function(){

    const profile = {

        weight:Number(
            document.getElementById(
                "weight"
            ).value
        ) || 0,

        targetWeight:Number(
            document.getElementById(
                "targetWeight"
            ).value
        ) || 0,

        triglycerides:Number(
            document.getElementById(
                "triglycerides"
            ).value
        ) || 0,

        hdl:Number(
            document.getElementById(
                "hdl"
            ).value
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

    alert(
        "Perfil guardado."
    );
};

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

// ======================
// HISTÓRICO PESO
// ======================

window.addWeight = function(){

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

        weight:value,

        date:
        new Date()
            .toLocaleDateString(
                "pt-PT"
            )

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

function renderWeights(){

    const list =
        document.getElementById(
            "weightHistory"
        );

    if(!list) return;

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
// GEMINI IA
// ======================

window.analyzeMeal = async function(){

    const result =
        document.getElementById(
            "result"
        );

    const profile =
        JSON.parse(
            localStorage.getItem(
                "panfood_profile"
            )
        );

    if(!profile){

        result.innerHTML =
        `
        <div class="card">
            Configure primeiro o perfil.
        </div>
        `;

        return;
    }

    const meal =
        document
        .getElementById(
            "meal"
        )
        .value
        .trim();

    if(!meal){

        result.innerHTML =
        `
        <div class="card">
            Introduza uma refeição.
        </div>
        `;

        return;
    }

    result.innerHTML =
    `
    <div class="card">
        🤖 A analisar refeição...
    </div>
    `;

    try{

        const response =
            await fetch(
                "https://panfood.jpina9.workers.dev",
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify({

                        meal,

                        profile

                    })
                }
            );

        const data =
            await response.json();

        if(!data.success){

            result.innerHTML =
            `
            <div class="card">
                ❌ ${data.error}
            </div>
            `;

            return;
        }

        result.innerHTML =
        `
        <div class="card">

            <h3>
                🤖 Análise IA
            </h3>

            <div
            style="
                white-space:pre-wrap;
                line-height:1.6;
            "
            >
${data.analysis}
            </div>

        </div>
        `;

    }catch(error){

        console.error(error);

        result.innerHTML =
        `
        <div class="card">

            <h3>
                ❌ Erro
            </h3>

            <p>
                Não foi possível contactar o Gemini.
            </p>

        </div>
        `;
    }
};
