import Usuario from '../models/Usuario.tsx'
import { useEffect, useState } from 'react';

export async function BorrarUsuarioAsync(id: number): Promise<Usuario[]> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/borrarusuario/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const data: Usuario[] = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error en BorrarUsuario:', error);
    return [];
  }
}
export function BorrarUsuario(id: number) {
  const [Usuario, setUsuario] = useState<Usuario[]>([]);

  useEffect(() => {
      BorrarUsuarioAsync(id).then((data) => {
      setUsuario(data);
      });
  }, []);
  return Usuario;
}
export default BorrarUsuario;