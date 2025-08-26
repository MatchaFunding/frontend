import Usuario from '../models/Usuario.tsx'
import { useEffect, useState } from 'react';

export async function VerTodosLosUsuariosAsync(): Promise<Usuario[]> {
  try {
    const response = await fetch('http://127.0.0.1:8000/vertodoslosusuarios/', {
      method: 'GET',
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
    console.error('Error en VerTodosLosUsuarios:', error);
    return [];
  }
}
export function VerTodosLosUsuarios() {
  const [Usuario, setUsuario] = useState<Usuario[]>([]);

  useEffect(() => {
      VerTodosLosUsuariosAsync().then((data) => {
      setUsuario(data);
      });
  }, []);
  return Usuario;
}
export default VerTodosLosUsuarios;