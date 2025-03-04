import { useEffect, useState } from "react"
import { SignIn, SignUp } from "../../database/authentication";
import Main from "../Main/Main";

export default function Content() {

    const [selectedPage, setSelectedPage] = useState("LOGIN");

    useEffect(() => {
        if (localStorage.getItem("USER")) {
            setSelectedPage("HOME");
        }
    }, []);
    

    switch (selectedPage) {

    // Página de Login
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
                                    <input type="email" id="email" placeholder="E-mail"/>
                                </div>
                                <div id="input-password">
                                    <input type="password" id="password" placeholder="Senha"/>
                                </div>
                            </div>
                            <div id="buttons-container">
                                <button id="btn-login" onClick={() => {SignIn("LOGIN_PASS", document.getElementById("email").value, document.getElementById("password").value)}}>Entrar</button>
                                <a href="" id="esqueci-senha" onClick={(e) => { e.preventDefault(); setSelectedPage("FORGOT_PASSWORD"); }}>Esqueci minha senha</a>
                            </div>
                            <p id="p-ou">OU</p>
                            <div id="buttons-login-api">
                                <button id="btn-apple" onClick={() => SignIn("LOGIN_APPLE")}>Apple</button>
                                <button id="btn-google" onClick={() => SignIn("LOGIN_GOOGLE")}>Google</button>
                            </div>
                        </div>
                    </div>
                </div>
            )


    // Página de Cadastro
        case "REGISTER":
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
                            <h3 id="bem-vindo-card-login">Cadastrar</h3>
                            <p id="link-register">Já possui conta? <a href="#" onClick={(e) => { e.preventDefault(); setSelectedPage("LOGIN"); }}>Acesse!</a></p>
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
                                <button id="btn-login" onClick={async () => { SignUp(document.getElementById("register-name").value, document.getElementById("register-email").value, document.getElementById("register-password").value, document.getElementById("confirm-password").value)}}>Cadastrar</button>
                            </div>
                            <p id="p-ou">OU</p>
                            <div id="buttons-login-api">
                                <button id="btn-apple" onClick={async() => {SignIn("LOGIN_APPLE")}}>Apple</button>
                                <button id="btn-google" onClick={async() => {SignIn("LOGIN_GOOGLE")}}>Google</button>
                            </div>
                        </div>
                    </div>
                </div>
            )

    // Página Home
        case "HOME":
            return(
                <Main MAIN="MAIN_MENU"/>
            )
            
        default:
            return <div>Página não encontrada</div>;
    }
}