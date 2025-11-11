export interface FormData {
// Paso 1: Persona
Nombre: string;
Apellido: string;
FechaDeNacimiento: string;
RUT: string;
Sexo: string;
// Paso 2: Beneficiario
NombreCompania: string;
CreacionCompania: string;
RegionCompania: string;
DireccionCompania: string;
TipoPersonaCompania: string;
TipoEmpresaCompania: string;
PerfilCompania: string;
RUTCompania: string;
RUTRepresentanteCompania: string;
// Paso 3: Opcional
approximateAmount: string;
benefitsOfInterest: string;
projectRegions: string;
projectDuration: string;
collaborators: string;
}

export interface DropdownOption {
value: string;
label: string;
}

export interface CustomDropdownProps {
field: string;
label: string;
options: DropdownOption[];
value: string;
placeholder?: string;
}

// Estado inicial del formulario
export const initialFormData: FormData = {
// Paso 1: Persona
Nombre: '',
Apellido: '',
FechaDeNacimiento: '',
RUT: '',
Sexo: '',
// Paso 2 - Beneficiario 
NombreCompania: '',
CreacionCompania: '',
RegionCompania: '',
DireccionCompania: '',
TipoPersonaCompania: '',
TipoEmpresaCompania: '',
PerfilCompania: '',
RUTCompania: '',
RUTRepresentanteCompania: '',
// Paso 3: Opcional
approximateAmount: '',
benefitsOfInterest: '',
projectRegions: '',
projectDuration: '',
collaborators: ''
};

// Opciones para los dropdowns
export const dropdownOptions = {
Sexo: [
  { value: '', label: 'Seleccionar' },
  { value: 'Hombre', label: 'Masculino' },
  { value: 'Mujer', label: 'Femenino' },
  { value: 'Otro', label: 'Prefiero no decir' }
],
TipoPersonaCompania: [
  { value: '', label: 'Seleccionar tipo de persona' },
  { value: 'Juridica', label: 'Jurídica' },
  { value: 'Natural', label: 'Natural' }
],
TipoEmpresaCompania: [
  { value: '', label: 'Seleccionar tipo de empresa' },
  { value: 'Sociedad Anonima', label: 'Sociedad Anónima' },
  { value: 'Sociedad de Responsabilidad Limitada', label: 'Sociedad de Responsabilidad Limitada' },
  { value: 'Sociedad por Acciones', label: 'Sociedad por Acciones' },
  { value: 'Empresa Individual de Responsabilidad Limitada', label: 'Empresa Individual de Responsabilidad Limitada' }
],
PerfilCompania: [
  { value: '', label: 'Seleccionar perfil' },
  { value: 'Empresa', label: 'Empresa' },
  { value: 'Extranjero', label: 'Extranjero' },
  { value: 'Institucion', label: 'Institución' },
  { value: 'Intermediario', label: 'Intermediario' },
  { value: 'Organizacion', label: 'Organización' },
  { value: 'Persona', label: 'Persona' }
],
regions: [
  { value: '', label: 'Seleccionar región' },
  { value: 'Arica y Parinacota', label: 'Arica y Parinacota' },
  { value: 'Tarapaca', label: 'Tarapacá' },
  { value: 'Antofagasta', label: 'Antofagasta' },
  { value: 'Atacama', label: 'Atacama' },
  { value: 'Coquimbo', label: 'Coquimbo' },
  { value: 'Valparaiso', label: 'Valparaíso' },
  { value: 'Santiago', label: 'Metropolitana' },
  { value: 'O\'Higgins', label: 'O\'Higgins' },
  { value: 'Maule', label: 'Maule' },
  { value: 'Nuble', label: 'Ñuble' },
  { value: 'Biobio', label: 'Biobío' },
  { value: 'La Araucania', label: 'La Araucanía' },
  { value: 'Los Rios', label: 'Los Ríos' },
  { value: 'Los Lagos', label: 'Los Lagos' },
  { value: 'Aysen', label: 'Aysén' },
  { value: 'Magallanes', label: 'Magallanes' }
],
benefits: [
  { value: '', label: 'Seleccionar beneficio' },
  { value: 'Capacitacion', label: 'Capacitación' },
  { value: 'Capital de riesgo', label: 'Capital de riesgo' },
  { value: 'Creditos', label: 'Créditos' },
  { value: 'Garantias', label: 'Garantías' },
  { value: 'Incentivo mujeres', label: 'Incentivo mujeres' },
  { value: 'Otros incentivos', label: 'Otros incentivos' },
  { value: 'Subsidios', label: 'Subsidios' }
]
};

