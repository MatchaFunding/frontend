import Instrumento from '../models/Instrumento.tsx'
import { useEffect, useState } from 'react';

export async function VerTodosLosInstrumentosAsync(): Promise<Instrumento[]> {
  try {
    const response = await fetch('http://127.0.0.1:8000/vertodoslosinstrumentos/', {
      method: 'GET',
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
    console.error('Error en VerTodosLosInstrumentos:', error);
    return [];
  }
}
export function VerTodosLosInstrumentos() {
  const [Instrumento, setInstrumento] = useState<Instrumento[]>([]);

  useEffect(() => {
      VerTodosLosInstrumentosAsync().then((data) => {
      setInstrumento(data);
      });
  }, []);
  return Instrumento;
}
export default VerTodosLosInstrumentos;