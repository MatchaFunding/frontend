const API_BASE_URL = 'https://ai.matchafunding.com/api/v1';
const RAG_BASE_URL = 'https://rag.matchafunding.com';

export interface RagChatRequest {
  fondo_id: number;
  question: string;
}

export interface RagChatResponse {
  answer: string;
  queries?: string[];
  sources?: Array<{
    kind: string;
    doc_id: string;
    id_fondo: number;
    doc_hash: string;
    source: string;
    idx: number;
    snippet: string;
    parent_present: boolean;
  }>;
}

export interface RagFondosResponse {
  fondos: number[];
}

/**
 * Envía una pregunta al chatbot RAG y obtiene una respuesta
 * @param question - La pregunta del usuario
 * @param fondoId - El ID del fondo para contexto
 * @returns La respuesta del chatbot
 */
export async function sendRagQuestion(
  question: string,
  fondoId: number
): Promise<RagChatResponse> {
  try {
    const requestBody: RagChatRequest = {
      fondo_id: fondoId,
      question: question,
    };

    console.log('📤 Enviando a RAG:', {
      url: `${RAG_BASE_URL}/chat`,
      body: requestBody
    });

    const response = await fetch(`${RAG_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Respuesta RAG:', {
      status: response.status,
      statusText: response.statusText
    });

    if (!response.ok) {
      // Intentar leer el mensaje de error del servidor
      let errorDetail = '';
      try {
        const errorData = await response.json();
        errorDetail = JSON.stringify(errorData);
        console.error('❌ Error del servidor:', errorData);
      } catch (e) {
        const errorText = await response.text();
        errorDetail = errorText;
        console.error('❌ Error del servidor (texto):', errorText);
      }
      throw new Error(`Error en la respuesta: ${response.status} - ${errorDetail}`);
    }

    const data: RagChatResponse = await response.json();
    console.log('✅ Respuesta exitosa:', data);
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

/**
 * Obtiene la lista de IDs de fondos disponibles para RAG
 * @returns Array de IDs de fondos disponibles
 */
export async function getRagFondos(): Promise<number[]> {
  try {
    const response = await fetch(`${RAG_BASE_URL}/fondos`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener fondos RAG: ${response.status}`);
    }

    const rawData = await response.json();
    
    // Verificar diferentes formatos posibles de respuesta
    let fondosArray: number[] = [];
    
    if (Array.isArray(rawData)) {
      // Si la respuesta es directamente un array
      fondosArray = rawData;
    } else if (rawData && typeof rawData === 'object') {
      // Si es un objeto, buscar la propiedad 'fondos'
      if ('fondos' in rawData) {
        fondosArray = rawData.fondos || [];
      }
    }
    
    return fondosArray;
  } catch (error) {
    console.error('Error al obtener fondos RAG:', error);
    // En caso de error, devolver array vacío
    return [];
  }
}