// Funciones de utilidad
export const getNextStep = (currentStep: number): number => {
  return Math.min(currentStep + 1, 3);
};

export const getPrevStep = (currentStep: number): number => {
  return Math.max(currentStep - 1, 1);
};

// Función para formatear RUT con puntos y guión
export const formatRut = (rut: string): string => {
  let clean = rut.replace(/[^0-9kK]/g, '');
  
  if (clean.length === 0) return '';
  
  const dv = clean.slice(-1).toUpperCase();
  const body = clean.slice(0, -1);
  
  if (body.length === 0) return dv;
  
  let formatted = '';
  let count = 0;
  
  for (let i = body.length - 1; i >= 0; i--) {
    if (count > 0 && count % 3 === 0) {
      formatted = '.' + formatted;
    }
    formatted = body[i] + formatted;
    count++;
  }
  
  return formatted + '-' + dv;
};

// Funciones para validación de formulario
export const isValidRut = (RUT: string): boolean => {
  if (!RUT)
    return false;
  let cleanRut = RUT.replace(/[.\-\s]/g, '');
  
  if (cleanRut.length < 8 || cleanRut.length > 9) return false;
  
  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1).toUpperCase();
  
  if (!/^\d+$/.test(body))
    return false;
  
  if (!/^[0-9K]$/.test(dv))
    return false;
  
  let sum = 0;
  let multiplier = 2;
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const remainder = sum % 11;
  const expectedDv = 11 - remainder;
  let calculatedDv: string;
  
  if (expectedDv === 11) {
    calculatedDv = '0';
  } else if (expectedDv === 10) {
    calculatedDv = 'K';
  } else {
    calculatedDv = expectedDv.toString();
  }

  return dv === calculatedDv;
};

export const isValidEmail = (email: string): boolean => {
  if (!email)
    return false;
  // Usar la misma validación que Django EmailField
  // Basada en la RFC 5322 pero más estricta
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  // Verificaciones adicionales para compatibilidad con Django
  if (email.length > 254)
    return false; // Límite de longitud de Django
  if (email.includes('..'))
    return false; // No permitir puntos consecutivos
  if (email.startsWith('.') || email.endsWith('.'))
    return false; // No puede empezar o terminar con punto
  if (email.includes('@.') || email.includes('.@'))
    return false; // No permitir punto junto al @
  const [localPart, domainPart] = email.split('@');
  if (!localPart || !domainPart)
    return false;
  if (localPart.length > 64)
    return false;
  if (!domainPart.includes('.'))
    return false;
  const domainParts = domainPart.split('.');
  if (domainParts.some(part => part.length === 0))
    return false; // No permitir partes vacías
  if (domainParts[domainParts.length - 1].length < 2)
    return false; // TLD debe tener al menos 2 caracteres

  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
if (!password) return false;
// Al menos 8 caracteres
return password.length >= 8;
};

export const isValidDate = (date: string): boolean => {
if (!date) return false;
const dateObj = new Date(date);
const now = new Date();

// Verificar que sea una fecha válida
if (isNaN(dateObj.getTime())) return false;

// No puede ser fecha futura
if (dateObj > now) return false;

// Para fecha de nacimiento, debe tener al menos 18 años
const minDate = new Date();
minDate.setFullYear(now.getFullYear() - 18);

return dateObj <= minDate;
};

export const isValidCompanyDate = (date: string): boolean => {
if (!date) return false;
const dateObj = new Date(date);
const now = new Date();

// Verificar que sea una fecha válida
if (isNaN(dateObj.getTime())) return false;

// No puede ser fecha futura
return dateObj <= now;
};

export const isValidName = (name: string): boolean => {
if (!name) return false;
// Al menos 2 caracteres, solo letras y espacios
const nameRegex = /^[a-záéíóúñü\s]{2,}$/i;
return nameRegex.test(name.trim());
};

