import Idea from '../models/Idea.tsx'
import { useEffect, useState } from 'react';

export async function BorrarIdeaAsync(id: number) {
  try {
    const response = await fetch(`https://chat-resorts-builders-calculators.trycloudflare.com/borraridea/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: Idea = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en BorrarIdea:', error);
  }
}
export function BorrarIdea(id: number) {
  const [Idea, setIdea] = useState<Idea>();

  useEffect(() => {
      BorrarIdeaAsync(id).then((data) => {
      setIdea(data);
      });
  }, );
  return Idea;
}
export default BorrarIdea;