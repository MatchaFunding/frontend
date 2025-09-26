
import MatchResult from '../models/MatchResult.tsx'

export async function VerCalceProyectosIAAsync(id: number) {
  try {
    const response = await fetch(`https://api.matchafunding.com/api/v1/ia/match/projectmatchhistoric`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body : JSON.stringify({
        'idea_id':id,
        'top_k':5
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: MatchResult[] = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en VerTodosLosInstrumentos:', error);
    return [];
  }
}

