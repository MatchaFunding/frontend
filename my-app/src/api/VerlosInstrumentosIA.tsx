
import MatchRequest from '../models/MatchRequest.tsx'
import MatchResult from '../models/MatchResult.tsx'


export async function VerTodosLosInstrumentosIAAsync(input : MatchRequest) {
  try {
    const response = await fetch(`https://button-steven-approximately-sake.trycloudflare.com/api/v1/ia/match`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body : JSON.stringify({
        'ID':input.idea_id,
        'top_k':input.top_k,
        'estado':input.estado,
        'regiones':input.regiones,
        'tipos_perfil':input.tipos_perfil
        
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

