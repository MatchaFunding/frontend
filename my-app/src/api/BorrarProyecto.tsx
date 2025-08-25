import Proyecto from '../models/Proyecto.tsx'
import { useEffect, useState } from 'react';

export async function BorrarProyectoAsync(id: number): Promise<Proyecto[]> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/borrarproyecto/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: Proyecto[] = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en BorrarProyecto:', error);
    return [];
  }
}
export function BorrarProyecto(id: number) {
  const [Proyecto, setProyecto] = useState<Proyecto[]>([]);

  useEffect(() => {
      BorrarProyectoAsync(id).then((data) => {
      setProyecto(data);
      });
  }, []);
  return Proyecto;
}
export default BorrarProyecto;