import Beneficiario from '../models/Beneficiario.tsx'
import { useEffect, useState } from 'react';

export async function CrearBeneficiarioAsync(data: Beneficiario): Promise<Beneficiario[]> {
  try {
    const response = await fetch('http://127.0.0.1:8000/crearbeneficiario/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'ID':data.ID,
        'Nombre':data.Nombre,
        'FechaDeCreacion':data.FechaDeCreacion,
        'RegionDeCreacion':data.RegionDeCreacion,
        'Direccion':data.Direccion,
        'TipoDePersona':data.TipoDePersona,
        'TipoDeEmpresa':data.TipoDeEmpresa,
        'Perfil':data.Perfil,
        'RUTdeEmpresa':data.RUTdeEmpresa,
        'RUTdeRepresentante':data.RUTdeRepresentante,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: Beneficiario[] = await response.json();
    return result;
  }
  catch (error) {
    console.error('Error en CrearBeneficiario:', error);
    return [];
  }
}
export function CrearBeneficiario(data: Beneficiario) {
  const [Beneficiario, setBeneficiario] = useState<Beneficiario[]>([]);

  useEffect(() => {
      CrearBeneficiarioAsync(data).then((out) => {
      setBeneficiario(out);
      });
  }, []);
  return Beneficiario;
}
export default CrearBeneficiario;