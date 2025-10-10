import React from 'react';
import NavBar from '../../components/NavBar/navbar';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/UI/cards';

const colorPalette = {
  darkGreen: '#44624a',
  softGreen: '#8ba888',
  oliveGray: '#505143',
  lightGray: '#f1f5f9',
};



const SelectIdea: React.FC = () => {
      const navigate = useNavigate();
    
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colorPalette.lightGray }}>
      <NavBar />

      <main className="flex-grow p-6 md:p-10 flex items-center justify-center pt-20 md:pt-24">
      
        <div className="flex flex-col lg:flex-row gap-8">

          <Card className="flex flex-col items-center p-8 max-w-sm text-center">
            <div className="flex-grow">
              <img src="/ideamatchito.png" alt="Ilustración de taza de té" className="hidden md:block w-30 h-auto mb-4 mx-auto" />
              <h2 className="text-2xl font-bold" style={{ color: colorPalette.oliveGray }}>
                ¿Tienes una idea?
              </h2>
              <p className="text-slate-600 mt-2 text-base mt-5">
                Aquí te ayudamos a convertir esa idea suelta en algo concreto. Inspírate, estructura y comienza a darle forma a tu proyecto desde cero.
              </p>
            </div>
            <button
              className="mt-5 font-bold py-3 px-8 rounded-2xl transition-transform transform hover:scale-105" 
              style={{ backgroundColor: '#c5d888', color: colorPalette.darkGreen }}
               onClick={() => navigate("/Matcha/New-idea")}
            >
              Generar Idea
            </button>
          </Card>

          <Card className="flex flex-col items-center p-8 max-w-sm text-center">
            <div className="flex-grow">
              <img src="/Tevolador.png" alt="Ilustración de taza de té" className="hidden md:block w-30 h-auto mb-4 mx-auto" />
              <h2 className="text-2xl font-bold" style={{ color: colorPalette.oliveGray }}>
                Construye tu proyecto
              </h2>
              <p className="text-slate-600 mt-2 text-base mt-5">
               Te guiamos paso a paso para desarrollar una postulación robusta y bien alineada con los criterios de evaluación de los fondos públicos o privados.
              </p>
            </div>
            <button
              className="mt-5 font-bold py-3 px-8 rounded-2xl transition-transform transform hover:scale-105" 
              style={{ backgroundColor: '#c5d888', color: colorPalette.darkGreen }}
               onClick={() => navigate("/Matcha/Nuevo-proyecto")}
            >
              Generar Proyecto
            </button>
          </Card>
            <Card className="flex flex-col items-center p-8 max-w-sm text-center">
            <div className="flex-grow">
              <img src="/Matchitograduado.png" alt="Ilustración de taza de té" className="hidden md:block w-30 h-auto mb-4 mx-auto" />
              <h2 className="text-2xl font-bold" style={{ color: colorPalette.oliveGray }}>
                Encuentra los proyectos históricos
              </h2>
              <p className="text-slate-600 mt-2 text-base mt-5">
               Compara con ideas anteriores para saber tu compatibilidad con fondos y mejorar tus posibilidades de exito con los proyectos ganadores.
              </p>
            </div>
            <button
              className="mt-5 font-bold py-3 px-8 rounded-2xl transition-transform transform hover:scale-105" 
              style={{ backgroundColor: '#c5d888', color: colorPalette.darkGreen }}
               onClick={() => navigate("/Matcha/My-projects")}
            >
              Generar Match histórico
            </button>
          </Card>

         
          <Card className="flex flex-col items-center p-8 max-w-sm text-center">
             <div   
      className=" flex-grow"
    >
                <img src="/matchachoro.png" alt="Ilustración de taza de té" className="hidden md:block mt-1 w-30 h-auto mb-4 mx-auto" />
                <h2 className="text-2xl font-bold" style={{ color: colorPalette.oliveGray }}>
                  Encuentra tu fondo ideal
                </h2>
                <p className="text-slate-600 mt-2 text-base mt-5">
                  Compara tu idea o proyecto con las múltiples oportunidades de financiamiento disponibles.
                </p>
            </div>
            <button
              className="mt-5 font-bold py-3 px-8 rounded-2xl transition-transform transform hover:scale-105" 
              style={{ backgroundColor: '#c5d888', color: colorPalette.darkGreen }}
               onClick={() => navigate("/Matcha/Select-Project")}
            >
              Hacer Match
            </button>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default SelectIdea;