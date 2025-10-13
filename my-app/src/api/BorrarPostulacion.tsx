import Postulacion from '../models/Postulacion.tsx'
import { useEffect, useState } from 'react';

export async function BorrarPostulacionAsync(id: number) {
  try {
    const response = await fetch(`https://backend.matchafunding.com/borrarpostulacion/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar postulación: ${response.status} ${response.statusText}`);
    }
    
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return { success: true, message: 'Postulación eliminada exitosamente' };
    }
    
    try {
      const data = await response.json();
      return data;
    } catch (jsonError) {
      return { success: true, message: 'Postulación eliminada exitosamente' };
    }
  }
  catch (error) {
    console.error('Error en BorrarPostulacion:', error);
    throw error; 
  }
}
export function BorrarPostulacion(id: number) {
  const [Postulacion, setPostulacion] = useState<Postulacion>();

  useEffect(() => {
      BorrarPostulacionAsync(id).then((data) => {
      setPostulacion(data);
      });
  }, );
  return Postulacion;
}
export default BorrarPostulacion;