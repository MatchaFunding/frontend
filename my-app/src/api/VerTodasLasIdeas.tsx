import Idea from '../models/Idea.tsx'
import { useEffect, useState } from 'react';

export async function VerTodasLasIdeasAsync(): Promise<Idea[]> {
  try {
    const response = await fetch('http://127.0.0.1:8000/vertodaslasideas/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: Idea[] = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en VerTodasLasIdeas:', error);
    return [];
  }
}
export function VerTodasLasIdeas() {
  const [Idea, setIdea] = useState<Idea[]>([]);

  useEffect(() => {
      VerTodasLasIdeasAsync().then((data) => {
      setIdea(data);
      });
  }, []);
  return Idea;
}
export default VerTodasLasIdeas;