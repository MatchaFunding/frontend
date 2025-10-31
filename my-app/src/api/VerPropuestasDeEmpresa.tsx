export interface PropuestaEmpresa {
  ID: number;
  Usuario: number;
  ResumenLLM: string;
}

export async function VerPropuestasDeEmpresaAsync(empresaId: number): Promise<PropuestaEmpresa[]> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/verpropuestasdeempresa/${empresaId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener las propuestas de la empresa');
    }
    
    const result: PropuestaEmpresa[] = await response.json();
    return result;
  } catch (error) {
    console.error('Error al obtener propuestas de empresa:', error);
    throw new Error('Error al obtener las propuestas');
  }
}

export default VerPropuestasDeEmpresaAsync;