export interface OpinionIAdeIdea {
  ID: number;
  ResumenLLM: string;
}

export async function CrearOpinionIAdeIdeaAsync(usuarioId: number, resumenLLM: string): Promise<OpinionIAdeIdea> {
  try {
    console.log('Enviando datos al backend para crear opinión IA:', { Usuario: usuarioId, ResumenLLM: resumenLLM });
    
    const response = await fetch(`https://backend.matchafunding.com/crearopinioniadeidea/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        Usuario: usuarioId,
        ResumenLLM: resumenLLM,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error del backend al crear opinión IA:', errorText);
      throw new Error('Error al guardar la opinión de IA');
    }
    
    const result: OpinionIAdeIdea = await response.json();
    console.log('Opinión IA creada exitosamente:', result);
    return result;
  } catch (error) {
    console.error('Error al crear opinión IA de idea:', error);
    throw new Error('Error al guardar la opinión de IA');
  }
}

export default CrearOpinionIAdeIdeaAsync;