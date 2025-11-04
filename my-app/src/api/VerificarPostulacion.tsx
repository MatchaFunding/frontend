import Postulacion from '../models/Postulacion';

export async function VerificarPostulacionAsync(empresaId: number, instrumentoId: number): Promise<boolean> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/postulaciones`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Error al verificar postulaciones:', response.status);
      return false;
    }
    
    const postulaciones: Postulacion[] = await response.json();
    
    const existePostulacion = postulaciones.some(postulacion => 
      postulacion.Beneficiario === empresaId && 
      postulacion.Instrumento === instrumentoId
    );
    
    return existePostulacion;
  } catch (error) {
    console.error('Error al verificar postulación:', error);
    return false;
  }
}

export async function ObtenerPostulacionAsync(empresaId: number, instrumentoId: number): Promise<Postulacion | null> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/postulaciones`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Error al obtener postulaciones:', response.status);
      return null;
    }
    
    const postulaciones: Postulacion[] = await response.json();
    
    const postulacion = postulaciones.find(postulacion => 
      postulacion.Beneficiario === empresaId && 
      postulacion.Instrumento === instrumentoId
    );
    
    return postulacion || null;
  } catch (error) {
    console.error('Error al obtener postulación:', error);
    return null;
  }
}

export default VerificarPostulacionAsync;