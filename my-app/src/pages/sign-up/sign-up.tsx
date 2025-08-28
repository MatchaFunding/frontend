import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './sign-up.css';
import type {
  FormData,
  CustomDropdownProps
} from './sign-up';
import {
  initialFormData,
  dropdownOptions,
  handleClickOutside,
  handleScroll,
  getNextStep,
  getPrevStep,
  getSelectedOption
} from './sign-up';
import { CrearPersona } from '../../api/CrearPersona';
import { CrearUsuario } from '../../api/CrearUsuario';
import { CambiarPersona } from '../../api/CambiarPersona';
import { CrearBeneficiario } from '../../api/CrearBeneficiario';
import { CrearMiembro } from '../../api/CrearMiembro';
import Persona from '../../models/Persona';
import Usuario from '../../models/Usuario';
import Beneficiario from '../../models/Beneficiario';
import Miembro from '../../models/Miembro';

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showStepForm, setShowStepForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingPersona, setIsUpdatingPersona] = useState(false);
  const [isUpdatingBeneficiario, setIsUpdatingBeneficiario] = useState(false);
  const [createdPersonaId, setCreatedPersonaId] = useState<number | null>(null);

  // Estados para los valores de los formularios
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Estados para controlar qué dropdowns están abiertos
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

  // Referencias para los dropdowns
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Función para asignar referencias
  const setDropdownRef = (field: string) => (ref: HTMLDivElement | null) => {
    dropdownRefs.current[field] = ref;
  };

  // Cerrar dropdowns cuando se hace click fuera
  useEffect(() => {
    const handleClickOutsideWrapper = (event: MouseEvent) => {
      handleClickOutside(event, dropdownRefs, setOpenDropdowns);
    };

    const handleScrollWrapper = (event: Event) => {
      handleScroll(event, setOpenDropdowns);
    };

    document.addEventListener('mousedown', handleClickOutsideWrapper);
    window.addEventListener('scroll', handleScrollWrapper, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideWrapper);
      window.removeEventListener('scroll', handleScrollWrapper, true);
    };
  }, []);

  // Función para manejar cambios en dropdowns
  const handleDropdownChange = (field: string, value: string) => {
    console.log('Changing dropdown:', field, 'to value:', value);
    setFormData(prev => ({ ...prev, [field]: value }));
    setOpenDropdowns(prev => ({ ...prev, [field]: false }));
  };

  // Función para toggle dropdowns
  const toggleDropdown = (field: string) => {
    console.log('Toggling dropdown:', field, 'Current state:', openDropdowns[field]);
    console.log('All dropdowns state:', openDropdowns);
    setOpenDropdowns(prev => {
      const newState = { 
        ...prev, 
        [field]: !prev[field]
      };
      console.log('New state will be:', newState);
      return newState;
    });
  };

  // Componente CustomDropdown
  const CustomDropdown: React.FC<CustomDropdownProps> = ({ field, label, options, value, placeholder }) => {
    const isOpen = openDropdowns[field] || false;
    const selectedOption = getSelectedOption(options, value);
    
    console.log(`CustomDropdown render - Field: ${field}, isOpen: ${isOpen}, value: ${value}`);
    
    const handleButtonClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Button clicked for field:', field, 'isOpen:', isOpen);
      console.log('Event details:', { type: e.type, target: e.target });
      console.log('Current step:', currentStep);
      toggleDropdown(field);
    };

    const handleOptionClick = (e: React.MouseEvent, optionValue: string) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Option clicked:', optionValue, 'for field:', field);
      handleDropdownChange(field, optionValue);
    };
    
    return (
      <div className="form-group">
        <label htmlFor={field} className="form-label">
          {label}
        </label>
        <div ref={setDropdownRef(field)} className="dropdown-container">
          <button
            type="button"
            onMouseDown={handleButtonClick}
            className="dropdown-button"
          >
            {selectedOption?.label || placeholder || 'Seleccionar'}
          </button>
          {isOpen && (
            <div
              className="dropdown-list"
              onWheel={(e) => e.stopPropagation()}
            >
              {options.map(option => (
                <div
                  key={option.value}
                  onMouseDown={(e) => handleOptionClick(e, option.value)}
                  className={`dropdown-option ${
                    value === option.value ? 'selected' : ''
                  } ${option.value === '' ? 'empty' : ''}`}
                  style={{ userSelect: 'none' }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Obtener datos del formulario
      const formDataElement = new FormData(e.target as HTMLFormElement);
      const email = formDataElement.get('email') as string;
      const password = formDataElement.get('password') as string;

      // Validar que los campos no estén vacíos
      if (!email || !password) {
        alert('Por favor, completa todos los campos');
        setIsLoading(false);
        return;
      }

      // Paso 1: Crear Persona con atributos básicos (nombre genérico temporal)
      console.log('Creando persona...');
      const nuevaPersona: Persona = new Persona({
        ID: 0, // El backend asignará el ID
        Nombre: 'Usuario Temporal', // Nombre genérico que se actualizará en el paso 1
        Sexo: 'NA', // Valor por defecto válido que se puede cambiar después
        RUT: '00000000-0', // RUT temporal válido que se llenará en el formulario paso a paso
        FechaDeNacimiento: '2000-01-01'
      });

      console.log('Datos de persona a enviar:', {
        ID: nuevaPersona.ID,
        Nombre: nuevaPersona.Nombre,
        Sexo: nuevaPersona.Sexo,
        RUT: nuevaPersona.RUT
      });

      const personaResponse = await CrearPersona(nuevaPersona);
      
      console.log('Respuesta completa de persona:', personaResponse);
      
      // El backend puede devolver un objeto directo o un array
      let personaCreada: Persona;

      if (Array.isArray(personaResponse)) {
        personaCreada = personaResponse[0];
      } 
      else if (personaResponse && typeof personaResponse === 'object' && 'ID' in personaResponse) {
        personaCreada = personaResponse;
      } 
      else {
        throw new Error('Error: Respuesta inválida del servidor al crear la persona');
      }
      
      let personaId: number = personaCreada.ID;
      
      if (!personaId || personaId === null) {
        throw new Error('Error: El servidor no devolvió un ID válido para la persona');
      }
      
      console.log('Persona creada con ID:', personaId);
      setCreatedPersonaId(personaId); // Guardar el ID para usarlo en el paso 1

      // Paso 2: Crear Usuario vinculado a la Persona
      console.log('Creando usuario...');
      const nuevoUsuario = new Usuario({
        ID: 0, // El backend asignará el ID
        Persona: personaId,
        NombreDeUsuario: email, // Usar email como nombre de usuario
        Contrasena: password,
        Correo: email
      });

      const usuarioResponse = await CrearUsuario(nuevoUsuario);
      
      if (!usuarioResponse) {
        throw new Error('Error al crear el usuario');
      }

      console.log('Usuario creado exitosamente');
      
      // Solo después de crear ambas entidades, continuar al formulario paso a paso
      setShowStepForm(true);
      
    } catch (error) {
      console.error('Error en el proceso de registro:', error);
      const errorMessage = error instanceof Error ? error.message : 'Un error inesperado ha ocurrido';
      alert(`Error al crear la cuenta: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para mapear valores del formulario a códigos del backend
  const mapearSexoParaBackend = (sexoFormulario: string): string => {
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

  const handleNextStep = async () => {
    // Si estamos en el paso 1, actualizar la persona antes de avanzar
    if (currentStep === 1 && createdPersonaId) {
      setIsUpdatingPersona(true);
      
      try {
        // Crear objeto Persona con los datos actualizados del formulario
        const personaActualizada = new Persona({
          ID: createdPersonaId,
          Nombre: formData.fullName || '',
          Sexo: mapearSexoParaBackend(formData.gender || ''),
          RUT: formData.rut || '00000000-0'
        });

        console.log('Actualizando persona con ID:', createdPersonaId);
        console.log('Datos a actualizar:', personaActualizada);
        console.log('Sexo mapeado:', formData.gender, '->', mapearSexoParaBackend(formData.gender || ''));

        const response = await CambiarPersona(createdPersonaId, personaActualizada);
        
        console.log('Respuesta de actualización:', response);
        
        // Verificar que la respuesta sea válida
        if (!response) {
          throw new Error('Error al actualizar la persona');
        }

        console.log('Persona actualizada exitosamente');
        
        // Solo después de actualizar exitosamente, avanzar al siguiente paso
        setCurrentStep(getNextStep(currentStep));
        
      } catch (error) {
        console.error('Error al actualizar persona:', error);
        alert('Error al actualizar los datos. Por favor, inténtalo de nuevo.');
      } finally {
        setIsUpdatingPersona(false);
      }
    } else if (currentStep === 2 && createdPersonaId) {
      // Si estamos en el paso 2, crear beneficiario y miembro
      setIsUpdatingBeneficiario(true);
      
      try {
        // Validación básica de campos requeridos
        if (!formData.companyName?.trim()) {
          throw new Error('El nombre de la empresa es requerido');
        }
        if (!formData.companyCreationRegion?.trim()) {
          throw new Error('La región de creación es requerida');
        }
        if (!formData.companyRut?.trim()) {
          throw new Error('El RUT de la empresa es requerido');
        }
        if (!formData.legalRepresentativeRut?.trim()) {
          throw new Error('El RUT del representante legal es requerido');
        }

        // Validación básica de formato de RUT (debe tener al menos 8 caracteres)
        if (formData.companyRut.length < 8) {
          throw new Error('El RUT de la empresa debe tener un formato válido (ej: 12345678-9)');
        }
        if (formData.legalRepresentativeRut.length < 8) {
          throw new Error('El RUT del representante debe tener un formato válido (ej: 12345678-9)');
        }

        console.log('Valores del formulario antes de crear beneficiario:');
        console.log('Company Name:', formData.companyName);
        console.log('Region:', formData.companyCreationRegion);
        console.log('Company RUT:', formData.companyRut);
        console.log('Rep RUT:', formData.legalRepresentativeRut);

        // Crear Beneficiario con los datos del formulario y valores predeterminados
        const nuevoBeneficiario = new Beneficiario({
          ID: 0, // El backend asignará el ID
          Nombre: formData.companyName?.trim() || 'Empresa Temporal',
          FechaDeCreacion: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
          RegionDeCreacion: formData.companyCreationRegion?.trim() || 'RM', // Metropolitana
          Direccion: 'Av. Ejemplo 123, Comuna, Ciudad', // Dirección más realista
          TipoDePersona: 'JU', // Juridica (código del modelo Django)
          TipoDeEmpresa: 'SPA', // Sociedad por Acciones (código del modelo Django)
          Perfil: 'EMP', // Empresa (código del modelo Django)
          RUTdeEmpresa: formData.companyRut?.trim() || '12345678-9',
          RUTdeRepresentante: formData.legalRepresentativeRut?.trim() || '87654321-0'
        });

        console.log('Creando beneficiario...');
        console.log('Datos del beneficiario a enviar:', {
          ID: nuevoBeneficiario.ID,
          Nombre: nuevoBeneficiario.Nombre,
          FechaDeCreacion: nuevoBeneficiario.FechaDeCreacion,
          RegionDeCreacion: nuevoBeneficiario.RegionDeCreacion,
          Direccion: nuevoBeneficiario.Direccion,
          TipoDePersona: nuevoBeneficiario.TipoDePersona,
          TipoDeEmpresa: nuevoBeneficiario.TipoDeEmpresa,
          Perfil: nuevoBeneficiario.Perfil,
          RUTdeEmpresa: nuevoBeneficiario.RUTdeEmpresa,
          RUTdeRepresentante: nuevoBeneficiario.RUTdeRepresentante
        });

        const beneficiarioResponse = await CrearBeneficiario(nuevoBeneficiario);
        
        console.log('Respuesta completa del beneficiario:', beneficiarioResponse);
        
        // El backend puede devolver un objeto directo o un array
        let beneficiarioCreado;
        if (Array.isArray(beneficiarioResponse) && beneficiarioResponse.length > 0) {
          beneficiarioCreado = beneficiarioResponse[0];
        } else if (beneficiarioResponse && typeof beneficiarioResponse === 'object' && 'ID' in beneficiarioResponse) {
          beneficiarioCreado = beneficiarioResponse;
        } else {
          console.error('Respuesta del servidor para beneficiario:', beneficiarioResponse);
          throw new Error('Error: Respuesta inválida del servidor al crear el beneficiario. Revisa los datos enviados.');
        }
        
        const beneficiarioId = beneficiarioCreado.ID as number;
        
        if (!beneficiarioId) {
          throw new Error('Error: El servidor no devolvió un ID válido para el beneficiario');
        }
        
        console.log('Beneficiario creado con ID:', beneficiarioId);

        // Crear Miembro vinculando la Persona con el Beneficiario
        const nuevoMiembro = new Miembro({
          ID: 0, // El backend asignará el ID
          Persona: createdPersonaId,
          Beneficiario: beneficiarioId
        });

        console.log('Creando miembro...');
        console.log('Datos del miembro:', nuevoMiembro);

        const miembroResponse = await CrearMiembro(nuevoMiembro);
        
        if (!miembroResponse) {
          throw new Error('Error al crear el miembro');
        }

        console.log('Miembro creado exitosamente');
        
        // Solo después de crear exitosamente, avanzar al siguiente paso
        setCurrentStep(getNextStep(currentStep));
        
      } catch (error) {
        console.error('Error al crear beneficiario o miembro:', error);
        
        // Extraer el mensaje de error más específico
        let errorMessage = 'Un error inesperado ha ocurrido';
        if (error instanceof Error) {
          errorMessage = error.message;
          // Si el error viene del servidor, mostrar más detalles
          if (errorMessage.includes('Error 400')) {
            errorMessage = 'Los datos enviados no son válidos. Por favor, revisa que todos los campos estén completos y en el formato correcto.';
          } else if (errorMessage.includes('Error 500')) {
            errorMessage = 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.';
          }
        }
        
        alert(`Error al crear la organización: ${errorMessage}`);
      } finally {
        setIsUpdatingBeneficiario(false);
      }
    } else {
      // Para otros pasos, simplemente avanzar
      setCurrentStep(getNextStep(currentStep));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(getPrevStep(currentStep));
  };

  const clearStep2Data = () => {
    console.log('Limpiando datos del paso 2...');
    setFormData(prev => ({
      ...prev,
      companyName: '',
      companyCreationRegion: '',
      companyRut: '',
      legalRepresentativeRut: ''
    }));
    // También cerrar todos los dropdowns
    setOpenDropdowns({});
    console.log('Datos del paso 2 limpiados');
  };
  return (
    <div className="signup-container">
      {isLoading ? (
        // Vista de carga
        <div className="loading-container">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <h2 className="loading-title">Creando tu cuenta</h2>
            <p className="loading-subtitle">
              Estamos configurando tu perfil, esto tomará unos momentos...
            </p>
          </div>
        </div>
      ) : !showStepForm ? (
        // Formulario inicial
        <div className="initial-form-container">
          {/* Left Panel: Form */}
          <div className="form-panel">
            <h1 className="main-title">Comencemos</h1>
            <p className="subtitle">
              Resgistrate hoy para poder ocupar los beneficios que ofrecemos
            </p>

            <form className="signup-form" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Dirección de correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue=""
                  required
                  className="form-input"
                  placeholder="mi.dirección@ejemplo.cl"
                />
              </div>

              <div className="form-group">
                <div className="password-group">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                </div>
                <div className="password-input-container">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="contraseña"
                    defaultValue=""
                    required
                    className="form-input"
                    placeholder="Min 8 carácteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-btn"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      // Eye-off SVG (hide password when visible)
                      <img src="/svgs/eye-off.svg" alt="Hide password" width="22" height="22" />
                    ) : (
                      // Eye-on SVG (show password when hidden)
                      <img src="/svgs/eye-on.svg" alt="Show password" width="22" height="22" />
                    )}
                  </button>
                </div>
              </div>

              <div className="checkbox-group">
                <input
                  id="agree"
                  name="agree"
                  type="checkbox"
                  className="checkbox-input"
                />
                <label htmlFor="agree" className="checkbox-label">
                  Estoy de acuerdo con los{' '}
                  <a href="#" className="terms-link">
                    Términos
                  </a>{' '}
                  y{' '}
                  <a href="#" className="terms-link">
                    Condiciones
                  </a>
                </label>
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isLoading}
                >
                  <span>{isLoading ? 'Creando cuenta...' : 'Registrarse'}</span>
                  <img src="/svgs/guy-in.svg" alt="" width="15" height="15" className="submit-btn-icon" />
                </button>
              </div>
            </form>

            <p className="bottom-text">
              ¿Tienes una cuenta?{' '}
              <a className="signin-link">
                  <Link to="/Login">Inicia sesión</Link>
              </a>
            </p>
          </div>
        </div>
      ) : (
        // Formulario de 3 pasos
        <div className="step-form-container">
          {/* Indicadores de progreso - fuera del recuadro */}
          <div className="progress-container">
            <div className="progress-steps">
              {/* Paso 1 */}
              <div className={`step-circle ${
                currentStep >= 1 ? 'active' : 'inactive'
              }`}>
                1
              </div>
              
              {/* Línea entre paso 1 y 2 */}
              <div className={`step-connector ${currentStep >= 2 ? 'active' : 'inactive'}`}></div>
              
              {/* Paso 2 */}
              <div className={`step-circle ${
                currentStep >= 2 ? 'active' : 'inactive'
              }`}>
                2
              </div>
              
              {/* Línea entre paso 2 y 3 */}
              <div className={`step-connector ${currentStep >= 3 ? 'active' : 'inactive'}`}></div>
              
              {/* Paso 3 */}
              <div className={`step-circle ${
                currentStep >= 3 ? 'active' : 'inactive'
              }`}>
                3
              </div>
            </div>
          </div>

          {/* Contenedor del formulario - mismo estilo que el login */}
          <div className="step-form-main">
            <div className="form-panel">
              {currentStep === 1 && (
                <div>
                  <h1 className="step-title">Cuéntanos un poco sobre ti</h1>
                  <p className="subtitle">
                    Completa la información para personalizar tu experiencia
                  </p>
                  
                  <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                      <label htmlFor="fullName" className="form-label">
                        Nombre completo
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="age" className="form-label">
                        Edad
                      </label>
                      <input
                        id="age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="rut" className="form-label">
                        RUT
                      </label>
                      <input
                        id="rut"
                        name="rut"
                        type="text"
                        value={formData.rut}
                        onChange={(e) => setFormData(prev => ({ ...prev, rut: e.target.value }))}
                        placeholder="12.345.678-9"
                        className="form-input"
                      />
                    </div>
                    
                    <CustomDropdown
                      field="gender"
                      label="Sexo"
                      options={dropdownOptions.gender}
                      value={formData.gender}
                    />
                    
                    <div className="form-group">
                      <label htmlFor="yearsOfActivity" className="form-label">
                        Años de actividad
                      </label>
                      <input
                        id="yearsOfActivity"
                        name="yearsOfActivity"
                        type="number"
                        value={formData.yearsOfActivity}
                        onChange={(e) => setFormData(prev => ({ ...prev, yearsOfActivity: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="specialization" className="block text-xs font-medium text-gray-500 mb-1">
                        Rubro o área de especialización
                      </label>
                      <input
                        id="specialization"
                        name="specialization"
                        type="text"
                        value={formData.specialization}
                        onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                  </form>
                </div>
              )}
              
              {currentStep === 2 && (
                <div>
                  <h1 className="step-title">Háblanos de tu organización</h1>
                  <p className="subtitle">
                    Información básica sobre tu empresa u organización
                  </p>
                  
                  <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                      <label htmlFor="companyName" className="form-label">
                        Nombre de la empresa/organización
                      </label>
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                        className="form-input"
                        placeholder="Ingresa el nombre de tu organización"
                      />
                    </div>
                    
                    <CustomDropdown
                      field="companyCreationRegion"
                      label="Región de creación"
                      options={dropdownOptions.regions}
                      value={formData.companyCreationRegion}
                    />
                    
                    <div className="form-group">
                      <label htmlFor="companyRut" className="form-label">
                        RUT de la empresa
                      </label>
                      <input
                        id="companyRut"
                        name="companyRut"
                        type="text"
                        value={formData.companyRut}
                        onChange={(e) => setFormData(prev => ({ ...prev, companyRut: e.target.value }))}
                        placeholder="Ej: 76.123.456-7"
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="legalRepresentativeRut" className="form-label">
                        RUT del representante legal
                      </label>
                      <input
                        id="legalRepresentativeRut"
                        name="legalRepresentativeRut"
                        type="text"
                        value={formData.legalRepresentativeRut}
                        onChange={(e) => setFormData(prev => ({ ...prev, legalRepresentativeRut: e.target.value }))}
                        placeholder="Ej: 12.345.678-9"
                        className="form-input"
                      />
                    </div>
                    
                    {/* Botón temporal para debug - limpiar datos */}
                    <div className="form-group">
                      <button
                        type="button"
                        onClick={clearStep2Data}
                        className="nav-btn secondary"
                        style={{ fontSize: '12px', padding: '8px' }}
                      >
                        Limpiar formulario (debug)
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {currentStep === 3 && (
                <div>
                  <h1 className="step-title">¿Qué tipo de apoyos buscas?</h1>
                  <p className="subtitle">
                    Ayúdanos a perfilar las mejores oportunidades
                  </p>
                  
                  <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                      <label htmlFor="approximateAmount" className="form-label">
                        Monto aproximado que buscas
                      </label>
                      <input
                        id="approximateAmount"
                        name="approximateAmount"
                        type="number"
                        value={formData.approximateAmount}
                        onChange={(e) => setFormData(prev => ({ ...prev, approximateAmount: e.target.value }))}
                        placeholder="Monto en pesos chilenos"
                        className="form-input"
                      />
                    </div>
                    
                    <CustomDropdown
                      field="benefitsOfInterest"
                      label="Beneficios o apoyos de interés"
                      options={dropdownOptions.benefits}
                      value={formData.benefitsOfInterest}
                    />
                    
                    <CustomDropdown
                      field="projectRegions"
                      label="Regiones donde quieres desarrollar el proyecto"
                      options={dropdownOptions.regions}
                      value={formData.projectRegions}
                    />
                    
                    <div className="form-group">
                      <label htmlFor="projectDuration" className="form-label">
                        Duración estimada del proyecto
                      </label>
                      <input
                        id="projectDuration"
                        name="projectDuration"
                        type="number"
                        value={formData.projectDuration}
                        onChange={(e) => setFormData(prev => ({ ...prev, projectDuration: e.target.value }))}
                        placeholder="Duración en meses"
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="collaborators" className="form-label">
                        Número de personas con las que planea colaborar
                      </label>
                      <input
                        id="collaborators"
                        name="collaborators"
                        type="number"
                        value={formData.collaborators}
                        onChange={(e) => setFormData(prev => ({ ...prev, collaborators: e.target.value }))}
                        placeholder="Número de colaboradores"
                        className="form-input"
                      />
                    </div>
                  </form>
                </div>
              )}
              
              {/* Botones de navegación */}
              <div className="navigation-container">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className={`nav-btn ${currentStep === 1 ? 'secondary' : 'secondary'}`}
                >
                  Anterior
                </button>
                
                <div className="nav-spacer"></div>
                
                <button
                  onClick={handleNextStep}
                  disabled={isUpdatingPersona || isUpdatingBeneficiario}
                  className="nav-btn primary"
                >
                  {isUpdatingPersona ? 'Guardando perfil...' : 
                   isUpdatingBeneficiario ? 'Creando organización...' : 
                   'Siguiente'}
                  {!isUpdatingPersona && !isUpdatingBeneficiario && (
                    <img src="/svgs/right-arrow.svg" alt="" width="7" height="7" style={{ marginLeft: '1rem', filter: 'brightness(0) invert(1)' }} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;