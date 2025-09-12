import Colaborador from '../models/Colaborador.tsx'
import { useEffect, useState } from 'react';

export async function CrearColaboradorAsync(data: Colaborador) {
  try {
    const response = await fetch(`https://chat-resorts-builders-calculators.trycloudflare.com/crearcolaborador/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'Persona':data.Persona,
        'Proyecto':data.Proyecto,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: Colaborador = await response.json();
    return result;
  }
  catch (error) {
    throw new Error('Error al obtener los datos');
  }
}
export function CrearColaborador(data: Colaborador) {
  const [Colaborador, setColaborador] = useState<Colaborador>();

  useEffect(() => {
      CrearColaboradorAsync(data).then((out) => {
      setColaborador(out);
      });
  }, );
  return Colaborador;
}
export default CrearColaborador;