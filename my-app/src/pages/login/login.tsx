import type { LoginFormData } from './login';
import { initialLoginFormData, ValidarFormularioLogin, ObtenerDatosFormulario, isLoginFormValid, ValidateFieldPure, handleInputChangePure } from './login';
import { Link, useNavigate } from 'react-router-dom';
import { IniciarSesion } from '../../api/IniciarSesion';
import { VerMiUsuario } from '../../api/VerMiUsuario';
import { Autorizar } from '../../api/Autorizar';
import { useState } from 'react';
import React from 'react';
import './login.css';
import { VerMiBeneficiario } from '../../api/VerMiBeneficiario';
import { VerMisProyectos } from '../../api/VerMisProyectos';
import { VerMisPostulaciones } from '../../api/VerMisPostulaciones';
import { VerMisMiembros } from '../../api/VerMisMiembros';


const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<LoginFormData>(initialLoginFormData);

  const ValidateField = (field: string, value: string) => {
    const errorMessage = ValidateFieldPure(field, value);
    setFieldErrors(prev => ({
      ...prev,
      [field]: errorMessage
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    const newFormData = handleInputChangePure(formData, field, value);
    setFormData(newFormData);
    ValidateField(field, value);
    if (loginError) {
      setLoginError('');
    }
  };

  const HandleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      const { email, password } = ObtenerDatosFormulario(e.target as HTMLFormElement);
      const validacion = ValidarFormularioLogin(email, password);

      if (!validacion.valid) {
        setLoginError(validacion.error);
        setIsLoading(false);
        return;
      }

      const resultado = await IniciarSesion(email, password);
      const auth = await Autorizar(email, password);

      const token = resultado.message;
      const id = auth[0].ID;

      const usuario = await VerMiUsuario(id);
      const beneficiario = await VerMiBeneficiario(id);
      const proyectos = await VerMisProyectos(id);
      const postulaciones = await VerMisPostulaciones(id);
      const miembros = await VerMisMiembros(id);

      console.log(`JSON Web Token: ${token}`);
      
      const datos = {
        "Usuario":usuario,
        "Beneficiario":beneficiario,
        "Proyectos":proyectos,
        "Postulaciones":postulaciones,
        "Miembros":miembros,
        "Ideas": []
      }

      localStorage.setItem("usuario", JSON.stringify(datos));
      console.log(`Datos completos: ${localStorage.getItem("usuario")}`);

      if (resultado.message) {
        navigate('/Home-i');
      }
      else {
        setLoginError('Credenciales invalidas!');
      }
      
    }
    catch (error) {
      console.error('Error en el proceso de login:', error);
      setLoginError('Error de conexión. Inténtalo de nuevo.');
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
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
            <h1 className="main-title">Iniciar sesión</h1>
            <p className="subtitle">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
            <form className="login-form" onSubmit={HandleFormSubmit}>
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
                  onBlur={(e) => ValidateField('email', e.target.value)}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                <p className="email-error">{fieldErrors.email || '\u00A0'}</p>
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
                    autoComplete="current-password" 
                    defaultValue="" 
                    required 
                    className="form-input" 
                    placeholder="Tu contraseña" 
                    onChange={(e) => handleInputChange('password', e.target.value)} 
                    onBlur={(e) => ValidateField('password', e.target.value)} 
                  />
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
<<<<<<< HEAD
                {fieldErrors.password && (
                  <p className="email-error">{fieldErrors.password}</p>
                )}
=======
                
                {/* Mensaje de error para la contraseña */}
                <p className="email-error">{fieldErrors.password || '\u00A0'}</p>
                
                {/* Enlace de olvidé mi contraseña */}
>>>>>>> main
                <a href="#" className="forgot-password-link">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
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
<<<<<<< HEAD
                {loginError && (
                  <p className="email-error" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                    {loginError}
                  </p>
                )}
=======
                
                {/* Mensaje de error de login */}
                <p className="email-error" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                  {loginError || '\u00A0'}
                </p>
>>>>>>> main
              </div>
            </form>
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
