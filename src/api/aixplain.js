const apiKey = '1c497aae01aa421baee6f9818cad584c1747a157fd8dd82924aacf6d8cc94086';
const modelId = '6759db476eb56303857a07c1';

const competences = {
    1: "Demonstração de domínio da norma padrão da língua escrita.",
    2: "Compreensão da proposta de redação e aplicação de conceitos das áreas de conhecimento para desenvolver o tema dentro dos limites estruturais do texto dissertativo-argumentativo.",
    3: "Seleção, organização e interpretação de informações, fatos, opiniões e argumentos para defender um ponto de vista.",
    4: "Demonstração de conhecimento dos mecanismos linguísticos necessários para a construção da argumentação.",
    5: "Elaboração de uma proposta de intervenção para o problema abordado, respeitando os direitos humanos."
};

function generateCompetencePrompt(THEME, MODEL, TITLE, CONTENT, index, description) {
    return `
        Tema: ${THEME}
        Modelo de correção: ${MODEL}
        ${TITLE ? `Título: ${TITLE}` : ""}
        
        Redação:
        ${CONTENT}

        Avalie a redação com foco na seguinte competência:
        ${index}. ${description}

        Inclua uma chave no formato "Competence${index}", cujo valor seja um array contendo:
        - Nota da competência (0 a 200).
        - Uma curta e direta análise específica (com menos de 700 caracteres).

        Retorne os resultados exatamente nesse formato JSON:
        {
            "Competence${index}": [<nota>, "<análise>"]
        }
    `;
}

export async function AnalyzeEssay(THEME, MODEL, TITLE, CONTENT) {
    console.log("Iniciando análise da redação...");

    const requests = Object.entries(competences).map(async ([index, description]) => {
        console.log(`Avaliando Competência ${index}...`);
        const prompt = generateCompetencePrompt(THEME, MODEL, TITLE, CONTENT, index, description);

        try {
            const response = await fetch(`https://models.aixplain.com/api/v1/execute/${modelId}`, {
                method: 'POST',
                headers: {
                    'x-api-key': apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: prompt })
            });

            const data = await response.json();
            console.log(`Resultado inicial da competência ${index}:`, data);

            if (!data.requestId) {
                throw new Error(`Falha ao obter requestId para competência ${index}`);
            }

            const result = await pollForResult(data.requestId);
            console.log(`Resultado da competência ${index}:`, result);

            return { [`Competence${index}`]: result[`Competence${index}`] };
        } catch (error) {
            console.error(`Erro na competência ${index}:`, error);
            return { [`Competence${index}`]: ["Erro", "Não foi possível avaliar essa competência."] };
        }
    });

    const resultsArray = await Promise.all(requests);
    const finalResults = resultsArray.reduce((acc, cur) => ({ ...acc, ...cur }), {});

    console.log("Resultados das competências obtidos. Gerando análise geral...");

    const generalAnalysis = await generateGeneralAnalysis(THEME, MODEL, TITLE, CONTENT, finalResults);

    const finalScore = Object.values(finalResults).reduce((acc, value) => {
        if (Array.isArray(value) && !isNaN(value[0])) {
            return acc + value[0];
        }
        return acc;
    }, 0);

    const completeResults = { ...finalResults, "General_Analysis": generalAnalysis, "Final_Score": finalScore, "Competences": competences, "aiModel": modelId };

    console.log("Resultado Final Completo:", completeResults);
    return completeResults;
}

async function generateGeneralAnalysis(THEME, MODEL, TITLE, CONTENT, competenceResults) {
    let finalScore = 0;
    let observations = [];

    Object.entries(competenceResults).forEach(([key, value]) => {
        if (Array.isArray(value) && !isNaN(value[0])) {
            finalScore += value[0];
            observations.push(`Competência ${key.replace("Competence", "")}: ${value[1]}`);
        }
    });

    const averageScore = finalScore / Object.keys(competenceResults).length;

    const analysisPrompt = `
        Tema: ${THEME}
        Modelo de correção: ${MODEL}
        ${TITLE ? `Título: ${TITLE}` : ""}

        Redação:
        ${CONTENT}

        Análise das competências:
        ${observations.join("\n")}

        Com base na pontuação média (${averageScore.toFixed(2)}) e nos comentários acima, forneça uma análise geral resumida da redação, destacando os principais pontos positivos e aspectos que podem ser melhorados.

        Retorne exatamente nesse formato JSON:
        {
            "General_Analysis": "<análise detalhada>"
        }
    `;

    try {
        const response = await fetch(`https://models.aixplain.com/api/v1/execute/${modelId}`, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: analysisPrompt })
        });

        const data = await response.json();
        console.log("Resultado inicial da análise geral:", data);

        if (!data.requestId) {
            throw new Error("Falha ao obter requestId para análise geral");
        }

        const result = await pollForResult(data.requestId);
        console.log("Resultado da análise geral:", result);

        return result["General_Analysis"];
    } catch (error) {
        console.error("Erro na análise geral:", error);
        return "Erro ao gerar análise geral.";
    }
}

async function pollForResult(requestId, maxAttempts = 50) {
    let attempts = 0;
    let pollingInterval = 2000;

    while (attempts < maxAttempts) {
        try {
            const response = await fetch(`https://models.aixplain.com/api/v1/data/${requestId}`, {
                method: 'GET',
                headers: {
                    'x-api-key': apiKey,
                    'Content-Type': 'application/json'
                }
            });

            let data = await response.json();
            console.log(`Tentativa ${attempts + 1}: Status da execução`, data);

            if (data.completed) {
                let cleanData = data.data
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

                console.log("JSON bruto recebido:", cleanData);

                if (!cleanData.endsWith("}")) {
                    cleanData += "\"}";
                }

                try {
                    return JSON.parse(cleanData);
                } catch (parseError) {
                    console.error("Erro ao converter JSON:", parseError);
                    return null;
                }
            }

            attempts++;
            if (attempts % 5 === 0) {
                pollingInterval *= 1.5;
            }
            await new Promise(resolve => setTimeout(resolve, pollingInterval));
        } catch (error) {
            console.error("Erro ao verificar o status da execução:", error);
        }
    }

    throw new Error("Tempo limite atingido para obter o resultado.");
}
