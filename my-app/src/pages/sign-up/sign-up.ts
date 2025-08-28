// Tipos y interfaces
export interface FormData {
  // Paso 1
  fullName: string;
  age: string;
  rut: string;
  gender: string;
  yearsOfActivity: string;
  specialization: string;
  // Paso 2 - Beneficiario (campos editables por el usuario)
  companyName: string; // Nombre
  companyCreationRegion: string; // RegionDeCreacion
  companyRut: string; // RUTdeEmpresa
  legalRepresentativeRut: string; // RUTdeRepresentante
  // Los campos Direccion, TipoDePersona, TipoDeEmpresa, Perfil se envían con valores predeterminados
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
  fullName: '',
  age: '',
  rut: '',
  gender: '',
  yearsOfActivity: '',
  specialization: '',
  // Paso 2 - Beneficiario (campos editables)
  companyName: '',
  companyCreationRegion: '',
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
  // Opciones removidas temporalmente: personType, companyType, companyProfile
  // Se usan valores predeterminados en el backend
  mainSector: [
    { value: '', label: 'Seleccionar rubro' },
    { value: 'rubro-1', label: 'Rubro 1' },
    { value: 'rubro-2', label: 'Rubro 2' },
    { value: 'prefiero-no-decir', label: 'Prefiero no decir' }
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

// Constantes de navegación de pasos
export const TOTAL_STEPS = 3;
export const MIN_STEP = 1;
export const MAX_STEP = 3;

// Funciones de utilidad
export const isValidStep = (step: number): boolean => {
  return step >= MIN_STEP && step <= MAX_STEP;
};

export const getNextStep = (currentStep: number): number => {
  return Math.min(currentStep + 1, MAX_STEP);
};

export const getPrevStep = (currentStep: number): number => {
  return Math.max(currentStep - 1, MIN_STEP);
};

export const isFirstStep = (step: number): boolean => {
  return step === MIN_STEP;
};

export const isLastStep = (step: number): boolean => {
  return step === MAX_STEP;
};

// Funciones para validación de formulario
export const isValidRut = (rut: string): boolean => {
  // Lógica básica de validación de RUT chileno
  const rutPattern = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
  return rutPattern.test(rut);
};

export const isValidAge = (age: string): boolean => {
  const ageNum = parseInt(age);
  return !isNaN(ageNum) && ageNum >= 18 && ageNum <= 100;
};

export const isValidFormField = (field: string, value: string): boolean => {
  if (!value.trim()) return false;
  
  switch (field) {
    case 'rut':
    case 'companyRut':
      return isValidRut(value);
    case 'age':
      return isValidAge(value);
    default:
      return value.trim().length > 0;
  }
};

// Funciones para manejo de dropdowns
export const getSelectedOption = (options: DropdownOption[], value: string): DropdownOption | undefined => {
  return options.find(opt => opt.value === value);
};

export const handleClickOutside = (
  event: MouseEvent,
  dropdownRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>,
  setOpenDropdowns: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
) => {
  console.log('Click outside detected, checking refs...');
  Object.entries(dropdownRefs.current).forEach(([key, ref]) => {
    if (ref && !ref.contains(event.target as Node)) {
      console.log(`Closing dropdown ${key} due to outside click`);
      setOpenDropdowns(prev => ({ ...prev, [key]: false }));
    }
  });
};

export const handleScroll = (
  event: Event,
  setOpenDropdowns: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
) => {
  // Solo cerrar si el scroll NO es dentro de un dropdown
  const target = event.target as Element;
  const isDropdownScroll = target.closest('.dropdown-list');
  
  if (!isDropdownScroll) {
    // Cerrar todos los dropdowns al hacer scroll fuera de ellos
    setOpenDropdowns({});
  }
};