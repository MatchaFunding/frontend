import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../../components/NavBar/navbar';
import Proyecto from "../../../models/Proyecto";

const ProjectCard: React.FC<{ proyecto: Proyecto; onSelect: () => void }> = ({ proyecto, onSelect }) => (
  <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col border border-slate-200/80">
    <div className="p-6 flex flex-col flex-grow text-center">
      <h3 className="text-xl font-bold text-[#44624a] mb-2">{proyecto.Titulo}</h3>
      <p className="text-slate-600 text-sm flex-grow mb-4">{proyecto.Descripcion}</p>
      <span className="inline-block mb-6 bg-[#8ba888]/20 text-[#44624a] text-xs font-semibold px-4 py-1 rounded-full">{proyecto.Area}</span>
      <button
        onClick={onSelect}
        className="mt-auto w-full bg-[#8ba888] hover:bg-[#3a523f] text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1"
      >
        Seleccionar y Buscar Fondos
      </button>
    </div>
  </div>
);

const MisProyectosH: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const storedUser = sessionStorage.getItem("usuario");
  if (storedUser) {
    const datos = JSON.parse(storedUser);
    const proyectos: Proyecto[] = datos.Proyectos;
    const filteredProyectos = proyectos.filter(p =>
      p.Titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleSelectProject = (proyecto: Proyecto) => {
      localStorage.setItem('selectedProject', JSON.stringify(proyecto));
      navigate('/Matcha/My-projects/proyectos-historicos');
    };
    
    return (
      <div className="min-h-screen bg-[#f1f5f9]">
        <NavBar />
        <main className="flex-grow p-6 md:p-10 max-w-screen-2xl mx-auto mt-[5%]">

          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[#505143]">Selecciona tu Proyecto</h1>
            <p className="text-slate-600 mt-2 text-lg">Elige un proyecto para encontrar las mejores oportunidades de financiamiento.</p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md mb-8 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:flex-grow">
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar proyecto..."
                className="w-full bg-[rgba(241,245,249,1)] border border-[rgba(80,81,67,0.3)] rounded-lg py-3 pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-[rgba(68,98,74,1)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProyectos.map(proyecto => (
              <ProjectCard
                key={proyecto.ID}
                proyecto={proyecto}
                onSelect={() => handleSelectProject(proyecto)}
              />
            ))}
          </div>
        </main>
      </div>
    );
  }
};

export default MisProyectosH;
