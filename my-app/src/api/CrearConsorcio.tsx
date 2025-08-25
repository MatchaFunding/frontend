import Consorcio from '../models/Consorcio.tsx'
import { useEffect, useState } from 'react';

export async function CrearConsorcioAsync(data: Consorcio): Promise<Consorcio[]> {
  try {
    const response = await fetch('http://127.0.0.1:8000/crearconsorcio/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'ID':data.ID,
        'PrimerBeneficiario':data.PrimerBeneficiario,
        'SegundoBeneficiario':data.SegundoBeneficiario,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: Consorcio[] = await response.json();
    return result;
  }
  catch (error) {
    console.error('Error en CrearConsorcio:', error);
    return [];
  }
}
export function CrearConsorcio(data: Consorcio) {
  const [Consorcio, setConsorcio] = useState<Consorcio[]>([]);

  useEffect(() => {
      CrearConsorcioAsync(data).then((out) => {
      setConsorcio(out);
      });
  }, []);
  return Consorcio;
}
export default CrearConsorcio;