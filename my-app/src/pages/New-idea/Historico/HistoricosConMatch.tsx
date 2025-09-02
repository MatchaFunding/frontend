import React, { useState, useMemo, useEffect } from 'react';
import NavBar from '../../../components/NavBar/navbar';
import { Link, useNavigate } from 'react-router-dom';

const colorPalette = {
  darkGreen: '#44624a',
  softGreen: '#8ba888',
  oliveGray: '#505143',
  lightGray: '#f1f5f9',
};

interface ProyectoHistorico {
  ID: number;
  Beneficiario: number;
  Titulo: string;
  Descripcion: string;
  DuracionEnMesesMinimo: number;
  DuracionEnMesesMaximo: number;
  Alcance: string;
  Area: string;
  Compatibilidad: number;
  ImagenUrl: string;
}

interface ProyectoSeleccionado {
  id: number;
  nombre: string;
  resumen: string;
  area: string;
}

const mockProyectosHistoricos: ProyectoHistorico[] = [
  {
    ID: 1,
    Beneficiario: 1001,
    Titulo: 'Plataforma de Telemedicina',
    Descripcion: 'Atención médica remota para zonas rurales.',
    DuracionEnMesesMinimo: 12,
    DuracionEnMesesMaximo: 24,
    Alcance: 'Nacional',
    Area: 'Salud',
    Compatibilidad: 95,
    ImagenUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=60',
  },
  {
    ID: 2,
    Beneficiario: 1002,
    Titulo: 'Energía Solar para Escuelas',
    Descripcion: 'Implementación de paneles solares en zonas vulnerables.',
    DuracionEnMesesMinimo: 18,
    DuracionEnMesesMaximo: 36,
    Alcance: 'Regional',
    Area: 'Sostenibilidad',
    Compatibilidad: 88,
    ImagenUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=60',
  },
  {
    ID: 3,
    Beneficiario: 1003,
    Titulo: 'Aula Virtual Inclusiva',
    Descripcion: 'Mejora de accesibilidad en plataformas educativas.',
    DuracionEnMesesMinimo: 10,
    DuracionEnMesesMaximo: 20,
    Alcance: 'Local',
    Area: 'Educación',
    Compatibilidad: 82,
    ImagenUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=60',
  },
];

const SearchIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={colorPalette.oliveGray} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const ProyectoCard: React.FC<ProyectoHistorico> = ({ 
  Titulo, Descripcion, Area, Alcance, DuracionEnMesesMinimo, DuracionEnMesesMaximo, Compatibilidad, ImagenUrl 
}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col border border-slate-200/80">
      <div className="relative h-52">
        <img src={ImagenUrl} alt={Titulo} className="w-full h-full object-cover" />
        <span className="absolute top-4 left-4 bg-[rgba(68,98,74,0.8)] backdrop-blur-sm text-white text-sm font-semibold py-1 px-3 rounded-lg">
          {Compatibilidad}% compatibilidad
        </span>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-slate-800 mb-2">{Titulo}</h2>
        <p className="text-slate-500 text-sm flex-grow mb-2">{Descripcion}</p>
        <p className="text-xs text-slate-400 italic mb-2">Área: {Area}</p>
        <p className="text-xs text-slate-400 italic mb-2">Duración: {DuracionEnMesesMinimo}-{DuracionEnMesesMaximo} meses</p>
        <p className="text-xs text-slate-400 italic mb-4">Alcance: {Alcance}</p>
        <button
          onClick={() => navigate(`/Matcha/My-projects/proyectos-historicos/Detalle`)}
          className="w-full bg-[#8ba888] hover:bg-[rgba(68,98,74,0.8)] text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300"
        >
          Ver más detalles
        </button>
      </div>
    </div>
  );
};

