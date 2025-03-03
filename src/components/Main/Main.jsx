import { useState } from "react";
import { AnalyzeEssay } from "../../api/aixplain.js";

export default function Main({ MAIN }) {
    const [selectedMain, setSelectedMain] = useState(MAIN);

    switch (selectedMain) {
        case "MAIN_MENU":
            return (
                <main>
                    <header>
                        <div id="greetings-container">
                            <h1 id="greetings-h1">
                                Bom dia, {JSON.parse(localStorage.getItem("USER"))?.displayName || "Usuário"}!
                            </h1>
                            <p id="greetings-p">“Aprender é crescer, sempre em frente!”</p>
                        </div>
                        <div id="new-essay-container">
                            <button id="new-essay" onClick={() => setSelectedMain("WRITE_ESSAY")}>
                                Escrever Redação
                            </button>
                        </div>
                    </header>
                    <section></section>
                </main>
            );

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
                                setSelectedMain("ESSAY_CORRECTION");
                            }
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
                        <textarea readOnly value={lastEssay.title || "Sem tema"} style={{ resize: "none", height: "fit-content" }} />
                        <textarea readOnly value={lastEssay.content || "Sem tema"} style={{ display: "flex", resize: "none", height: "80vh" }} />
                    </div>

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
