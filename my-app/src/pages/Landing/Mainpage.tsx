import React from 'react';
//import React, { useEffect } from 'react';
import NavBar from '../../components/NavBar/navbar';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faWrench, faEquals } from "@fortawesome/free-solid-svg-icons";

const MatchaHomePage: React.FC = () => {
  const navigate = useNavigate();
  const colors = {
  darkGreen: "#44624a",
  softGreen: "#8ba888",
};

  /*
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
  }, []);
  */

  return (
  <div className="bg-slate-50 min-h-screen flex flex-col">
    <NavBar />
   <main className="flex-grow p-2 md:p-4 lg:p-8 w-full pt-28 sm:pt-32 md:pt-20 lg:pt-20 xl:pt-24 flex justify-center items-center">
  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-12 w-full max-w-none px-4 py-2">
   <div
      onClick={() => navigate("/Matcha/Select-Idea")}
      className="lg:col-span-3 bg-white p-4 lg:p-8 rounded-2xl shadow-lg flex flex-col justify-between cursor-pointer hover:shadow-2xl transition-shadow w-full min-h-[400px] lg:min-h-[600px]"
    >
      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12 h-full w-full">
    
        <div className="w-full lg:w-1/2 flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 md:gap-6">
          <div className="text flex-1 md:flex-none text-left md:text-center px-2 mb-0 md:mb-2 lg:mb-6">
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-gray-500">Haz</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-black tracking-tighter">
              Match
            </h1>
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-gray-500 block">
              con un fondo
            </span>
          </div>
          <img
            src="./Tevolador.png"
            alt="Taza de matcha colgando"
            className="w-24 sm:w-28 md:w-36 lg:w-52 h-auto object-contain shadow-lg rounded-full flex-shrink-0 mt-0 md:mt-1 lg:mt-0"
          />
        </div>

       
        <div className="w-full lg:w-1/2 space-y-3 lg:space-y-8 mt-3 lg:mt-0">
     
          <div className="flex items-start gap-4">
            <FontAwesomeIcon
              icon={faLightbulb}
              size="lg"
              className="mt-1 md:hidden"
              style={{ color: colors.softGreen }}
            />
            <FontAwesomeIcon
              icon={faLightbulb}
              size="2x"
              className="mt-1 hidden md:block"
              style={{ color: colors.softGreen }}
            />
            <div>
              <span className="text-lg block font-semibold text-[#44624a]">
                ¿Tienes una idea?
              </span>
              <p className="text-gray-600 mt-2 text-sm lg:text-base">
                Convierte esa idea inicial en un proyecto real y estructurado a
                través de la Inteligencia Artificial.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FontAwesomeIcon
              icon={faWrench}
              size="lg"
              className="mt-1 md:hidden"
              style={{ color: colors.softGreen }}
            />
            <FontAwesomeIcon
              icon={faWrench}
              size="2x"
              className="mt-1 hidden md:block"
              style={{ color: colors.softGreen }}
            />
            <div>
              <span className="text-lg block font-semibold text-[#44624a]">
                Construye tu proyecto
              </span>
              <p className="text-gray-600 mt-2 text-sm lg:text-base">
                Si ya tienes una idea clara, te guiamos paso a paso para
                transformarla en un proyecto sólido.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FontAwesomeIcon
              icon={faEquals}
              size="lg"
              className="mt-1 md:hidden"
              style={{ color: colors.softGreen }}
            />
            <FontAwesomeIcon
              icon={faEquals}
              size="2x"
              className="mt-1 hidden md:block"
              style={{ color: colors.softGreen }}
            />
            <div>
              <span className="text-lg block font-semibold text-[#44624a]">
                Encuentra tu fondo ideal
              </span>
              <p className="text-gray-600 mt-2 text-sm lg:text-base">
                Compara tu idea o proyecto con las distintas oportunidades de
                financiamiento abiertas actualmente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div 
      className="lg:col-span-2 flex flex-col gap-6 md:gap-8 lg:gap-12 w-full"
      >
      <div 
        className="bg-white p-6 rounded-2xl shadow-lg flex items-center cursor-pointer hover:shadow-2xl transition-shadow min-h-[240px] lg:min-h-[280px] w-full"
        onClick={() => navigate("/premium")}
        >
          <div className="flex-shrink-0 mr-4">
            <img 
              src="./premium-icon.jpg"
              alt="Servicios Premium"
              className="w-32 h-32 lg:w-36 lg:h-36 object-cover rounded-full shadow-lg" 
            />
          </div>
          <div className="flex-1 min-w-0"> 
            <span className="text-gray-500 text-lg">¡Desbloquea todo tu potencial!</span>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-black">Premium</h2>
            <p className="text-gray-600 mt-3 text-sm lg:text-base leading-relaxed">
             ¡Estás a un paso de acceder a nuestras herramientas más poderosas! Con el plan Premium, tu asistente se vuelve más inteligente y personalizado.
            </p>
          </div>
        </div>
      <div 
        onClick={() => navigate("/free-search")}
        className="bg-white p-6 rounded-2xl shadow-lg flex items-center cursor-pointer hover:shadow-2xl transition-shadow min-h-[240px] lg:min-h-[280px] w-full"
        >
        <div className="flex-1 min-w-0 mr-4">
          <span className="text-gray-500 text-lg">Busca</span>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-black">Fondos</h2>
          <span className="text-gray-500 text-lg">en un mismo lugar</span>
          <p className="text-gray-600 mt-3 text-sm lg:text-base leading-relaxed">
          Explora en un solo lugar fondos públicos y privados en Chile (CORFO, ANID, fondos.gob), siempre actualizados y listos para filtrar sin recorrer varias plataformas.

          </p>
        </div>
        <div className="flex-shrink-0">
        <img 
            src="./fondito.png"
            alt="Buscar fondos"
            className="w-32 h-32 lg:w-36 lg:h-36 object-cover rounded-full shadow-lg" 
          />
        </div>
      </div>
    </div>
  </div>
</main>
    </div>
  );
};

export default MatchaHomePage;