const ProyectosHistoricosConPorcentaje: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProyectoSeleccionado | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('Todas');
  const [sortBy, setSortBy] = useState<'compatibilidad' | 'alfabetico' | 'duracion'>('compatibilidad');
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const projectData = localStorage.getItem('selectedProject');
    if (projectData) {
      try {
        const project = JSON.parse(projectData);
        setSelectedProject(project);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const areas = useMemo(() => ['Todas', ...new Set(mockProyectosHistoricos.map(p => p.Area))], []);

  const filteredProyectos = useMemo(() => {
    let proyectos = [...mockProyectosHistoricos];
    if (searchTerm) proyectos = proyectos.filter(p => p.Titulo.toLowerCase().includes(searchTerm.toLowerCase()));
    if (areaFilter !== 'Todas') proyectos = proyectos.filter(p => p.Area === areaFilter);
    proyectos.sort((a, b) => {
      switch (sortBy) {
        case 'alfabetico': return a.Titulo.localeCompare(b.Titulo);
        case 'compatibilidad': return b.Compatibilidad - a.Compatibilidad;
        case 'duracion': return (b.DuracionEnMesesMaximo - b.DuracionEnMesesMinimo) - (a.DuracionEnMesesMaximo - a.DuracionEnMesesMinimo);
        default: return 0;
      }
    });
    return proyectos;
  }, [searchTerm, areaFilter, sortBy]);

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <NavBar />
      <main className="flex-grow p-6 md:p-10 max-w-screen-2xl mx-auto mt-[5%]">
        <div className="text-center mb-10">
          {selectedProject ? (
            <>
              <h1 className="text-4xl font-bold text-[#505143]">Proyectos Históricos similares a</h1>
              <h2 className="text-3xl font-semibold text-[#44624a] mt-1">"{selectedProject.nombre}"</h2>
            </>
          ) : (
            <h1 className="text-4xl font-bold text-[#505143]">Explorar Proyectos Históricos Adjudicados</h1>
          )}
        </div>

        <header className="bg-white p-4 sm:p-6 rounded-2xl shadow-md mb-8 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Busca un proyecto histórico..."
              className="w-full bg-[rgba(241,245,249,1)] border border-[rgba(80,81,67,0.3)] rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[rgba(68,98,74,1)]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="bg-[rgba(139,168,136,0.2)] text-[rgba(80,81,67,1)] font-semibold py-3 px-5 rounded-lg cursor-pointer focus:outline-none"
            >
              {areas.map(area => <option key={area} value={area}>{area}</option>)}
            </select>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="bg-[rgba(139,168,136,0.2)] text-[rgba(80,81,67,1)] font-semibold py-3 px-5 rounded-lg transition-colors"
              >
                Ordenar
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10">
                  <button onClick={() => { setSortBy('alfabetico'); setDropdownOpen(false); }} className="block px-4 py-2 text-[rgba(80,81,67,1)] hover:bg-[rgba(139,168,136,0.2)] w-full text-left">Alfabético</button>
                  <button onClick={() => { setSortBy('compatibilidad'); setDropdownOpen(false); }} className="block px-4 py-2 text-[rgba(80,81,67,1)] hover:bg-[rgba(139,168,136,0.2)] w-full text-left">Porcentaje de match</button>
                  <button onClick={() => { setSortBy('duracion'); setDropdownOpen(false); }} className="block px-4 py-2 text-[rgba(80,81,67,1)] hover:bg-[rgba(139,168,136,0.2)] w-full text-left">Duración</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {!selectedProject && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-8">
            <p className="font-bold">No has seleccionado un proyecto.</p>
            <p>Mostrando todos los proyectos históricos adjudicados. Para ver compatibilidad personalizada, <Link to="/Matcha/My-projects" className="underline font-semibold">selecciona un proyecto primero</Link>.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProyectos.map(proyecto => <ProyectoCard key={proyecto.ID} {...proyecto} />)}
        </div>

        <footer className="flex flex-col sm:flex-row justify-between items-center mt-10 text-[rgba(80,81,67,1)]">
          <p>Mostrando {filteredProyectos.length} de {mockProyectosHistoricos.length} proyectos</p>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <button className="px-3 py-1 border rounded-lg hover:bg-[rgba(139,168,136,0.2)]">&lt;</button>
            <button className="px-3 py-1 border rounded-lg bg-[rgba(68,98,74,1)] text-white border-[rgba(68,98,74,1)]">1</button>
            <button className="px-3 py-1 border rounded-lg hover:bg-[rgba(139,168,136,0.2)]">2</button>
            <button className="px-3 py-1 border rounded-lg hover:bg-[rgba(139,168,136,0.2)]">3</button>
            <button className="px-3 py-1 border rounded-lg hover:bg-[rgba(139,168,136,0.2)]">&gt;</button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default ProyectosHistoricosConPorcentaje;
