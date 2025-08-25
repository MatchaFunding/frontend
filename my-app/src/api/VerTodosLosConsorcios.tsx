import Consorcio from '../models/Consorcio.tsx'
import { useEffect, useState } from 'react';

export async function VerTodosLosConsorciosAsync(): Promise<Consorcio[]> {
  try {
    const response = await fetch('http://127.0.0.1:8000/vertodoslosconsorcios/', {
      method: 'GET',
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
    console.error('Error en VerTodosLosConsorcios:', error);
    return [];
  }
}
export function VerTodosLosConsorcios() {
  const [Consorcio, setConsorcio] = useState<Consorcio[]>([]);

  useEffect(() => {
      VerTodosLosConsorciosAsync().then((data) => {
      setConsorcio(data);
      });
  }, []);
  return Consorcio;
}
export default VerTodosLosConsorcios;