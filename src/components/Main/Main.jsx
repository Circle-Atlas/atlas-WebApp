import { useState, useEffect } from "react";
import { AnalyzeEssay } from "../../api/aixplain.js";
import { SaveEssay, GetEssays } from "../../database/essays.js";

export default function Main({ MAIN }) {
    // Igonra isso

    const user = JSON.parse(localStorage.getItem("USER"));
    
    const [selectedMain, setSelectedMain] = useState(MAIN);

    const [essays, setEssays] = useState([]);

    useEffect(() => {
        async function fetchEssays() {
            const fetchedEssays = await GetEssays();
            setEssays(fetchedEssays || []);
        }

        fetchEssays();
    }, []);

    // Até aqui

    switch (selectedMain) {
        // Página principal
        case "MAIN_MENU":
            return (
                <main>
                    <header>
                        <div id="left-container">
                            <div id="greetings-container">
                                <h1 id="greetings-h1">
                                    Bom dia, {JSON.parse(localStorage.getItem("USER"))?.displayName || "Usuário"}!
                                </h1>
                                <p id="greetings-p">“Aprender é crescer, sempre em frente!”</p>
                            </div>
                        </div>
                        <div id="right-container">
                            <div id="new-essay-container">
                                <button id="new-essay" onClick={() => setSelectedMain("WRITE_ESSAY")}>
                                    Escrever Redação
                                </button>
                            </div>
                            <div id="corrected-essays-container">
                                {/* Aqui ele faz um loop e para cada redação corrigida ele cria uma div com a class "corrected-essay" 
                                e com o tema e a pontuação final */}
                                {essays.length > 0 ? (
                                    essays.map((essay) => (
                                        <div className="corrected-essay" key={essay.id}>
                                            <p>{essay.theme}</p>
                                            <p>{essay.finalScore}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="corrected-essay">
                                        <p>Você não corrigiu nenhuma redação!</p>
                                    </div>
                                )}
                            </div>
                        </div>   
                    </header>
                    <section></section>
                </main>
            );
        // Página de escrita da redação
        case "WRITE_ESSAY":
            return (
                <main>
                    <div id="container-left">
                        <button id="back-btn" onClick={() => setSelectedMain("MAIN_MENU")}>Back</button>
                        <img src="" alt="Menina Escrevendo" />
                        <label htmlFor="theme">Qual é o tema da sua redação?</label>
                        <input type="text" id="theme" />
                        <label htmlFor="model">Qual o modelo de correção?</label>
                        <div id="model">
                            <button className="modelType selected" onClick={(event) => {
                                document.querySelector(".modelType.selected")?.classList.remove("selected");
                                event.target.classList.add("selected");
                            }}>
                                ENEM
                            </button>
                            <button className="modelType" onClick={(event) => {
                                document.querySelector(".modelType.selected")?.classList.remove("selected");
                                event.target.classList.add("selected");
                            }}>
                                UERJ
                            </button>
                        </div>
                        <button id="correct" onClick={async () => {
                            
                            // Isso tu ignora pois é o que vai acontecer no click do botão 
                            // que no caso vai enviar para a API corrigir a redação

                            const title = document.getElementById("essay-title").value.trim() || "Sem título";
                            const content = document.getElementById("essay-content").value.trim();
                            const theme = document.getElementById("theme").value.trim() || "Sem tema";
                            const model = document.querySelector(".modelType.selected")?.innerHTML || "Sem modelo";

                            if (content === "") {
                                alert("Você deve digitar algo.");
                                return;
                            }

                            const analysis = await AnalyzeEssay(theme, model, title, content);

                            if (analysis) {
                                localStorage.setItem("LastEssay", JSON.stringify({
                                    ...analysis,
                                    title,
                                    content,
                                    theme,
                                    model
                                }));
                                const essaySaved = await SaveEssay(theme, model, title, content, analysis.General_Analysis, analysis.Final_Score);

                                if(essaySaved.success) {
                                    setSelectedMain("ESSAY_CORRECTION");
                                } else {
                                    alert("Erro ao salvar redação.");
                                }
                            }

                            // Até aqui
                        }}>
                            Corrigir
                        </button>
                    </div>
                    <div id="container-right">
                        <textarea id="essay-title" placeholder="Título da redação"></textarea>
                        <textarea id="essay-content" placeholder="Digite aqui sua redação"></textarea>
                    </div>
                </main>
            );
        // Página após correção da redação
        case "ESSAY_CORRECTION":
            const lastEssay = JSON.parse(localStorage.getItem("LastEssay")) || {};
            console.log(lastEssay)

            return (
                <main>
                    <div id="container-left">
                    <button id="back-btn" onClick={() => setSelectedMain("WRITE_ESSAY")}>Back</button>
                        <h2>Tema</h2>
                        <textarea readOnly value={lastEssay.theme || "Sem tema"} style={{ resize: "none" }} />
                        <h2>Redação</h2>
                        {/* Aqui adicionei uns estilos no próprio textarea só para ficar mais visível, mas tu pode remover */}
                        <textarea readOnly value={lastEssay.title || "Sem tema"} style={{ resize: "none", height: "fit-content" }} />
                        <textarea readOnly value={lastEssay.content || "Sem tema"} style={{ display: "flex", resize: "none", height: "80vh" }} />
                    </div>
                    {/* Aqui para mim está auto explicativo */}
                    <div id="container-right">
                        <h1>{lastEssay.Final_Score}</h1>
                        <h2>Análise Geral</h2>
                        <p>{lastEssay.General_Analysis}</p>
                        <h2>Pontos por Competências</h2>
                        <p>1) {lastEssay.Competence1[0]}</p>
                        <p>2) {lastEssay.Competence2[0]}</p>
                        <p>3) {lastEssay.Competence3[0]}</p>
                        <p>4) {lastEssay.Competence4[0]}</p>
                        <p>5) {lastEssay.Competence5[0]}</p>
                        <h2>Modelo de Correção: {lastEssay.model}</h2>
                    </div>
                </main>
            );

        default:
            return <main><h1>Página não encontrada</h1></main>;
    }
}
