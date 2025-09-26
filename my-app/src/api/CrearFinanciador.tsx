import Financiador from '../models/Financiador.tsx'
import { useEffect, useState } from 'react';

export async function CrearFinanciadorAsync(data: Financiador) {
  try {
    const response = await fetch(`https://backend.matchafunding.com/crearfinanciador/`, {
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
    const result: Financiador = await response.json();
    return result;
  }
  catch (error) {
    throw new Error('Error al obtener los datos');
  }
}
export function CrearFinanciador(data: Financiador) {
  const [Financiador, setFinanciador] = useState<Financiador>();

  useEffect(() => {
      CrearFinanciadorAsync(data).then((out) => {
      setFinanciador(out);
      });
  }, );
  return Financiador;
}
export default CrearFinanciador;