export const isValidCompanyName = (name: string): boolean => {
if (!name) return false;
// Al menos 2 caracteres
return name.trim().length >= 2;
};

// Mensajes de error específicos
export const getFieldErrorMessage = (field: string, value: string): string => {
switch (field) {
  case 'email':
    if (!value)
      return '';
    if (!isValidEmail(value)) {
      if (value.length > 254)
        return 'El correo electrónico es demasiado largo (máximo 254 caracteres)';
      if (value.includes('..'))
        return 'El correo no puede contener puntos consecutivos';
      if (value.startsWith('.') || value.endsWith('.'))
        return 'El correo no puede empezar o terminar con punto';
      if (value.includes('@.') || value.includes('.@'))
        return 'Formato de correo inválido cerca del símbolo @';
      if (!value.includes('@'))
        return 'El correo debe contener el símbolo @';
      if (value.split('@').length !== 2)
        return 'El correo debe contener exactamente un símbolo @';
      const [localPart, domainPart] = value.split('@');
      if (localPart.length > 64)
        return 'La parte antes del @ es demasiado larga (máximo 64 caracteres)';
      if (!domainPart.includes('.'))
        return 'El dominio debe contener al menos un punto';
      return 'Por favor, ingresa un correo electrónico válido (ej: usuario@ejemplo.com)';
    }
    return '';
  case 'password':
    if (!value)
      return '';
    if (!isValidPassword(value))
      return 'La contraseña debe tener al menos 8 caracteres';
    return '';
  case 'Nombre':
  case 'Apellido':
    if (!value)
      return '';
    if (!isValidName(value))
      return 'Debe contener solo letras y tener al menos 2 caracteres';
    return '';
  case 'RUT':
  case 'RUTCompania':
  case 'RUTRepresentanteCompania':
    if (!value)
      return '';
    if (!isValidRut(value)) {
      // Verificar si tiene la longitud mínima (sin contar formato)
      const cleanValue = value.replace(/[.\-\s]/g, '');
      if (cleanValue.length < 8) {
        return 'RUT debe tener al menos 8 caracteres (ej: 12345678-9 o 12.345.678-9)';
      }
      return 'RUT inválido. El dígito verificador no coincide. Verifica tu RUT';
    }
    return '';
  case 'FechaDeNacimiento':
    if (!value)
      return '';
    if (!isValidDate(value))
      return 'Debe ser mayor de 18 años y una fecha válida';
    return '';
  case 'CreacionCompania':
    if (!value)
      return '';
    if (!isValidCompanyDate(value))
      return 'Debe ser una fecha válida y no futura';
    return '';
  case 'NombreCompania':
    if (!value)
      return '';
    if (!isValidCompanyName(value))
      return 'Debe tener al menos 2 caracteres';
    return '';
  default:
    return '';
}
};

// Validación completa de un paso
export const isStepValid = (step: number, formData: FormData): boolean => {
  switch (step) {
    case 1:
      return isValidName(formData.Nombre) &&
              isValidName(formData.Apellido) &&
              isValidRut(formData.RUT) &&
              isValidDate(formData.FechaDeNacimiento) &&
              formData.Sexo !== '';
    
    case 2:
      return isValidCompanyName(formData.NombreCompania) &&
              isValidCompanyDate(formData.CreacionCompania) &&
              formData.RegionCompania !== '' &&
              formData.TipoPersonaCompania !== '' &&
              formData.TipoEmpresaCompania !== '' &&
              formData.PerfilCompania !== '' &&
              isValidRut(formData.RUTCompania) &&
              isValidRut(formData.RUTRepresentanteCompania);
    
    default:
      return true;
  }
};

// Validación del formulario inicial
export const isInitialFormValid = (email: string, password: string, termsAccepted: boolean = false): boolean => {
  // Limpiar el email para validación
  const cleanEmail = email ? email.trim().toLowerCase() : '';

  return isValidEmail(cleanEmail) && 
          isValidPassword(password) && 
          cleanEmail.length > 0 &&
          password.length > 0 &&
          termsAccepted;
};

