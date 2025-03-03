import { auth } from "./firebase.js";
import { signInWithEmailAndPassword, GoogleAuthProvider, OAuthProvider, signInWithPopup } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export async function SignIn(TYPE, EMAIL, PASSWORD) {
    switch (TYPE) {
        case "LOGIN_PASS":
            try {
                const userCredential = await signInWithEmailAndPassword(auth, EMAIL, PASSWORD);
                console.log("Usuário logado:", userCredential);
                return userCredential.user;
            } catch (error) {
                console.error("Erro ao fazer login:", error.message);
                throw error;
            }

        case "LOGIN_GOOGLE":
            try {
                const result = await signInWithPopup(auth, googleProvider);
                console.log("Usuário logado com Google:", result.user);
                return result.user;
            } catch (error) {
                console.error("Erro ao fazer login com Google:", error.message);
                throw error;
            }

        case "LOGIN_APPLE":
            try {
                const result = await signInWithPopup(auth, appleProvider);
                console.log("Usuário logado com Apple:", result.user);
                return result.user;
            } catch (error) {
                console.error("Erro ao fazer login com Apple:", error.message);
                throw error;
            }

        default:
            console.error("Tipo de login inválido");
    }
}
