
import MatchResult from '../models/MatchResult.tsx'


export async function VerCalceFondosIAAsync(ide : number) {
  try {
    const response = await fetch(`https://button-steven-approximately-sake.trycloudflare.com/api/v1/ia/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body : JSON.stringify({
        'idea_id':ide,
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

