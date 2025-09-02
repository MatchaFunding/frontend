export interface FormData {
  // Paso 1
  firstName: string;
  lastName: string;
  birthDate: string;
  rut: string;
  gender: string;
  // Paso 2 - Beneficiario (campos editables por el usuario)
  companyName: string; // Nombre
  companyCreationDate: string; // FechaDeCreacion
  companyCreationRegion: string; // RegionDeCreacion
  companyAddress: string; // Direccion
  companyPersonType: string; // TipoDePersona
  companyType: string; // TipoDeEmpresa
  companyProfile: string; // Perfil
  companyRut: string; // RUTdeEmpresa
  legalRepresentativeRut: string; // RUTdeRepresentante
  // Paso 3
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
  // Paso 1
  firstName: '',
  lastName: '',
  birthDate: '',
  rut: '',
  gender: '',
  // Paso 2 - Beneficiario (campos editables)
  companyName: '',
  companyCreationDate: '',
  companyCreationRegion: '',
  companyAddress: '',
  companyPersonType: '',
  companyType: '',
  companyProfile: '',
  companyRut: '',
  legalRepresentativeRut: '',
  // Paso 3
  approximateAmount: '',
  benefitsOfInterest: '',
  projectRegions: '',
  projectDuration: '',
  collaborators: ''
};

// Opciones para los dropdowns
export const dropdownOptions = {
  gender: [
    { value: '', label: 'Seleccionar' },
    { value: 'masculino', label: 'Masculino' },
    { value: 'femenino', label: 'Femenino' },
    { value: 'prefiero-no-decir', label: 'Prefiero no decir' }
  ],
  companyPersonType: [
    { value: '', label: 'Seleccionar tipo de persona' },
    { value: 'JU', label: 'Jurídica' },
    { value: 'NA', label: 'Natural' }
  ],
  companyType: [
    { value: '', label: 'Seleccionar tipo de empresa' },
    { value: 'SA', label: 'Sociedad Anónima' },
    { value: 'SRL', label: 'Sociedad de Responsabilidad Limitada' },
    { value: 'SPA', label: 'Sociedad por Acciones' },
    { value: 'EIRL', label: 'Empresa Individual de Responsabilidad Limitada' }
  ],
  companyProfile: [
    { value: '', label: 'Seleccionar perfil' },
    { value: 'EMP', label: 'Empresa' },
    { value: 'EXT', label: 'Extranjero' },
    { value: 'INS', label: 'Institución' },
    { value: 'MED', label: 'Intermediario' },
    { value: 'ORG', label: 'Organización' },
    { value: 'PER', label: 'Persona' }
  ],
  regions: [
    { value: '', label: 'Seleccionar región' },
    { value: 'AP', label: 'Arica y Parinacota' },
    { value: 'TA', label: 'Tarapacá' },
    { value: 'AN', label: 'Antofagasta' },
    { value: 'AT', label: 'Atacama' },
    { value: 'CO', label: 'Coquimbo' },
    { value: 'VA', label: 'Valparaíso' },
    { value: 'RM', label: 'Metropolitana' },
    { value: 'LI', label: 'O\'Higgins' },
    { value: 'ML', label: 'Maule' },
    { value: 'NB', label: 'Ñuble' },
    { value: 'BI', label: 'Biobío' },
    { value: 'AR', label: 'La Araucanía' },
    { value: 'LR', label: 'Los Ríos' },
    { value: 'LL', label: 'Los Lagos' },
    { value: 'AI', label: 'Aysén' },
    { value: 'MA', label: 'Magallanes' }
  ],
  benefits: [
    { value: '', label: 'Seleccionar beneficio' },
    { value: 'beneficio-1', label: 'Beneficio 1' },
    { value: 'beneficio-2', label: 'Beneficio 2' },
    { value: 'prefiero-no-decir', label: 'Prefiero no decir' }
  ]
};

