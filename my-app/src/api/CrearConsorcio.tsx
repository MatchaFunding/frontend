import Consorcio from '../models/Consorcio.tsx'
import { useEffect, useState } from 'react';

export async function CrearConsorcioAsync(data: Consorcio): Promise<Consorcio> {
  try {
    const response = await fetch(`https://referral-charlotte-fee-powers.trycloudflare.com/crearconsorcio/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'PrimerBeneficiario':data.PrimerBeneficiario,
        'SegundoBeneficiario':data.SegundoBeneficiario,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: Consorcio = await response.json();
    return result;
  }
  catch (error) {
    throw new Error('Error al obtener los datos');
  }
}
export function CrearConsorcio(data: Consorcio) {
  const [Consorcio, setConsorcio] = useState<Consorcio>();

  useEffect(() => {
      CrearConsorcioAsync(data).then((out) => {
      setConsorcio(out);
      });
  }, );
  return Consorcio;
}
export default CrearConsorcio;