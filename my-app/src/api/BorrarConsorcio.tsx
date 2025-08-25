import Consorcio from '../models/Consorcio.tsx'
import { useEffect, useState } from 'react';

export async function BorrarConsorcioAsync(id: number): Promise<Consorcio[]> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/borrarconsorcio/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: Consorcio[] = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en BorrarConsorcio:', error);
    return [];
  }
}
export function BorrarConsorcio(id: number) {
  const [Consorcio, setConsorcio] = useState<Consorcio[]>([]);

  useEffect(() => {
      BorrarConsorcioAsync(id).then((data) => {
      setConsorcio(data);
      });
  }, []);
  return Consorcio;
}
export default BorrarConsorcio;