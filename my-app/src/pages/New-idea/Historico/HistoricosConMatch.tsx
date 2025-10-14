
import { useState, useMemo, useEffect } from 'react';
import NavBar from '../../../components/NavBar/navbar';
import { Link, useNavigate } from 'react-router-dom';
import { DisclaimerModal } from '../../../components/Shared/Disclaimer';
import { VerProyectosHistoricosIAAsync } from '../../../api/VerProyectosHistoricosIA';
import { VerCalceProyectosIAAsync } from '../../../api/VerCalceProyectosIA';
import LoopAnimation from '../../../components/Shared/animationFrame';
import type MatchResult from '../../../models/MatchResult';
import Proyecto from '../../../models/Proyecto';

const colorPalette = {
  darkGreen: '#44624a',
  softGreen: '#8ba888',
  oliveGray: '#505143',
  lightGray: '#f1f5f9',
};

// Interfaz actualizada para incluir los scores
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
  // Nuevos campos para almacenar los scores del calce
  semantic_score?: number;
  topic_score?: number;
  rules_score?: number;
}

// Interfaz para el objeto de scores que se mostrará
interface ScoreData {
  semantic_score?: number;
  topic_score?: number;
  rules_score?: number;
}

// Interfaz para las props del ProyectoCard, incluyendo el manejador de evento
interface ProyectoCardProps extends ProyectoHistorico {
  onRightClick: (event: React.MouseEvent, scores: ScoreData) => void;
}

interface ProyectoSeleccionado {
  id: number;
  beneficiario: number;
  Titulo: string;
  Descripcion: string;
  DuracionEnMesesMinimo:number;
  DuracionEnMesesMaximo:number;
  Alcance: string;
  Area:string;

}

// --- Componentes Adicionales ---

// Componente para el menú contextual que muestra los scores
const ScoreContextMenu: React.FC<{ x: number, y: number, scores: ScoreData }> = ({ x, y, scores }) => {
  return (
    <div
      style={{ top: y, left: x, position: 'fixed' }}
      className="bg-white p-4 rounded-lg shadow-xl z-50 border border-slate-200"
      onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del menú lo cierre
    >
      <h4 className="font-bold text-slate-800 mb-2 text-md">Scores del Calce de IA</h4>
      <ul className="text-sm text-slate-600 space-y-1">
        <li><strong>Semantic Score:</strong> {scores.semantic_score?.toFixed(4) ?? 'N/A'}</li>
        <li><strong>Topic Score:</strong> {scores.topic_score ?? 'N/A'}</li>
        <li><strong>Rules Score:</strong> {scores.rules_score ?? 'N/A'}</li>
      </ul>
    </div>
  );
};

const SearchIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={colorPalette.oliveGray} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

// --- Componente de Tarjeta de Proyecto Modificado ---

interface ProyectoCardProps {
  ID: number; // <-- ¡AÑADIDO!
  Titulo: string;
  Descripcion: string;
  Area: string;
  Alcance: string;
  DuracionEnMesesMinimo: number;
  DuracionEnMesesMaximo: number;
  Compatibilidad: number;
  ImagenUrl?: string;
  semantic_score: number;
  topic_score: number;
  rules_score: number;
  onRightClick: (event: React.MouseEvent, scores: ScoreData) => void;
}

