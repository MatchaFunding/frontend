import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mapInstrumentsToCards } from '../free-search/free-search';
import { useState, useEffect, useMemo } from 'react';
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import VerTodosLosInstrumentos from '../../api/VerTodosLosInstrumentos.tsx';
import FreeSearchCard from '../../components/free-search-card/free-search-card.tsx';
import NavBar from '../../components/NavBar/navbar';
import React from 'react';

const MatchaHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [userSexo, setUserSexo] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const instrumentos = VerTodosLosInstrumentos();
  const initialized = false;
  
  // Detectar si es móvil/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1400);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Seleccionar 10 fondos aleatorios
  const randomFondos = useMemo(() => {
    if (instrumentos.length === 0)
      return [];
    const shuffled = [...instrumentos].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10);
    return mapInstrumentsToCards(selected);
  }, [instrumentos]);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Datos del usuario cargados desde localStorage:', parsedUser);
      } 
      catch (error) {
        console.error('Error al parsear datos del usuario desde localStorage:', error);
      }
    } else {
      console.log('No se encontraron datos de usuario en localStorage');
    }
  }, [randomFondos.length, initialized]);

  // Cargar datos de la persona del usuario
  useEffect(() => {
    const fetchUserPersona = async () => {
      const storedUser = sessionStorage.getItem("usuario");
      if (!storedUser)
        return;
      try {
        const datos = JSON.parse(storedUser);
        const miembros = datos.Miembros;
        const persona = miembros[0];
        if (persona) {
          setUserName(persona.Nombre || "Usuario");
          setUserSexo(persona.Sexo || "");
        }
      }
      catch (error) {
        console.error('Error al cargar datos de la persona:', error);
      }
    };

    fetchUserPersona();
  }, []);

  const handleNext = () => {
    if (isAnimating || randomFondos.length === 0)
      return;
    setIsAnimating(true);
    // En responsive avanza de 1, en desktop de 2
    const step = isMobile ? 1 : 2;
    setCurrentIndex((prevIndex) => prevIndex + step);
  };

  const handlePrev = () => {
    if (isAnimating || randomFondos.length === 0)
      return;
    setIsAnimating(true);
    // En responsive retrocede de 1, en desktop de 2
    const step = isMobile ? 1 : 2;
    setCurrentIndex((prevIndex) => prevIndex - step);
  };

  // Manejar el fin de la transición
  const handleTransitionEnd = () => {
    if (!isAnimating)
      return;
    
    setIsAnimating(false);
    if (currentIndex >= randomFondos.length * 2) {
      const newIndex = currentIndex - randomFondos.length;
      setCurrentIndex(newIndex);
    }
    else if (currentIndex < randomFondos.length) {
      const newIndex = currentIndex + randomFondos.length;
      setCurrentIndex(newIndex);
    }
  };

  return (
  <div className="bg-slate-50 flex flex-col min-h-screen">
    <NavBar />
   <main className="flex-1 flex flex-col w-full pt-20 sm:pt-24 md:pt-32 lg:pt-32 xl:pt-36 overflow-y-auto">
  
  {/* Contenedor principal con flex-col y justify-between - Altura exacta de viewport */}
  <div className="flex flex-col justify-between p-2 md:p-4 lg:p-8 h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] lg:h-[calc(100vh-8rem)] xl:h-[calc(100vh-9rem)] flex-shrink-0">
    
    {/* Sección superior: Saludo + Banner (ocupa el espacio restante) */}
    <div className="flex-1 flex flex-col gap-4 md:gap-6 min-h-0">
      
      {/* Saludo personalizado */}
      {userName && (
        <div className="w-full max-w-none px-4 flex-shrink-0">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-black text-center">
            {userSexo === "Hombre" ? "Bienvenido" : userSexo === "Mujer" ? "Bienvenida" : "Bienvenide"} a MatchaFunding, {userName}
          </h2>
        </div>
      )}

      {/* Banner que ocupa el espacio restante */}
      <div className="w-full max-w-none px-4 flex-1 min-h-0 flex">
        <div className="rounded-2xl shadow-lg w-full h-full bg-white flex items-center justify-center overflow-hidden">
          <img 
            src="/svgs/banner.svg" 
            alt="Banner MatchaFunding" 
            className="w-full h-full object-contain p-2 md:p-4"
          />
        </div>
      </div>
    </div>

    {/* Botones principales - En la parte inferior sin scroll */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 w-full max-w-none px-4 py-2 flex-shrink-0">
   <div
      onClick={() => navigate("/Matcha/Select-Idea")}
      className="bg-white rounded-2xl shadow-lg flex flex-col cursor-pointer hover:shadow-2xl transition-shadow w-full overflow-hidden"
      style={{ display: 'grid', gridTemplateRows: '80px 1fr' }}
    >
      <div className="bg-[#f9f2de] flex items-center justify-center">
        <img
          src="./buscando.png"
          alt="Taza de matcha colgando"
          className="w-16 h-16 lg:w-20 lg:h-20 object-contain rounded-full"
        />
      </div>
      <div className="px-4 py-3 flex flex-col">
        <h1 className="text-xl lg:text-2xl font-semibold text-black tracking-tighter text-center mb-2">
          Crea y busca un Match
        </h1>
        <p className="text-gray-600 text-xs leading-relaxed line-clamp-4">
          Transforma tu idea en un proyecto sólido y estructurado. Nuestra inteligencia artificial convertirá tu idea en un plan de acción detallado. Además, podrás comparar tu proyecto con otros similares para identificar tus fortalezas y, finalmente, conectar con el fondo de financiamiento ideal que mejor se adapta a tus necesidades.
        </p>
      </div>
    </div>

    <div 
      onClick={() => navigate("/free-search")}
      className="bg-white rounded-2xl shadow-lg flex flex-col cursor-pointer hover:shadow-2xl transition-shadow w-full overflow-hidden"
      style={{ display: 'grid', gridTemplateRows: '80px 1fr' }}
    >
      <div className="bg-[#f8e9cf] flex items-center justify-center">
        <img 
          src="./fondito.png"
          alt="Buscar fondos"
          className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-full" 
        />
      </div>
      <div className="px-4 py-3 flex flex-col">
        <h2 className="text-xl lg:text-2xl font-semibold text-black text-center mb-2">Busca fondos y proyectos</h2>
        <p className="text-gray-600 text-xs leading-relaxed line-clamp-4">
          Explora manualmente, todo en un solo lugar, tanto la totalidad de fondos públicos y privados disponibles en Chile como los proyectos que ya han resultado ganadores. Mantenemos toda esta valiosa información siempre actualizada por ti, para que puedas filtrar con precisión y encontrar exactamente lo que necesitas sin perder tiempo recorriendo y comparando múltiples plataformas.
        </p>
      </div>
    </div>

    <div 
      className="bg-white rounded-2xl shadow-lg flex flex-col cursor-pointer hover:shadow-2xl transition-shadow w-full overflow-hidden"
      onClick={() => navigate("/premium")}
      style={{ display: 'grid', gridTemplateRows: '80px 1fr' }}
    >
      <div className="bg-[#f5efdf] flex items-center justify-center">
        <img 
          src="./premium-icon.jpg"
          alt="Servicios Premium"
          className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-full" 
        />
      </div>
      <div className="px-4 py-3 flex flex-col">
        <h2 className="text-xl lg:text-2xl font-semibold text-black text-center mb-2">Accede a Premium</h2>
        <p className="text-gray-600 text-xs leading-relaxed line-clamp-4">
          ¡Estás a un paso de acceder a nuestras herramientas más poderosas! Con el plan Premium, tu asistente de IA evoluciona: se vuelve proactivo, más inteligente y profundamente personalizado. Aprenderá de los detalles de tu proyecto para entregarte alertas a medida, recomendaciones de optimización y oportunidades que ni siquiera sabías que existían.
        </p>
      </div>
    </div>
  </div>
  </div>

  {/* Carrusel de fondos aleatorios - Accesible con scroll */}
  {randomFondos.length > 0 && (
    <div className="w-full max-w-none px-4 py-8">
      <div className="mx-auto" style={{ maxWidth: '1600px' }}>
        <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-center text-black">
          Fondos destacados
        </h2>
        <div className="relative mx-auto flex items-center justify-center gap-8">
          {/* Botón anterior */}
          <button
            onClick={handlePrev}
            className="flex-shrink-0 bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg transition-all"
            aria-label="Anterior"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-[#44624a]" size="lg" />
          </button>

          {/* Contenedor de tarjetas */}
          <div 
            className="overflow-hidden relative" 
            style={{ 
              width: isMobile 
                ? 'calc(100vw - 100px)' 
                : 'calc(304px * 4 + 24px * 3)' 
            }}
          >
            <div 
              className="flex gap-6"
              onTransitionEnd={handleTransitionEnd}
              style={{ 
                transform: isMobile 
                  ? `translateX(calc(-${currentIndex} * (100vw - 160px + 24px)))`
                  : `translateX(calc(-${currentIndex} * (304px + 24px)))`,
                transition: isAnimating ? 'transform 0.5s ease-in-out' : 'none'
              }}
            >
              {randomFondos.concat(randomFondos).concat(randomFondos).map((card, idx) => (
                <div 
                  key={`carousel-${card.id}-${idx}`} 
                  className="flex-shrink-0"
                  style={{ 
                    width: isMobile ? 'calc(100vw - 160px)' : '304px',
                    boxShadow: 'none'
                  }}
                >
                  <FreeSearchCard
                      id={card.id}
                      title={card.title}
                      description={card.description}
                      topic={card.topic}
                      benefit={card.benefit}
                      image={card.image}
                      fechaApertura={card.fechaApertura}
                      fechaCierre={card.fechaCierre}
                      link={card.link}
                    />
                </div>
              ))}
            </div>
          </div>

          {/* Botón siguiente */}
          <button
            onClick={handleNext}
            className="flex-shrink-0 bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg transition-all"
            aria-label="Siguiente"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-[#44624a]" size="lg" />
          </button>
        </div>

        {/* Indicadores de posición */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: isMobile ? randomFondos.length : Math.ceil(randomFondos.length / 2) }).map((_, idx) => {
            // Normalizar el currentIndex al rango del array original
            const normalizedIndex = ((currentIndex % randomFondos.length) + randomFondos.length) % randomFondos.length;
            const step = isMobile ? 1 : 2;
            const activeIndex = Math.floor(normalizedIndex / step);
            
            return (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  activeIndex === idx 
                    ? 'w-8 bg-[#44624a]' 
                    : 'w-2 bg-gray-300'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  )}
  </main>
    </div>
  );
};

export default MatchaHomePage;