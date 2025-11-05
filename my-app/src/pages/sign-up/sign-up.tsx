import type { FormData, CustomDropdownProps } from './sign-up';
import { Link, useNavigate } from 'react-router-dom';
import { initialFormData, dropdownOptions, getNextStep, getPrevStep, getSelectedOption, validarCamposStep1, validarCamposStep2, manejarErrorServidor, ObtenerDatosFormulario, validarFormularioInicial, isStepValid, isInitialFormValid, isValidEmail, validateFieldPure, handleInputChangePure, handleDropdownChangePure, toggleDropdownPure, GenerarContrasenaNueva } from './sign-up';
import { VerificarEmailExiste } from '../../api/VerificarEmail';
import { Registrarse } from '../../api/Registrarse';
import { useState, useRef, useEffect } from 'react';
import React from 'react';
import './sign-up.css';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showStepForm, setShowStepForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [correo, setCorreo] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailCheckTimeout, setEmailCheckTimeout] = useState<number | null>(null);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const isUpdatingBeneficiario = false;
  const isUpdatingPersona = false;
  
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const setDropdownRef = (field: string) => (ref: HTMLDivElement | null) => {
    dropdownRefs.current[field] = ref;
  };

  const handleClickOutside = (event: MouseEvent) => {
    Object.entries(dropdownRefs.current).forEach(([key, ref]) => {
      if (ref && !ref.contains(event.target as Node)) {
        setOpenDropdowns(prev => ({ ...prev, [key]: false }));
      }
    });
  };

  const handleScroll = (event: Event) => {
    const target = event.target as Element;
    if (!target || typeof target.closest !== 'function') {
      setOpenDropdowns({});
      return;
    }
    const isDropdownScroll = target.closest('.dropdown-list');
    if (!isDropdownScroll) {
      setOpenDropdowns({});
    }
  };

  useEffect(() => {
    const handleClickOutsideWrapper = (event: MouseEvent) => {
      handleClickOutside(event);
    };

    const handleScrollWrapper = (event: Event) => {
      handleScroll(event);
    };

    document.addEventListener('mousedown', handleClickOutsideWrapper);
    window.addEventListener('scroll', handleScrollWrapper, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideWrapper);
      window.removeEventListener('scroll', handleScrollWrapper, true);
      if (emailCheckTimeout) {
        clearTimeout(emailCheckTimeout);
      }
    };
  }, [emailCheckTimeout]);

  // Función para validar un campo específico
  const validateField = (field: string, value: string) => {
    const errorMessage = validateFieldPure(field, value);
    setFieldErrors(prev => ({
      ...prev,
      [field]: errorMessage
    }));
  };

  // Función para verificar si el email existe en el backend con debounce
  const checkEmailExists = async (email: string) => {
    if (!email || !isValidEmail(email)) {
      setEmailExists(false);
      return;
    }

    // Limpiar timeout anterior si existe
    if (emailCheckTimeout) {
      clearTimeout(emailCheckTimeout);
    }

    // Crear nuevo timeout para debounce
    const timeoutId = window.setTimeout(async () => {
      setIsCheckingEmail(true);
      
      try {
        const exists = await VerificarEmailExiste(email);
        setEmailExists(exists);
        
        if (exists) {
          setFieldErrors(prev => ({
            ...prev,
            email: 'Este correo electrónico ya está registrado'
          }));
        }
        // Si no existe, limpiar el error de email si solo era por duplicado
        else {
          setFieldErrors(prev => {
            const newErrors = { ...prev };
            if (newErrors.email === 'Este correo electrónico ya está registrado') {
              delete newErrors.email;
            }
            return newErrors;
          });
        }
      } 
      catch (error) {
        console.error('Error al verificar email:', error);
        setEmailExists(false);
      } 
      finally {
        setIsCheckingEmail(false);
        setEmailCheckTimeout(null);
      }
    }, 500); // Esperar 500ms después de que el usuario deje de escribir

    setEmailCheckTimeout(timeoutId);
  };

  const handleInputChange = (field: string, value: string) => {
    const newFormData = handleInputChangePure(formData, field, value);
    setFormData(newFormData);
    validateField(field, value);
  };
  
  const handleDropdownChange = (field: string, value: string) => {
    const result = handleDropdownChangePure(formData, openDropdowns, field, value);
    setFormData(result.formData);
    setOpenDropdowns(result.openDropdowns);
  };

  // Función para generar contraseña
  const GenerarContrasena = () => {
    const nuevaContrasena = GenerarContrasenaNueva(8);
    
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.value = nuevaContrasena;
      
      const inputEvent = new Event('input', { bubbles: true });
      const changeEvent = new Event('change', { bubbles: true });
      const blurEvent = new Event('blur', { bubbles: true });
      
      passwordInput.dispatchEvent(inputEvent);
      passwordInput.dispatchEvent(changeEvent);
      passwordInput.dispatchEvent(blurEvent);
      
      validateField('password', nuevaContrasena);
    }
  };

  // Función para toggle dropdowns
  const toggleDropdown = (field: string) => {
    const newState = toggleDropdownPure(openDropdowns, field);
    setOpenDropdowns(newState);
  };

  // Componente Dropdown para mostrar opciones en el formulario
  const CustomDropdown: React.FC<CustomDropdownProps> = ({ field, label, options, value, placeholder }) => {
    const isOpen = openDropdowns[field] || false;
    const selectedOption = getSelectedOption(options, value);
    
    const handleButtonClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown(field);
    };

    const handleOptionClick = (e: React.MouseEvent, optionValue: string) => {
      e.preventDefault();
      e.stopPropagation();
      handleDropdownChange(field, optionValue);
    };
    
    return (
      <div className="form-group">
        <label htmlFor={field} className="form-label">
          {label}
        </label>
        <div ref={setDropdownRef(field)} className="dropdown-container">
          <button type="button" onMouseDown={handleButtonClick} className="dropdown-button">
            {selectedOption?.label || placeholder || 'Seleccionar'}
          </button>
          {isOpen && (
            <div className="dropdown-list" onWheel={(e) => e.stopPropagation()}>
              {options.map(option => (
                <div key={option.value} onMouseDown={(e) => handleOptionClick(e, option.value)} className={`dropdown-option ${ value === option.value ? 'selected' : ''} ${option.value === '' ? 'empty' : ''}`} style={{ userSelect: 'none' }}>
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const HandleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  try {
      const { email, password } = ObtenerDatosFormulario(e.target as HTMLFormElement);
      const validacion = validarFormularioInicial(email, password, isTermsAccepted);
      if (!validacion.valid) {
        alert(validacion.error);
        setIsLoading(false);
        return;
      }
      const emailExiste = await VerificarEmailExiste(email);
      if (emailExiste) {
        alert('Este correo electrónico ya está registrado. Por favor, usa otro correo.');
        setEmailExists(true);
        setFieldErrors(prev => ({
          ...prev,
          email: 'Este correo electrónico ya está registrado'
        }));
        setIsLoading(false);
        return;
      }
      else {
        setCorreo(email);
      }
      setContrasena(password);
      setShowStepForm(true);
    }
    catch (error) {
      console.error('Error en el proceso de registro:', error);
      const errorMessage = manejarErrorServidor(error);
      alert(`Error al crear la cuenta: ${errorMessage}`);
    }
    finally {
      setIsLoading(false);
    }
  };

  /*
  Esta funcion gestiona el formulario de multiples pasos
  para crear al Usuario , su Empresa, y sus Miembros
  */
  const HandleNextStep = async () => {
    if (currentStep === 1) {
      const validacion = validarCamposStep1(formData);
      if (!validacion.valid) {
        alert(`Por favor, completa todos los campos requeridos:\n${validacion.errors.join('\n')}`);
        return;
      }
      setCurrentStep(getNextStep(currentStep));
    }
    else if (currentStep === 2) {
      const validacion = validarCamposStep2(formData);
      if (!validacion.valid) {
        alert(`Por favor, completa todos los campos requeridos:\n${validacion.errors.join('\n')}`);
        return;
      }
      setCurrentStep(getNextStep(currentStep));
    }
    else if (currentStep === 3) {
      if (correo && contrasena) {
        try {
          var registro = await Registrarse(formData, correo, contrasena, correo);
          console.log(`Registro: ${JSON.stringify(registro)}`);
          navigate('/login');
        }
        catch (error) {
          console.error('Faltan datos del usuario para validar credenciales');
        }
      }
      else {
        console.error('Faltan datos del usuario para validar credenciales');
      }
    }
    else {
      setCurrentStep(getNextStep(currentStep));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(getPrevStep(currentStep));
  };

  return (
    <div className="signup-container">
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <h2 className="loading-title">Creando tu cuenta</h2>
            <p className="loading-subtitle"> Estamos configurando tu perfil, esto tomará unos momentos...</p>
          </div>
        </div>
      ) : !showStepForm ? (
        <div className="initial-form-container">
          <div className="form-panel">
            {/* Titulo de "comencemos" */}
            <h1 className="main-title">Comencemos</h1>
            <p className="subtitle">
              Resgistrate hoy para poder ocupar los beneficios que ofrecemos
            </p>
            {/* Inputs */}
            <form className="signup-form" onSubmit={HandleFormSubmit}>
              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Dirección de correo electrónico
                </label>
                <input id="email" name="email" type="email" autoComplete="email" defaultValue="" required className="form-input" placeholder="mi.dirección@ejemplo.cl"
                  onBlur={(e) => {
                    const email = e.target.value.trim().toLowerCase();
                    validateField('email', email);
                    if (isValidEmail(email)) {
                      if (emailCheckTimeout) {
                        clearTimeout(emailCheckTimeout);
                        setEmailCheckTimeout(null);
                      }
                      checkEmailExists(email);
                    }
                  }}
                  onChange={(e) => {
                    const email = e.target.value.trim().toLowerCase();
                    validateField('email', email);
                    if (emailExists) {
                      setEmailExists(false);
                    }
                    if (isValidEmail(email)) {
                      checkEmailExists(email);
                    }
                  }}
                />
                <p className="email-error">
                  {isCheckingEmail ? 'Verificando disponibilidad del correo...' : (fieldErrors.email || '\u00A0')}
                </p>
              </div>
              <div className="form-group">
                <div className="password-group">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                </div>
                <div className="password-input-container">
                  <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="contraseña" defaultValue="" required className="form-input" placeholder="Min 8 carácteres" onChange={(e) => validateField('password', e.target.value)} onBlur={(e) => validateField('password', e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle-btn" aria-label={showPassword ? "Hide password" : "Show password"} >
                    {showPassword ? (
                      <img src="/svgs/eye-off.svg" alt="Hide password" width="22" height="22" />
                    ) : (
                      <img src="/svgs/eye-on.svg" alt="Show password" width="22" height="22" />
                    )}
                  </button>
                </div>
                <button type="button" onClick={GenerarContrasena} className="generate-password-btn">
                  Generar contraseña segura
                </button>
                {/* Mensaje de error para la contraseña */}
                <p className="email-error">{fieldErrors.password || '\u00A0'}</p>
              </div>
              {/* Checkbox */}
              <div className="checkbox-group">
                <input 
                  id="agree" 
                  name="agree" 
                  type="checkbox" 
                  className="checkbox-input"
                  checked={isTermsAccepted}
                  onChange={(e) => setIsTermsAccepted(e.target.checked)}
                />
                  <label htmlFor="agree" className="checkbox-label">
                    Estoy de acuerdo con los <a href="#" className="terms-link">Términos</a> y <a href="#" className="terms-link">Condiciones</a>
                  </label>
              </div>
              {/* Botón de registro */}
              <div className="form-group">
                <button type="submit" className="submit-btn"
                  disabled={
                    isLoading || 
                    isCheckingEmail || 
                    emailExists || 
                    !isTermsAccepted ||
                    !isInitialFormValid( 
                      (document.getElementById('email') as HTMLInputElement)?.value || '', 
                      (document.getElementById('password') as HTMLInputElement)?.value || '',
                      isTermsAccepted
                    )
                  } >
                  <span>{isLoading ? 'Creando cuenta...' : 'Registrarse'}</span>
                  <img src="/svgs/guy-in.svg" alt="" width="15" height="15" className="submit-btn-icon" />
                </button>
              </div>
            </form>
            {/* Extras de abajo */}
            <p className="bottom-text">
              ¿Tienes una cuenta?{' '}
              <a className="signin-link">
                  <Link to="/Login">Inicia sesión</Link>
              </a>
            </p>
          </div>
        </div>
      ) : (
        <div className="step-form-container">
          <div className="progress-container">
            <div className="progress-steps">
              <div className={`step-circle ${ currentStep >= 1 ? 'active' : 'inactive'}`}>
                1
              </div>
              <div className={`step-connector ${currentStep >= 2 ? 'active' : 'inactive'}`}></div>
              <div className={`step-circle ${ currentStep >= 2 ? 'active' : 'inactive' }`}>
                2
              </div>
              <div className={`step-connector ${currentStep >= 3 ? 'active' : 'inactive'}`}></div>
              <div className={`step-circle ${ currentStep >= 3 ? 'active' : 'inactive' }`}>
                3
              </div>
            </div>
          </div>
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
                      <label htmlFor="Nombre" className="form-label">
                        Nombre
                      </label>
                      <input
                        id="Nombre" name="Nombre" type="text" value={formData.Nombre} onChange={(e) => handleInputChange('Nombre', e.target.value)} onBlur={(e) => validateField('Nombre', e.target.value)} className="form-input" placeholder="Ej: Juan" />
                      {fieldErrors.Nombre && (
                        <p className="email-error">{fieldErrors.Nombre}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="Apellido" className="form-label">
                        Apellido
                      </label>
                      <input id="Apellido" name="Apellido" type="text" value={formData.Apellido} onChange={(e) => handleInputChange('Apellido', e.target.value)} onBlur={(e) => validateField('Apellido', e.target.value)} className="form-input" placeholder="Ej: Pérez" />
                      {fieldErrors.Apellido && (
                        <p className="email-error">{fieldErrors.Apellido}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="FechaDeNacimiento" className="form-label">
                        Fecha de nacimiento
                      </label>
                      <input id="FechaDeNacimiento" name="FechaDeNacimiento" type="date" value={formData.FechaDeNacimiento} onChange={(e) => handleInputChange('FechaDeNacimiento', e.target.value)} onBlur={(e) => validateField('FechaDeNacimiento', e.target.value)} className="form-input" />
                      {fieldErrors.FechaDeNacimiento && (
                        <p className="email-error">{fieldErrors.FechaDeNacimiento}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="RUT" className="form-label">
                        RUT
                      </label>
                      <input id="RUT" name="RUT" type="text" value={formData.RUT} onChange={(e) => handleInputChange('RUT', e.target.value)} onBlur={(e) => validateField('RUT', e.target.value)} placeholder="12.345.678-9" className="form-input" />
                      {fieldErrors.RUT && (
                        <p className="email-error">{fieldErrors.RUT}</p>
                      )}
                    </div>
                    <CustomDropdown field="Sexo" label="Sexo" options={dropdownOptions.Sexo} value={formData.Sexo} />
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
                      <label htmlFor="NombreCompania" className="form-label">
                        Nombre de la empresa/organización
                      </label>
                      <input id="NombreCompania" name="NombreCompania" type="text" value={formData.NombreCompania} onChange={(e) => handleInputChange('NombreCompania', e.target.value)} onBlur={(e) => validateField('NombreCompania', e.target.value)} className="form-input" placeholder="Ingresa el nombre de tu organización" />
                      {fieldErrors.NombreCompania && (
                        <p className="email-error">{fieldErrors.NombreCompania}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="CreacionCompania" className="form-label">
                        Fecha de creación
                      </label>
                      <input id="CreacionCompania" name="CreacionCompania" type="date" value={formData.CreacionCompania} onChange={(e) => handleInputChange('CreacionCompania', e.target.value)} onBlur={(e) => validateField('CreacionCompania', e.target.value)} className="form-input" />
                      {fieldErrors.CreacionCompania && (
                        <p className="email-error">{fieldErrors.CreacionCompania}</p>
                      )}
                    </div>
                    <CustomDropdown field="RegionCompania" label="Región de creación" options={dropdownOptions.regions} value={formData.RegionCompania} />
                    <div className="form-group">
                      <label htmlFor="DireccionCompania" className="form-label">
                        Dirección
                      </label>
                      <input id="DireccionCompania" name="DireccionCompania" type="text" value={formData.DireccionCompania} onChange={(e) => setFormData(prev => ({ ...prev, DireccionCompania: e.target.value }))} className="form-input" placeholder="Ej: Av. Providencia 123, Providencia, Santiago" />
                    </div>
                    <CustomDropdown field="TipoPersonaCompania" label="Tipo de persona" options={dropdownOptions.TipoPersonaCompania} value={formData.TipoPersonaCompania} />
                    <CustomDropdown field="TipoEmpresaCompania" label="Tipo de empresa" options={dropdownOptions.TipoEmpresaCompania} value={formData.TipoEmpresaCompania} />
                    <CustomDropdown field="PerfilCompania" label="Perfil" options={dropdownOptions.PerfilCompania} value={formData.PerfilCompania} />
                    <div className="form-group">
                      <label htmlFor="RUTCompania" className="form-label">
                        RUT de la empresa
                      </label>
                      <input id="RUTCompania" name="RUTCompania" type="text" value={formData.RUTCompania} onChange={(e) => handleInputChange('RUTCompania', e.target.value)} onBlur={(e) => validateField('RUTCompania', e.target.value)} placeholder="Ej: 76.123.456-7" className="form-input" />
                      {fieldErrors.RUTCompania && (
                        <p className="email-error">{fieldErrors.RUTCompania}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="RUTRepresentanteCompania" className="form-label">
                        RUT del representante legal
                      </label>
                      <input id="RUTRepresentanteCompania" name="RUTRepresentanteCompania" type="text" value={formData.RUTRepresentanteCompania} onChange={(e) => handleInputChange('RUTRepresentanteCompania', e.target.value)} onBlur={(e) => validateField('RUTRepresentanteCompania', e.target.value)} placeholder="Ej: 12.345.678-9" className="form-input" />
                      {fieldErrors.RUTRepresentanteCompania && (
                        <p className="email-error">{fieldErrors.RUTRepresentanteCompania}</p>
                      )}
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
                      <input id="approximateAmount" name="approximateAmount" type="number" value={formData.approximateAmount} onChange={(e) => setFormData(prev => ({ ...prev, approximateAmount: e.target.value }))} placeholder="Monto en pesos chilenos" className="form-input" />
                    </div>
                    <CustomDropdown field="benefitsOfInterest" label="Beneficios o apoyos de interés" options={dropdownOptions.benefits} value={formData.benefitsOfInterest} />
                    <CustomDropdown field="projectRegions" label="Regiones donde quieres desarrollar el proyecto" options={dropdownOptions.regions} value={formData.projectRegions} />
                    <div className="form-group">
                      <label htmlFor="projectDuration" className="form-label">
                        Duración estimada del proyecto
                      </label>
                      <input id="projectDuration" name="projectDuration" type="number" value={formData.projectDuration} onChange={(e) => setFormData(prev => ({ ...prev, projectDuration: e.target.value }))} placeholder="Duración en meses" className="form-input" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="collaborators" className="form-label">
                        Número de personas con las que planea colaborar
                      </label>
                      <input id="collaborators" name="collaborators" type="number" value={formData.collaborators} onChange={(e) => setFormData(prev => ({ ...prev, collaborators: e.target.value }))} placeholder="Número de colaboradores" className="form-input" />
                    </div>
                  </form>
                </div>
              )}
              <div className="navigation-container">
                <button onClick={handlePrevStep} disabled={currentStep === 1} className={`nav-btn ${currentStep === 1 ? 'secondary' : 'secondary'}`} >
                  Anterior
                </button>
                <div className="nav-spacer"></div>
                <button
                  onClick={HandleNextStep}
                  disabled={
                    isUpdatingPersona || 
                    isUpdatingBeneficiario || 
                    !isStepValid(currentStep, formData)
                  }
                  className="nav-btn primary"
                >
                  {isUpdatingPersona ? 'Guardando perfil...' : 
                   isUpdatingBeneficiario ? 'Creando organización...' : 
                   currentStep === 3 ? 'Finalizar' : 'Siguiente'}
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