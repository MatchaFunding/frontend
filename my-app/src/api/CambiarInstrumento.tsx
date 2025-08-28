import Instrumento from '../models/Instrumento.tsx'
import { useEffect, useState } from 'react';

export async function CambiarInstrumentoAsync(id: number, data: Instrumento): Promise<Instrumento[]> {
  try {
    const response = await fetch(`https://spring-park-flashing-ensures.trycloudflare.com/cambiarinstrumento/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'ID':data.ID,
        'Titulo':data.Titulo,
        'Financiador':data.Financiador,
        'Alcance':data.Alcance,
        'Descripcion':data.Descripcion,
        'FechaDeApertura':data.FechaDeApertura,
        'FechaDeCierre':data.FechaDeCierre,
        'DuracionEnMeses':data.DuracionEnMeses,
        'Beneficios':data.Beneficios,
        'Requisitos':data.Requisitos,
        'MontoMinimo':data.MontoMinimo,
        'MontoMaximo':data.MontoMaximo,
        'Estado':data.Estado,
        'TipoDeBeneficio':data.TipoDeBeneficio,
        'TipoDePerfil':data.TipoDePerfil,
        'EnlaceDelDetalle':data.EnlaceDelDetalle,
        'EnlaceDeLaFoto':data.EnlaceDeLaFoto,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: Instrumento[] = await response.json();
    return result;
  }
  catch (error) {
    console.error('Error en CambiarInstrumento:', error);
    return [];
  }
}
export function CambiarInstrumento(id: number, data: Instrumento) {
  const [Instrumento, setInstrumento] = useState<Instrumento[]>([]);

  useEffect(() => {
      CambiarInstrumentoAsync(id, data).then((out) => {
      setInstrumento(out);
      });
  }, []);
  return Instrumento;
}
export default CambiarInstrumento;