
import React, { useState, useRef } from "react";

function DropdownMenu({ navigate }: { navigate: (path: string) => void }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const timeoutRef = useRef<number | null>(null);

  const handleLogout = () => {
    // Limpiar todo el storage
    localStorage.clear();
    sessionStorage.clear();
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
    <div 
      className="inline-block text-left" 
      ref={menuRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors text-white font-semibold px-6 py-2 rounded-full shadow-md focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
      >
        Mi cuenta
        <svg className="inline ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200 py-1">
          <button
            onClick={() => { setOpen(false); navigate("/edit-profile"); }}
            className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
          >
            Editar perfil
          </button>
          <button
            onClick={() => { setOpen(false); navigate("/Proyectos"); }}
            className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
          >
            Proyectos
          </button>
          <button
            onClick={() => { setOpen(false); navigate("/Perfil"); }}
            className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
          >
            Perfil
          </button>
          <div className="border-t border-gray-200 my-1"></div>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
import { useNavigate } from "react-router-dom";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileLogout = () => {
    // Limpiar todo el storage
    localStorage.clear();
    sessionStorage.clear();
    // Redireccionar al landing
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-[#9ab05f] px-4 md:px-10 py-3 md:py-5 min-h-[70px] md:min-h-[90px] shadow-lg z-50">
      <div className="flex items-center justify-between relative h-full">
        {/* Logo (Matcha funding) - Más pequeño en móvil */}
        <div className="z-20">
          <span
            className="text-white font-extrabold text-3xl tracking-wider transition cursor-pointer"
            onClick={() => navigate("/Home-i")}
          >
            <img
              src="/logo1.png"
              alt="logo"
              className="w-48 md:w-64 h-auto self-center shadow-lg rounded-full"
            />
          </span>
        </div>

        {/* Desktop Navigation - Oculto en móvil */}
        <nav className="hidden md:flex items-center gap-8 z-30 absolute left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => navigate("/free-search")}
            className="text-white font-semibold px-6 py-2 rounded-full hover:bg-white/20 transition-colors"
          >
            Búsqueda libre
          </button>
          <button
            onClick={() => navigate("/Matcha/New-idea")}
            className="text-white font-semibold px-6 py-2 rounded-full hover:bg-white/20 transition-colors"
          >
            Generar Idea
          </button>
          <button
            onClick={() => navigate("/Matcha/Nuevo-proyecto")}
            className="text-white font-semibold px-6 py-2 rounded-full hover:bg-white/20 transition-colors"
          >
            Generar Proyecto
          </button>
          <button
            onClick={() => navigate("/Matcha/My-projects")}
            className="text-white font-semibold px-6 py-2 rounded-full hover:bg-white/20 transition-colors"
          >
            Match histórico
          </button>
          <button
            onClick={() => navigate("/Matcha/Select-Project")}
            className="text-white font-semibold px-6 py-2 rounded-full hover:bg-white/20 transition-colors"
          >
            Match fondos
          </button>
        </nav>

        {/* Desktop Dropdown Mi cuenta - Oculto en móvil */}
        <div className="hidden md:block z-20">
          <DropdownMenu navigate={navigate} />
        </div>

        {/* Mobile Menu Button - Solo visible en móvil */}
        <div className="md:hidden z-20">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors text-white font-semibold p-2 rounded-full shadow-md focus:outline-none flex items-center justify-center"
          >
            <img 
              src="/svgs/menu-line.svg" 
              alt="Menu" 
              className="w-5 h-5 filter brightness-0 invert"
            />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#9ab05f] shadow-lg z-40">
          <div className="px-6 py-4 space-y-1">
            {/* Título del menú móvil */}
            <div className="text-white font-bold text-lg mb-4 border-b border-white/20 pb-2">
              Menú principal
            </div>
            
            {/* Navegación móvil */}
            <button
              onClick={() => {
                navigate("/free-search");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-white font-semibold px-4 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Búsqueda libre
            </button>
            <button
              onClick={() => {
                navigate("/Matcha/New-idea");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-white font-semibold px-4 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Generar Idea
            </button>
            <button
              onClick={() => {
                navigate("/Matcha/Nuevo-proyecto");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-white font-semibold px-4 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Generar Proyecto
            </button>
            <button
              onClick={() => {
                navigate("/Matcha/My-projects");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-white font-semibold px-4 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Match histórico
            </button>
            <button
              onClick={() => {
                navigate("/Matcha/Select-Project");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-white font-semibold px-4 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Match fondos
            </button>

            {/* Divisor */}
            <div className="border-t border-white/20 my-3"></div>

            {/* Opciones que antes estaban en "Mi cuenta" */}
            <button
              onClick={() => {
                navigate("/edit-profile");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-white font-semibold px-4 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Editar perfil
            </button>
            <button
              onClick={() => {
                navigate("/Proyectos");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-white font-semibold px-4 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Proyectos
            </button>
            <button
              onClick={() => {
                navigate("/Perfil");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-white font-semibold px-4 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Perfil
            </button>
            
            {/* Divisor antes del logout */}
            <div className="border-t border-white/20 my-3"></div>
            
            <button
              onClick={handleMobileLogout}
              className="block w-full text-left text-red-200 font-semibold px-4 py-3 rounded-lg hover:bg-red-600/30 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </header>
    );
  };

export default NavBar;
