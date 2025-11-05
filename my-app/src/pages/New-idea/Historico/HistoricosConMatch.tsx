import type MatchResult from '../../../models/MatchResult';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DisclaimerModal } from '../../../components/Shared/Disclaimer';
import { VerProyectosHistoricosIA } from '../../../api/VerProyectosHistoricosIA';
import { VerCalceProyectosIAAsync } from '../../../api/VerCalceProyectosIA';
import LoopAnimation from '../../../components/Shared/animationFrame';
import NavBar from '../../../components/NavBar/navbar';
import Proyecto from '../../../models/Proyecto';

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
  Compatibilidad?: number;
  ImagenUrl?: string;
  semantic_score?: number;
  topic_score?: number;
  rules_score?: number;
}

const SearchIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={colorPalette.oliveGray} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

interface ProyectoCardProps {
  ID: number;
  Titulo: string;
  Descripcion: string;
  Area: string;
  Alcance: string;
  DuracionEnMesesMinimo: number;
  DuracionEnMesesMaximo: number;
  Compatibilidad?: number;
  ImagenUrl?: string;
  semantic_score?: number;
  topic_score?: number;
  rules_score?: number;
}

const ProyectoCard: React.FC<ProyectoCardProps> = ({
  ID, Titulo, Descripcion, Area, Alcance, DuracionEnMesesMinimo, DuracionEnMesesMaximo, Compatibilidad, ImagenUrl,
  semantic_score, topic_score, rules_score
}) => {
  const navigate = useNavigate();
  const defaultImage = '/sin-foto.png';
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col border border-slate-200/80 h-auto sm:h-[560px] cursor-pointer">
      {/* Imagen oculta en móvil como en búsqueda libre */}
      <div className="relative h-52 flex-shrink-0 hidden sm:block">
        <img 
          src={ImagenUrl || defaultImage} 
          alt={Titulo} 
          className="w-full h-full object-cover" 
          onError={(e) => { e.currentTarget.src = defaultImage; }}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        <span className="absolute top-4 left-4 bg-[rgba(68,98,74,0.8)] backdrop-blur-sm text-white text-sm font-semibold py-1 px-3 rounded-lg">
          {Compatibilidad || 0}% compatibilidad
        </span>
        
        {showTooltip && (
          <div
            style={{ 
              position: 'fixed', 
              top: tooltipPosition.y + 10, 
              left: tooltipPosition.x + 10,
              zIndex: 1000
            }}
            className="bg-white rounded-lg shadow-2xl p-4 border border-slate-200 w-64 animate-fade-in-fast pointer-events-none"
          >
            <h4 className="font-bold text-slate-800 text-lg mb-2">Puntaje de afinidad</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Semántico:</span>
                <span className="font-semibold text-slate-800 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {semantic_score !== undefined ? `${(semantic_score * 100).toFixed(1)}%` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Temático:</span>
                <span className="font-semibold text-slate-800 bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                  {topic_score !== undefined ? `${(topic_score * 100).toFixed(1)}%` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Por reglas:</span>
                <span className="font-semibold text-slate-800 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                  {rules_score !== undefined ? `${(rules_score * 100).toFixed(1)}%` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 sm:p-6 flex flex-col flex-grow min-h-0">
        {/* Badge de compatibilidad móvil - solo visible en móvil */}
        <div className="flex justify-start mb-2 sm:hidden">
          <span className="bg-[rgba(68,98,74,0.8)] text-white text-sm font-semibold py-1 px-3 rounded-lg">
            {Compatibilidad || 0}% compatibilidad
          </span>
        </div>
        
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 line-clamp-2 flex-shrink-0">{Titulo}</h2>
        <p className="text-slate-500 text-sm mb-3 sm:mb-4 line-clamp-5 sm:line-clamp-4 overflow-hidden flex-shrink-0">{Descripcion}</p>
        <div className="mt-3 sm:mt-auto flex-shrink-0">
          <p className="text-xs text-slate-400 italic mb-1 sm:mb-2">Área: {Area}</p>
          <p className="text-xs text-slate-400 italic mb-1 sm:mb-2">Duración: {DuracionEnMesesMinimo}-{DuracionEnMesesMaximo} meses</p>
          <p className="text-xs text-slate-400 italic mb-3 sm:mb-4">Alcance: {Alcance}</p>
          <button
            onClick={() => navigate(`/Matcha/My-projects/proyectos-historicos/Detalle/${ID}`)}
            className="w-full text-white font-bold py-2 sm:py-3 px-4 rounded-xl"
            style={{
              background: 'linear-gradient(to right, #44624a 0%, #8ba888 50%, #44624a 100%)',
              backgroundSize: '200% 100%',
              backgroundPosition: '0% 0%',
              transition: 'all 0.6s ease',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundPosition = '100% 0%';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundPosition = '0% 0%';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            }}
          >
            Ver más detalles
          </button>
        </div>
      </div>
    </div>
  );
};

const ProyectosHistoricosConPorcentaje: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Proyecto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('Todas');
  const [sortBy, setSortBy] = useState<'compatibilidad' | 'alfabetico' | 'duracion'>('compatibilidad');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [historicos, setHistoricos] = useState<ProyectoHistorico[]>([]);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  
  const enviarProyectoAI = async (proyecto: Proyecto) => {
    console.log("Enviando proyecto al servicio de IA:", proyecto);
    const payload = [{
      ID: proyecto.ID,
      Beneficiario: proyecto.Beneficiario,
      Titulo: proyecto.Titulo,
      Descripcion: proyecto.Descripcion,
      DuracionEnMesesMinimo: proyecto.DuracionEnMesesMinimo,
      DuracionEnMesesMaximo: proyecto.DuracionEnMesesMaximo,
      Alcance: proyecto.Alcance,
      Area: proyecto.Area,
    }];
    try {
      const response = await fetch("https://ai.matchafunding.com/api/v1/projects/upsertusers", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor de IA.' }));
        console.error('Error al enviar datos a la IA:', response.status, errorData);
        throw new Error(`El servidor de IA respondió con el estado ${response.status}`);
      }
      const result = await response.json();
      console.log('Respuesta exitosa del servicio de IA:', result);
    }
    catch (error) {
      console.error("Falló la comunicación con el endpoint de la IA:", error);
    }
  };

  async function VerProyectosHistoricos(id: number) {
    try {
      setIsLoading(true);
      const proyectoshistoricos = await VerProyectosHistoricosIA();
      if (proyectoshistoricos && proyectoshistoricos.projects) {
        const calces: MatchResult[] = await VerCalceProyectosIAAsync(id);
        const proyectosConCompatibilidad: ProyectoHistorico[] = proyectoshistoricos.projects
          .map((p: ProyectoHistorico) => {
            const match = calces.find((c) => c.name === p.Titulo);
            if (!match)
              return null;
            return {
              ...p,
              Compatibilidad: Math.floor((match.affinity || 0) * 100),
              semantic_score: match.semantic_score,
              topic_score: match.topic_score,
              rules_score: match.rules_score,
            };
          }).filter((p: ProyectoHistorico | null): p is ProyectoHistorico => p !== null);
        setHistoricos(proyectosConCompatibilidad);
      }
    }
    catch (error) {
      console.error("Error al obtener proyectos históricos:", error);
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const projectData = localStorage.getItem('selectedProject');
    if (projectData) {
      try {
        const project = JSON.parse(projectData);
        setSelectedProject(project);
        enviarProyectoAI(project);
        if (project.ID)
          VerProyectosHistoricos(project.ID);
      }
      catch (error) {
        console.error(error);
      }
    }
  }, []);
  const areas = useMemo(() => ['Todas', ...new Set(historicos.map(p => p.Area))], [historicos]);

  const filteredProyectos = useMemo(() => {
    let proyectos = [...historicos];
    if (searchTerm) proyectos = proyectos.filter(p => p.Titulo.toLowerCase().includes(searchTerm.toLowerCase()));
    if (areaFilter !== 'Todas') proyectos = proyectos.filter(p => p.Area === areaFilter);
    proyectos.sort((a, b) => {
      switch (sortBy) {
        case 'alfabetico':
          return a.Titulo.localeCompare(b.Titulo);
        case 'compatibilidad':
          return (b.Compatibilidad || 0) - (a.Compatibilidad || 0);
        case 'duracion':
          return (b.DuracionEnMesesMaximo - b.DuracionEnMesesMinimo) - (a.DuracionEnMesesMaximo - a.DuracionEnMesesMinimo);
        default:
          return 0;
      }
    });
    return proyectos;
  }, [searchTerm, areaFilter, sortBy, historicos]);

  if (showAnimation || isLoading) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
        <NavBar />
        <div className="flex flex-col items-center justify-center flex-1 space-y-6 px-4">
          <LoopAnimation />
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 animate-pulse text-center max-w-md sm:max-w-lg">
            {isLoading ? "Cargando proyectos históricos..." : "Cargando..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <NavBar />
      {showDisclaimer && <DisclaimerModal onClose={() => setShowDisclaimer(false)} />}
      <main className="flex-grow p-6 md:p-10 max-w-screen-2xl mx-auto mt-24 sm:mt-32">
        <div className="text-center mb-10">
          {selectedProject ? (
            <>
              <h1 className="text-4xl font-bold text-[#505143]">Proyectos históricos Recomendados para</h1>
              <h2 className="text-3xl font-semibold text-[#44624a] mt-1">"{selectedProject.Titulo}"</h2>
            </>
          ) : (
            <h1 className="text-4xl font-bold text-[#505143]">Explorar Todos los Proyectos Históricos</h1>
          )}
        </div>

        <header className="bg-white p-4 sm:p-6 rounded-2xl shadow-md mb-8 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Busca un proyecto histórico..." className="w-full bg-[rgba(241,245,249,1)] border border-[rgba(80,81,67,0.3)] rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[rgba(68,98,74,1)]" />
          </div>
          <div className="flex items-center gap-2">
            <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} className="bg-[rgba(139,168,136,0.2)] text-[rgba(80,81,67,1)] font-semibold py-3 px-5 rounded-lg cursor-pointer focus:outline-none">
              {areas.map(area => <option key={area} value={area}>{area}</option>)}
            </select>
            <div className="relative">
              <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="bg-[rgba(139,168,136,0.2)] text-[rgba(80,81,67,1)] font-semibold py-3 px-5 rounded-lg transition-colors">Ordenar</button>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProyectos.length > 0 ? (
            filteredProyectos.map(proyecto =>
              <ProyectoCard
                key={proyecto.ID}
                {...proyecto}
              />)
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-500">No se encontraron proyectos históricos que coincidan.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProyectosHistoricosConPorcentaje;