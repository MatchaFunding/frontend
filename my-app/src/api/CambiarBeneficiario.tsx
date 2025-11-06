import Beneficiario from '../models/Beneficiario.tsx'

export async function CambiarBeneficiario(id: number, data: Beneficiario) {
  try {
    const response = await fetch(`https://backend.matchafunding.com/beneficiarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'ID':data.ID,
        'Nombre':data.Nombre,
        'FechaDeCreacion':data.FechaDeCreacion,
        'RegionDeCreacion':data.RegionDeCreacion,
        'Direccion':data.Direccion,
        'TipoDePersona':data.TipoDePersona,
        'TipoDeEmpresa':data.TipoDeEmpresa,
        'Perfil':data.Perfil,
        'RUTdeEmpresa':data.RUTdeEmpresa,
        'RUTdeRepresentante':data.RUTdeRepresentante,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: Beneficiario[] = await response.json();
    return result[0];
  }
  catch (error) {
    console.error('Error en CambiarBeneficiario:', error);
  }
}