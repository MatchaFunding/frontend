import Idea from '../models/Idea.tsx'
import { useEffect, useState } from 'react';

export async function CambiarIdeaAsync(id: number, data: Idea): Promise<Idea | null> {
  try {
    const response = await fetch(`https://backend.matchafunding.com/cambiaridea/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'ID':data.ID,
        'Usuario':data.Usuario,
        'Campo':data.Campo,
        'Problema':data.Problema,
        'Publico':data.Publico,
        'Innovacion':data.Innovacion,
        'Oculta':data.Oculta,
        'FechaDeCreacion':data.FechaDeCreacion,
        'Propuesta':data.Propuesta,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en CambiarIdea - Status:', response.status);
      console.error('Error details:', errorText);
      throw new Error(`Error al cambiar idea: ${response.status}`);
    }
    const result: Idea = await response.json();
    return result;
  }
  catch (error) {
    console.error('Error en CambiarIdea:', error);
    return null;
  }
}
export function CambiarIdea(id: number, data: Idea) {
  const [Idea, setIdea] = useState<Idea>();

  useEffect(() => {
      CambiarIdeaAsync(id, data).then((out) => {
        if (out) {
          setIdea(out);
        }
      });
  }, );
  return Idea;
}
export default CambiarIdea;