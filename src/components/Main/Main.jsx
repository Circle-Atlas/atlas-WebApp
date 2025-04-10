import { useState, useEffect, useRef } from "react";
import { AnalyzeEssay } from "../../api/aixplain.js";
import { SaveEssay, GetEssays, SaveEssayDraft, DeleteEssayDraft, GetEssayDrafts, DeleteEssay } from "../../database/essays.js";

export default function Main({ MAIN }) {
  // Igonra isso
  
  const user = JSON.parse(localStorage.getItem("USER"));

  const [selectedMain, setSelectedMain] = useState(MAIN);
  const [essays, setEssays] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ number: 1, title: 1, points: "", analysis: "" });

  const [theme, setTheme] = useState("");
  const [model, setModel] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [draftId, setDraftId] = useState(null);
  const timeoutRef = useRef(null);

  //===========================================//
  //Estou criando aqui aquele mini-menu de apagar e compartilhar as redações

    //===========================================//

  async function fetchEssays() {
    const fetchedEssays = await GetEssays();
    setEssays(fetchedEssays || []);

    const fetchedDrafts = await GetEssayDrafts();
    console.log("Rascunhos recebidos:", fetchedDrafts);
    setDrafts(fetchedDrafts || []);
  }

  //===========================================//

  //Estou criando aqui aquele mini-menu de apagar e compartilhar as redações

  //===========================================//

  useEffect(() => {
     if (selectedMain === "MAIN_MENU") {
        fetchEssays();
    }
}, [selectedMain]);

