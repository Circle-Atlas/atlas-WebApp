import { useState, useEffect, useRef } from "react";
import { AnalyzeEssay } from "../../api/aixplain.js";
import { SaveEssay, GetEssays, SaveEssayDraft, DeleteEssayDraft, GetEssayDrafts, DeleteEssay } from "../../database/essays.js";
import { OCRGoogleAPI } from "../../api/ocr.js";
import confetti from "canvas-confetti";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import DETALHE_FUNDO from "../../assets/detalhe-fundo.png"
import LOGO_ATLAS_MENOR from "../../assets/logo-atlas-menor.png"
import BACK_ICON_LEFT from "../../assets/backIcon.png"
import BACK_ICON_RIGHT from "../../assets/backIconDois.png"
import BTN_SHARE from "../../assets/button-share.png"
import CAMERA from "../../assets/camera.png"
import ICON_FILE from "../../assets/icon-file.png"
import MENINA_ESCREVENDO from "../../assets/meninaEscrevendo.png"
import TRES_BOLINHAS from "../../assets/tres-bolinhas.png"

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

  const [filename, setFileName] = useState("")
  const [imgsrc, setImgSrc] = useState("")
  const [showOverlay, setShowOverlay] = useState(false);
 
  const [imageBase64, setImageBase64] = useState(null);

  const timeoutRef = useRef(null);

  const [loading, setLoading] = useState(false);

  {/*
    
  Criacao do Menu do compartilhar e apagar  
  
  */}

    const [openMenuId, setOpenMenuId] = useState(null);

    const menuRef = useRef();

    const toggleMenu = (id) => {
      setOpenMenuId(prevId => (prevId === id ? null : id));
    };

  {/*
    
    ================================================================

  */}

  {/*

    Setas para navegar nas redações e nos rascunhos

  */}

  const carrosselRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const verificarSetas = () => {
    const carrossel = carrosselRef.current;
    if (!carrossel) return;

    const scrollEsquerda = carrossel.scrollLeft;
    const scrollMaximo = carrossel.scrollWidth - carrossel.clientWidth;

    setShowLeftArrow(scrollEsquerda > 0);
    setShowRightArrow(scrollEsquerda < scrollMaximo - 5);
  };

  const rolarCarrossel = (pixels) => {
    carrosselRef.current.scrollBy({ left: pixels, behavior: "smooth" });
  };

  useEffect(() => {
    verificarSetas();
    const carrossel = carrosselRef.current;
    carrossel.addEventListener("scroll", verificarSetas);

    return () => {
      carrossel.removeEventListener("scroll", verificarSetas);
    };
  }, []);

  {/*
    
    DraftEssay

  */}

  const carrosselDraftRef = useRef(null);
  const [showLeftArrowDraft, setShowLeftArrowDraft] = useState(false);
  const [showRightArrowDraft, setShowRightArrowDraft] = useState(true);

  const verificarSetasDraft = () => {
    const carrosselDraft = carrosselDraftRef.current;
    if (!carrosselDraft) return;

    const scrollEsquerda = carrosselDraft.scrollLeft;
    const scrollMaximo = carrosselDraft.scrollWidth - carrosselDraft.clientWidth;

    setShowLeftArrow(scrollEsquerda > 0);
    setShowRightArrow(scrollEsquerda < scrollMaximo - 5);
  };

  const rolarCarrosselDraft = (pixels) => {
    carrosselDraftRef.current.scrollBy({ left: pixels, behavior: "smooth" });
  };

  useEffect(() => {
    verificarSetas();
    const carrosselDraft = carrosselDraftRef.current;
    carrosselDraft.addEventListener("scroll", verificarSetas);

    return () => {
      carrosselDraft.removeEventListener("scroll", verificarSetas);
    };
  }, []);


  {/*
    
    ================================================================

  */}

  async function fetchEssays() {
    const fetchedEssays = await GetEssays();
    setEssays(fetchedEssays || []);

    const fetchedDrafts = await GetEssayDrafts();
    console.log("Rascunhos recebidos:", fetchedDrafts);
    setDrafts(fetchedDrafts || []);
  }
  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
  
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1]; 
      setImageBase64(base64);
  
      setLoading(true);
      try {
        const transcription = await OCRGoogleAPI(base64);
        setContent(transcription);
        setFileName(file.name);
        setImgSrc(reader.result)
      } catch (error) {
        console.error("Erro ao processar a imagem:", error);
      }
      setLoading(false);
    };
  
    reader.readAsDataURL(file);
  }


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

