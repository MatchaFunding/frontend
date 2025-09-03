import Persona from '../models/Persona.tsx'
import { useEffect, useState } from 'react';

export async function BorrarPersonaAsync(id: number) {
  try {
    const response = await fetch(`https://referral-charlotte-fee-powers.trycloudflare.com/borrarpersona/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: Persona = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en BorrarPersona:', error);
  }
}
export function BorrarPersona(id: number) {
  const [Persona, setPersona] = useState<Persona>();

  useEffect(() => {
      BorrarPersonaAsync(id).then((data) => {
      setPersona(data);
      });
  }, );
  return Persona;
}
export default BorrarPersona;