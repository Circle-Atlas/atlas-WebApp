import { useEffect, useState } from "react"
import { SignIn, SignUp } from "../../database/authentication";
import Main from "../Main/Main";
import DETALHE_FUNDO from "../../assets/detalhe-fundo.png"
import LOGO_ATLAS from "../../assets/logo-atlas.png"

export default function Content() {

    const [selectedPage, setSelectedPage] = useState("LOGIN");

    useEffect(() => {
        if (localStorage.getItem("USER")) {
            setSelectedPage("HOME");
        }
    }, []);
    
    document.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
          document.getElementById("btn-login").click();
        }
    });
    
    switch (selectedPage) {

    // Página de Login
        case "LOGIN":
            return(
                <div id="page-login">
                    <img id="detalhe-fundo-login" src={DETALHE_FUNDO} alt="detalhe-fundo"/>
                    <div id="container-left-login">
                        <h2 id="bem-vindo-h2-container">
                            <p id="bem-vindo">Bem-vindo ao</p>
                            <img id="logo-atlas" src={LOGO_ATLAS} alt="Logo Atlas"/>
                            <p id="frase-destaque-login">Um app educacional projetado
                            especialmente para auxiliar você na sua redação nos vestibulares.</p>
                        </h2>
                    </div>
                    <div id="container-right-login">
                        <div id="card-login">
                            <div id="bem-vindo-card-login">
                            <h3 id="bem-vindo-card-login-2">Olá, bem-vindo :D</h3>
                            <p id="link-register-login">Novo por aqui? <a href="#" onClick={(e) => { e.preventDefault(); setSelectedPage("REGISTER"); }}>Crie sua conta!</a></p>
                            </div>
                            <div id="inputs-container">
                                <div id="input-email">
                                    <input type="email" id="email" placeholder="E-mail"/>
                                </div>
                                <div id="input-password">
                                    <input type="password" id="password" placeholder="Senha"/>
                                </div>
                            </div>
                            <div id="buttons-container-login">
                                <button id="btn-login" onClick={() => {SignIn("LOGIN_PASS", document.getElementById("email").value, document.getElementById("password").value)}}>Entrar</button>
                                <a href="" id="esqueci-senha-login" onClick={(e) => { e.preventDefault(); setSelectedPage("FORGOT_PASSWORD"); }}>Esqueci minha senha</a>
                            </div>
                            <div id="ou-linha">
                                <p>
                                  OU
                                </p>
                            </div>
                            <div id="buttons-login-api">
                                <button id="btn-apple" onClick={() => SignIn("LOGIN_APPLE")}></button>
                                <button id="btn-google" onClick={() => SignIn("LOGIN_GOOGLE")}></button>
                            </div>
                        </div>
                    </div>
                </div>
            )


    // Página de Cadastro
        case "REGISTER":
            return(
                <div id="page-cadastro">
                    <img id="detalhe-fundo-cadastro" src={DETALHE_FUNDO} alt="" />
                    <div id="container-left-cadastro">
                        <h2 id="bem-vindo-h2-container">
                            <p id="bem-vindo-cadastro">Bem-vindo ao</p>
                            <img id="logo-atlas" src={LOGO_ATLAS} alt="Logo Atlas"/>
                            <p id="frase-destaque-cadastro">Um app educacional projetado
                            especialmente para auxiliar você na sua redação nos vestibulares.</p>
                        </h2>
                    </div>
                    <div id="container-right-cadastro">
                        <div id="card-cadastro">
                            <div id="cadastro">
                            <h3 id="cadastro-1">Cadastrar</h3>
                            <p id="link-register-cadastro">Já possui conta? <a href="#" onClick={(e) => { 
                                 e.preventDefault(); 
                                 setSelectedPage("LOGIN"); 
                                 document.getElementById("register-name").value = ""
                                 document.getElementById("register-email").value = ""
                                 document.getElementById("register-password").value =""
                                 document.getElementById("confirm-password").value = ""
 
                             }}>Acesse!</a></p>
                            </div>
                            <div id="inputs-container">
                                <div id="input-name">
                                    <input type="text" id="register-name" placeholder="Nome"/>
                                </div>
                                <div id="input-email">
                                    <input type="email" id="register-email" placeholder="E-mail"/>
                                </div>
                                <div id="input-password">
                                    <input type="password" id="register-password" placeholder="Senha" />
                                </div>
                                <div id="input-confirm-password">
                                    <input type="password" id="confirm-password" placeholder="Confirmar senha"/>
                                </div>
                            </div>
                            <div id="buttons-container">
                                <button id="btn-login" onClick={async () => { 
                                    const resultSignUp = await SignUp(document.getElementById("register-name").value, document.getElementById("register-email").value, document.getElementById("register-password").value, document.getElementById("confirm-password").value)
                                    if (resultSignUp) {
                                        setSelectedPage("LOGIN")
                                        document.getElementById("register-name").value = ""
                                        document.getElementById("register-email").value = ""
                                        document.getElementById("register-password").value =""
                                        document.getElementById("confirm-password").value = ""
                                    }
                                    }}>Cadastrar</button>
                            </div>
                            <div id="ou-linha-cadastro">
                                <p>
                                    OU
                                </p>
                            </div>
                            <div id="buttons-login-api">
                                <button id="btn-apple" onClick={async() => {SignIn("LOGIN_APPLE")}}></button>
                                <button id="btn-google" onClick={async() => {SignIn("LOGIN_GOOGLE")}}></button>
                            </div>
                        </div>
                    </div>
                </div>
            )

    // Página Home
        case "HOME":
            return(
                // Aqui pra tu ver as divs vai la em Main/Main.jsx
                <Main MAIN="MAIN_MENU"/>
            )
            
        default:
            return <div>Página não encontrada</div>;
    }
}