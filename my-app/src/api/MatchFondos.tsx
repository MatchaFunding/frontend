export interface MatchRequest {
  idea_id: number;
  top_k?: number;
}

export interface MatchResult {
  call_id: number;
  name: string;
  agency?: string;
  affinity: number;
  semantic_score: number;
  rules_score: number;
  topic_score: number;
  explanations: string[];
}

export interface ProcessIdeaRequest {
  ID: number;
  Usuario: number;
  Campo: string;
  Problema: string;
  Publico: string;
  Innovacion: string;
}

export interface ProcessIdeaResponse {
  ID: number;
  Usuario: number;
  Campo: string;
  Problema: string;
  Publico: string;
  Innovacion: string;
  Embedding: number[];
}

export async function processIdeaAsync(idea: ProcessIdeaRequest): Promise<ProcessIdeaResponse> {
  try {
    console.log('Procesando idea:', idea);
    
    // Timeout de 30 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(`https://ai.matchafunding.com/api/v1/ia/process-idea`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(idea),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log('Process idea response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en processIdea - Status:', response.status);
      console.error('Error details:', errorText);
      
      if (response.status === 422) {
        console.error('Error de validación. Verificar campos enviados:', idea);
      }
      
      throw new Error(`Error al procesar idea: ${response.status} - ${errorText}`);
    }

    const result: ProcessIdeaResponse = await response.json();
    console.log('Idea procesada exitosamente:', result);
    return result;
  } catch (error) {
    console.error('Error en processIdea:', error);
    throw error;
  }
}

export async function getMatchFondosAsync(request: MatchRequest): Promise<MatchResult[]> {
  try {
    console.log('Enviando request de match con endpoint GET:', request);
    
    const ideaId = request.idea_id;
    const topK = request.top_k || 10;

    // Timeout de 30 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    console.log(`Llamando a endpoint GET: https://ai.matchafunding.com/api/v1/ia/{id}/${topK}?id_idea=${ideaId}`);
    
    const response = await fetch(`https://ai.matchafunding.com/api/v1/ia/{id}/${topK}?id_idea=191`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en getMatchFondos - Status:', response.status);
      console.error('Error details:', errorText);
      throw new Error(`Error al obtener matches: ${response.status} - ${errorText}`);
    }

    const result: MatchResult[] = await response.json();
    console.log('Resultado exitoso del endpoint GET:', result);
    return result;

  } catch (error) {
    console.error('Error en getMatchFondos:', error);
    throw error;
  }
}


export async function getMatchProyectoFondosAsync(request: MatchRequest): Promise<MatchResult[]> {
  try {
    console.log('Enviando request de match con endpoint GET:', request);
    
    const ideaId = request.idea_id;
    const topK = request.top_k || 10;

    // Timeout de 30 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    console.log(`Llamando a endpoint GET: https://ai.matchafunding.com/api/v1/ia/funds/{id}/${topK}?id_idea=${ideaId}`);
    
    const response = await fetch(`https://ai.matchafunding.com/api/v1/ia/funds/{id}/${topK}?id_idea=${ideaId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en getMatchFondos - Status:', response.status);
      console.error('Error details:', errorText);
      throw new Error(`Error al obtener matches: ${response.status} - ${errorText}`);
    }

    const result: MatchResult[] = await response.json();
    console.log('Resultado exitoso del endpoint GET:', result);
    return result;

  } catch (error) {
    console.error('Error en getMatchFondos:', error);
    throw error;
  }
}




export async function checkCollectionsHealth(): Promise<any> {
  try {
    const response = await fetch(`https://ai.matchafunding.com/api/v1/ia/health/collections`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al verificar colecciones: ${response.status}`);
    }

    const result = await response.json();
    console.log('Estado de colecciones:', result);
    return result;
  } catch (error) {
    console.error('Error al verificar colecciones:', error);
    throw error;
  }
}

export default getMatchFondosAsync;