useEffect(() => {
  if (selectedMain === "ESSAY_CORRECTION") {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = 9999;
    canvas.style.backgroundColor = "transparent";

    document.body.appendChild(canvas);

    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    });

    myConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.4, x: 0.8 },
    });

    setTimeout(() => {
      document.body.removeChild(canvas);
    }, 5000); 
  }
}, [selectedMain]);

const [animatedScore, setAnimatedScore] = useState(0);

useEffect(() => {
  if (selectedMain === "ESSAY_CORRECTION") {
    const essay = JSON.parse(localStorage.getItem("LastEssay")) || {};
    let start = 0;
    const end = essay.Final_Score || 0;
    const duration = 1000;
    const stepTime = 10;

    const increment = (end / duration) * stepTime;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setAnimatedScore(Math.round(start));
    }, stepTime);

    return () => clearInterval(timer); // limpa o intervalo ao desmontar
  }
}, [selectedMain]);

  // Até aqui
  if (loading) {
    return (
      <div id="loading-overlay">
        <div class="loader">
        </div>
        <p>Carregando...</p>
      </div>
    );
  }

  switch (selectedMain) {
    // Página principal
    case "MAIN_MENU":
        return (
            <main>
                <img id="detalhe-fundo-menu" src={DETALHE_FUNDO} alt="detalhe-fundo" />
                <div id="nav-bar-menu">
                    <button id="icone-menu"></button>
                    <button id="jornada-menu">
                        
                    </button>
                    <button id="temas-menu">
                      
                    </button>
                    <img id="logo-atlas-menor-menu" src={LOGO_ATLAS_MENOR} alt="logo-atlas"/>
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
                     const firstName = fullName.split(" ")[0];
 
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
                  
                <div id="conteudo-carrosel">
                
                  <button className="seta-esquerda" onClick={() => rolarCarrossel(-300)}>
                    <img src={BACK_ICON_LEFT} alt="" />
                  </button>
                
                
                  <button className="seta-direita" onClick={() => rolarCarrossel(300)}>
                    <img src={BACK_ICON_RIGHT} alt="" />
                  </button>
                
                  <div id="corrected-essay-carrosel" ref={carrosselRef}>
                    {essays.length > 0 ? (
                      essays.map((essay) => (
                        <div className="corrected-essay" key={essay.id} ref={menuRef}>
                          <div id="corrected-header">
                          <p id="corrected-time">há 6 min</p>
                          <button id="corrected-menu" onClick={() => toggleMenu(essay.id)}>
                              <img src={TRES_BOLINHAS} alt="tres bolinhas" />
                            </button>
                          </div>
                          <p id="themeFinalScore">{essay.theme}</p>
                          {openMenuId === essay.id && (
                            <div id="essay-options">
                              <div id="essay-option-item">
                                <button id="share-essay">Compartilhar</button>
                                <button id="delete-essay" onClick={async () => {
                                  await DeleteEssay(essay.id);
                                  fetchEssays();
                                }}>Apagar</button>
                              </div>
                            </div>
                          )}
                           <div id="corrected-footer">
                                <p id="NumberFinalScore">{essay.finalScore}</p>
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="corrected-essay">
                        <p>Você não corrigiu nenhuma redação!</p>
                      </div>
                    )}
                  </div>
                  <div id="draft-essays-container">
                  <div id="rascunho">
                    <h3>Rascunhos</h3>
                    <a href="#">Ver tudo</a>
                  </div>

                  <button className="seta-esquerda" onClick={() => rolarCarrosselDraft(-300)}>
                    <img src={BACK_ICON_LEFT} alt="seta-esquerda" />
                  </button>
                
                  <button className="seta-direita" onClick={() => rolarCarrosselDraft(300)}>
                    <img src={BACK_ICON_RIGHT} alt="seta-direita" />
                  </button>

                    <div id="draft-essay-carrosel" ref={carrosselDraftRef}>
                    {drafts.length > 0 ? (
                           drafts.map((draft) => (
                             <div className="draft-essay" key={draft.id} style={{ cursor: "pointer" }}>
                              <div id="draft-header">
                                <p id="draft-time">há 6 min</p>
                                <button id="draft-menu" onClick={() => toggleMenu(draft.id)}>
                                  <img src={TRES_BOLINHAS} alt="tres bolinhas" />
                                </button>
                              </div>
                              {openMenuId === draft.id && (
                                <div id="essay-options">
                                <div id="essay-option-item">
                                     <button id="delete-essay" onClick={async () => {
                                       await DeleteEssayDraft(draft.id);
                                       fetchEssays();
                                     }}>Apagar</button>
                                   </div>
                                </div>
                              )}
                                <p id="themeFinalScore-draft" readOnly onClick={(event) => {
                                 setSelectedMain("WRITE_ESSAY")
                                 setTitle(draft.title);
                                 setTheme(draft.theme);
                                 setContent(draft.content);
                                 setModel(draft.model);
                                 setDraftId(draft.id);
                               }} >{draft.theme || "Sem tema"}</p>
                               {console.log(draft)}
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
            src={DETALHE_FUNDO}
            alt="detalhe-fundo"
          />
          <div id="nav-bar-redacao">
            <button id="icone-redacao"></button>
            <button id="jornada-redacao"></button>
            <button id="temas-redacao"></button>
            <img
              id="logo-atlas-menor-redacao"
              src={LOGO_ATLAS_MENOR}
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
                  setImgSrc("");
                  setFileName("");
                }}
              ></button>
              <img
                id="meninaEscrevendo"
                src={MENINA_ESCREVENDO}
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
                <label for="file-essay" class="custom-file-essay">
                  <img src={CAMERA} alt="camera" id="camera-icon" />
                  Carregar foto
                </label>
                <input id="file-essay" type="file" accept=".jpg,.png,.webp" onChange={handleFileChange}/>
                {/*
                <input type="file" id="file-essay" accept=".jpg,.png,.pdf"/>
                */}
                <label htmlFor="model">
                  Qual o <span id="temaRoxo">modelo de correção?</span>
                </label>
                <div id="model">
                  <button
                    className="modelType"
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
                    setLoading(true);
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
                        draftId,
                        imageBase64
                      );
                      

                      if (essaySaved.success) {
                        await DeleteEssayDraft(draftId);
                        setDraftId(null);
                        setSelectedMain("ESSAY_CORRECTION");
                        
                      } else {
                        alert("Erro ao salvar redação.");
                      }
                    }

                    setLoading(false);
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
              <div id="file-container">
                {/*
                <img src="./src/assets/icon-file.png" alt="" />
                */}
                <p
                  id="file-name"
                  style={{ cursor: "pointer", textDecoration: "none" }}
                  onClick={() => setShowOverlay(true)}
                >
                  {filename}
                </p>
              </div>
               
               {showOverlay && (
                 <div
                   id="overlay-img"
                   style={{
                     position: "fixed",
                     top: 0,
                     left: 0,
                     width: "100vw",
                     height: "100vh",
                     backgroundColor: "rgba(0,0,0,0.8)",
                     zIndex: 1000,
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                   }}
                 >
                   <button
                     id="close-img-btn"
                     onClick={() => setShowOverlay(false)} // isso aqui depende do seu state handler
                     style={{
                       position: "absolute",
                       top: "20px",
                       right: "20px",
                       background: "transparent",
                       border: "none",
                       color: "#fff",
                       fontSize: "2rem",
                       cursor: "pointer",
                     }}
                   >
                     ×
                   </button>
                   <img
                     src={imgsrc}
                     alt="Preview da Imagem"
                     style={{
                       maxWidth: "80vw",
                       maxHeight: "90vh",
                       objectFit: "contain",
                       borderRadius: "8px",
                     }}
                   />
                 </div>
               )}
            </div>
          </div>
        </main>
      );
    // Página após correção da redação
    case "ESSAY_CORRECTION": 
    const lastEssay = JSON.parse(localStorage.getItem("LastEssay")) || {};
      return (
        <main>
          <img id="detalhe-fundo-correcao-redacao" src={DETALHE_FUNDO} alt="detalhe-fundo" />
          <div id="nav-bar-correcao-redacao">
            <button id="icone-correcao-redacao"></button>
            <button id="jornada-correcao-redacao"></button>
            <button id="temas-correcao-redacao"></button>
            <img id="logo-atlas-menor-correcao-redacao" src={LOGO_ATLAS_MENOR} alt="logo-atlas" />
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
                <img src={BTN_SHARE} alt="botao-compartilhar" />
              </button>
              <CircularProgressbar
                 value={animatedScore}
                 maxValue={1000}
                 text={`${animatedScore}`}
                 styles={buildStyles({
                   pathColor: "#00b3a7",
                   textColor: "#00b3a7",
                   trailColor: "#f0f0f0",
                   textSize: "20px",
                   strokeLinecap: "round",
                 })}
               />
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
            <p>{points} Pontos</p>
            <p>{analysis}</p>
          </div>
        </div>
      </div>
    </div>
  );
}