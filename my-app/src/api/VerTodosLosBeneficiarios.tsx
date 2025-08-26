import Beneficiario from '../models/Beneficiario.tsx'
import { useEffect, useState } from 'react';

export async function VerTodosLosBeneficiariosAsync(): Promise<Beneficiario[]> {
  try {
    const response = await fetch('http://127.0.0.1:8000/vertodoslosbeneficiarios/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: Beneficiario[] = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en VerTodosLosBeneficiarios:', error);
    return [];
  }
}
export function VerTodosLosBeneficiarios() {
  const [Beneficiario, setBeneficiario] = useState<Beneficiario[]>([]);

  useEffect(() => {
      VerTodosLosBeneficiariosAsync().then((data) => {
      setBeneficiario(data);
      });
  }, []);
  return Beneficiario;
}
export default VerTodosLosBeneficiarios;