import Financiador from '../models/Financiador.tsx'
import { useEffect, useState } from 'react';

export async function CambiarFinanciadorAsync(id: number, data: Financiador) {
  try {
    const response = await fetch(`https://struggle-smooth-earnings-girlfriend.trycloudflare.com/cambiarfinanciador/${id}`, {
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
    const result: Financiador = await response.json();
    return result;
  }
  catch (error) {
    console.error('Error en CambiarFinanciador:', error);
  }
}
export function CambiarFinanciador(id: number, data: Financiador) {
  const [Financiador, setFinanciador] = useState<Financiador>();

  useEffect(() => {
      CambiarFinanciadorAsync(id, data).then((out) => {
      setFinanciador(out);
      });
  }, );
  return Financiador;
}
export default CambiarFinanciador;