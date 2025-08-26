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

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showStepForm, setShowStepForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowStepForm(true);
  };

  const handleNextStep = () => {
    setCurrentStep(getNextStep(currentStep));
  };

  const handlePrevStep = () => {
    setCurrentStep(getPrevStep(currentStep));
  };
  return (
    <div className="signup-container">
      {!showStepForm ? (
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
                <label htmlFor="name" className="form-label">
                  Nombre
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue=""
                  className="form-input"
                  placeholder="Introducir nombre"
                />
              </div>

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
                >
                  <span>Registrarse</span>
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
                    Cuanta más información tengamos, mejor podremos encontrar fondos para ti
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
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="legalRepresentative" className="form-label">
                        Nombre del representante legal
                      </label>
                      <input
                        id="legalRepresentative"
                        name="legalRepresentative"
                        type="text"
                        value={formData.legalRepresentative}
                        onChange={(e) => setFormData(prev => ({ ...prev, legalRepresentative: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                    
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
                        placeholder="12.345.678-9"
                        className="form-input"
                      />
                    </div>
                    
                    <CustomDropdown
                      field="mainSector"
                      label="Rubro principal"
                      options={dropdownOptions.mainSector}
                      value={formData.mainSector}
                    />
                    
                    <CustomDropdown
                      field="operatingRegion"
                      label="Región donde opera"
                      options={dropdownOptions.regions}
                      value={formData.operatingRegion}
                    />
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
                  className="nav-btn primary"
                >
                  Siguiente
                  <img src="/svgs/right-arrow.svg" alt="" width="7" height="7" style={{ marginLeft: '1rem', filter: 'brightness(0) invert(1)' }} />
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