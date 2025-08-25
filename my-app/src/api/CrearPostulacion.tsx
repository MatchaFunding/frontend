import Postulacion from '../models/Postulacion.tsx'
import { useEffect, useState } from 'react';

export async function CrearPostulacionAsync(data: Postulacion): Promise<Postulacion[]> {
  try {
    const response = await fetch('http://127.0.0.1:8000/crearpostulacion/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'ID':data.ID,
        'Beneficiario':data.Beneficiario,
        'Proyecto':data.Proyecto,
        'Instrumento':data.Instrumento,
        'Resultado':data.Resultado,
        'MontoObtenido':data.MontoObtenido,
        'FechaDePostulacion':data.FechaDePostulacion,
        'FechaDeResultado':data.FechaDeResultado,
        'Detalle':data.Detalle,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: Postulacion[] = await response.json();
    return result;
  }
  catch (error) {
    console.error('Error en CrearPostulacion:', error);
    return [];
  }
}
export function CrearPostulacion(data: Postulacion) {
  const [Postulacion, setPostulacion] = useState<Postulacion[]>([]);

  useEffect(() => {
      CrearPostulacionAsync(data).then((out) => {
      setPostulacion(out);
      });
  }, []);
  return Postulacion;
}
export default CrearPostulacion;