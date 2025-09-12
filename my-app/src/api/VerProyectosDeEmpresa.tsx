import Proyecto from '../models/Proyecto.tsx';
import { useEffect, useState } from 'react';

export async function VerProyectosDeEmpresaAsync(id: number): Promise<Proyecto[]> {
  try {
    const response = await fetch(`https://chat-resorts-builders-calculators.trycloudflare.com/verproyectosdeempresa/${id}`, {
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
    console.error('Error en VerProyectosDeEmpresaAsync:', error);
    return [];
  }
}
export function VerProyectosDeEmpresa(id: number) {
  const [Proyecto, setProyecto] = useState<Proyecto[]>([]);

  useEffect(() => {
      VerProyectosDeEmpresaAsync(id).then((data) => {
      setProyecto(data);
      });
  }, []);
  return Proyecto;
}
export default VerProyectosDeEmpresa;