import Postulacion from '../models/Postulacion.tsx'
import { useEffect, useState } from 'react';

export async function VerTodasLasPostulacionesAsync(): Promise<Postulacion[]> {
  try {
    const response = await fetch('http://127.0.0.1:8000/vertodaslaspostulaciones/', {
      method: 'GET',
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
    console.error('Error en VerTodasLasPostulaciones:', error);
    return [];
  }
}
export function VerTodasLasPostulaciones() {
  const [Postulacion, setPostulacion] = useState<Postulacion[]>([]);

  useEffect(() => {
      VerTodasLasPostulacionesAsync().then((data) => {
      setPostulacion(data);
      });
  }, []);
  return Postulacion;
}
export default VerTodasLasPostulaciones;