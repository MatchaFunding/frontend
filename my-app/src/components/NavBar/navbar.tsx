
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

//Generar dropdown
function GenerarDropdown({ navigate }: { navigate: (path: string) => void }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const timeoutRef = useRef<number | null>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !(menuRef.current as any).contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className="text-white font-semibold px-6 py-2 rounded-full hover:bg-white/20 transition-colors flex items-center">
        Crear
        <svg className="inline ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200 py-1">
          <button onClick={() => { setOpen(false); navigate("/Matcha/New-idea"); }} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200">
            Crear una idea con IA
          </button>
          <button onClick={() => { setOpen(false); navigate("/Matcha/Nuevo-proyecto"); }} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200">
            Crear un proyecto
          </button>
        </div>
      )}
    </div>
  );
}

//Match dropdown
function MatchDropdown({ navigate }: { navigate: (path: string) => void }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const timeoutRef = useRef<number | null>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !(menuRef.current as any).contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className="text-white font-semibold px-6 py-2 rounded-full hover:bg-white/20 transition-colors flex items-center">
        Match
        <svg className="inline ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200 py-1">
          <button onClick={() => { setOpen(false); navigate("/Matcha/Select-Project"); }} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200">
            Buscar match con fondos
          </button>
          <button onClick={() => { setOpen(false); navigate("/Matcha/My-projects"); }} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200">
            Buscar match con proyectos
          </button>
        </div>
      )}
    </div>
  );
}

//Premium dropdown
function PremiumDropdown({ navigate }: { navigate: (path: string) => void }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const timeoutRef = useRef<number | null>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !(menuRef.current as any).contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className="text-white font-semibold px-6 py-2 rounded-full hover:bg-white/20 transition-colors flex items-center">
        Premium
        <svg className="inline ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200 py-1">
          <button onClick={() => { setOpen(false); navigate("/premium/fine-tuning"); }} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200">
            Acceder Fine Tuning
          </button>
          <button onClick={() => { setOpen(false); navigate("/premium/rag"); }} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200">
            Acceder RAG
          </button>
        </div>
      )}
    </div>
  );
}

