// Tipos y interfaces
export interface FormData {
  // Paso 1
  fullName: string;
  age: string;
  rut: string;
  gender: string;
  yearsOfActivity: string;
  specialization: string;
  // Paso 2
  companyName: string;
  legalRepresentative: string;
  companyRut: string;
  mainSector: string;
  operatingRegion: string;
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
  // Paso 2
  companyName: '',
  legalRepresentative: '',
  companyRut: '',
  mainSector: '',
  operatingRegion: '',
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
  mainSector: [
    { value: '', label: 'Seleccionar rubro' },
    { value: 'rubro-1', label: 'Rubro 1' },
    { value: 'rubro-2', label: 'Rubro 2' },
    { value: 'prefiero-no-decir', label: 'Prefiero no decir' }
  ],
  regions: [
    { value: '', label: 'Seleccionar región' },
    { value: 'arica-parinacota', label: 'Arica y Parinacota' },
    { value: 'tarapaca', label: 'Tarapacá' },
    { value: 'antofagasta', label: 'Antofagasta' },
    { value: 'atacama', label: 'Atacama' },
    { value: 'coquimbo', label: 'Coquimbo' },
    { value: 'valparaiso', label: 'Valparaíso' },
    { value: 'metropolitana', label: 'Metropolitana' },
    { value: 'ohiggins', label: 'O\'Higgins' },
    { value: 'maule', label: 'Maule' },
    { value: 'nuble', label: 'Ñuble' },
    { value: 'biobio', label: 'Biobío' },
    { value: 'araucania', label: 'Araucanía' },
    { value: 'los-rios', label: 'Los Ríos' },
    { value: 'los-lagos', label: 'Los Lagos' },
    { value: 'aysen', label: 'Aysén' },
    { value: 'magallanes', label: 'Magallanes' }
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