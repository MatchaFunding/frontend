import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './sign-up.css';
import type { FormData, CustomDropdownProps } from './sign-up';
import { initialFormData, dropdownOptions, getNextStep, getPrevStep, getSelectedOption, mapearSexoParaBackend, validarCamposStep1, validarCamposStep2, manejarErrorServidor, obtenerDatosFormulario, validarFormularioInicial, isStepValid, isInitialFormValid, isValidEmail, validateFieldPure, handleInputChangePure, handleDropdownChangePure, toggleDropdownPure, generarContrasenaNueva, crearNombreCompleto, procesarRespuestaServidor, validarIdServidor, obtenerFechaActualISO } from './sign-up';
import { CrearPersonaAsync } from '../../api/CrearPersona';
import { CrearUsuarioAsync } from '../../api/CrearUsuario';
import { CambiarPersonaAsync } from '../../api/CambiarPersona';
import { CrearBeneficiarioAsync } from '../../api/CrearBeneficiario';
import { CrearMiembroAsync } from '../../api/CrearMiembro';
import { VerificarEmailExiste } from '../../api/VerificarEmail';
import { ValidarCredencialesDeEmpresaAsync } from '../../api/Login';
import Persona from '../../models/Persona';
import Usuario from '../../models/Usuario';
import Beneficiario from '../../models/Beneficiario';
import Miembro from '../../models/Miembro';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showStepForm, setShowStepForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingPersona, setIsUpdatingPersona] = useState(false);
  const [isUpdatingBeneficiario, setIsUpdatingBeneficiario] = useState(false);
  const [createdPersonaId, setCreatedPersonaId] = useState<number | null>(null);
  const [createdUsuarioId, setCreatedUsuarioId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailCheckTimeout, setEmailCheckTimeout] = useState<number | null>(null);
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
      // Limpiar timeout al desmontar componente
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
        } else {
          // Si no existe, limpiar el error de email si solo era por duplicado
          setFieldErrors(prev => {
            const newErrors = { ...prev };
            if (newErrors.email === 'Este correo electrónico ya está registrado') {
              delete newErrors.email;
            }
            return newErrors;
          });
        }
      } catch (error) {
        console.error('Error al verificar email:', error);
        setEmailExists(false);
      } finally {
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
  const generarContrasena = () => {
    const nuevaContrasena = generarContrasenaNueva(8);
    
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Obtener datos del formulario
      const { email, password } = obtenerDatosFormulario(e.target as HTMLFormElement);

      console.log('Email original del formulario:', (e.target as HTMLFormElement).email?.value);
      console.log('Email procesado para envío:', email);
      console.log('Longitud del email:', email.length);
      console.log('Email válido según nuestra validación:', isValidEmail(email));

      // Validar campos básicos
      const validacion = validarFormularioInicial(email, password);
      if (!validacion.valid) {
        alert(validacion.error);
        setIsLoading(false);
        return;
      }

      // Verificar una vez más que el email no existe antes de proceder
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

      // Paso 1: Crear Persona con atributos básicos (nombre genérico temporal)
      const nuevaPersona: Persona = new Persona({
        ID: 0, // El backend asignará el ID
        Nombre: 'Usuario Temporal', // Nombre genérico que se actualizará en el paso 1
        Sexo: 'NA', // Valor por defecto válido que se puede cambiar después
        RUT: '00000000-0', // RUT temporal válido que se llenará en el formulario paso a paso
        FechaDeNacimiento: '2000-01-01'
      });

      const personaResponse = await CrearPersonaAsync(nuevaPersona);
      
      // El backend puede devolver un objeto directo o un array
      const personaCreada = procesarRespuestaServidor<Persona>(personaResponse);
      const personaId = validarIdServidor(personaCreada.ID, 'la persona');
      
      setCreatedPersonaId(personaId); // Guardar el ID para usarlo en el paso 1

      // Paso 2: Crear Usuario vinculado a la Persona
      const nuevoUsuario = new Usuario({
        ID: 0, // El backend asignará el ID
        Persona: personaId,
        NombreDeUsuario: email, // Usar email como nombre de usuario
        Contrasena: password,
        Correo: email
      });

      const usuarioResponse = await CrearUsuarioAsync(nuevoUsuario);
      
      if (!usuarioResponse) {
        throw new Error('Error al crear el usuario');
      }

      // Procesar la respuesta y obtener el ID del usuario creado
      const usuarioCreado = procesarRespuestaServidor<Usuario>(usuarioResponse);
      const usuarioId = validarIdServidor(usuarioCreado.ID, 'el usuario');
      
      // Guardar la información del usuario creado
      setCreatedUsuarioId(usuarioId);
      setUserEmail(email);
      setUserPassword(password);

      // Solo después de crear ambas entidades, continuar al formulario paso a paso
      setShowStepForm(true);
      
    } catch (error) {
      console.error('Error en el proceso de registro:', error);
      const errorMessage = manejarErrorServidor(error);
      alert(`Error al crear la cuenta: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = async () => {
    // Si estamos en el paso 1, actualizar la persona antes de avanzar
    if (currentStep === 1 && createdPersonaId) {
      // Validar campos antes de proceder
      const validacion = validarCamposStep1(formData);
      if (!validacion.valid) {
        alert(`Por favor, completa todos los campos requeridos:\n${validacion.errors.join('\n')}`);
        return;
      }

      setIsUpdatingPersona(true);
      
      try {
        // Crear objeto Persona con los datos actualizados del formulario
        const nombreCompleto = crearNombreCompleto(formData.firstName || '', formData.lastName || '');
        const personaActualizada = new Persona({
          ID: createdPersonaId,
          Nombre: nombreCompleto,
          Sexo: mapearSexoParaBackend(formData.gender || ''),
          RUT: formData.rut || '00000000-0',
          FechaDeNacimiento: formData.birthDate || '2000-01-01'
        });

        const response = await CambiarPersonaAsync(createdPersonaId, personaActualizada);
        
        // Verificar que la respuesta sea válida
        if (!response) {
          throw new Error('Error al actualizar la persona');
        }

        // Solo después de actualizar exitosamente, avanzar al siguiente paso
        setCurrentStep(getNextStep(currentStep));
        
      } catch (error) {
        console.error('Error al actualizar persona:', error);
        alert('Error al actualizar los datos. Por favor, inténtalo de nuevo.');
      } finally {
        setIsUpdatingPersona(false);
      }
    } else if (currentStep === 2 && createdPersonaId) {
      // Validar campos antes de proceder
      const validacion = validarCamposStep2(formData);
      if (!validacion.valid) {
        alert(`Por favor, completa todos los campos requeridos:\n${validacion.errors.join('\n')}`);
        return;
      }

      // Si estamos en el paso 2, crear beneficiario y miembro
      setIsUpdatingBeneficiario(true);
      
      try {

        // Crear Beneficiario con todos los datos del formulario
        const nuevoBeneficiario = new Beneficiario({
          ID: 0, // El backend asignará el ID
          Nombre: formData.companyName?.trim() || '',
          FechaDeCreacion: formData.companyCreationDate || obtenerFechaActualISO(),
          RegionDeCreacion: formData.companyCreationRegion || '',
          Direccion: formData.companyAddress?.trim() || '',
          TipoDePersona: formData.companyPersonType || '',
          TipoDeEmpresa: formData.companyType || '',
          Perfil: formData.companyProfile || '',
          RUTdeEmpresa: formData.companyRut?.trim() || '',
          RUTdeRepresentante: formData.legalRepresentativeRut?.trim() || ''
        });

        const beneficiarioResponse = await CrearBeneficiarioAsync(nuevoBeneficiario);
        
        // El backend puede devolver un objeto directo o un array
        const beneficiarioCreado = procesarRespuestaServidor<Beneficiario>(beneficiarioResponse);
        const beneficiarioId = validarIdServidor(beneficiarioCreado.ID, 'el beneficiario');
        
        // Crear Miembro vinculando la Persona con el Beneficiario
        const nuevoMiembro = new Miembro({
          ID: 0, // El backend asignará el ID
          Persona: createdPersonaId,
          Beneficiario: beneficiarioId
        });

        const miembroResponse = await CrearMiembroAsync(nuevoMiembro);
        
        if (!miembroResponse) {
          throw new Error('Error al crear el miembro');
        }

        // Solo después de crear exitosamente, avanzar al siguiente paso
        setCurrentStep(getNextStep(currentStep));
        
      } catch (error) {
        console.error('Error al crear beneficiario o miembro:', error);
        const errorMessage = manejarErrorServidor(error);
        alert(`Error al crear la organización: ${errorMessage}`);
      } finally {
        setIsUpdatingBeneficiario(false);
      }
    } else if (currentStep === 3) {
      // Si estamos en el paso 3 (último paso), validar credenciales y guardar datos completos en sessionStorage
      if (createdUsuarioId && userEmail && userPassword) {
        try {
          // Llamar a la API de validación de credenciales de empresa para obtener todos los datos
          const resultado = await ValidarCredencialesDeEmpresaAsync({ 
            email: userEmail, 
            password: userPassword 
          });
          
          if (resultado.success && resultado.usuario) {
            // Guardar todos los datos de empresa en sessionStorage (igual que en login)
            sessionStorage.setItem('usuario', JSON.stringify(resultado.usuario));
            console.log('Datos completos de empresa guardados en sessionStorage (SignUp):', resultado.usuario);
            
            // Redirigir al home
            navigate('/Home-i');
          } else {
            // Si no se pueden validar las credenciales, usar datos básicos como respaldo
            const userData = {
              ID: createdUsuarioId,
              Correo: userEmail,
              NombreDeUsuario: userEmail,
              // Agregar otros datos si están disponibles
              ...(formData.firstName && formData.lastName && {
                Nombre: `${formData.firstName} ${formData.lastName}`
              })
            };
            sessionStorage.setItem('usuario', JSON.stringify(userData));
            console.log('Datos básicos guardados en sessionStorage (SignUp - respaldo):', userData);
            navigate('/Home-i');
          }
        } catch (error) {
          console.error('Error al validar credenciales después del registro:', error);
          // En caso de error, usar datos básicos como respaldo
          const userData = {
            ID: createdUsuarioId,
            Correo: userEmail,
            NombreDeUsuario: userEmail,
            // Agregar otros datos si están disponibles
            ...(formData.firstName && formData.lastName && {
              Nombre: `${formData.firstName} ${formData.lastName}`
            })
          };
          sessionStorage.setItem('usuario', JSON.stringify(userData));
          console.log('Datos básicos guardados en sessionStorage (SignUp - error):', userData);
          navigate('/Home-i');
        }
      } else {
        console.error('Faltan datos del usuario para validar credenciales');
        navigate('/Home-i');
      }
    } else {
      // Para otros pasos, simplemente avanzar
      setCurrentStep(getNextStep(currentStep));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(getPrevStep(currentStep));
  };

  return (
    <div className="signup-container">
      {/* Vista de carga (puede volverse un componente separado) */}
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
            <form className="signup-form" onSubmit={handleFormSubmit}>
              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Dirección de correo electrónico
                </label>
                <input id="email" name="email" type="email" autoComplete="email" defaultValue="" required className="form-input" placeholder="mi.dirección@ejemplo.cl"
                  onBlur={(e) => {
                    const email = e.target.value.trim().toLowerCase();
                    validateField('email', email);
                    // Verificar inmediatamente en onBlur
                    if (isValidEmail(email)) {
                      // Limpiar timeout si existe y verificar inmediatamente
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
                    // Reset del estado de email existe cuando el usuario está escribiendo
                    if (emailExists) {
                      setEmailExists(false);
                    }
                    // Usar debounce para verificar mientras escribe
                    if (isValidEmail(email)) {
                      checkEmailExists(email);
                    }
                  }}
                />
                {isCheckingEmail && (
                  <p className="email-checking">Verificando disponibilidad del correo...</p>
                )}
                {fieldErrors.email && (
                  <p className="email-error">{fieldErrors.email}</p>
                )}
              </div>
              {/* Contraseña */}
              <div className="form-group">
                <div className="password-group">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                </div>
                <div className="password-input-container">
                  {/* Input para insertar contraseña */}
                  <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="contraseña" defaultValue="" required className="form-input" placeholder="Min 8 carácteres" onChange={(e) => validateField('password', e.target.value)} onBlur={(e) => validateField('password', e.target.value)} />
                  {/* Boton para mostrar/ocultar contraseña */}
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle-btn" aria-label={showPassword ? "Hide password" : "Show password"} >
                    {showPassword ? (
                      // Visible
                      <img src="/svgs/eye-off.svg" alt="Hide password" width="22" height="22" />
                    ) : (
                      // No visible
                      <img src="/svgs/eye-on.svg" alt="Show password" width="22" height="22" />
                    )}
                  </button>
                </div>
                
                {/* Botón para generar contraseña */}
                <button type="button" onClick={generarContrasena} className="generate-password-btn">
                  Generar contraseña segura
                </button>
                {/* Mensaje de error para la contraseña */}
                {fieldErrors.password && (
                  <p className="email-error">{fieldErrors.password}</p>
                )}
              </div>
              {/* Checkbox */}
              <div className="checkbox-group">
                <input id="agree" name="agree" type="checkbox" className="checkbox-input" />
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
                    !isInitialFormValid( 
                      (document.getElementById('email') as HTMLInputElement)?.value || '', 
                      (document.getElementById('password') as HTMLInputElement)?.value || '' 
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
        // Formulario de 3 pasos después del registro
        <div className="step-form-container">
          {/* Pasos (literalmente) */}
          <div className="progress-container">
            <div className="progress-steps">
              {/* Paso 1 */}
              <div className={`step-circle ${ currentStep >= 1 ? 'active' : 'inactive'}`}>
                1
              </div>
              {/* Línea entre paso 1 y 2 */}
              <div className={`step-connector ${currentStep >= 2 ? 'active' : 'inactive'}`}></div>
              {/* Paso 2 */}
              <div className={`step-circle ${ currentStep >= 2 ? 'active' : 'inactive' }`}>
                2
              </div>
              {/* Línea entre paso 2 y 3 */}
              <div className={`step-connector ${currentStep >= 3 ? 'active' : 'inactive'}`}></div>
              {/* Paso 3 */}
              <div className={`step-circle ${ currentStep >= 3 ? 'active' : 'inactive' }`}>
                3
              </div>
            </div>
          </div>

          {/* Formulario de los pasos */}
          <div className="step-form-main">
            <div className="form-panel">
              {/* Paso 1 */}
              {currentStep === 1 && (
                <div>
                  {/* Título */}
                  <h1 className="step-title">Cuéntanos un poco sobre ti</h1>
                  <p className="subtitle">
                    Completa la información para personalizar tu experiencia
                  </p>
                  {/* Formulario */}
                  <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
                    {/* Input nombre */}
                    <div className="form-group">
                      <label htmlFor="firstName" className="form-label">
                        Nombre
                      </label>
                      <input
                        id="firstName" name="firstName" type="text" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} onBlur={(e) => validateField('firstName', e.target.value)} className="form-input" placeholder="Ej: Juan" />
                      {fieldErrors.firstName && (
                        <p className="email-error">{fieldErrors.firstName}</p>
                      )}
                    </div>
                    {/* Input apellido */}
                    <div className="form-group">
                      <label htmlFor="lastName" className="form-label">
                        Apellido
                      </label>
                      <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} onBlur={(e) => validateField('lastName', e.target.value)} className="form-input" placeholder="Ej: Pérez" />
                      {fieldErrors.lastName && (
                        <p className="email-error">{fieldErrors.lastName}</p>
                      )}
                    </div>
                    {/* Input fecha de nacimiento */}
                    <div className="form-group">
                      <label htmlFor="birthDate" className="form-label">
                        Fecha de nacimiento
                      </label>
                      <input id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={(e) => handleInputChange('birthDate', e.target.value)} onBlur={(e) => validateField('birthDate', e.target.value)} className="form-input" />
                      {fieldErrors.birthDate && (
                        <p className="email-error">{fieldErrors.birthDate}</p>
                      )}
                    </div>
                    {/* Input RUT */}
                    <div className="form-group">
                      <label htmlFor="rut" className="form-label">
                        RUT
                      </label>
                      <input id="rut" name="rut" type="text" value={formData.rut} onChange={(e) => handleInputChange('rut', e.target.value)} onBlur={(e) => validateField('rut', e.target.value)} placeholder="12.345.678-9" className="form-input" />
                      {fieldErrors.rut && (
                        <p className="email-error">{fieldErrors.rut}</p>
                      )}
                    </div>
                    {/* Input sexo */}
                    <CustomDropdown field="gender" label="Sexo" options={dropdownOptions.gender} value={formData.gender} />
                  </form>
                </div>
              )}
              {/* Paso 2 */}
              {currentStep === 2 && (
                <div>
                  {/* Título */}
                  <h1 className="step-title">Háblanos de tu organización</h1>
                  <p className="subtitle">
                    Información básica sobre tu empresa u organización
                  </p>
                  {/* Formulario */}
                  <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
                    {/* Nombre de la empresa/organización */}
                    <div className="form-group">
                      <label htmlFor="companyName" className="form-label">
                        Nombre de la empresa/organización
                      </label>
                      <input id="companyName" name="companyName" type="text" value={formData.companyName} onChange={(e) => handleInputChange('companyName', e.target.value)} onBlur={(e) => validateField('companyName', e.target.value)} className="form-input" placeholder="Ingresa el nombre de tu organización" />
                      {fieldErrors.companyName && (
                        <p className="email-error">{fieldErrors.companyName}</p>
                      )}
                    </div>
                    {/* Fecha de creación */}
                    <div className="form-group">
                      <label htmlFor="companyCreationDate" className="form-label">
                        Fecha de creación
                      </label>
                      <input id="companyCreationDate" name="companyCreationDate" type="date" value={formData.companyCreationDate} onChange={(e) => handleInputChange('companyCreationDate', e.target.value)} onBlur={(e) => validateField('companyCreationDate', e.target.value)} className="form-input" />
                      {fieldErrors.companyCreationDate && (
                        <p className="email-error">{fieldErrors.companyCreationDate}</p>
                      )}
                    </div>
                    {/* Región */}
                    <CustomDropdown field="companyCreationRegion" label="Región de creación" options={dropdownOptions.regions} value={formData.companyCreationRegion} />
                    {/* Dirección */}
                    <div className="form-group">
                      <label htmlFor="companyAddress" className="form-label">
                        Dirección
                      </label>
                      <input id="companyAddress" name="companyAddress" type="text" value={formData.companyAddress} onChange={(e) => setFormData(prev => ({ ...prev, companyAddress: e.target.value }))} className="form-input" placeholder="Ej: Av. Providencia 123, Providencia, Santiago" />
                    </div>
                    {/* Tipo de persona */}
                    <CustomDropdown field="companyPersonType" label="Tipo de persona" options={dropdownOptions.companyPersonType} value={formData.companyPersonType} />
                    {/* Tipo de empresa */}
                    <CustomDropdown field="companyType" label="Tipo de empresa" options={dropdownOptions.companyType} value={formData.companyType} />
                    {/* Perfil */}
                    <CustomDropdown field="companyProfile" label="Perfil" options={dropdownOptions.companyProfile} value={formData.companyProfile} />
                    {/* Rut de la empresa */}
                    <div className="form-group">
                      <label htmlFor="companyRut" className="form-label">
                        RUT de la empresa
                      </label>
                      <input id="companyRut" name="companyRut" type="text" value={formData.companyRut} onChange={(e) => handleInputChange('companyRut', e.target.value)} onBlur={(e) => validateField('companyRut', e.target.value)} placeholder="Ej: 76.123.456-7" className="form-input" />
                      {fieldErrors.companyRut && (
                        <p className="email-error">{fieldErrors.companyRut}</p>
                      )}
                    </div>
                    {/* Rut del representante legal */}
                    <div className="form-group">
                      <label htmlFor="legalRepresentativeRut" className="form-label">
                        RUT del representante legal
                      </label>
                      <input id="legalRepresentativeRut" name="legalRepresentativeRut" type="text" value={formData.legalRepresentativeRut} onChange={(e) => handleInputChange('legalRepresentativeRut', e.target.value)} onBlur={(e) => validateField('legalRepresentativeRut', e.target.value)} placeholder="Ej: 12.345.678-9" className="form-input" />
                      {fieldErrors.legalRepresentativeRut && (
                        <p className="email-error">{fieldErrors.legalRepresentativeRut}</p>
                      )}
                    </div>
                  </form>
                </div>
              )}
              {/* Paso 3 */}
              {currentStep === 3 && (
                <div>
                  {/* Título */}
                  <h1 className="step-title">¿Qué tipo de apoyos buscas?</h1>
                  <p className="subtitle">
                    Ayúdanos a perfilar las mejores oportunidades
                  </p>
                  {/* Formulario */}
                  <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
                    {/* Monto aproximado */}
                    <div className="form-group">
                      <label htmlFor="approximateAmount" className="form-label">
                        Monto aproximado que buscas
                      </label>
                      <input id="approximateAmount" name="approximateAmount" type="number" value={formData.approximateAmount} onChange={(e) => setFormData(prev => ({ ...prev, approximateAmount: e.target.value }))} placeholder="Monto en pesos chilenos" className="form-input" />
                    </div>
                    {/* Beneficios */}
                    <CustomDropdown field="benefitsOfInterest" label="Beneficios o apoyos de interés" options={dropdownOptions.benefits} value={formData.benefitsOfInterest} />
                    {/* Regiones del proyecto */}
                    <CustomDropdown field="projectRegions" label="Regiones donde quieres desarrollar el proyecto" options={dropdownOptions.regions} value={formData.projectRegions} />
                    {/* Duración del proyecto */}
                    <div className="form-group">
                      <label htmlFor="projectDuration" className="form-label">
                        Duración estimada del proyecto
                      </label>
                      <input id="projectDuration" name="projectDuration" type="number" value={formData.projectDuration} onChange={(e) => setFormData(prev => ({ ...prev, projectDuration: e.target.value }))} placeholder="Duración en meses" className="form-input" />
                    </div>
                    {/* Numero de personas a colaborar */}
                    <div className="form-group">
                      <label htmlFor="collaborators" className="form-label">
                        Número de personas con las que planea colaborar
                      </label>
                      <input id="collaborators" name="collaborators" type="number" value={formData.collaborators} onChange={(e) => setFormData(prev => ({ ...prev, collaborators: e.target.value }))} placeholder="Número de colaboradores" className="form-input" />
                    </div>
                  </form>
                </div>
              )}
              {/* Botones de navegación */}
              <div className="navigation-container">
                <button onClick={handlePrevStep} disabled={currentStep === 1} className={`nav-btn ${currentStep === 1 ? 'secondary' : 'secondary'}`} >
                  Anterior
                </button>
                <div className="nav-spacer"></div>
                <button
                  onClick={handleNextStep}
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