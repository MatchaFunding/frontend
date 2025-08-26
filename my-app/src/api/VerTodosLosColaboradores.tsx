import Colaborador from '../models/Colaborador.tsx'
import { useEffect, useState } from 'react';

export async function VerTodosLosColaboradoresAsync(): Promise<Colaborador[]> {
  try {
    const response = await fetch('http://127.0.0.1:8000/vertodosloscolaboradores/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: Colaborador[] = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en VerTodosLosColaboradores:', error);
    return [];
  }
}
export function VerTodosLosColaboradores() {
  const [Colaborador, setColaborador] = useState<Colaborador[]>([]);

  useEffect(() => {
      VerTodosLosColaboradoresAsync().then((data) => {
      setColaborador(data);
      });
  }, []);
  return Colaborador;
}
export default VerTodosLosColaboradores;