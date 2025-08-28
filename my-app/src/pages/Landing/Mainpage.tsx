import React from 'react';
import NavBar from '../../components/NavBar/navbar';
import { useNavigate } from 'react-router-dom';

const MatchaHomePage: React.FC = () => {
     const navigate = useNavigate();
  return (

    <div className="bg-slate-50 h-screen flex flex-col">
      <NavBar />
   <main className="flex-grow p-8 md:p-12 lg:p-16 w-[100%] max-h-[100%]  mt-[5%] flex justify-center items-start">
  <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 w-full h-full">

    <div
      onClick={() => navigate("/Matcha/Select-Idea")}
      className="lg:col-span-3 bg-white p-8 rounded-2xl shadow-lg flex flex-col justify-between w-[85%] h-[90%] my-auto mx-auto cursor-pointer hover:shadow-2xl transition-shadow ml-10 "
    >
      <div className="flex items-center gap-6">
        <div>
          <span className="text-gray-500 text-2xl">Haz</span>
          <h1 className="text-8xl font-bold text-black tracking-tighter">Match</h1>
          <span className="text-gray-500 text-2xl block">con un fondo</span>
        </div>
        <img
          src="./Tevolador.png"
          alt="Taza de matcha colgando"
          className="w-[50%] h-auto self-center translate-y-[30%] shadow-lg rounded-full"
        />
      </div>
    </div>


    <div className="lg:col-span-2 flex flex-col gap-0 h-full">

      <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center h-[39%] my-auto">
  <div className="flex-shrink-0">
    <img 
      src="./image.png"
      alt="Mejora tu perfil"
      className="w-41 h-40 rounded-full shadow-lg" 
    />
  </div>
  <div className="ml-4"> 
    <span className="text-gray-500 text-lg">Mejora tu</span>
    <h2 className="text-5xl font-semibold text-black">Perfil</h2>
    <p className="text-gray-600 mt-2 text-md">
      Optimiza tus chances de adquirir financiamiento analizando puntos clave.
    </p>
  </div>
</div>


      <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-6 h-[39%] my-auto">
         
        <div className="flex-1 p-4">
          <span className="text-gray-500 text-lg">Busca</span>
          <h2 className="text-5xl font-semibold text-black">Fondos</h2>
          <span className="text-gray-500 text-lg">en un mismo lugar</span>
          <p className="text-gray-600 mt-4 text-md">
            Busca todos los fondos abiertos en una misma plataforma.
          </p>
        </div>
         <div className="flex-shrink-0">
    <img 
            src="./fondito.png"
      alt="Mejora tu perfil"
      className="w-41 h-40 rounded-full shadow-lg" 
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