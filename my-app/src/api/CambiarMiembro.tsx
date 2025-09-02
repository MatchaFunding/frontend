import Miembro from '../models/Miembro.tsx'
import { useEffect, useState } from 'react';

export async function CambiarMiembroAsync(id: number, data: Miembro): Promise<Miembro> {
  try {
    const response = await fetch(`https://referral-charlotte-fee-powers.trycloudflare.com/cambiarmiembro/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'ID':data.ID,
        'Persona':data.Persona,
        'Beneficiario':data.Beneficiario,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: Miembro = await response.json();
    return result;
  }
  catch (error) {
    console.error('Error en CambiarMiembro:', error);
  }
}
export function CambiarMiembro(id: number, data: Miembro) {
  const [Miembro, setMiembro] = useState<Miembro>();

  useEffect(() => {
      CambiarMiembroAsync(id, data).then((out) => {
      setMiembro(out);
      });
  }, );
  return Miembro;
}
export default CambiarMiembro;