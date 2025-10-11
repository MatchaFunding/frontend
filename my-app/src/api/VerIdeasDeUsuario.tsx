import Idea from '../models/Idea.tsx'
import { useEffect, useState } from 'react';

export async function VerIdeasDeUsuarioAsync(usuarioId: number): Promise<Idea[]> {
  try {
    const response = await fetch(`https://backend.matchafunding.com/verideasdeusuario/${usuarioId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: Idea[] = await response.json();
    // Convertir los datos a instancias de Idea para asegurar consistencia
    return data.map(idea => new Idea(idea));
  }
  catch (error) {
    console.error('Error en VerIdeasDeUsuario:', error);
    throw error;
  }
}

export function VerIdeasDeUsuario(usuarioId: number) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (usuarioId) {
      VerIdeasDeUsuarioAsync(usuarioId)
        .then((data) => {
          setIdeas(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [usuarioId]);
  
  return { ideas, loading, error };
}

export default VerIdeasDeUsuario;