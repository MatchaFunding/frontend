import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import type { LoginFormData } from './login';
import { 
  initialLoginFormData, 
  validarFormularioLogin, 
  obtenerDatosFormulario, 
  isLoginFormValid, 
  validateFieldPure, 
  handleInputChangePure
} from './login';
import { ValidarCredencialesDeEmpresaAsync } from '../../api/Login';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<LoginFormData>(initialLoginFormData);

  // Función para validar un campo específico
  const validateField = (field: string, value: string) => {
    const errorMessage = validateFieldPure(field, value);
    setFieldErrors(prev => ({
      ...prev,
      [field]: errorMessage
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    const newFormData = handleInputChangePure(formData, field, value);
    setFormData(newFormData);
    validateField(field, value);
    
    // Limpiar error de login cuando el usuario empiece a escribir
    if (loginError) {
      setLoginError('');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(''); // Limpiar errores anteriores

    try {
      // Obtener datos del formulario
      const { email, password } = obtenerDatosFormulario(e.target as HTMLFormElement);

      console.log('Email:', email);
      console.log('Password length:', password.length);

      // Validar campos básicos
      const validacion = validarFormularioLogin(email, password);
      if (!validacion.valid) {
        setLoginError(validacion.error);
        setIsLoading(false);
        return;
      }

      // Llamar a la API de validación de credenciales de empresa
      const resultado = await ValidarCredencialesDeEmpresaAsync({ email, password });
      
      if (resultado.success) {
        console.log('Empresa logueada:', resultado.usuario);
        
        // Guardar datos de empresa en sessionStorage
        if (resultado.usuario) {
          sessionStorage.setItem('usuario', JSON.stringify(resultado.usuario));
          console.log('Datos de empresa guardados en sessionStorage (Login):', resultado.usuario);
        }
        
        // Redirigir al home después del login exitoso
        navigate('/Home-i');
      } else {
        setLoginError('Correo o contraseña mal ingresados');
      }
      
    } catch (error) {
      console.error('Error en el proceso de login:', error);
      setLoginError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Vista de carga */}
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <h2 className="loading-title">Iniciando sesión</h2>
            <p className="loading-subtitle">Verificando tus credenciales...</p>
          </div>
        </div>
      ) : (
        <div className="login-form-container">
          <div className="form-panel">
            {/* Título de "Iniciar sesión" */}
            <h1 className="main-title">Iniciar sesión</h1>
            <p className="subtitle">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
            
            {/* Formulario */}
            <form className="login-form" onSubmit={handleFormSubmit}>
              {/* Email */}
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
                  onBlur={(e) => validateField('email', e.target.value)}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                <p className="email-error">{fieldErrors.email || '\u00A0'}</p>
              </div>
              
              {/* Contraseña */}
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
                    autoComplete="current-password" 
                    defaultValue="" 
                    required 
                    className="form-input" 
                    placeholder="Tu contraseña" 
                    onChange={(e) => handleInputChange('password', e.target.value)} 
                    onBlur={(e) => validateField('password', e.target.value)} 
                  />
                  {/* Botón para mostrar/ocultar contraseña */}
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="password-toggle-btn" 
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <img src="/svgs/eye-off.svg" alt="Ocultar contraseña" width="22" height="22" />
                    ) : (
                      <img src="/svgs/eye-on.svg" alt="Mostrar contraseña" width="22" height="22" />
                    )}
                  </button>
                </div>
                
                {/* Mensaje de error para la contraseña */}
                <p className="email-error">{fieldErrors.password || '\u00A0'}</p>
                
                {/* Enlace de olvidé mi contraseña */}
                {/* <a href="#" className="forgot-password-link">
                  ¿Olvidaste tu contraseña?
                </a> */}
              </div>
              
              {/* Botón de login */}
              <div className="form-group">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isLoading || !isLoginFormValid(
                    (document.getElementById('email') as HTMLInputElement)?.value || '', 
                    (document.getElementById('password') as HTMLInputElement)?.value || ''
                  )}
                >
                  <span>{isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}</span>
                  <img src="/svgs/guy-in.svg" alt="" width="15" height="15" className="submit-btn-icon" />
                </button>
                
                {/* Mensaje de error de login */}
                <p className="email-error" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                  {loginError || '\u00A0'}
                </p>
              </div>
            </form>
            
            {/* Enlaces de abajo */}
            <p className="bottom-text">
              ¿No tienes una cuenta?{' '}
              <Link to="/SignUp" className="signup-link">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
