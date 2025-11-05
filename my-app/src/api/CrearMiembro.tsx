import Miembro from '../models/Miembro.tsx'
import { useEffect, useState } from 'react';

export async function CrearMiembroAsync(data: Miembro) {
  try {
    const response = await fetch(`https://backend.matchafunding.com/miembros`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'Persona':data.Persona,
        'Beneficiario':data.Beneficiario,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: Miembro = await response.json();
    return result;
  }
  catch (error) {
    throw new Error('Error al obtener los datos');
  }
}
export function CrearMiembro(data: Miembro) {
  const [Miembro, setMiembro] = useState<Miembro>();

  useEffect(() => {
      CrearMiembroAsync(data).then((out) => {
      setMiembro(out);
      });
  }, );
  return Miembro;
}
export default CrearMiembro;