import Idea from '../models/Idea.tsx'
import IdeaRespuesta from '../models/IdeaRespuesta.ts'

export async function CrearIdeaIAAsync(data: Idea) {
  try {
    const response = await fetch(`https://incredible-differently-forget-rx.trycloudflare.com/api/v1/ideas/`, {
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
        'ID': data.ID
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: IdeaRespuesta = await response.json();
    return result;
  }
  catch (error) {
    throw new Error('Error al obtener los datos');
  }
}

export default CrearIdeaIAAsync;
