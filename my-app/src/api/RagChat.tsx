const API_BASE_URL = 'https://ai.matchafunding.com/api/v1';

export interface RagChatRequest {
  question: string;
  fondo_nombre?: string;
}

export interface RagChatResponse {
  answer: string;
  fondo?: string;
}

/**
 * Envía una pregunta al chatbot RAG y obtiene una respuesta
 * @param question - La pregunta del usuario
 * @param fondoNombre - (Opcional) El nombre del fondo para contexto
 * @returns La respuesta del chatbot
 */
export async function sendRagQuestion(
  question: string,
  fondoNombre?: string
): Promise<RagChatResponse> {
  try {
    const requestBody: RagChatRequest = {
      question: question,
    };

    if (fondoNombre) {
      requestBody.fondo_nombre = fondoNombre;
    }

    const response = await fetch(`${API_BASE_URL}/rag/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Error en la respuesta: ${response.status}`);
    }

    const data: RagChatResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error al enviar pregunta al RAG:', error);
    throw error;
  }
}

/**
 * Verifica el estado del servicio RAG
 * @returns Estado del servicio
 */
export async function checkRagHealth(): Promise<{ status: string; service: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/rag/health`);
    
    if (!response.ok) {
      throw new Error(`Error en health check: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al verificar estado del RAG:', error);
    throw error;
  }
}
