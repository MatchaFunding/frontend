import Idea from '../models/Idea.tsx'
import { useEffect, useState } from 'react';

export async function BorrarIdeaAsync(id: number) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/borraridea/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error al eliminar idea: ${response.status} ${response.statusText}`);
    }
    
    // Similar a BorrarPostulacion: manejar respuestas vacías (204 No Content)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return { success: true, message: 'Idea eliminada exitosamente' };
    }
    
    try {
      const data = await response.json();
      return data;
    } catch (jsonError) {
      // Si no hay JSON válido pero la respuesta fue exitosa
      return { success: true, message: 'Idea eliminada exitosamente' };
    }
  } catch (error) {
    console.error('Error en BorrarIdea:', error);
    throw error; 
  }
}
export function BorrarIdea(id: number) {
  const [Idea, setIdea] = useState<Idea | null>();

  useEffect(() => {
      BorrarIdeaAsync(id).then((data) => {
      setIdea(data);
      });
  }, );
  return Idea;
}
export default BorrarIdea;