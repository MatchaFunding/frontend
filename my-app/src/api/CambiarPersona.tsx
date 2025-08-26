import Persona from '../models/Persona.tsx'
import { useEffect, useState } from 'react';

export async function CambiarPersonaAsync(id: number, data: Persona): Promise<Persona[]> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/cambiarpersona/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'ID':data.ID,
        'Nombre':data.Nombre,
        'Sexo':data.Sexo,
        'RUT':data.RUT,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: Persona[] = await response.json();
    return result;
  }
  catch (error) {
    console.error('Error en CambiarPersona:', error);
    return [];
  }
}
export function CambiarPersona(id: number, data: Persona) {
  const [Persona, setPersona] = useState<Persona[]>([]);

  useEffect(() => {
      CambiarPersonaAsync(id, data).then((out) => {
      setPersona(out);
      });
  }, []);
  return Persona;
}
export default CambiarPersona;