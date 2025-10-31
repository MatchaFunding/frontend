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

const PremiumOptions: React.FC = () => {
  const navigate = useNavigate();
    
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colorPalette.lightGray }}>
      <NavBar />

      <main className="flex-grow p-6 md:p-10 flex items-center justify-center pt-20 md:pt-24">
        <div className="flex flex-col lg:flex-row gap-8">

          <Card className="flex flex-col items-center p-8 max-w-sm text-center">
            <div className="flex-grow">
              <img src="/fine-tuning-icon.png" alt="Fine Tuning Premium" className="hidden md:block w-30 h-auto mb-4 mx-auto" />
              <h2 className="text-2xl font-bold" style={{ color: colorPalette.oliveGray }}>
                Asistente Experto 
              </h2>
              <p className="text-slate-600 mt-2 text-base mt-5">
                Utiliza nuestra IA entrenada para formular proyectos robustos para acceder al financiamiento.
              </p>
            </div>
            <button
              className="mt-5 font-bold py-3 px-8 rounded-2xl transition-transform transform hover:scale-105" 
              style={{ backgroundColor: '#c5d888', color: colorPalette.darkGreen }}
              onClick={() => navigate("/premium/fine-tuning")}
            >
              Acceder Fine Tuning
            </button>
          </Card>

          <Card className="flex flex-col items-center p-8 max-w-sm text-center">
            <div className="flex-grow">
              <img src="/rag-icon.png" alt="RAG Premium" className="hidden md:block w-30 h-auto mb-4 mx-auto" />
              <h2 className="text-2xl font-bold" style={{ color: colorPalette.oliveGray }}>
                Chatea con tus Documentos
              </h2>
              <p className="text-slate-600 mt-2 text-base mt-5">
                Pregúntale directo al documento. Asegura tu elegibilidad y no te pierdas nada.
              </p>
            </div>
            <button
              className="mt-5 font-bold py-3 px-8 rounded-2xl transition-transform transform hover:scale-105" 
              style={{ backgroundColor: '#c5d888', color: colorPalette.darkGreen }}
              onClick={() => navigate("/premium/rag")}
            >
              Acceder RAG
            </button>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default PremiumOptions;