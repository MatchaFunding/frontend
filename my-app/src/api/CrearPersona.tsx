import Persona from '../models/Persona.tsx'
import { useEffect, useState } from 'react';

export async function CrearPersonaAsync(data: Persona): Promise<Persona> {
  try {
    const response = await fetch(`https://spring-park-flashing-ensures.trycloudflare.com/crearpersona/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'ID':data.ID,
        'Nombre':data.Nombre,
        'Sexo':data.Sexo,
        'RUT':data.RUT,
        'FechaDeNacimiento':data.FechaDeNacimiento,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: Persona = await response.json();
    return result;
  }
  catch (error) {
    throw new Error('Error al obtener los datos');
  }
}
export function CrearPersona(data: Persona) {
  const [Persona, setPersona] = useState<Persona>();

  useEffect(() => {
      CrearPersonaAsync(data).then((out) => {
      setPersona(out);
      });
  }, );
  return Persona;
}
export default CrearPersona;