import Usuario from '../models/Usuario.tsx'
import { useEffect, useState } from 'react';

export async function BorrarUsuarioAsync(id: number) {
  try {
    const response = await fetch(`https://struggle-smooth-earnings-girlfriend.trycloudflare.com/borrarusuario/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: Usuario = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en BorrarUsuario:', error);
  }
}
export function BorrarUsuario(id: number) {
  const [Usuario, setUsuario] = useState<Usuario>();

  useEffect(() => {
      BorrarUsuarioAsync(id).then((data) => {
      setUsuario(data);
      });
  }, );
  return Usuario;
}
export default BorrarUsuario;