import Postulacion from '../models/Postulacion.tsx'
import { useEffect, useState } from 'react';

export async function CrearPostulacionAsync(data: Postulacion): Promise<Postulacion> {
  try {
    const response = await fetch(`https://referral-charlotte-fee-powers.trycloudflare.com/crearpostulacion/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
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
    const result: Postulacion = await response.json();
    return result;
  }
  catch (error) {
    throw new Error('Error al obtener los datos');
  }
}
export function CrearPostulacion(data: Postulacion) {
  const [Postulacion, setPostulacion] = useState<Postulacion>();

  useEffect(() => {
      CrearPostulacionAsync(data).then((out) => {
      setPostulacion(out);
      });
  }, );
  return Postulacion;
}
export default CrearPostulacion;