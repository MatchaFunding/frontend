import Persona from '../models/Persona.tsx'

export async function CrearPersona(data: Persona) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/personas/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'Nombre':data.Nombre,
        'Sexo':data.Sexo,
        'RUT':data.RUT,
        'FechaDeNacimiento':data.FechaDeNacimiento,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: Persona = await response.json();
    return result;
  }
  catch (error) {
    throw new Error('Error al obtener los datos');
  }
}