// Funciones de utilidad
export const getNextStep = (currentStep: number): number => {
  return Math.min(currentStep + 1, 3);
};

export const getPrevStep = (currentStep: number): number => {
  return Math.max(currentStep - 1, 1);
};

// Funciones para validación de formulario
export const isValidRut = (rut: string): boolean => {
  if (!rut) return false;
  
  // Limpiar el RUT: eliminar puntos, espacios y guiones
  let cleanRut = rut.replace(/[.\s-]/g, '');
  
  // Debe tener entre 8 y 9 caracteres
  if (cleanRut.length < 8 || cleanRut.length > 9) return false;
  
  // Separar cuerpo y dígito verificador
  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1).toUpperCase();
  
  // El cuerpo debe ser solo números
  if (!/^\d+$/.test(body)) return false;
  
  // El dígito verificador debe ser número o K
  if (!/^[0-9K]$/.test(dv)) return false;
  
  // Calcular dígito verificador usando el algoritmo estándar chileno
  let sum = 0;
  let multiplier = 2;
  
  // Recorrer de derecha a izquierda
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const remainder = sum % 11;
  let calculatedDv: string;
  
  if (remainder < 2) {
    calculatedDv = remainder.toString();
  } else {
    calculatedDv = (11 - remainder).toString();
    if (calculatedDv === '10') {
      calculatedDv = 'K';
    }
  }
  
  return dv === calculatedDv;
};

export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  
  // Usar la misma validación que Django EmailField
  // Basada en la RFC 5322 pero más estricta
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // Verificaciones adicionales para compatibilidad con Django
  if (email.length > 254) return false; // Límite de longitud de Django
  if (email.includes('..')) return false; // No permitir puntos consecutivos
  if (email.startsWith('.') || email.endsWith('.')) return false; // No puede empezar o terminar con punto
  if (email.includes('@.') || email.includes('.@')) return false; // No permitir punto junto al @
  
  // Verificar que la parte local (antes del @) no sea muy larga
  const [localPart, domainPart] = email.split('@');
  if (!localPart || !domainPart) return false;
  if (localPart.length > 64) return false; // Límite RFC para parte local
  
  // Verificar que el dominio tenga al menos un punto y una extensión válida
  if (!domainPart.includes('.')) return false;
  const domainParts = domainPart.split('.');
  if (domainParts.some(part => part.length === 0)) return false; // No permitir partes vacías
  if (domainParts[domainParts.length - 1].length < 2) return false; // TLD debe tener al menos 2 caracteres
  
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
      if (!value) return '';
      if (!isValidEmail(value)) {
        // Dar mensajes más específicos según el tipo de error
        if (value.length > 254) return 'El correo electrónico es demasiado largo (máximo 254 caracteres)';
        if (value.includes('..')) return 'El correo no puede contener puntos consecutivos';
        if (value.startsWith('.') || value.endsWith('.')) return 'El correo no puede empezar o terminar con punto';
        if (value.includes('@.') || value.includes('.@')) return 'Formato de correo inválido cerca del símbolo @';
        if (!value.includes('@')) return 'El correo debe contener el símbolo @';
        if (value.split('@').length !== 2) return 'El correo debe contener exactamente un símbolo @';
        
        const [localPart, domainPart] = value.split('@');
        if (localPart.length > 64) return 'La parte antes del @ es demasiado larga (máximo 64 caracteres)';
        if (!domainPart.includes('.')) return 'El dominio debe contener al menos un punto';
        
        return 'Por favor, ingresa un correo electrónico válido (ej: usuario@ejemplo.com)';
      }
      return '';
    
    case 'password':
      if (!value) return '';
      if (!isValidPassword(value)) return 'La contraseña debe tener al menos 8 caracteres';
      return '';
    
    case 'firstName':
    case 'lastName':
      if (!value) return '';
      if (!isValidName(value)) return 'Debe contener solo letras y tener al menos 2 caracteres';
      return '';
    
    case 'rut':
    case 'companyRut':
    case 'legalRepresentativeRut':
      if (!value) return '';
      if (!isValidRut(value)) {
        // Dar un mensaje más específico sobre el formato
        const cleanRut = value.replace(/[.\s-]/g, '');
        if (cleanRut.length < 8) return 'RUT muy corto. Debe tener al menos 8 dígitos';
        if (cleanRut.length > 9) return 'RUT muy largo. Máximo 9 caracteres';
        if (!/^\d+[0-9kK]$/i.test(cleanRut)) return 'RUT debe contener solo números y dígito verificador (0-9 o K)';
        return 'RUT inválido. El dígito verificador no coincide. Verifica tu RUT';
      }
      return '';
    
    case 'birthDate':
      if (!value) return '';
      if (!isValidDate(value)) return 'Debe ser mayor de 18 años y una fecha válida';
      return '';
    
    case 'companyCreationDate':
      if (!value) return '';
      if (!isValidCompanyDate(value)) return 'Debe ser una fecha válida y no futura';
      return '';
    
    case 'companyName':
      if (!value) return '';
      if (!isValidCompanyName(value)) return 'Debe tener al menos 2 caracteres';
      return '';
    
    default:
      return '';
  }
};

