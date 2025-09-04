import Idea from '../models/Idea.tsx'
import { useEffect, useState } from 'react';

export async function CambiarIdeaAsync(id: number, data: Idea) {
  try {
    const response = await fetch(`https://referral-charlotte-fee-powers.trycloudflare.com/cambiaridea/${id}`, {
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
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: Idea = await response.json();
    return result;
  }
  catch (error) {
    console.error('Error en CambiarIdea:', error);
  }
}
export function CambiarIdea(id: number, data: Idea) {
  const [Idea, setIdea] = useState<Idea>();

  useEffect(() => {
      CambiarIdeaAsync(id, data).then((out) => {
      setIdea(out);
      });
  }, );
  return Idea;
}
export default CambiarIdea;