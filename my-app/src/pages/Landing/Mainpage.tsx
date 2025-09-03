import React from 'react';
//import React, { useEffect } from 'react';
import NavBar from '../../components/NavBar/navbar';
import { useNavigate } from 'react-router-dom';

const MatchaHomePage: React.FC = () => {
  const navigate = useNavigate();

  /*
  useEffect(() => {
    const storedUser = sessionStorage.getItem('usuario');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Datos del usuario cargados desde sessionStorage:', parsedUser);
      } 
      catch (error) {
        console.error('Error al parsear datos del usuario desde sessionStorage:', error);
      }
    } else {
      console.log('No se encontraron datos de usuario en sessionStorage');
    }
  }, []);
  */

  return (
  <div className="bg-slate-50 min-h-screen flex flex-col">
    <NavBar />
   <main className="flex-grow p-4 md:p-6 lg:p-8 w-full mt-[3%] flex justify-center items-center">
  <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 w-full max-w-none px-4 py-2">
    <div
      onClick={() => navigate("/Matcha/Select-Idea")}
      className="lg:col-span-3 bg-white p-8 rounded-2xl shadow-lg flex flex-col justify-between cursor-pointer hover:shadow-2xl transition-shadow w-full min-h-[500px] lg:min-h-[600px]"
    >
      <div className="flex items-center gap-6 h-full w-full">
        <div className="w-3/5 space-y-6">
          <div>
            <span className="text-gray-500 text-xl lg:text-2xl">Haz</span>
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold text-black tracking-tighter">Match</h1>
            <span className="text-gray-500 text-xl lg:text-2xl block">con un fondo</span>
          </div>
            
          <div>
            <span className="text-gray-500 text-lg block font-medium">
            ¿Tienes una idea?
            </span>
            <p className="text-gray-600 mt-2 text-sm lg:text-base">
                Convierte esa idea inicial en un proyecto real y estructurado a través de la 
                Inteligencia Artificial
            </p>
          </div>
          
          <div>
            <span className="text-gray-500 text-lg block font-medium">
            Construye tu proyecto
            </span>
            <p className="text-gray-600 mt-2 text-sm lg:text-base">
                Si ya tienes una idea clara, te guiamos paso a paso para transformarla en un
                proyecto sólido.
            </p>
          </div>
          
          <div>
            <span className="text-gray-500 text-lg block font-medium">
            Encuentra tu fondo ideal
            </span>
            <p className="text-gray-600 mt-2 text-sm lg:text-base">
                Compara tu idea o proyecto con las distintas oportunidades de financiamiento 
                abiertas actualmente.
            </p>
          </div>
        </div>
        <div className="w-2/5 flex justify-center items-center">
          <img
            src="./Tevolador.png"
            alt="Taza de matcha colgando"
            className="w-full max-w-96 h-auto object-contain shadow-lg rounded-full"
          />
        </div>
      </div>
    </div>
    <div 
      className="lg:col-span-2 flex flex-col gap-12 w-full"
      >
      <div 
        className="bg-white p-6 rounded-2xl shadow-lg flex items-center cursor-pointer hover:shadow-2xl transition-shadow min-h-[240px] lg:min-h-[280px] w-full"
        onClick={() => navigate("/Perfil")}
        >
          <div className="flex-shrink-0 mr-4">
            <img 
              src="./image.png"
              alt="Mejora tu perfil"
              className="w-32 h-32 lg:w-36 lg:h-36 object-cover rounded-full shadow-lg" 
            />
          </div>
          <div className="flex-1 min-w-0"> 
            <span className="text-gray-500 text-lg">Mejora tu</span>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-black">Perfil</h2>
            <p className="text-gray-600 mt-3 text-sm lg:text-base leading-relaxed">
              Optimiza tus posibilidades de éxito con ayuda de inteligencia artificial. Esta herramienta analiza tu perfil y te entrega
              recomendaciones personalizadas para potenciar tus puntos fuertes y mejorar los débiles. Así, aumentas las probabilidades de
              adjudicarte un fondo o beneficio cuando postules.
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
            Accede a una base de datos completa y siempre actualizada de fondos públicos y privados disponibles en Chile,
            incluyendo CORFO, ANID y fondos.gob. Aquí puedes explorar y filtrar libremente todas las convocatorias abiertas
            sin tener que visitar múltiples plataformas.
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