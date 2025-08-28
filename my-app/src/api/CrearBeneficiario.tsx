import Beneficiario from '../models/Beneficiario.tsx'
import { useEffect, useState } from 'react';

export async function CrearBeneficiarioAsync(data: Beneficiario): Promise<Beneficiario[]> {
  try {
    const payload = {
      // No enviar ID para que Django lo genere automáticamente
      'Nombre':data.Nombre,
      'FechaDeCreacion':data.FechaDeCreacion,
      'RegionDeCreacion':data.RegionDeCreacion,
      'Direccion':data.Direccion,
      'TipoDePersona':data.TipoDePersona,
      'TipoDeEmpresa':data.TipoDeEmpresa,
      'Perfil':data.Perfil,
      'RUTdeEmpresa':data.RUTdeEmpresa,
      'RUTdeRepresentante':data.RUTdeRepresentante,
    };

    console.log('Payload completo enviado al servidor:');
    console.log(JSON.stringify(payload, null, 2));

    const response = await fetch('http://127.0.0.1:8000/crearbeneficiario/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Status de respuesta:', response.status);
    console.log('Headers de respuesta:', response.headers);
    
    if (!response.ok) {
      // Intentar obtener el mensaje de error del servidor
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.text();
        console.log('Mensaje de error del servidor:', errorData);
        
        // Intentar parsear como JSON para obtener errores de validación específicos
        try {
          const errorJson = JSON.parse(errorData);
          if (errorJson && typeof errorJson === 'object') {
            // Si hay errores de validación específicos, mostrarlos
            const errorDetails = Object.entries(errorJson)
              .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
              .join('; ');
            errorMessage += ` - Errores de validación: ${errorDetails}`;
          } else {
            errorMessage += ` - ${errorData}`;
          }
        } catch (parseError) {
          // Si no es JSON válido, usar el texto tal como está
          errorMessage += ` - ${errorData}`;
        }
      } catch (e) {
        console.log('No se pudo obtener el mensaje de error del servidor');
      }
      throw new Error(errorMessage);
    }
    
    const result: Beneficiario[] = await response.json();
    console.log('Beneficiario creado exitosamente:', result);
    return result;
  }
  catch (error) {
    console.error('Error detallado en CrearBeneficiario:', error);
    throw error; // Re-lanzar el error para que se maneje en el componente
  }
}
export function CrearBeneficiario(data: Beneficiario) {
  const [Beneficiario, setBeneficiario] = useState<Beneficiario[]>([]);

  useEffect(() => {
      CrearBeneficiarioAsync(data).then((out) => {
      setBeneficiario(out);
      });
  }, []);
  return Beneficiario;
}
export default CrearBeneficiario;