import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isMatchaRoute = location.pathname.toLowerCase().startsWith("/matcha");

  const navTitles: Record<string, { title: string; subtitle: string }> = {
    "/Home-i": {
      title: "Menú Principal",
      subtitle: "Busca fondos de forma inteligente y personalizada",
    },
    "/Proyectos": {
      title: "Mis Proyectos",
      subtitle: "Gestiona y visualiza tus proyectos financiados",
    },
    "/Perfil": {
      title: "Mi Perfil",
      subtitle: "Actualiza tu información y configuración personal",
    },
  };

  const currentNav = isMatchaRoute
    ? { title: "MATCH", subtitle: "Gestiona tus ideas y proyectos" }
    : navTitles[location.pathname] || navTitles["/Home-i"];

  const orderedRoutes = ["/Home-i", "/Proyectos", "/Perfil"];
  const currentIndex = orderedRoutes.findIndex((r) => r === location.pathname);

  const navigateTo = (direction: "next" | "prev") => {
    if (currentIndex === -1) {
      navigate("/Home-i");
      return;
    }
    let nextIndex =
      direction === "next"
        ? (currentIndex + 1) % orderedRoutes.length
        : (currentIndex - 1 + orderedRoutes.length) % orderedRoutes.length;

    navigate(orderedRoutes[nextIndex]);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-[#9ab05f] px-10 py-5 shadow-lg z-50">
      <div className="flex items-center justify-between relative">
        <div className="flex-1 text-left z-20">
          <span
            className="text-white font-extrabold text-3xl tracking-wider hover:opacity-90 transition cursor-pointer"
            onClick={() => navigate("/Home-i")}
          >
            <img
              src="/logo1.png"
              alt="logo"
              className="w-[25%] h-auto self-center shadow-lg rounded-full"
            />
          </span>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-5 z-10">
          {!isMatchaRoute && (
            <>
              <button
                onClick={() => navigateTo("prev")}
                className="flex items-center justify-center p-4 rounded-full hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-10 h-10 text-white" />
              </button>

              <div className="text-center">
                <span className="block text-white font-bold text-xl sm:text-2xl">
                  {currentNav.title}
                </span>
                <span className="block text-white/90 text-sm sm:text-base font-light">
                  {currentNav.subtitle}
                </span>
              </div>

              <button
                onClick={() => navigateTo("next")}
                className="flex items-center justify-center p-4 rounded-full hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-10 h-10 text-white" />
              </button>
            </>
          )}

          {isMatchaRoute && (
            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="block text-white font-bold text-xl sm:text-2xl">
                  {currentNav.title}
                </span>
                <span className="block text-white/90 text-sm sm:text-base font-light">
                  {currentNav.subtitle}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 text-right relative z-20 space-x-3">
          {isMatchaRoute && (
            <button
              onClick={() => navigate("/Home-i")}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors text-white font-semibold rounded-full shadow-md"
            >
              Volver al Menú
            </button>
          )}
          <button
            onClick={() => navigate("/Perfil")}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors text-white font-semibold px-6 py-2 rounded-full shadow-md"
          >
            Mi cuenta
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
