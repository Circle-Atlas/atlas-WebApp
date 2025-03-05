import { getFirestore, collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { app } from "./firebase.js";

const db = getFirestore(app);

export async function SaveEssay(THEME, MODEL, TITLE, CONTENT, GENERAL_ANALYSIS, FINAL_SCORE) {
    try {
        const user = JSON.parse(localStorage.getItem("USER"));
        
        if (!user || !user.uid) {
            throw new Error("Usuário não autenticado.");
        }

        const essaysRef = collection(db, "essays");
        
        await addDoc(essaysRef, {
            userId: user.uid,
            theme: THEME,
            model: MODEL,
            title: TITLE,
            content: CONTENT,
            generalAnalysis: GENERAL_ANALYSIS,
            finalScore: FINAL_SCORE,
            date: new Date().toISOString(),
        });

        console.log("Redação salva com sucesso.");
        return { success: true };
    } catch (error) {
        console.error("Erro ao salvar redação:", error);
        return { success: false, error: error.message };
    }
}

export async function GetEssays() {
    try {
        const user = JSON.parse(localStorage.getItem("USER"));
        
        if (!user || !user.uid) {
            throw new Error("Usuário não autenticado.");
        }

        const essaysRef = collection(db, "essays");
        const q = query(essaysRef, where("userId", "==", user.uid));

        const snapshot = await getDocs(q);
        
        const essays = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        
        console.log("Redações obtidas com sucesso:", essays);
        return essays;

    } catch (error) {
        console.error("Erro ao obter redações:", error);
        return { success: false, error: error.message };
    }
}
