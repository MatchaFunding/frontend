// Interfaces para el formulario de login
export interface LoginFormData {
  email: string;
  password: string;
}

// Datos iniciales del formulario
export const initialLoginFormData: LoginFormData = {
  email: '',
  password: ''
};

// Validación de email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validación de campos individuales
export const validateFieldPure = (field: string, value: string): string => {
  switch (field) {
    case 'email':
      if (!value.trim()) {
        return 'El correo electrónico es obligatorio';
      }
      if (!isValidEmail(value)) {
        return 'Ingresa un correo electrónico válido';
      }
      return '';
    
    case 'password':
      if (!value.trim()) {
        return 'La contraseña es obligatoria';
      }
      if (value.length < 8) {
        return 'La contraseña debe tener al menos 8 caracteres';
      }
      return '';
    
    default:
      return '';
  }
};

// Función para manejar cambios en inputs
export const handleInputChangePure = (
  formData: LoginFormData,
  field: string,
  value: string
): LoginFormData => {
  return {
    ...formData,
    [field]: value
  };
};

// Validación del formulario completo
export const isLoginFormValid = (email: string, password: string): boolean => {
  return isValidEmail(email) && password.length >= 8;
};

// Obtener datos del formulario
export const obtenerDatosFormulario = (form: HTMLFormElement): LoginFormData => {
  const formData = new FormData(form);
  const email = (formData.get('email') as string)?.trim() || '';
  const password = (formData.get('password') as string)?.trim() || '';

  return {
    email,
    password
  };
};

// Validar formulario de login
export const validarFormularioLogin = (email: string, password: string): { valid: boolean; error: string } => {
  if (!email.trim()) {
    return { valid: false, error: 'Por favor, ingresa tu correo electrónico' };
  }

  if (!isValidEmail(email)) {
    return { valid: false, error: 'Por favor, ingresa un correo electrónico válido' };
  }

  if (!password.trim()) {
    return { valid: false, error: 'Por favor, ingresa tu contraseña' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'La contraseña debe tener al menos 8 caracteres' };
  }

  return { valid: true, error: '' };
};

// Manejo de errores del servidor
export const manejarErrorServidor = (error: any): string => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Error desconocido del servidor';
};
