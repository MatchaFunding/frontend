import Persona from '../models/Persona.tsx'
import { useEffect, useState } from 'react';

export async function BorrarPersonaAsync(id: number): Promise<Persona[]> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/borrarpersona/${id}`, {
      method: 'POST',
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
    console.error('Error en BorrarPersona:', error);
    return [];
  }
}
export function BorrarPersona(id: number) {
  const [Persona, setPersona] = useState<Persona[]>([]);

  useEffect(() => {
      BorrarPersonaAsync(id).then((data) => {
      setPersona(data);
      });
  }, []);
  return Persona;
}
export default BorrarPersona;