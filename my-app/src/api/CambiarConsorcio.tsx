import Consorcio from '../models/Consorcio.tsx'
import { useEffect, useState } from 'react';

export async function CambiarConsorcioAsync(id: number, data: Consorcio): Promise<Consorcio[]> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/cambiarconsorcio/${id}`, {
      method: 'PUT',
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
    console.error('Error en CambiarConsorcio:', error);
    return [];
  }
}
export function CambiarConsorcio(id: number, data: Consorcio) {
  const [Consorcio, setConsorcio] = useState<Consorcio[]>([]);

  useEffect(() => {
      CambiarConsorcioAsync(id, data).then((out) => {
      setConsorcio(out);
      });
  }, []);
  return Consorcio;
}
export default CambiarConsorcio;