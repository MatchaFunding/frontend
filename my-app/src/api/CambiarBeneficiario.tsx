import Beneficiario from '../models/Beneficiario.tsx'
import { useEffect, useState } from 'react';

export async function CambiarBeneficiarioAsync(id: number, data: Beneficiario) {
  try {
    const response = await fetch(`https://struggle-smooth-earnings-girlfriend.trycloudflare.com/cambiarbeneficiario/${id}`, {
      method: 'PUT',
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
    const result: Beneficiario = await response.json();
    return result;
  }
  catch (error) {
    console.error('Error en CambiarBeneficiario:', error);
  }
}
export function CambiarBeneficiario(id: number, data: Beneficiario) {
  const [Beneficiario, setBeneficiario] = useState<Beneficiario>();

  useEffect(() => {
      CambiarBeneficiarioAsync(id, data).then((out) => {
      setBeneficiario(out);
      });
  }, );
  return Beneficiario;
}
export default CambiarBeneficiario;