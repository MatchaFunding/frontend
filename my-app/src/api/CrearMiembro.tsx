import Miembro from '../models/Miembro.tsx'
import { useEffect, useState } from 'react';

export async function CrearMiembroAsync(data: Miembro): Promise<Miembro[]> {
  try {
    const response = await fetch('http://127.0.0.1:8000/crearmiembro/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'ID':data.ID,
        'Persona':data.Persona,
        'Beneficiario':data.Beneficiario,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: Miembro[] = await response.json();
    return result;
  }
  catch (error) {
    console.error('Error en CrearMiembro:', error);
    return [];
  }
}
export function CrearMiembro(data: Miembro) {
  const [Miembro, setMiembro] = useState<Miembro[]>([]);

  useEffect(() => {
      CrearMiembroAsync(data).then((out) => {
      setMiembro(out);
      });
  }, []);
  return Miembro;
}
export default CrearMiembro;