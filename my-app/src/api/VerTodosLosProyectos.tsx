import Proyecto from '../models/Proyecto.tsx'
import { useEffect, useState } from 'react';

export async function VerTodosLosProyectosAsync(): Promise<Proyecto[]> {
  try {
    const response = await fetch('http://127.0.0.1:8000/vertodoslosproyectos/', {
      method: 'GET',
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
    console.error('Error en VerTodosLosProyectos:', error);
    return [];
  }
}
export function VerTodosLosProyectos() {
  const [Proyecto, setProyecto] = useState<Proyecto[]>([]);

  useEffect(() => {
      VerTodosLosProyectosAsync().then((data) => {
      setProyecto(data);
      });
  }, []);
  return Proyecto;
}
export default VerTodosLosProyectos;