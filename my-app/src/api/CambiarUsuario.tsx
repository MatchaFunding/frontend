import Usuario from '../models/Usuario.tsx'
import { useEffect, useState } from 'react';

export async function CambiarUsuarioAsync(id: number, data: Usuario) {
  try {
    const response = await fetch(`https://chat-resorts-builders-calculators.trycloudflare.com/cambiarusuario/${id}`, {
      method: 'PUT',
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
    const result: Usuario = await response.json();
    return result;
  }
  catch (error) {
    console.error('Error en CambiarUsuario:', error);
  }
}
export function CambiarUsuario(id: number, data: Usuario) {
  const [Usuario, setUsuario] = useState<Usuario>();

  useEffect(() => {
      CambiarUsuarioAsync(id, data).then((out) => {
      setUsuario(out);
      });
  }, );
  return Usuario;
}
export default CambiarUsuario;