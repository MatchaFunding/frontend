import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/UI/cards';
import NavBar from '../../components/NavBar/navbar';
import React from 'react';

const colorPalette = {
  darkGreen: '#44624a',
  softGreen: '#8ba888',
  oliveGray: '#505143',
  lightGray: '#f1f5f9',
};

const SelectChange: React.FC = () => {
  const navigate = useNavigate();
    
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colorPalette.lightGray }}>
      <NavBar />
      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10" style={{ color: colorPalette.oliveGray }}>
          ¿Qué quieres editar?
        </h1>
          <div className="flex flex-col lg:flex-row gap-8">
          <Card className="flex flex-col items-center p-8 max-w-sm text-center">
            <div className="flex-grow">
              <img src="/editandoMatch.png" alt="Ilustración de perfil de usuario" className="w-40 h-auto mb-4 mx-auto" />
              <h2 className="text-2xl font-bold" style={{ color: colorPalette.oliveGray }}>
                Tu Perfil Personal
              </h2>
              <p className="text-slate-600 mt-2 text-base">
               Actualiza tu nombre, correo y otros datos personales.
              </p>
            </div>
            <button
              className="mt-6 font-bold py-3 px-8 rounded-2xl transition-transform transform hover:scale-105" 
              style={{ backgroundColor: '#c5d888', color: colorPalette.darkGreen }}
              onClick={() => navigate("/edit-Myprofile")}
            >
              Editar Perfil
            </button>
          </Card>
          <Card className="flex flex-col items-center p-8 max-w-sm text-center">
            <div className="flex-grow">
                <img src="/EmpresarioM.png" alt="Ilustración de perfil de empresa" className="w-40 h-auto mb-4 mx-auto" />
                <h2 className="text-2xl font-bold" style={{ color: colorPalette.oliveGray }}>
                  El Perfil de tu Empresa
                </h2>
                <p className="text-slate-600 mt-2 text-base">
                 Administra la información, miembros y etiquetas de la empresa.
                </p>
            </div>
            <button
              className="mt-6 font-bold py-3 px-8 rounded-2xl transition-transform transform hover:scale-105" 
              style={{ backgroundColor: '#c5d888', color: colorPalette.darkGreen }}
              onClick={() => navigate("/edit-profileE")}
            >
              Editar Empresa
            </button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SelectChange;