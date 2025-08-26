import Miembro from '../models/Miembro.tsx'
import { useEffect, useState } from 'react';

export async function VerTodosLosMiembrosAsync(): Promise<Miembro[]> {
  try {
    const response = await fetch('http://127.0.0.1:8000/vertodoslosmiembros/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: Miembro[] = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en VerTodosLosMiembros:', error);
    return [];
  }
}
export function VerTodosLosMiembros() {
  const [Miembro, setMiembro] = useState<Miembro[]>([]);

  useEffect(() => {
      VerTodosLosMiembrosAsync().then((data) => {
      setMiembro(data);
      });
  }, []);
  return Miembro;
}
export default VerTodosLosMiembros;