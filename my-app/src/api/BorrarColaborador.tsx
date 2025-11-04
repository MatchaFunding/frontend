import Colaborador from '../models/Colaborador.tsx'
import { useEffect, useState } from 'react';

export async function BorrarColaboradorAsync(id: number) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/colaboradores/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: Colaborador = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en BorrarColaborador:', error);
  }
}
export function BorrarColaborador(id: number) {
  const [Colaborador, setColaborador] = useState<Colaborador>();

  useEffect(() => {
      BorrarColaboradorAsync(id).then((data) => {
      setColaborador(data);
      });
  }, );
  return Colaborador;
}
export default BorrarColaborador;