import Instrumento from '../models/Instrumento.tsx'
import { useEffect, useState } from 'react';

export async function BorrarInstrumentoAsync(id: number): Promise<Instrumento[]> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/borrarinstrumento/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: Instrumento[] = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en BorrarInstrumento:', error);
    return [];
  }
}
export function BorrarInstrumento(id: number) {
  const [Instrumento, setInstrumento] = useState<Instrumento[]>([]);

  useEffect(() => {
      BorrarInstrumentoAsync(id).then((data) => {
      setInstrumento(data);
      });
  }, []);
  return Instrumento;
}
export default BorrarInstrumento;