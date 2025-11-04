export async function BorrarIdea(id: number) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/ideas/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar idea: ${response.status} ${response.statusText}`);
    }
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return { success: true, message: 'Idea eliminada exitosamente' };
    }    
    try {
      const data = await response.json();
      return data;
    }
    catch (jsonError) {
      return { success: true, message: 'Idea eliminada exitosamente' };
    }
  } catch (error) {
    console.error('Error en BorrarIdea:', error);
    throw error; 
  }
}