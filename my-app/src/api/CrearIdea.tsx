import Idea from '../models/Idea.tsx'
import { useEffect, useState } from 'react';

export async function CrearIdeaAsync(data: Idea): Promise<Idea[]> {
  try {
    const response = await fetch('http://127.0.0.1:8000/crearidea/', {
      method: 'POST',
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
    const result: Idea[] = await response.json();
    return result;
  }
  catch (error) {
    console.error('Error en CrearIdea:', error);
    return [];
  }
}
export function CrearIdea(data: Idea) {
  const [Idea, setIdea] = useState<Idea[]>([]);

  useEffect(() => {
      CrearIdeaAsync(data).then((out) => {
      setIdea(out);
      });
  }, []);
  return Idea;
}
export default CrearIdea;