import React from 'react';
import NavBar from '../../components/NavBar/navbar';
import { useNavigate } from 'react-router-dom';

const Newmatch: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-slate-50 h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow flex justify-center items-center p-8 md:p-12 lg:p-16 mt-[5%]">
        <div className="flex justify-center items-center w-full h-full">
          <div
            onClick={() => navigate("/Proyectos")}
            className="bg-white p-8 rounded-2xl shadow-lg flex flex-col justify-between w-[80%] lg:w-[60%] h-auto cursor-pointer hover:shadow-2xl transition-shadow"
          >
            <div className="flex flex-col lg:flex-row items-center gap-6 text-center lg:text-left">
              <div>
                <span className="text-gray-500 text-2xl">¡Felicidades! Hiciste un </span>
                <h1 className="text-8xl font-bold text-black tracking-tighter">nuevo Match</h1>
                <span className="text-gray-500 text-2xl block">Clickea aquí para que veas las fases de tu proyecto</span>
              </div>
              <img
                src="/celebracion.png"
                alt="Celebración"
                className="w-[50%] h-auto self-center lg:translate-y-[0%] shadow-lg rounded-full"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Newmatch;
