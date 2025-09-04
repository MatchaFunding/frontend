import Postulacion from '../models/Postulacion.tsx'
import { useEffect, useState } from 'react';

export async function BorrarPostulacionAsync(id: number) {
  try {
    const response = await fetch(`https://referral-charlotte-fee-powers.trycloudflare.com/borrarpostulacion/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: Postulacion = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en BorrarPostulacion:', error);
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