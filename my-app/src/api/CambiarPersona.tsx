import Persona from '../models/Persona.tsx'
import { useEffect, useState } from 'react';

export async function CambiarPersonaAsync(id: number, data: Persona): Promise<any> {
  try {
    console.log('Enviando datos a CambiarPersona:', JSON.stringify(data, null, 2));
    
    const response = await fetch(`http://127.0.0.1:8000/cambiarpersona/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'ID':data.ID,
        'Nombre':data.Nombre,
        'Sexo':data.Sexo,
        'RUT':data.RUT,
      }),
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Response data:', result);
    return result; // Devolvemos directamente lo que responde el backend
  }
  catch (error) {
    console.error('Error en CambiarPersona:', error);
    throw error; // Re-lanzamos el error para que lo maneje el componente
  }
}
export function CambiarPersona(id: number, data: Persona) {
  const [Persona, setPersona] = useState<Persona[]>([]);

  useEffect(() => {
      CambiarPersonaAsync(id, data).then((out) => {
      setPersona(out);
      });
  }, []);
  return Persona;
}
export default CambiarPersona;