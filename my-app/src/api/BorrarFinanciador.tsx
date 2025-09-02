import Financiador from '../models/Financiador.tsx'
import { useEffect, useState } from 'react';

export async function BorrarFinanciadorAsync(id: number): Promise<Financiador> {
  try {
    const response = await fetch(`https://referral-charlotte-fee-powers.trycloudflare.com/borrarfinanciador/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: Financiador = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en BorrarFinanciador:', error);
  }
}
export function BorrarFinanciador(id: number) {
  const [Financiador, setFinanciador] = useState<Financiador>();

  useEffect(() => {
      BorrarFinanciadorAsync(id).then((data) => {
      setFinanciador(data);
      });
  }, );
  return Financiador;
}
export default BorrarFinanciador;