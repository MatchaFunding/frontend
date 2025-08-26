import Persona from '../models/Persona.tsx'
import { useEffect, useState } from 'react';

export async function VerTodasLasPersonasAsync(): Promise<Persona[]> {
  try {
    const response = await fetch('http://127.0.0.1:8000/vertodaslaspersonas/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: Persona[] = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en VerTodasLasPersonas:', error);
    return [];
  }
}
export function VerTodasLasPersonas() {
  const [Persona, setPersona] = useState<Persona[]>([]);

  useEffect(() => {
      VerTodasLasPersonasAsync().then((data) => {
      setPersona(data);
      });
  }, []);
  return Persona;
}
export default VerTodasLasPersonas;