useEffect(() => {
  if (selectedMain === "WRITE_ESSAY" && (title || content || theme)) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            SaveEssayDraft({
                id: draftId,
                theme,
                model,
                title,
                content,
            }).then(res => {
                if (res.success && !draftId) {
                    setDraftId(res.id); 
                }
            });
            console.log("Salvando rascunho...");
        }, 2000);
    }
}, [theme, model, title, content, selectedMain]);

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
                        
                    </button>
                    <button id="temas-menu">
                      
                    </button>
                    <img id="logo-atlas-menor-menu" src="./src/assets/logo-atlas-menor.png" alt="logo-atlas"/>
                </div>
                <header>
            <div id="card-menu">
               <div id="left-container-menu">
                 <div id="greetings-container">
                 <h1 id="greetings-h1">
                   {(() => {
                     const hour = new Date().getHours();
                     let greeting = "Boa noite";
 
                     if (hour >= 2 && hour < 12) {
                       greeting = "Bom dia";
                     } else if (hour >= 12 && hour < 18) {
                       greeting = "Boa tarde";
                     }
 
                     const fullName = JSON.parse(localStorage.getItem("USER"))?.displayName || "Usuário";
                     const firstName = fullName.split(" ")[0]; // Pega apenas o primeiro nome
 
                     return `${greeting}, ${firstName}!`;
                   })()}
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
                  onClick={() => {
                    setSelectedMain("WRITE_ESSAY") 
                    setTheme("");
                    setModel("");
                    setTitle("");
                    setContent("");
                    setDraftId(null);
                  }}
                >
                  Escrever Redação
                </button>
              </div>
              <div id="corrected-essays-container">
                {/* Aqui ele faz um loop e para cada redação corrigida ele cria uma div com a class "corrected-essay" 
                 e com o tema e a pontuação final */}
                 <div id="redacao-corrigida">
                    <h3>Redações Corrigidas</h3>
                    <a href="#">Ver tudo</a>
                 </div>
                <div id="conteudo-corrected-essay-carrosel">
                  <div id="corrected-essay-carrosel">
                    {essays.length > 0 ? (
                      essays.map((essay) => (
                        <div className="corrected-essay" key={essay.id}>
                          <div id="corrected-header">
                            <span id="corrected-time">há 6 min</span>
                            <button id="corrected-menu">
                              <img src="./src/assets/tres-bolinhas.png" alt="tres-bolinhas" />
                            </button>
                          </div>

                            <div id="essay-options">
                              <button id="share-essay">Compartilhar</button>
                              <button id="delete-essay" onClick={async () => {
                                await DeleteEssay(essay.id);
                                fetchEssays();
                              }}>Apagar</button>
                            </div>

                          <p id="themeFinalScore">{essay.theme}</p>
                          <div id="corrected-footer">
                            <p id="NumberFinalScore">{essay.finalScore}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="corrected-essay">
                        <p id="corrected-essay-mensage">Você não corrigiu nenhuma redação!</p>
                      </div>
                    )}
                  </div>
                  <div id="draft-essays-container">
                   <div id="rascunho">
                     <h3>Rascunhos</h3>
                     <a href="#">Ver tudo</a>
                  </div>
                  <div id="ver-tudo">
                        
                  </div>
                  <div id="conteudo-draft-essay-carrosel">
                    <div id="draft-essay-carrosel">
                            {drafts.length > 0 ? (
                              drafts.map((draft) => (
                                <div className="draft-essay" key={draft.id} style={{ cursor: "pointer" }}>
                                  <div id="corrected-header">
                                    <span id="corrected-time">há 6 min</span>
                                    <button id="corrected-menu">
                                      <img src="./src/assets/tres-bolinhas.png" alt="tres-bolinhas" />
                                    </button>
                                  </div>
                                <div id="essay-options">
                                  <button id="delete-essay" onClick={async () => {
                                    await DeleteEssayDraft(draft.id);
                                    fetchEssays();
                                  }}>Apagar</button>
                                </div>

                                <textarea wrap="hard" rows={4}  id="themeFinalScore-draft"  readOnly value={draft.theme || "Sem tema"} onClick={() => {
                                    setSelectedMain("WRITE_ESSAY")
                                    setTitle(draft.title);
                                    setTheme(draft.theme);
                                    setContent(draft.content);
                                    setModel(draft.model);
                                    setDraftId(draft.id);
                                  }}> </textarea>
                                  {console.log(draft)}

                              {/*
                              <p id="themeFinalScore">{essay.theme}</p>
                              */}

                                </div>
                              ))
                            ) : (
                              <div className="draft-essay">
                                <p>Você não tem nenhum rascunho salvo!</p>
                              </div>
                            )}
                  </div>
                   </div>
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
            <button id="jornada-redacao"></button>
            <button id="temas-redacao"></button>
            <img
              id="logo-atlas-menor-redacao"
              src="./src/assets/logo-atlas-menor.png"
              alt="logo-atlas"
            />
          </div>
          <div id="card-redacao">
          <div id="container-left-redacao">
          <button
                id="back-btn"
                onClick={() => {
                  setSelectedMain("MAIN_MENU")
                  fetchEssays()
                  setTheme("");
                  setModel("");
                  setTitle("");
                  setContent("");
                  setDraftId(null);
                }}
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
                  <input type="text" id="theme" placeholder="Digite aqui..." value={theme} onChange={e => setTheme(e.target.value)} />
                  <button id="hamburguer"></button>
                </div>
                <input type="file" id="file-essay" accept=".jpg,.png,.pdf" />
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
                      setModel("ENEM");
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
                      setModel("UERJ");
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
                        analysis.aiModel,
                        title,
                        content,
                        analysis.General_Analysis,
                        analysis.Final_Score,
                        analysis.Competence1[1],
                        analysis.Competence2[1],
                        analysis.Competence3[1],
                        analysis.Competence4[1],
                        analysis.Competence5[1],
                        analysis.Competence1[0],
                        analysis.Competence2[0],
                        analysis.Competence3[0],
                        analysis.Competence4[0],
                        analysis.Competence5[0],
                      );

                      if (essaySaved.success) {
                        await DeleteEssayDraft(draftId);
                        setDraftId(null);
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
                value={title}
                onChange={e => setTitle(e.target.value)}
              ></textarea>
              <textarea
                id="essay-content"
                placeholder="Digite aqui sua redação"
                value={content}
                onChange={e => setContent(e.target.value)}
              ></textarea>
            </div>
          </div>
        </main>
      );
    // Página após correção da redação
    case "ESSAY_CORRECTION":
      const lastEssay = JSON.parse(localStorage.getItem("LastEssay")) || {};

      return (
        <main>
          <img id="detalhe-fundo-correcao-redacao" src="./src/assets/detalhe-fundo.png" alt="detalhe-fundo" />
          <div id="nav-bar-correcao-redacao">
            <button id="icone-correcao-redacao"></button>
            <button id="jornada-correcao-redacao"></button>
            <button id="temas-correcao-redacao"></button>
            <img id="logo-atlas-menor-correcao-redacao" src="./src/assets/logo-atlas-menor.png" alt="logo-atlas" />
          </div>

          <div id="card-correcao-redacao">
            <div id="container-left-correcao-redacao">
              <button id="back-btn-correcao-redacao" onClick={() => setSelectedMain("MAIN_MENU")}></button>
              <div id="tema">
                <h2>Tema</h2>
                <textarea id="textoTema" readOnly value={lastEssay.theme || "Sem tema"} style={{ resize: "none" }} />
              </div>
              <h2>Redação</h2>
              <textarea id="temaRedacao" readOnly value={lastEssay.title || "Sem tema"} style={{ resize: "none", height: "fit-content" }} />
              <textarea id="redacao" readOnly value={lastEssay.content || "Sem tema"} style={{ display: "flex", resize: "none", height: "48vh" }} />
            </div>

            <div id="container-right-correcao-redacao">
              <button id="btn-share">
                <img src="./src/assets/button-share.png" alt="botao-compartilhar" />
              </button>
              <img id="confete" src="./src/assets/confete.png" alt="confete" />
              <h1 id="finalScore">{lastEssay.Final_Score}</h1>
              <h2 id="analiseGeral">Análise Geral</h2>
              <textarea id="analiseGeralTexto" readOnly value={lastEssay.General_Analysis}></textarea>

              <h2 id="point-comp">Pontos por Competências</h2>
              <div id="quadro-competencias">
                {[1, 2, 3, 4, 5].map((n) => (
                  <p
                    key={n}
                    onClick={() => {
                      setModalData({
                        number: n,
                        title: lastEssay.Competences[n],
                        points: lastEssay[`Competence${n}`][0],
                        analysis: lastEssay[`Competence${n}`][1]
                      });
                      setShowModal(true);
                    }}
                  >
                    <span id="comp-number"><span id={`number${n}`}>{n}</span></span>
                    <span id="result-competencia">{lastEssay[`Competence${n}`][0]}</span>
                  </p>
                ))}
              </div>

              <div id="title-model-redacao">
                <h2>Modelo de Correção: <span id="model-correcao">{lastEssay.model}</span></h2>
              </div>
            </div>
          </div>

          {showModal && (
            <ModalAnalysis
              number={modalData.number}
              title={modalData.title}
              points={modalData.points}
              analysis={modalData.analysis}
              onClose={() => setShowModal(false)}
            />
          )}
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

function ModalAnalysis({ number, title, points, analysis, onClose }) {
  //Adicionei estilos inline para o modal, mas você pode fazer no css
  return (
    <div id="modal-analysis">
      <div id="modal-analysis-card">
        <button id="btn-modal-analysis" onClick={onClose}>×</button>
        <div id="modal-analysis-card-content">
          <h1>Competência {number}</h1>
          <h2>{title}</h2>
          <div id="modal-analysis-points-analysis">
            <p id="modal-points">{points} Pontos</p>
            <p>{analysis}</p>
          </div>
        </div>
      </div>
    </div>
  );
 }