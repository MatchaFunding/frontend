interface LoginResponse {
  success: boolean;
  message?: string;
  error?: string;
  usuario?: any;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export async function ValidarCredencialesAsync(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    console.log('Validando credenciales para:', credentials.email);
    
    const response = await fetch(`https://struggle-smooth-earnings-girlfriend.trycloudflare.com/validarcredenciales/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Correo: credentials.email,
        Contrasena: credentials.password
      }),
    });
    
    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Respuesta del servidor:', data);
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Credenciales incorrectas'
      };
    }
    
    return data;
  }
  catch (error) {
    console.error('Error en ValidarCredencialesAsync:', error);
    return {
      success: false,
      error: 'Error de conexión con el servidor'
    };
  }
}

export async function ValidarCredencialesDeEmpresaAsync(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    console.log('Validando credenciales de empresa para:', credentials.email);
    
    const response = await fetch(`https://struggle-smooth-earnings-girlfriend.trycloudflare.com/validarcredencialesdeempresa/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Correo: credentials.email,
        Contrasena: credentials.password
      }),
    });
    
    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Respuesta del servidor (empresa):', data);
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Credenciales incorrectas'
      };
    }
    
    // Si la respuesta es exitosa (200) y contiene datos de empresa, es un login válido
    if (response.ok && (data.Beneficiario || data.Miembros || data.Proyectos)) {
      return {
        success: true,
        usuario: data
      };
    }
    
    return data;
  }
  catch (error) {
    console.error('Error en ValidarCredencialesDeEmpresaAsync:', error);
    return {
      success: false,
      error: 'Error de conexión con el servidor'
    };
  }
}