// Funciones para manejo de dropdowns
export const getSelectedOption = (options: DropdownOption[], value: string): DropdownOption | undefined => {
  return options.find(opt => opt.value === value);
};

// Función para mapear valores del formulario a códigos del backend
export const mapearSexoParaBackend = (sexoFormulario: string): string => {
  const mapeo: { [key: string]: string } = {
    'masculino': 'Hombre',
    'femenino': 'Mujer', 
    'prefiero-no-decir': 'Otro',
    'otro': 'Otro',
    'hombre': 'Hombre',
    'mujer': 'Mujer',
    'male': 'Hombre',
    'female': 'Mujer',
    'other': 'Otro',
    '': 'Otro'
  };

  const sexoLowerCase = sexoFormulario.toLowerCase();
  return mapeo[sexoLowerCase] || 'NA'; // Si no encuentra coincidencia, usar 'NA' por defecto
};

// Validaciones específicas para el registro
export const validarCamposStep1 = (formData: FormData): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (!formData.Nombre?.trim()) {
    errors.push('El nombre es requerido');
  }
  if (!formData.Apellido?.trim()) {
    errors.push('El apellido es requerido');
  }
  if (!formData.FechaDeNacimiento) {
    errors.push('La fecha de nacimiento es requerida');
  }
  if (!formData.RUT?.trim()) {
    errors.push('El RUT es requerido');
  }
  else if (!isValidRut(formData.RUT)) {
    errors.push('El RUT debe tener formato XX.XXX.XXX-X (ej: 12.345.678-9)');
  }
  if (!formData.Sexo?.trim()) {
    errors.push('El sexo es requerido');
  }
  return { valid: errors.length === 0, errors };
};

export const validarCamposStep2 = (formData: FormData): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (!formData.NombreCompania?.trim()) {
    errors.push('El nombre de la empresa es requerido');
  }
  if (!formData.RegionCompania?.trim()) {
    errors.push('La región de creación es requerida');
  }
  if (!formData.RUTCompania?.trim()) {
    errors.push('El RUT de la empresa es requerido');
  }
  else if (formData.RUTCompania.replace(/[.\-\s]/g, '').length < 8) {
    errors.push('El RUT de la empresa debe tener al menos 8 caracteres (ej: 12.345.678-9 o 12345678-9)');
  }
  if (!formData.RUTRepresentanteCompania?.trim()) {
    errors.push('El RUT del representante legal es requerido');
  }
  else if (formData.RUTRepresentanteCompania.replace(/[.\-\s]/g, '').length < 8) {
    errors.push('El RUT del representante debe tener al menos 8 caracteres (ej: 12.345.678-9 o 12345678-9)');
  }
  return { valid: errors.length === 0, errors };
};

// Función para manejar errores del servidor
export const manejarErrorServidor = (error: unknown): string => {
  let errorMessage = 'Un error inesperado ha ocurrido';
  if (error instanceof Error) {
    errorMessage = error.message;
    console.log('Error completo:', error);
    if (errorMessage.includes('Error 400')) {
      errorMessage = 'Los datos enviados no son válidos. Por favor, revisa que todos los campos estén completos y en el formato correcto. Detalles: ' + errorMessage;
    }
    else if (errorMessage.includes('Error 500')) {
      errorMessage = 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.';
    }
  }
  return errorMessage;
};

// Función para obtener datos del formulario de manera consistente
export const ObtenerDatosFormulario = (formElement: HTMLFormElement): { email: string; password: string } => {
  const formData = new FormData(formElement);
  let email = formData.get('email') as string;
  const password = formData.get('password') as string;
  if (email) {
    email = email.trim().toLowerCase(); // Eliminar espacios y convertir a minúsculas
  }
  return {email, password};
};

