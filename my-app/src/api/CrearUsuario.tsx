import Usuario from '../models/Usuario.tsx'
import { useEffect, useState } from 'react';

export async function CrearUsuarioAsync(data: Usuario): Promise<Usuario[]> {
  try {
    const response = await fetch('http://127.0.0.1:8000/crearusuario/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'ID':data.ID,
        'Persona':data.Persona,
        'NombreDeUsuario':data.NombreDeUsuario,
        'Contrasena':data.Contrasena,
        'Correo':data.Correo,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: Usuario[] = await response.json();
    return result;
  }
  catch (error) {
    console.error('Error en CrearUsuario:', error);
    return [];
  }
}
export function CrearUsuario(data: Usuario) {
  const [Usuario, setUsuario] = useState<Usuario[]>([]);

  useEffect(() => {
      CrearUsuarioAsync(data).then((out) => {
      setUsuario(out);
      });
  }, []);
  return Usuario;
}
export default CrearUsuario;