//Mi cuenta dopdown
function DropdownMenu({ navigate }: { navigate: (path: string) => void }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const timeoutRef = useRef<number | null>(null);

  //Logout 
  const handleLogout = () => {
    localStorage.clear();
    localStorage.clear();
    navigate("/");
    setOpen(false);
  };

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !(menuRef.current as any).contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  return (
    <div className="inline-block text-left" ref={menuRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button 
        className="backdrop-blur-sm text-white font-semibold px-6 py-2 rounded-full shadow-md focus:outline-none transition-all duration-[600ms] ease-in-out"
        style={{ background: 'linear-gradient(to right, #44624a 0%, #8ba888 50%, #44624a 100%)', backgroundSize: '200% 100%', backgroundPosition: open ? '100% 0%' : '0% 0%'}}
        onClick={() => setOpen((prev) => !prev)}>
        Mi cuenta
        <svg className="inline ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200 py-1">
          {/* <button onClick={() => { setOpen(false); navigate("/edit-Myprofile"); }} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200">
            Editar perfil
          </button>

         <button onClick={() => { setOpen(false); navigate("/edit-profileE"); }} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200">
            Editar empresa
          </button>   */}

          <button onClick={() => { setOpen(false); navigate("/Proyectos"); }} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200">
            Ideas y proyectos
          </button>
          <button onClick={() => { setOpen(false); navigate("/Perfil"); }} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200">
            Perfil
          </button>
          <div className="border-t border-gray-200 my-1"></div>
          <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200">
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileGenerarOpen, setMobileGenerarOpen] = useState(false);
  const [mobileMatchOpen, setMobileMatchOpen] = useState(false);
  const [mobilePremiumOpen, setMobilePremiumOpen] = useState(false);

  const handleMobileLogout = () => {
    localStorage.clear();
    localStorage.clear();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-[#44624a] px-4 md:px-10 py-3 md:py-5 min-h-[70px] md:min-h-[90px] shadow-md z-50">
      <div className="flex items-center justify-between relative h-full">
        {/* Logo MatchaFunding */}
        <div className="z-20">
          <span className="text-white font-extrabold text-3xl tracking-wider transition cursor-pointer" onClick={() => navigate("/Home-i")}>
            <img src="/svgs/boton-home.svg" alt="logo" className="w-48 md:w-64 h-auto self-center shadow-lg rounded-full transition-transform hover:scale-105"/>
          </span>
        </div>

        {/* Navegación */}
        <nav className="hidden md:flex items-center justify-center gap-12 z-30 absolute left-1/2 transform -translate-x-1/2">
          <button onClick={() => navigate("/free-search")} className="text-white font-semibold px-6 py-2 rounded-full hover:bg-white/20 transition-colors">
            Búsqueda libre
          </button>
          <GenerarDropdown navigate={navigate} />
          <MatchDropdown navigate={navigate} />
          <PremiumDropdown navigate={navigate} />
        </nav>

        {/*Mi cuenta */}
        <div className="hidden md:block z-20">
          <DropdownMenu navigate={navigate} />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden z-20">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors text-white font-semibold p-2 rounded-full shadow-md focus:outline-none flex items-center justify-center">
            <img src="/svgs/menu-line.svg" alt="Menu" className="w-5 h-5 filter brightness-0 invert" />
          </button>
        </div>
      </div>

      {/* Mobile Version */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#44624a] shadow-lg z-40">
          <div className="px-6 py-4 space-y-1">
            <button onClick={() => { navigate("/free-search"); setIsMobileMenuOpen(false); }} className="block w-full text-left text-white font-semibold px-4 py-3 rounded-lg hover:bg-white/20 transition-colors">
              Búsqueda libre
            </button>
            
            {/* Generar dropdown móvil */}
            <div>
              <button onClick={() => setMobileGenerarOpen(!mobileGenerarOpen)} className="block w-full text-left text-white font-semibold px-4 py-3 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-between">
                Generar
                <svg className={`w-4 h-4 transition-transform ${mobileGenerarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileGenerarOpen && (
                <div className="pl-4 space-y-1">
                  <button onClick={() => {navigate("/Matcha/New-idea"); setIsMobileMenuOpen(false); setMobileGenerarOpen(false);}} className="block w-full text-left text-white/90 font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                    Crear Idea con IA
                  </button>
                  <button onClick={() => {navigate("/Matcha/Nuevo-proyecto"); setIsMobileMenuOpen(false); setMobileGenerarOpen(false);}} className="block w-full text-left text-white/90 font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                    Crear Proyecto
                  </button>
                </div>
              )}
            </div>

            {/* Match dropdown móvil */}
            <div>
              <button onClick={() => setMobileMatchOpen(!mobileMatchOpen)} className="block w-full text-left text-white font-semibold px-4 py-3 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-between">
                Match
                <svg className={`w-4 h-4 transition-transform ${mobileMatchOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileMatchOpen && (
                <div className="pl-4 space-y-1">
                  <button onClick={() => {navigate("/Matcha/Select-Project"); setIsMobileMenuOpen(false); setMobileMatchOpen(false);}} className="block w-full text-left text-white/90 font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                    Match con Fondos
                  </button>
                  <button onClick={() => {navigate("/Matcha/My-projects"); setIsMobileMenuOpen(false); setMobileMatchOpen(false);}} className="block w-full text-left text-white/90 font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                    Match con Proyectos
                  </button>
                </div>
              )}
            </div>

            {/* Premium dropdown móvil */}
            <div>
              <button onClick={() => setMobilePremiumOpen(!mobilePremiumOpen)} className="block w-full text-left text-white font-semibold px-4 py-3 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-between">
                Premium
                <svg className={`w-4 h-4 transition-transform ${mobilePremiumOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobilePremiumOpen && (
                <div className="pl-4 space-y-1">
                  <button onClick={() => {navigate("/premium/fine-tuning"); setIsMobileMenuOpen(false); setMobilePremiumOpen(false);}} className="block w-full text-left text-white/90 font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                    Acceder Fine Tuning
                  </button>
                  <button onClick={() => {navigate("/premium/rag"); setIsMobileMenuOpen(false); setMobilePremiumOpen(false);}} className="block w-full text-left text-white/90 font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                    Acceder RAG
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-white/20 my-2"></div>
            <button onClick={() => {navigate("/Proyectos"); setIsMobileMenuOpen(false);}} className="block w-full text-left text-white font-semibold px-4 py-3 rounded-lg hover:bg-white/20 transition-colors">
              Ideas y proyectos
            </button>
            <button onClick={() => {navigate("/Perfil"); setIsMobileMenuOpen(false);}} className="block w-full text-left text-white font-semibold px-4 py-3 rounded-lg hover:bg-white/20 transition-colors">
              Perfil
            </button>
            <button onClick={handleMobileLogout} className="block w-full text-left text-red-200 font-semibold px-4 py-3 rounded-lg hover:bg-red-600/30 transition-colors">
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </header>
    );
  };

export default NavBar;
