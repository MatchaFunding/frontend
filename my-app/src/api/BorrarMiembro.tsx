import Miembro from '../models/Miembro.tsx'
import { useEffect, useState } from 'react';

export async function BorrarMiembroAsync(id: number): Promise<Miembro[]> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/borrarmiembro/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: Miembro[] = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en BorrarMiembro:', error);
    return [];
  }
}
export function BorrarMiembro(id: number) {
  const [Miembro, setMiembro] = useState<Miembro[]>([]);

  useEffect(() => {
      BorrarMiembroAsync(id).then((data) => {
      setMiembro(data);
      });
  }, []);
  return Miembro;
}
export default BorrarMiembro;