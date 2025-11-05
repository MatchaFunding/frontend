import Idea from '../models/Idea.tsx'

export async function CrearIdea(data: Idea) {
  try {
    const response = await fetch(`https://backend.matchafunding.com/ideas`, {
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
        'FechaDeCreacion':data.FechaDeCreacion,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: Idea[] = await response.json();
    return result[0];
  }
  catch (error) {
    throw new Error('Error al obtener los datos');
  }
}