export async function VerEmpresaCompletaAsync(id: number) {
  try {
    const response = await fetch(`https://backend.matchafunding.com/verempresacompleta/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
    throw new Error('Error al obtener los datos');
  }
}