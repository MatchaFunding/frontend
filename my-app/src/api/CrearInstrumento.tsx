import Instrumento from '../models/Instrumento.tsx'
import { useEffect, useState } from 'react';

export async function CrearInstrumentoAsync(data: Instrumento) {
  try {
    const response = await fetch(`https://struggle-smooth-earnings-girlfriend.trycloudflare.com/crearinstrumento/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
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
    const result: Instrumento = await response.json();
    return result;
  }
  catch (error) {
    throw new Error('Error al obtener los datos');
  }
}
export function CrearInstrumento(data: Instrumento) {
  const [Instrumento, setInstrumento] = useState<Instrumento>();

  useEffect(() => {
      CrearInstrumentoAsync(data).then((out) => {
      setInstrumento(out);
      });
  }, );
  return Instrumento;
}
export default CrearInstrumento;