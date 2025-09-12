import Beneficiario from '../models/Beneficiario.tsx'
import { useEffect, useState } from 'react';

export async function CrearBeneficiarioAsync(data: Beneficiario) {
  try {
    const response = await fetch(`https://chat-resorts-builders-calculators.trycloudflare.com/crearbeneficiario/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
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
    const result: Beneficiario = await response.json();
    return result;
  }
  catch (error) {
    throw new Error('Error al obtener los datos');
  }
}
export function CrearBeneficiario(data: Beneficiario) {
  const [Beneficiario, setBeneficiario] = useState<Beneficiario>();

  useEffect(() => {
      CrearBeneficiarioAsync(data).then((out) => {
      setBeneficiario(out);
      });
  }, );
  return Beneficiario;
}
export default CrearBeneficiario;