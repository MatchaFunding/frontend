
export async function VerFondosVigentesIAAsync() {
  try {
    const response = await fetch(`https://uruguay-cigarettes-advised-answering.trycloudflare.com/api/v1/ia/match/projectmatchhistoric`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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

