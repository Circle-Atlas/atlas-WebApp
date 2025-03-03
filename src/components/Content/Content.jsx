import { useState } from "react"

export default function Content() {

    const [selectedPage, setSelectedPage] = useState("LOGIN");

    switch (selectedPage) {
        case "LOGIN":
            return(
                <div id="page-login">
                    <div id="container-left">
                        <h2 id="bem-vindo-h2-container">
                            Bem-vindo ao<br></br>
                            <img id="logo-atlas" src="" alt="Logo Atlas" />
                            Um app educacional projetado<br></br>
                            especialmente para auxiliar você na sua redação nos vestibulares.
                        </h2>
                    </div>
                    <div id="container-right">
                        <div id="card-login">
                            <h3 id="bem-vindo-card-login">Olá, bem-vindo :D</h3>
                            <p id="link-register">Novo por aqui? <a href="#" onClick={(e) => { e.preventDefault(); setSelectedPage("REGISTER"); }}>Crie sua conta!</a></p>
                            <div id="inputs-container">
                                <div id="input-email">
                                    <input type="email" id="email" />
                                </div>
                                <div id="input-password">
                                    <input type="password" id="password" />
                                </div>
                            </div>
                            <div id="buttons-container">
                                <button id="btn-login">Entrar</button>
                                <a href="" id="esqueci-senha" onClick={(e) => { e.preventDefault(); setSelectedPage("FORGOT_PASSWORD"); }}>Esqueci minha senha</a>
                            </div>
                            <p id="p-ou">OU</p>
                            <div id="buttons-login-api">
                                <button id="btn-apple"></button>
                                <button id="btn-google"></button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        case "REGISTER":
            return console.log("Register")
        default:
            return <div>Página não encontrada</div>;
    }
}
