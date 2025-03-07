import { app, auth } from "./firebase.js";
import { 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    OAuthProvider, 
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    updateProfile 
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

async function createUserDoc(user) {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        await setDoc(userRef, {
            name: user.displayName || "Usuário sem nome",
            email: user.email || "Sem email",
            userId: user.uid
        });
        console.log("Usuário salvo no Firestore:", user);
    }
}

export async function SignIn(TYPE, EMAIL, PASSWORD) {
    try {
        let userCredential;

        switch (TYPE) {
            case "LOGIN_PASS":
                if (!EMAIL || !PASSWORD) {
                    alert("Digite um email e uma senha.");
                    return;
                }
                userCredential = await signInWithEmailAndPassword(auth, EMAIL, PASSWORD);
                break;

            case "LOGIN_GOOGLE":
                userCredential = await signInWithPopup(auth, googleProvider);
                break;

            case "LOGIN_APPLE":
                userCredential = await signInWithPopup(auth, appleProvider);
                break;

            default:
                console.error("Tipo de login inválido");
                return;
        }

        const user = userCredential.user;
        console.log(`Usuário logado (${TYPE}):`, user);

        localStorage.setItem("USER", JSON.stringify(user));
        await createUserDoc(user);

        alert(`Bem-vindo, ${user.displayName || "Usuário"}!`);
        location.reload();

    } catch (error) {
        console.error(`Erro ao fazer login (${TYPE}):`, error.message);
        alert(`Erro ao fazer login (${TYPE}).`);
        return false;
    }
}

export async function SignUp(NAME, EMAIL, PASSWORD, CONFIRM_PASSWORD) {
    if (!NAME || !EMAIL || !PASSWORD || !CONFIRM_PASSWORD) {
        alert("Todos os campos devem ser preenchidos.");
        return false;
    } 

    if (!EMAIL.includes("@")) {
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

        await updateProfile(user, { displayName: NAME });
        await createUserDoc(user);

        alert("Usuário criado com sucesso!");
        return true;

    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            alert("Este email já está em uso.");
        } else {
            alert("Erro ao registrar usuário.");
            console.error("Erro ao registrar:", error.message);
        }
        return false;
    }
}
