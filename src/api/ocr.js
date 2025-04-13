
export async function OCRGoogleAPI(base64img) {
    const url = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAW13Hwd47T6ntlPQEV20myx1zos2qvxjI";
    
    const body = {
      "requests": [
        {
          "image": {
            "content": base64img
          },
          "features": [
            { "type": "TEXT_DETECTION" }
          ]
        }
      ]
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao se comunicar com a API do Google Vision');
      }
  
      const result = await response.json();
  
      if (result.responses && result.responses[0].textAnnotations) {
        return result.responses[0].textAnnotations[0].description;
      } else {
        return 'Nenhum texto detectado';
      }
    } catch (error) {
      console.error("Erro ao processar a imagem:", error);
      throw error; 
    }
  }
  