export async function VerificarEmailExiste(email: string): Promise<boolean> {
  try {
    console.log('Verificando email:', email);
    
    const url = `https://referral-charlotte-fee-powers.trycloudflare.com/validarsiexistecorreo/`;
    console.log('URL completa:', url);
    
    const payload = {
      Correo: email
    };
    console.log('Payload enviado:', payload);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    console.log('Response status:', response.status);
    
    // El backend retorna 200 si el email NO existe (disponible para registro)
    // El backend retorna 400 si el email SÍ existe (ya está registrado)
    if (response.status === 200) {
      console.log('Email disponible para registro (200)');
      return false; // Email NO existe, disponible para registro
    }
    
    if (response.status === 400) {
      console.log('Email ya existe en la base de datos (400)');
      return true; // Email SÍ existe, no disponible para registro
    }
    
    // Si recibimos 404, probablemente el endpoint no existe o hay un problema con el servidor
    if (response.status === 404) {
      console.error('Endpoint no encontrado - revisar URL del servidor');
      return false; // En caso de error del servidor, asumir que no existe para no bloquear
    }
    
    // Para cualquier otro error, asumir que no existe para no bloquear el registro
    console.error('Error inesperado en la respuesta:', response.status, response.statusText);
    return false;
  }
  catch (error) {
    console.error('Error en VerificarEmailExiste:', error);
    console.warn('Error de conectividad detectado - permitiendo registro para no bloquear usuario');
    
    // Si hay error de CORS o conectividad, permitir el registro
    // En producción esto debe resolverse configurando correctamente el servidor
    return false;
  }
}
