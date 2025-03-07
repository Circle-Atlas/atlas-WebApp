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
                <img id="detalhe-fundo-menu" src="./src/assets/detalhe-fundo.png" alt="detalhe-fundo" />
                <div id="nav-bar-menu">
                    <button id="icone-menu"></button>
                    <button id="jornada-menu">
                        Jornada
                    </button>
                    <button id="temas-menu">
                        Temas
                    </button>
                    <img id="logo-atlas-menu" src="./src/assets/logo-atlas.png" alt="logo-atlas"/>
                </div>
                <header>
            <div id="card-menu">
              <div id="left-container-menu">
                <div id="greetings-container">
                  <h1 id="greetings-h1">
                    Bom dia,{" "}
                    {JSON.parse(localStorage.getItem("USER"))?.displayName ||
                      "Usuário"}
                    !
                  </h1>
                  <p id="greetings-p">
                    “Aprender é crescer, sempre em frente!”
                  </p>
                </div>
              </div>
              <div id="right-container-menu">
              <div id="new-essay-container">
                <button
                  id="new-essay"
                  onClick={() => setSelectedMain("WRITE_ESSAY")}
                >
                  Escrever Redação
                </button>
              </div>
              <div id="corrected-essays-container">
                {/* Aqui ele faz um loop e para cada redação corrigida ele cria uma div com a class "corrected-essay" 
                 e com o tema e a pontuação final */}
                 <div id="redacao-corrigida">
                    <h3>Redações Corrigidas</h3>
                 </div>
                 <div id="ver-tudo">
                    <a href="#">Ver tudo</a>
                 </div>
                <div id="conteudo-carrosel">
                  <div id="corrected-essay-carrosel">
                    {essays.length > 0 ? (
                      essays.map((essay) => (
                        <div className="corrected-essay" key={essay.id}>
                          <p id="themmeFinalScore">{essay.theme}</p>
                          <p id="NumberFinalScore">{essay.finalScore}</p>
                        </div>
                      ))
                    ) : (
                      <div className="corrected-essay">
                        <p>Você não corrigiu nenhuma redação!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
          <img
            id="detalhe-fundo-redacao"
            src="./src/assets/detalhe-fundo.png"
            alt="detalhe-fundo"
          />
          <div id="nav-bar-redacao">
            <button id="icone-redacao"></button>
            <button id="jornada-redacao">Jornada</button>
            <button id="temas-redacao">Temas</button>
            <img
              id="logo-atlas-redacao"
              src="./src/assets/logo-atlas.png"
              alt="logo-atlas"
            />
          </div>
          <div id="card-redacao">
          <div id="container-left-redacao">
          <button
                id="back-btn"
                onClick={() => setSelectedMain("MAIN_MENU")}
              ></button>
              <img
                id="meninaEscrevendo"
                src="./src/assets/meninaEscrevendo.png"
                alt="Menina Escrevendo"
              />
              <div id="inf-redacao">
                <label htmlFor="theme">
                  Qual é o tema da sua <span id="temaRoxo">redação</span>?
                </label>
                <div id="text-redacao">
                  <input type="text" id="theme" placeholder="Digite aqui..." />
                  <button id="hamburguer"></button>
                </div>
                <label htmlFor="model">
                  Qual o <span id="temaRoxo">modelo de correção?</span>
                </label>
                <div id="model">
                  <button
                    className="modelType selected"
                    onClick={(event) => {
                      document
                        .querySelector(".modelType.selected")
                        ?.classList.remove("selected");
                      event.target.classList.add("selected");
                    }}
                  >
                    ENEM
                  </button>
                  <button
                    className="modelType"
                    onClick={(event) => {
                      document
                        .querySelector(".modelType.selected")
                        ?.classList.remove("selected");
                      event.target.classList.add("selected");
                    }}
                  >
                    UERJ
                  </button>
                </div>
                <button
                  id="correct"
                  onClick={async () => {
                    // Isso tu ignora pois é o que vai acontecer no click do botão
                    // que no caso vai enviar para a API corrigir a redação

                    const title =
                      document.getElementById("essay-title").value.trim() ||
                      "Sem título";
                    const content = document
                      .getElementById("essay-content")
                      .value.trim();
                    const theme =
                      document.getElementById("theme").value.trim() ||
                      "Sem tema";
                    const model =
                      document.querySelector(".modelType.selected")
                        ?.innerHTML || "Sem modelo";

                    if (content === "") {
                      alert("Você deve digitar algo.");
                      return;
                    }

                    const analysis = await AnalyzeEssay(
                      theme,
                      model,
                      title,
                      content
                    );

                    if (analysis) {
                      localStorage.setItem(
                        "LastEssay",
                        JSON.stringify({
                          ...analysis,
                          title,
                          content,
                          theme,
                          model,
                        })
                      );
                      const essaySaved = await SaveEssay(
                        theme,
                        model,
                        title,
                        content,
                        analysis.General_Analysis,
                        analysis.Final_Score
                      );

                      if (essaySaved.success) {
                        setSelectedMain("ESSAY_CORRECTION");
                      } else {
                        alert("Erro ao salvar redação.");
                      }
                    }

                    // Até aqui
                  }}
                >
                  Corrigir
                </button>
              </div>
            </div>
            <div id="container-right-redacao">
              <textarea
                id="essay-title"
                placeholder="Título da redação"
              ></textarea>
              <textarea
                id="essay-content"
                placeholder="Digite aqui sua redação"
              ></textarea>
            </div>
          </div>
        </main>
      );
    // Página após correção da redação
    case "ESSAY_CORRECTION":
      const lastEssay = JSON.parse(localStorage.getItem("LastEssay")) || {};
      console.log(lastEssay);

      return (
        <main>
          <img
            id="detalhe-fundo-correcao-redacao"
            src="./src/assets/detalhe-fundo.png"
            alt="detalhe-fundo"
          />
          <div id="nav-bar-correcao-redacao">
            <button id="icone-correcao-redacao"></button>
            <button id="jornada-correcao-redacao">Jornada</button>
            <button id="temas-correcao-redacao">Temas</button>
            <img
              id="logo-atlas-correcao-redacao"
              src="./src/assets/logo-atlas.png"
              alt="logo-atlas"
            />
          </div>
          <div id="card-correcao-redacao">
            <div id="container-left-correcao-redacao">
              <button
                id="back-btn-correcao-redacao"
                onClick={() => setSelectedMain("WRITE_ESSAY")}
              ></button>
              <div id="tema">
                <h2>Tema</h2>
                <textarea
                  id="textoTema"
                  readOnly
                  value={lastEssay.theme || "Sem tema"}
                  style={{ resize: "none" }}
                />
              </div>
              <h2>Redação</h2>
              {/* Aqui adicionei uns estilos no próprio textarea só para ficar mais visível, mas tu pode remover */}
              <textarea id="temaRedacao"
                readOnly
                value={lastEssay.title || "Sem tema"}
                style={{ resize: "none", height: "fit-content" }}
              />
              <textarea id="redacao"
                readOnly
                value={lastEssay.content || "Sem tema"}
                style={{ display: "flex", resize: "none", height: "48vh" }}
              />
            </div>
          </div>
          {/* Aqui para mim está auto explicativo */}
          <div id="container-right-correcao-redacao">
            <h1 id="finalScore">{lastEssay.Final_Score}</h1>
            <h2 id="analiseGeral">Análise Geral</h2>
            <textarea id="analiseGeralTexto" readOnly value={lastEssay.General_Analysis}></textarea>
            {/*<p>{lastEssay.General_Analysis}</p>*/}
            <h2 id="point-comp">Pontos por Competências</h2>
            <div id="quadro-competencias"> 
            <p><span id="comp-number"><span id="number1">1</span></span><span id="result-competencia">{lastEssay.Competence1[0]}</span></p>
            <p><span id="comp-number"><span id="number1">2</span></span><span id="result-competencia">{lastEssay.Competence1[0]}</span></p>
            <p><span id="comp-number"><span id="number1">3</span></span><span id="result-competencia">{lastEssay.Competence1[0]}</span></p>
            <p><span id="comp-number"><span id="number1">4</span></span><span id="result-competencia">{lastEssay.Competence1[0]}</span></p>
            <p><span id="comp-number"><span id="number1">5</span></span><span id="result-competencia">{lastEssay.Competence1[0]}</span></p>
            
            </div>
            <h2>Modelo de Correção: <span id="model-correcao">{lastEssay.model}</span></h2>
          </div>
        </main>
      );

    default:
      return (
        <main>
          <h1>Página não encontrada</h1>
        </main>
      );
  }
}
