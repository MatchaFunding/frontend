import Financiador from '../models/Financiador.tsx'
import { useEffect, useState } from 'react';

export async function CrearFinanciadorAsync(data: Financiador): Promise<Financiador[]> {
  try {
    const response = await fetch('http://127.0.0.1:8000/crearfinanciador/', {
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
    const result: Financiador[] = await response.json();
    return result;
  }
  catch (error) {
    console.error('Error en CrearFinanciador:', error);
    return [];
  }
}
export function CrearFinanciador(data: Financiador) {
  const [Financiador, setFinanciador] = useState<Financiador[]>([]);

  useEffect(() => {
      CrearFinanciadorAsync(data).then((out) => {
      setFinanciador(out);
      });
  }, []);
  return Financiador;
}
export default CrearFinanciador;