// Validación completa de un paso
export const isStepValid = (step: number, formData: FormData): boolean => {
  switch (step) {
    case 1:
      return isValidName(formData.firstName) &&
             isValidName(formData.lastName) &&
             isValidRut(formData.rut) &&
             isValidDate(formData.birthDate) &&
             formData.gender !== '';
    
    case 2:
      return isValidCompanyName(formData.companyName) &&
             isValidCompanyDate(formData.companyCreationDate) &&
             formData.companyCreationRegion !== '' &&
             formData.companyPersonType !== '' &&
             formData.companyType !== '' &&
             formData.companyProfile !== '' &&
             isValidRut(formData.companyRut) &&
             isValidRut(formData.legalRepresentativeRut);
    
    default:
      return true;
  }
};

// Validación del formulario inicial
export const isInitialFormValid = (email: string, password: string): boolean => {
  // Limpiar el email para validación
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  
  return isValidEmail(cleanEmail) && 
         isValidPassword(password) && 
         cleanEmail.length > 0 &&
         password.length > 0;
};

// Funciones para manejo de dropdowns
export const getSelectedOption = (options: DropdownOption[], value: string): DropdownOption | undefined => {
  return options.find(opt => opt.value === value);
};

// Función para mapear valores del formulario a códigos del backend
export const mapearSexoParaBackend = (sexoFormulario: string): string => {
  const mapeo: { [key: string]: string } = {
    'masculino': 'VAR',
    'femenino': 'MUJ', 
    'prefiero-no-decir': 'NA',
    'otro': 'NA',
    'hombre': 'VAR',
    'mujer': 'MUJ',
    'male': 'VAR',
    'female': 'MUJ',
    'other': 'NA',
    '': 'NA' // Valor por defecto si está vacío
  };
  
  const sexoLowerCase = sexoFormulario.toLowerCase();
  return mapeo[sexoLowerCase] || 'NA'; // Si no encuentra coincidencia, usar 'NA' por defecto
};

// Validaciones específicas para el registro
export const validarCamposStep1 = (formData: FormData): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!formData.firstName?.trim()) {
    errors.push('El nombre es requerido');
  }
  
  if (!formData.lastName?.trim()) {
    errors.push('El apellido es requerido');
  }
  
  if (!formData.birthDate) {
    errors.push('La fecha de nacimiento es requerida');
  }
  
  if (!formData.rut?.trim()) {
    errors.push('El RUT es requerido');
  } else if (!isValidRut(formData.rut)) {
    errors.push('El RUT debe tener un formato válido (ej: 12345678-9)');
  }
  
  if (!formData.gender?.trim()) {
    errors.push('El sexo es requerido');
  }
  
  return { valid: errors.length === 0, errors };
};

