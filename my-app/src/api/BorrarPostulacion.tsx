import Postulacion from '../models/Postulacion.tsx'
import { useEffect, useState } from 'react';

export async function BorrarPostulacionAsync(id: number): Promise<Postulacion[]> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/borrarpostulacion/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: Postulacion[] = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en BorrarPostulacion:', error);
    return [];
  }
}
export function BorrarPostulacion(id: number) {
  const [Postulacion, setPostulacion] = useState<Postulacion[]>([]);

  useEffect(() => {
      BorrarPostulacionAsync(id).then((data) => {
      setPostulacion(data);
      });
  }, []);
  return Postulacion;
}
export default BorrarPostulacion;