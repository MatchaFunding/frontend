export async function VerMisMiembros(id: number) {
  try {
    const response = await fetch(`https://backend.matchafunding.com/usuarios/${id}/miembros`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result = await response.json();
    return result;
  }
  catch (error) {
    console.error('Error en VerMiUsuario:', error);
  }
}