// Función para validar campos básicos del formulario inicial
export const validarFormularioInicial = (email: string, password: string, termsAccepted: boolean = false): { valid: boolean; error: string } => {
  if (!email || !password) {
    return { valid: false, error: 'Por favor, completa todos los campos' };
  }

  if (!termsAccepted) {
    return { valid: false, error: 'Debes aceptar los términos y condiciones para continuar' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'La contraseña debe tener al menos 8 caracteres' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Por favor, ingresa un correo electrónico válido' };
  }

  return { valid: true, error: '' };
};

// Función para validar un campo específico (versión pura)
export const validateFieldPure = (field: string, value: string): string => {
  return getFieldErrorMessage(field, value);
};

// Función para manejar cambios en inputs (versión pura)
export const handleInputChangePure = (formData: FormData, field: string, value: string): FormData => {
  // Si el campo es un RUT, formatearlo automáticamente
  if (field === 'RUT' || field === 'RUTCompania' || field === 'RUTRepresentanteCompania') {
    const formattedValue = formatRut(value);
    return { ...formData, [field]: formattedValue };
  }
  return { ...formData, [field]: value };
};

// Función para manejar cambios en dropdowns (versión pura)
export const handleDropdownChangePure = (formData: FormData, openDropdowns: { [key: string]: boolean }, field: string, value: string): { formData: FormData; openDropdowns: { [key: string]: boolean } } => {
  return {
    formData: { ...formData, [field]: value },
    openDropdowns: { ...openDropdowns, [field]: false }
  };
};

// Función para toggle dropdowns (versión pura)
export const toggleDropdownPure = (openDropdowns: { [key: string]: boolean }, field: string): { [key: string]: boolean } => {
  return {
    ...openDropdowns,
    [field]: !openDropdowns[field]
  };
};

// Función para verificar email (lógica pura)
export const verificarEmailPuro = async (email: string, VerificarEmailExiste: (email: string) => Promise<boolean>): Promise<{ error: string; isChecking: boolean }> => {
  if (!email || email.trim() === '') {
    return { error: '', isChecking: false };
  }
  try {
    const existe = await VerificarEmailExiste(email);
    if (existe) {
      return {
        error: 'Este correo electrónico ya está registrado',
        isChecking: false 
      };
    }
    else {
      return {
        error: '',
        isChecking: false
      };
    }
  }
  catch (error) {
    console.error('Error al verificar email:', error);
    return { error: '', isChecking: false };
  }
};

// Función para generar contraseña segura 
export const GenerarContrasenaNueva = (length: number = 8): string => {
  const mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const minusculas = 'abcdefghijklmnopqrstuvwxyz';
  const numeros = '0123456789';
  const simbolos = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const todosLosCaracteres = mayusculas + minusculas + numeros + simbolos;
  let contrasena = '';
  // Asegurar al menos un carácter de cada tipo
  contrasena += mayusculas[Math.floor(Math.random() * mayusculas.length)];
  contrasena += minusculas[Math.floor(Math.random() * minusculas.length)];
  contrasena += numeros[Math.floor(Math.random() * numeros.length)];
  contrasena += simbolos[Math.floor(Math.random() * simbolos.length)];
  // Completar el resto de la contraseña
  for (let i = 4; i < length; i++) {
    contrasena += todosLosCaracteres[Math.floor(Math.random() * todosLosCaracteres.length)];
  }
  // Mezclar los caracteres
  return contrasena.split('').sort(() => 0.5 - Math.random()).join('');
};

// Función para crear nombre completo
export const crearNombreCompleto = (Nombre: string, Apellido: string): string => {
  return `${Nombre?.trim() || ''} ${Apellido?.trim() || ''}`.trim() || 'Usuario Temporal';
};

// Función para procesar respuesta del servidor (Persona o Array)
export const procesarRespuestaServidor = <T extends { ID: number }>(response: T | T[] | any): T => {
  if (Array.isArray(response)) {
    if (response.length === 0) {
      throw new Error('Error: El servidor devolvió un array vacío');
    }
    return response[0];
  } 
  else if (response && typeof response === 'object' && 'ID' in response) {
    return response;
  } 
  else {
    throw new Error('Error: Respuesta inválida del servidor');
  }
};

// Función para validar ID del servidor
export const validarIdServidor = (id: number | null | undefined, entidad: string): number => {
  if (!id || id === null) {
    throw new Error(`Error: El servidor no devolvió un ID válido para ${entidad}`);
  }
  return id;
};

// Función para obtener fecha actual en formato ISO
export const obtenerFechaActualISO = (): string => {
  return new Date().toISOString().split('T')[0];
};