const ProyectoCard: React.FC<ProyectoCardProps> = ({
  ID, // <-- ¡AÑADIDO! Lo desestructuramos de las props
  Titulo, Descripcion, Area, Alcance, DuracionEnMesesMinimo, DuracionEnMesesMaximo, Compatibilidad, ImagenUrl,
  semantic_score, topic_score, rules_score, onRightClick
}) => {
  const navigate = useNavigate();
  const defaultImage = '/sin-foto.png';

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    onRightClick(event, { semantic_score, topic_score, rules_score });
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col border border-slate-200/80 h-[560px] cursor-pointer"
    >
      <div className="relative h-52 flex-shrink-0">
        <img
          src={ImagenUrl || defaultImage}
          alt={Titulo}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = defaultImage; }}
        />
        <span className="absolute top-4 left-4 bg-[rgba(68,98,74,0.8)] backdrop-blur-sm text-white text-sm font-semibold py-1 px-3 rounded-lg">
          {Compatibilidad || 0}% compatibilidad
        </span>
      </div>
      <div className="p-6 flex flex-col flex-grow min-h-0">
        <h2 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2 flex-shrink-0">{Titulo}</h2>
        <p
          className="text-slate-500 text-sm mb-4 overflow-hidden flex-shrink-0"
          style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', lineHeight: '1.4', maxHeight: 'calc(1.4em * 5)', minHeight: 'calc(1.4em * 5)' }}
        >
          {Descripcion}
        </p>
        <div className="mt-auto flex-shrink-0">
          <p className="text-xs text-slate-400 italic mb-2">Área: {Area}</p>
          <p className="text-xs text-slate-400 italic mb-2">Duración: {DuracionEnMesesMinimo}-{DuracionEnMesesMaximo} meses</p>
          <p className="text-xs text-slate-400 italic mb-4">Alcance: {Alcance}</p>
          <button
            // 2. Modificamos el onClick para usar el ID en la URL
            onClick={() => navigate(`/Matcha/My-projects/proyectos-historicos/Detalle/${ID}`)}
            className="w-full bg-[#8ba888] hover:bg-[rgba(68,98,74,0.8)] text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300"
          >
            Ver más detalles
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Componente Principal ---