export const validarCamposStep2 = (formData: FormData): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!formData.companyName?.trim()) {
    errors.push('El nombre de la empresa es requerido');
  }
  
  if (!formData.companyCreationRegion?.trim()) {
    errors.push('La región de creación es requerida');
  }
  
  if (!formData.companyRut?.trim()) {
    errors.push('El RUT de la empresa es requerido');
  } else if (formData.companyRut.length < 8) {
    errors.push('El RUT de la empresa debe tener un formato válido (ej: 12345678-9)');
  }
  
  if (!formData.legalRepresentativeRut?.trim()) {
    errors.push('El RUT del representante legal es requerido');
  } else if (formData.legalRepresentativeRut.length < 8) {
    errors.push('El RUT del representante debe tener un formato válido (ej: 12345678-9)');
  }
  
  return { valid: errors.length === 0, errors };
};

// Función para manejar errores del servidor
export const manejarErrorServidor = (error: unknown): string => {
  let errorMessage = 'Un error inesperado ha ocurrido';
  
  if (error instanceof Error) {
    errorMessage = error.message;
    
    console.log('Error completo:', error);
    
    // Si el error viene del servidor, mostrar más detalles
    if (errorMessage.includes('Error 400')) {
      errorMessage = 'Los datos enviados no son válidos. Por favor, revisa que todos los campos estén completos y en el formato correcto. Detalles: ' + errorMessage;
    } else if (errorMessage.includes('Error 500')) {
      errorMessage = 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.';
    }
  }
  
  return errorMessage;
};

// Función para obtener datos del formulario de manera consistente
export const obtenerDatosFormulario = (formElement: HTMLFormElement): { email: string; password: string } => {
  const formData = new FormData(formElement);
  let email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  // Limpiar y normalizar el email
  if (email) {
    email = email.trim().toLowerCase(); // Eliminar espacios y convertir a minúsculas
  }
  
  return { email, password };
};

// Función para validar campos básicos del formulario inicial
export const validarFormularioInicial = (email: string, password: string): { valid: boolean; error: string } => {
  if (!email || !password) {
    return { valid: false, error: 'Por favor, completa todos los campos' };
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
export const handleInputChangePure = (
  formData: FormData,
  field: string,
  value: string
): FormData => {
  return { ...formData, [field]: value };
};

// Función para manejar cambios en dropdowns (versión pura)
export const handleDropdownChangePure = (
  formData: FormData,
  openDropdowns: { [key: string]: boolean },
  field: string,
  value: string
): { formData: FormData; openDropdowns: { [key: string]: boolean } } => {
  return {
    formData: { ...formData, [field]: value },
    openDropdowns: { ...openDropdowns, [field]: false }
  };
};

// Función para toggle dropdowns (versión pura)
export const toggleDropdownPure = (
  openDropdowns: { [key: string]: boolean },
  field: string
): { [key: string]: boolean } => {
  return {
    ...openDropdowns,
    [field]: !openDropdowns[field]
  };
};

// Función para verificar email (lógica pura)
export const verificarEmailPuro = async (
  email: string,
  VerificarEmailExiste: (email: string) => Promise<boolean>
): Promise<{ error: string; isChecking: boolean }> => {
  if (!email || email.trim() === '') {
    return { error: '', isChecking: false };
  }
  
  try {
    const existe = await VerificarEmailExiste(email);
    if (existe) {
      return { error: 'Este correo electrónico ya está registrado', isChecking: false };
    } else {
      return { error: '', isChecking: false };
    }
  } catch (error) {
    console.error('Error al verificar email:', error);
    return { error: '', isChecking: false };
  }
};

// Función para generar contraseña segura 
export const generarContrasenaNueva = (length: number = 8): string => {
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
export const crearNombreCompleto = (firstName: string, lastName: string): string => {
  return `${firstName?.trim() || ''} ${lastName?.trim() || ''}`.trim() || 'Usuario Temporal';
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