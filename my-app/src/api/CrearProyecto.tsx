import Proyecto from '../models/Proyecto.tsx'
import { useEffect, useState } from 'react';

export async function CrearProyectoAsync(data: Proyecto): Promise<Proyecto> {
  try {
    const response = await fetch(`https://referral-charlotte-fee-powers.trycloudflare.com/crearproyecto/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'Beneficiario':data.Beneficiario,
        'Titulo':data.Titulo,
        'Descripcion':data.Descripcion,
        'DuracionEnMesesMinimo':data.DuracionEnMesesMinimo,
        'DuracionEnMesesMaximo':data.DuracionEnMesesMaximo,
        'Alcance':data.Alcance,
        'Area':data.Area,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: Proyecto = await response.json();
    return result;
  }
  catch (error) {
    throw new Error('Error al obtener los datos');
  }
}
export function CrearProyecto(data: Proyecto) {
  const [Proyecto, setProyecto] = useState<Proyecto>();

  useEffect(() => {
      CrearProyectoAsync(data).then((out) => {
      setProyecto(out);
      });
  }, );
  return Proyecto;
}
export default CrearProyecto;