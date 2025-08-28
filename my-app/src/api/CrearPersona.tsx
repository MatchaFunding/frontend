import Persona from '../models/Persona.tsx'
import { useEffect, useState } from 'react';

export async function CrearPersonaAsync(data: Persona): Promise<any> {
  try {
    console.log('Enviando datos a CrearPersona:', JSON.stringify(data, null, 2));
    
    const response = await fetch('http://127.0.0.1:8000/crearpersona/', {
      method: 'POST',
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
    return result; 
  }
  catch (error) {
    console.error('Error en CrearPersona:', error);
    throw error;
  }
}
export function CrearPersona(data: Persona) {
  const [Persona, setPersona] = useState<Persona[]>([]);

  useEffect(() => {
      CrearPersonaAsync(data).then((out) => {
      setPersona(out);
      });
  }, []);
  return Persona;
}
export default CrearPersona;