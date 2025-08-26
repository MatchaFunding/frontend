import Financiador from '../models/Financiador.tsx'
import { useEffect, useState } from 'react';

export async function VerTodosLosFinanciadoresAsync(): Promise<Financiador[]> {
  try {
    const response = await fetch('http://127.0.0.1:8000/vertodoslosfinanciadores/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: Financiador[] = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en VerTodosLosFinanciadores:', error);
    return [];
  }
}
export function VerTodosLosFinanciadores() {
  const [Financiador, setFinanciador] = useState<Financiador[]>([]);

  useEffect(() => {
      VerTodosLosFinanciadoresAsync().then((data) => {
      setFinanciador(data);
      });
  }, []);
  return Financiador;
}
export default VerTodosLosFinanciadores;