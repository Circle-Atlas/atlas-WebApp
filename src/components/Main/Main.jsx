import { useState } from "react"

export default function Main({MAIN}) {
    const [ selectedMain, setSelectedMain ] = useState(MAIN)

    switch(selectedMain) {
        case "MAIN_MENU":
            return(
                <main>
                    <header>
                        <div id="greetings-container">
                            <h1 id="greetings-h1">Bom dia, {JSON.parse(localStorage.getItem("USER")).displayName}!</h1>
                            <p id="greetings-p">“Aprender é crescer, sempre em frente!”</p>
                        </div>
                        <div id="new-essay-container">
                            <button id="new-essay" onClick={() => { setSelectedMain("WRITE_ESSAY") }}>Escrever Redação</button>
                        </div>
                    </header>
                    <section>
                        
                    </section>
                </main>
            )
        case "WRITE_ESSAY":
            return(
                <main>
                    <div id="container-left">
                        <button id="back-btn" onClick={() => setSelectedMain("MAIN_MENU")}>Back</button>

                        <img src="" alt="Menina Escrevendo" />

                        <label htmlFor="theme">Qual é o tema da sua redação?</label>
                        <input type="text" id="theme"/>

                        <label htmlFor="model">Qual o modelo de correção?</label>
                        <div id="model">
                        <button className="modelType" onClick={(event) => {
                            const selected = document.querySelector(".modelType.selected");
                            if (selected) {
                                selected.classList.remove("selected");
                            }
                            event.target.classList.add("selected");
                        }}>
                            ENEM
                        </button>

                        <button className="modelType" onClick={(event) => {
                            const selected = document.querySelector(".modelType.selected");
                            if (selected) {
                                selected.classList.remove("selected");
                            }
                            event.target.classList.add("selected");
                        }}>
                            UERJ
                        </button>

                        </div>
                        <button id="correct">Corrigir</button>
                    </div>
                    <div id="container-right">
                        <textarea id="essay-title" placeholder="Título da redação"></textarea>
                        <textarea id="essay-content" placeholder="Digite aqui sua redação"></textarea>
                    </div>
                </main>
            )
    }
}