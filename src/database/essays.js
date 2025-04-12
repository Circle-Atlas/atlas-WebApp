import { 
    getFirestore, collection, getDocs, query, where, addDoc, doc, updateDoc, deleteDoc 
} from "firebase/firestore";
import { app } from "./firebase.js";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";


const db = getFirestore(app);

export async function SaveEssay(
    THEME,
    MODEL,
    AI_MODEL,
    TITLE,
    CONTENT,
    GENERAL_ANALYSIS,
    FINAL_SCORE,
    ANALYSIS_COMPETENCE1,
    ANALYSIS_COMPETENCE2,
    ANALYSIS_COMPETENCE3,
    ANALYSIS_COMPETENCE4,
    ANALYSIS_COMPETENCE5,
    SCORE_COMPETENCE1,
    SCORE_COMPETENCE2,
    SCORE_COMPETENCE3,
    SCORE_COMPETENCE4,
    SCORE_COMPETENCE5,
    DRAFTID = null,
    IMAGE_BASE64 = null // nova entrada
) {
    try {
        const user = JSON.parse(localStorage.getItem("USER"));
        if (!user || !user.uid) throw new Error("Usuário não autenticado.");

        const db = getFirestore(app);
        const storage = getStorage(app);

        let imageUrl = "";

        if (IMAGE_BASE64) {
            const storageRef = ref(storage, `users/${user.uid}/essays/${Date.now()}.jpg`);
            await uploadString(storageRef, IMAGE_BASE64, 'base64');
            imageUrl = await getDownloadURL(storageRef);
        }

        const essaysCollectionRef = collection(db, `users/${user.uid}/essays`);
        await addDoc(essaysCollectionRef, {
            theme: THEME,
            essayModel: MODEL,
            aiModel: AI_MODEL,
            title: TITLE,
            content: CONTENT,
            generalAnalysis: GENERAL_ANALYSIS,
            finalScore: FINAL_SCORE,
            analysisCompetence1: ANALYSIS_COMPETENCE1,
            analysisCompetence2: ANALYSIS_COMPETENCE2,
            analysisCompetence3: ANALYSIS_COMPETENCE3,
            analysisCompetence4: ANALYSIS_COMPETENCE4,
            analysisCompetence5: ANALYSIS_COMPETENCE5,
            scoreCompetence1: SCORE_COMPETENCE1,
            scoreCompetence2: SCORE_COMPETENCE2,
            scoreCompetence3: SCORE_COMPETENCE3,
            scoreCompetence4: SCORE_COMPETENCE4,
            scoreCompetence5: SCORE_COMPETENCE5,
            imageUrl: imageUrl,
            date: new Date().toISOString(),
        });

        if (DRAFTID) {
            const draftRef = doc(db, `users/${user.uid}/draft/${DRAFTID}`);
            await deleteDoc(draftRef);
        }

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

        const essaysRef = collection(db, `users/${user.uid}/essays`);
        const snapshot = await getDocs(essaysRef);
        
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

export async function SaveEssayDraft({ id = null, theme = "", model = "", title = "", content = "", generalAnalysis = "", finalScore = "" }) {
    try {
        const user = JSON.parse(localStorage.getItem("USER"));
        
        if (!user || !user.uid) {
            throw new Error("Usuário não autenticado.");
        }

        const draftCollectionRef = collection(db, `users/${user.uid}/draft`);
        
        if (id) {
            const draftRef = doc(draftCollectionRef, id);
            await updateDoc(draftRef, {
                theme,
                model,
                title,
                content,
                generalAnalysis,
                finalScore,
                date: new Date().toISOString(),
            });

            console.log("Rascunho atualizado:", id);
            return { success: true, id };
        } else {
            const docRef = await addDoc(draftCollectionRef, {
                theme,
                model,
                title,
                content,
                generalAnalysis,
                finalScore,
                date: new Date().toISOString(),
            });

            console.log("Novo rascunho criado:", docRef.id);
            return { success: true, id: docRef.id };
        }
    } catch (error) {
        console.error("Erro ao salvar rascunho:", error);
        return { success: false, error: error.message };
    }
}

    export async function GetEssayDrafts() {
        try {
        const user = JSON.parse(localStorage.getItem("USER"));
        const draftsRef = collection(db, "users", user.uid, "draft");
        const snapshot = await getDocs(draftsRef);
    
        const drafts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return drafts;
        } catch (error) {
        console.error("Erro ao buscar rascunhos:", error);
        return [];
        }
    }

export async function DeleteEssayDraft(id) {
    try {
        const user = JSON.parse(localStorage.getItem("USER"));
        
        if (!user || !user.uid) {
            throw new Error("Usuário não autenticado.");
        }

        const draftRef = doc(getFirestore(app), `users/${user.uid}/draft/${id}`);
        await deleteDoc(draftRef);
        
        console.log(`Rascunho ${id} deletado com sucesso.`);
        return { success: true };
    } catch (error) {
        console.error("Erro ao deletar rascunho:", error);
        return { success: false, message: error.message };
    }
}
 
export async function DeleteEssay(id) {
    try {
        const user = JSON.parse(localStorage.getItem("USER"));
        
        if (!user || !user.uid) {
            throw new Error("Usuário não autenticado.");
        }

        const draftRef = doc(getFirestore(app), `users/${user.uid}/essays/${id}`);
        await deleteDoc(draftRef);
        
        console.log(`Redação ${id} deletada com sucesso.`);
        return { success: true };
    } catch (error) {
        console.error("Erro ao deletar redação:", error);
        return { success: false, message: error.message };
    }
}