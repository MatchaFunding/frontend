import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img 
    src="/svgs/menu-line.svg" 
    alt="Menu"
    className={`${className || "w-6 h-6"} filter brightness-0 invert`}
  />
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className || "w-6 h-6"}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
{/*
  const navLinks = [
    { href: '#productos', label: 'Planes' },
    { href: '#mas-informacion', label: 'Más información' },
    { href: '#seguridad', label: 'Confiabilidad' },
    { href: '#asistencia', label: 'Asistencia' },
    { href: '#descarga', label: 'App' },
  ]; */}

  return (
    <nav className="b-transparent text-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-full bg-white ">
        
         
            </div>
            <div className="ml-3">
              <a href="/" className="text-xl sm:text-2xl font-bold tracking-tight">
                MatchaFunding
              </a>
            </div>
          </div>

          {/*

          <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium hover:opacity-[90%] hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>*/}

          {/* Sección Derecha: Idioma, Registrarse e Iniciar Sesión */}
          <div className="hidden md:flex items-center space-x-4">
            {/*<button className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors">
              <GlobeIcon className="w-5 h-5 mr-1" />
              Idioma
            </button> */}
            <Link
              to="/signup"
              className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              Registrarse
            </Link>
            <Link
              to="/login"
              className="text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              Iniciar sesión
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none outline-none border-none"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#44624a] shadow-lg" id="mobile-menu">
          <div className="px-4 py-3 space-y-3">
            <Link
              to="/signup"
              className="block w-full text-center bg-white text-gray-900 px-4 py-3 rounded-full text-base font-semibold hover:bg-gray-200 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Registrarse
            </Link>
            <Link
              to="/login"
              className="block w-full text-center border-2 border-white text-white px-4 py-3 rounded-full text-base font-semibold hover:bg-white hover:text-gray-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};






const LandingPageTailwind: React.FC = () => {
  return (
    <div className="font-sans text-gray-800 min-h-screen bg-[#f1ebe1]">
      <Navbar />
      <section className="bg-[#44624a] text-white pt-20 pb-32 md:pt-28 md:pb-40 px-5 relative overflow-hidden"
        style={{ borderBottomLeftRadius: '50% 40px', borderBottomRightRadius: '50% 40px' }}
      >
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <div className="md:w-1/2 lg:w-2/5 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5">
              Encuentra tu Perfect Match
            </h1>
            <p className="text-base sm:text-lg mb-8 opacity-90">La guía que necesitas</p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-5">
              <Link to="/signup">
                <button className="bg-gradient-to-r from-[#44624a] to-[#8ba888] hover:from-[#8ba888] hover:to-[#44624a] text-white py-3 px-8 rounded-full text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto">
                  Comencemos
                </button>
              </Link>
            </div>
          </div>

          <div className="md:w-1/2 lg:w-3/5 relative flex justify-center items-center mt-10 md:mt-0 min-h-[300px]">
            <img
              src="Matchitoestudioso.png"
              alt="Happy couple"
              className="max-w-full h-auto max-h-[350px] md:max-h-[400px] rounded-2xl shadow-2xl z-10 object-cover z-10 
                 transform -rotate-6 
                 -translate-x-10 md:-translate-x-16  /* Ajusta este valor para el solapamiento */
                 hover:scale-105 transition-transform duration-300"
            />
            <img
              src="fonditocorazon.png"
              alt="Happy couple"
              className="max-w-full h-auto max-h-[350px] md:max-h-[400px] rounded-2xl shadow-2xl z-10 object-cover   z-20 
                 transform rotate-6 
                 translate-x-10 md:translate-x-16  /* Ajusta este valor para el solapamiento */
                 hover:scale-105 transition-transform duration-300"
            />
       
           
          
          </div>
        </div>
      </section>

  
      <section className="py-16 md:py-24 px-5 bg-[#f1ebe1] relative">
       
        <div className="container mx-auto max-w-4xl relative mt-12 md:mt-0">
          <div className="hidden md:block absolute top-[-40px] left-[15%] w-[70%] h-[50px] z-0">
            <div className="w-full h-full border-t-2 border-dashed border-blue-400 rounded-t-[100px]"></div>
          </div>

          <div className="flex flex-col md:flex-row justify-around items-start md:items-center gap-10 md:gap-0 relative z-10">
            {/* Feature 1 */}
            <div className="flex-1 max-w-xs mx-auto text-center p-5">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-500 flex justify-center items-center mx-auto mb-5 text-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M18 18a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72M6 18.719a6.062 6.062 0 01-.963-1.584M15.75 9v3.205M6.75 9v3.205" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Conoce los fondos disponibles</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Explora las opciones que se ajustan a tu perfil y necesidades.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex-1 max-w-xs mx-auto text-center p-6 bg-white rounded-xl shadow-xl md:-translate-y-8 transform transition-transform duration-300 hover:scale-105">
              <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-500 flex justify-center items-center mx-auto mb-5 text-2xl">
                💡
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Recibe recomendaciones</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Nuestro sistema inteligente te ayuda a encontrar el match perfecto.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex-1 max-w-xs mx-auto text-center p-5">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-500 flex justify-center items-center mx-auto mb-5 text-2xl">
                ✅
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Aplica fácilmente</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Una vez que encuentres tu opción ideal, completa el proceso en pocos pasos.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPageTailwind;
