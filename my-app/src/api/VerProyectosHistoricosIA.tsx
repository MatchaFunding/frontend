export async function VerProyectosHistoricosIAAsync() {
  try {
    const response = await fetch(`https://button-steven-approximately-sake.trycloudflare.com/api/v1/projects/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en VerTodosLosInstrumentos:', error);
    return [];
  }
}

