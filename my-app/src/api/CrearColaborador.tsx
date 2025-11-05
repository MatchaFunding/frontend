import Colaborador from '../models/Colaborador.tsx'

export async function CrearColaborador(data: Colaborador) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/colaboradores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'Persona':data.Persona,
        'Proyecto':data.Proyecto,
        'Usuario':data.Usuario,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: Colaborador = await response.json();
    return result;
  }
  catch (error) {
    throw new Error('Error al obtener los datos');
  }
}