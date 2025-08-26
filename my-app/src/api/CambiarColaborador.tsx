import Colaborador from '../models/Colaborador.tsx'
import { useEffect, useState } from 'react';

export async function CambiarColaboradorAsync(id: number, data: Colaborador): Promise<Colaborador[]> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/cambiarcolaborador/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'ID':data.ID,
        'Persona':data.Persona,
        'Proyecto':data.Proyecto,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: Colaborador[] = await response.json();
    return result;
  }
  catch (error) {
    console.error('Error en CambiarColaborador:', error);
    return [];
  }
}
export function CambiarColaborador(id: number, data: Colaborador) {
  const [Colaborador, setColaborador] = useState<Colaborador[]>([]);

  useEffect(() => {
      CambiarColaboradorAsync(id, data).then((out) => {
      setColaborador(out);
      });
  }, []);
  return Colaborador;
}
export default CambiarColaborador;