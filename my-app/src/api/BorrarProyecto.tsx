import Proyecto from '../models/Proyecto.tsx'
import { useEffect, useState } from 'react';

export async function BorrarProyectoAsync(id: number) {
  try {
    const response = await fetch(`https://chat-resorts-builders-calculators.trycloudflare.com/borrarproyecto/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: Proyecto = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en BorrarProyecto:', error);
  }
}
export function BorrarProyecto(id: number) {
  const [Proyecto, setProyecto] = useState<Proyecto>();

  useEffect(() => {
      BorrarProyectoAsync(id).then((data) => {
      setProyecto(data);
      });
  }, );
  return Proyecto;
}
export default BorrarProyecto;