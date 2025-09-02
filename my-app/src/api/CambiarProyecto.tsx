import Proyecto from '../models/Proyecto.tsx'
import { useEffect, useState } from 'react';

export async function CambiarProyectoAsync(id: number, data: Proyecto): Promise<Proyecto> {
  try {
    const response = await fetch(`https://referral-charlotte-fee-powers.trycloudflare.com/cambiarproyecto/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'ID':data.ID,
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
    console.error('Error en CambiarProyecto:', error);
  }
}
export function CambiarProyecto(id: number, data: Proyecto) {
  const [Proyecto, setProyecto] = useState<Proyecto>();

  useEffect(() => {
      CambiarProyectoAsync(id, data).then((out) => {
      setProyecto(out);
      });
  }, );
  return Proyecto;
}
export default CambiarProyecto;