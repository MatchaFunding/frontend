import Idea from '../models/Idea.tsx'
import { useEffect, useState } from 'react';




export async function CrearIdeaAsync(data: Idea) {
  try {
    const response = await fetch(`https://backend.matchafunding.com/crearidea/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
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
    throw new Error('Error al obtener los datos');
  }
}
export function CrearIdea(data: Idea) {
  const [Idea, setIdea] = useState<Idea>();

  useEffect(() => {
      CrearIdeaAsync(data).then((out) => {
      setIdea(out);
      });
  }, );
  return Idea;
}
export default CrearIdea;
