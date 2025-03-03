import { app, auth } from "./firebase.js";
import { 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    OAuthProvider, 
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    updateProfile 
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export async function SignIn(TYPE, EMAIL, PASSWORD) {
    switch (TYPE) {
        case "LOGIN_PASS":
            if (!EMAIL || !PASSWORD) {
                alert("Digite um email e uma senha.");
                return;
            }
            try {
                const userCredential = await signInWithEmailAndPassword(auth, EMAIL, PASSWORD);
                console.log("Usuário logado:", userCredential.user);
                localStorage.setItem("USER", JSON.stringify(userCredential.user))
                location.reload()
            } catch (error) {
                alert("Email ou senha inválidos.");
                console.error("Erro ao fazer login:", error.message);
                return false;
            }

        case "LOGIN_GOOGLE":
            try {
                const result = await signInWithPopup(auth, googleProvider);
                console.log("Usuário logado com Google:", result.user);
                localStorage.setItem("USER", JSON.stringify(result.user))
                alert(`Entrou como ${result.user.displayName}`);
                location.reload()
            } catch (error) {
                alert("Erro ao fazer login com Google.");
                console.error("Erro ao fazer login com Google:", error.message);
                return false;
            }

        case "LOGIN_APPLE":
            try {
                const result = await signInWithPopup(auth, appleProvider);
                console.log("Usuário logado com Apple:", result.user);
                localStorage.setItem("USER", JSON.stringify(result.user))
                location.reload()
            } catch (error) {
                alert("Erro ao fazer login com Apple.");
                console.error("Erro ao fazer login com Apple:", error.message);
                return false
            }

        default:
            console.error("Tipo de login inválido");
    }
}

export async function SignUp(NAME, EMAIL, PASSWORD, CONFIRM_PASSWORD) {
    if (!NAME || !EMAIL || !PASSWORD || !CONFIRM_PASSWORD) {
        alert("Todos os campos devem ser preenchidos.");
        return false;
    } 

    if (!EMAIL || !EMAIL.includes("@")) {
        alert("Digite um e-mail válido.");
        return false;
    }
    

    if (PASSWORD !== CONFIRM_PASSWORD) {
        alert("As senhas devem ser iguais.");
        return false;
    }

    if (PASSWORD.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return false;
    }    

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, EMAIL, PASSWORD);
        const user = userCredential.user;

        await updateProfile(user, {
            displayName: NAME
        });

        await setDoc(doc(db, "users", user.uid), {
            name: NAME,
            email: EMAIL,
            userId: user.uid
        });

        console.log("Usuário registrado e salvo no Firestore:", user);
        alert("Usuário criado com sucesso!")
        return true;

    } catch (error) {
        if (error = "Firebase: Error (auth/email-already-in-use).") {
            alert("Este email já está em uso.")
        } else {
            alert("Erro ao registrar usuário.");
            console.error("Erro ao registrar:", error.message);
        } 
        return false;
    }
}