export async function VerMiBeneficiario(id: number) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/usuarios/${id}/beneficiarios`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result = await response.json();
    return result[0];
  }
  catch (error) {
    console.error('Error en VerMiUsuario:', error);
  }
}