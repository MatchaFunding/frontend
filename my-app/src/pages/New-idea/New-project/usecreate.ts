// hooks/useCrearProyecto.ts
import { useState } from 'react';
import type Proyecto from '../../../models/Proyecto';
import { CrearProyecto } from '../../../api/CrearProyecto';


export function useCrearProyecto() {
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearProyecto = async (data: Proyecto) => {
    setLoading(true);
    setError(null);
    try {
      const nuevoProyecto = await CrearProyecto(data);
      setProyecto(nuevoProyecto);
      return nuevoProyecto;
    } catch (err) {
      setError('Error al crear el proyecto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { proyecto, crearProyecto, loading, error };
}