const ProyectosHistoricosConPorcentaje: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProyectoSeleccionado | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('Todas');
  const [sortBy, setSortBy] = useState<'compatibilidad' | 'alfabetico' | 'duracion'>('compatibilidad');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [historicos, setHistoricos] = useState<ProyectoHistorico[]>([]);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Estado para manejar la visibilidad y posición del menú contextual
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; scores: ScoreData } | null>(null);

  const AI_API_URL = "https://ai.matchafunding.com/api/v1/projects/upsertusers";

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
      const response = await fetch(AI_API_URL, {
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
    } catch (error) {
      console.error("Falló la comunicación con el endpoint de la IA:", error);
    }
  };

  async function VerProyectosHistoricos(id: number) {
    try {
      setIsLoading(true);
      const proyectoshistoricos = await VerProyectosHistoricosIAAsync();
      console.log("Proyectos historicos:", proyectoshistoricos.projects);

      if (proyectoshistoricos && proyectoshistoricos.projects) {
        const calces: MatchResult[] = await VerCalceProyectosIAAsync(id);
        console.log("Los calces fueron:", calces);

        interface ProyectoConCompatibilidad extends ProyectoHistorico {
          Compatibilidad: number;
          semantic_score?: number;
          topic_score?: number;
          rules_score?: number;
        }

        interface MatchResultExtended {
          name: string;
          affinity?: number;
          semantic_score?: number;
          topic_score?: number;
          rules_score?: number;
        }

        const proyectosConCompatibilidad: ProyectoConCompatibilidad[] = proyectoshistoricos.projects
          .map((p: ProyectoHistorico): ProyectoConCompatibilidad | null => {
            const match: MatchResultExtended | undefined = calces.find((c: MatchResultExtended) => c.name === p.Titulo);

            if (!match) {
              return null; // Si no hay calce, no incluimos el proyecto
            }

            // Aquí guardamos los scores en el objeto de cada proyecto
            return {
              ...p,
              Compatibilidad: Math.floor((match.affinity || 0) * 100),
              semantic_score: match.semantic_score,
              topic_score: match.topic_score,
              rules_score: match.rules_score,
            };
          })
          .filter((p: ProyectoHistorico | null): p is ProyectoHistorico => p !== null)

        setHistoricos(proyectosConCompatibilidad);
      }
    } catch (error) {
      console.error("Error al obtener proyectos históricos:", error);
    } finally {
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
        console.log("Proyecto seleccionado: " + JSON.stringify(project));
        enviarProyectoAI(project);

        if (project.ID) {
          VerProyectosHistoricos(project.ID);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  // Efecto para cerrar el menú contextual al hacer clic en cualquier otro lugar
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const areas = useMemo(() => ['Todas', ...new Set(historicos.map(p => p.Area))], [historicos]);

  const filteredProyectos = useMemo(() => {
    let proyectos = [...historicos];
    if (searchTerm) proyectos = proyectos.filter(p => p.Titulo.toLowerCase().includes(searchTerm.toLowerCase()));
    if (areaFilter !== 'Todas') proyectos = proyectos.filter(p => p.Area === areaFilter);
    proyectos.sort((a, b) => {
      switch (sortBy) {
        case 'alfabetico': return a.Titulo.localeCompare(b.Titulo);
        case 'compatibilidad': return (b.Compatibilidad || 0) - (a.Compatibilidad || 0);
        case 'duracion': return (b.DuracionEnMesesMaximo - b.DuracionEnMesesMinimo) - (a.DuracionEnMesesMaximo - a.DuracionEnMesesMinimo);
        default: return 0;
      }
    });
    return proyectos;
  }, [searchTerm, areaFilter, sortBy, historicos]);

  // Manejador que se activa desde el ProyectoCard
  const handleCardRightClick = (event: React.MouseEvent, scores: ScoreData) => {
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      scores: scores
    });
  };

  if (showAnimation || isLoading) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
        <NavBar />
        <div className="flex flex-col items-center justify-center flex-1 space-y-6">
          <LoopAnimation />
          <p className="text-xl sm:text-2xl font-semibold text-gray-700 animate-pulse">
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
      <main className="flex-grow p-6 md:p-10 max-w-screen-2xl mx-auto mt-[5%]">
        <div className="text-center mb-10">
          {selectedProject ? (
            <>
              <h1 className="text-4xl font-bold text-[#505143]">Proyectos históricos Recomendados para</h1>
              <h2 className="text-3xl font-semibold text-[#44624a] mt-1">"{selectedProject.Titulo}"</h2>
            </>
          ) : (
            <h1 className="text-4xl font-bold text-[#505143]">Explorar Todos los Fondos</h1>
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
          {filteredProyectos.length > 0 ? (
            filteredProyectos.map(proyecto =>
              <ProyectoCard
                key={proyecto.ID}
                {...proyecto}
                Compatibilidad={proyecto.Compatibilidad ?? 0}
                semantic_score={proyecto.semantic_score ?? 0}
                topic_score={proyecto.topic_score ?? 0}
                rules_score={proyecto.rules_score ?? 0}
                onRightClick={handleCardRightClick}
              />)
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-500">No se encontraron proyectos históricos que coincidan con los filtros seleccionados.</p>
            </div>
          )}
        </div>

        <footer className="flex flex-col sm:flex-row justify-between items-center mt-10 text-[rgba(80,81,67,1)]">
          <p>Mostrando {filteredProyectos.length} de {historicos.length} proyectos</p>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <button className="px-3 py-1 border rounded-lg hover:bg-[rgba(139,168,136,0.2)]">&lt;</button>
            <button className="px-3 py-1 border rounded-lg bg-[rgba(68,98,74,1)] text-white border-[rgba(68,98,74,1)]">1</button>
            <button className="px-3 py-1 border rounded-lg hover:bg-[rgba(139,168,136,0.2)]">2</button>
            <button className="px-3 py-1 border rounded-lg hover:bg-[rgba(139,168,136,0.2)]">3</button>
            <button className="px-3 py-1 border rounded-lg hover:bg-[rgba(139,168,136,0.2)]">&gt;</button>
          </div>
        </footer>
      </main>

      {/* Renderiza el menú contextual si hay datos en el estado */}
      {contextMenu && (
        <ScoreContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          scores={contextMenu.scores}
        />
      )}
    </div>
  );
};

export default ProyectosHistoricosConPorcentaje;