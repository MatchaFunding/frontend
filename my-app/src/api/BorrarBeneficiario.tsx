import Beneficiario from '../models/Beneficiario.tsx'
import { useEffect, useState } from 'react';

export async function BorrarBeneficiarioAsync(id: number) {
  try {
    const response = await fetch(`https://struggle-smooth-earnings-girlfriend.trycloudflare.com/borrarbeneficiario/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: Beneficiario = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en BorrarBeneficiario:', error);
  }
}
export function BorrarBeneficiario(id: number) {
  const [Beneficiario, setBeneficiario] = useState<Beneficiario>();

  useEffect(() => {
      BorrarBeneficiarioAsync(id).then((data) => {
      setBeneficiario(data);
      });
  }, );
  return Beneficiario;
}
export default BorrarBeneficiario;