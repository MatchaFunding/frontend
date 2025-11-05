import type Proyecto from '../../../models/Proyecto';
import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DisclaimerModal } from '../../../components/Shared/Disclaimer';
import { VerFondosIAAsync } from '../../../api/VerFondosIA';
import { getMatchProyectoFondosAsync } from '../../../api/MatchFondos';
import LoopAnimation from '../../../components/Shared/animationFrame';
import NavBar from '../../../components/NavBar/navbar';
import React from 'react';

interface ProyectoSeleccionado {
  id: number;
  nombre: string;
  resumen: string;
  area: string;
}

interface Fondo {
  ID: number;
  Titulo: string;
  Descripcion: string;
  Beneficios: string;
  Requisitos: string;
  Estado: string;
  FechaDeApertura: string;
  FechaDeCierre: string;
  MontoMinimo: number;
  MontoMaximo: number;
  DuracionEnMeses: number;
  Alcance: string;
  TipoDeBeneficio: string;
  TipoDePerfil: string;
  EnlaceDeLaFoto: string;
  EnlaceDelDetalle: string;
  compatibilidad?: number;
  semantic_score?: number;
  topic_score?: number;
  rules_score?: number;
}

interface MatchFondo {
  call_id: number; 
  affinity: number;
  semantic_score: number;
  topic_score: number;
  rules_score: number;
}

interface VerFondosResponse {
  funds: Fondo[];
}

interface FondoCardProps extends Fondo {}

const SearchIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#505143" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const StatusBadge: React.FC<{ estado: string; className?: string }> = ({ estado, className }) => {
  const isAbierto = estado === 'ABI';
  const bgColor = isAbierto ? 'bg-green-100' : 'bg-red-100';
  const textColor = isAbierto ? 'text-green-800' : 'text-red-800';
  const text = isAbierto ? 'Abierto' : 'Cerrado';
  const ringColor = isAbierto ? 'ring-green-200' : 'ring-red-200';
  return (<span className={`px-3 py-1 text-xs font-bold rounded-full ring-2 ring-inset ${bgColor} ${textColor} ${ringColor} ${className}`}>{text}</span>);
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch (error) {
    return 'Fecha inválida';
  }
};

// --- COMPONENTE FondoCard siguiendo el formato de free-search-card ---
const FondoCard: React.FC<FondoCardProps> = ({ ID, Titulo, Descripcion, compatibilidad, Estado, FechaDeApertura, FechaDeCierre, MontoMaximo, TipoDeBeneficio, EnlaceDeLaFoto, semantic_score, topic_score, rules_score }) => {
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
    <div 
      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col border border-slate-200/80 overflow-hidden w-full sm:w-[19rem] max-w-[20rem] h-auto sm:h-[33rem] min-h-64"
      style={{
        fontFamily: "'Roboto', sans-serif"
      }}
    >
      {/* Imagen container - exactamente como free-search-card */}
      <div 
        className="relative w-full overflow-hidden flex-shrink-0"
        style={{ height: '9rem' }}
      >
        <img 
          src={EnlaceDeLaFoto || defaultImage} 
          alt={Titulo} 
          className="w-full object-cover object-center block" 
          style={{ height: '9rem' }}
          onError={(e) => { e.currentTarget.src = defaultImage; }}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        
        {/* Badges en la imagen */}
        {compatibilidad !== undefined && (
          <span className="absolute top-4 left-4 bg-[rgba(68,98,74,0.8)] backdrop-blur-sm text-white text-sm font-semibold py-1 px-3 rounded-lg">
            {compatibilidad}% compatibilidad
          </span>
        )}
        <StatusBadge estado={Estado} className="absolute top-4 right-4" />
        
        {/* Tooltip que sigue el mouse */}
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

      {/* Content - siguiendo estructura de free-search-card */}
      <div 
        className="flex flex-col items-start w-full h-full box-border flex-1"
        style={{ padding: '1.5rem' }}
      >
        {/* Título */}
        <h2 
          className="font-bold text-slate-800 mb-2 w-full overflow-hidden text-ellipsis"
          style={{
            fontSize: '1.25rem',
            lineHeight: '1.2',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '3rem'
          }}
        >
          {Titulo}
        </h2>
        
        {/* Descripción */}
        <p 
          className="text-slate-500 mb-4 font-normal w-full flex-1 break-words"
          style={{
            fontSize: '0.875rem',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxHeight: '4.9rem',
            hyphens: 'auto'
          }}
        >
          {Descripcion}
        </p>

        {/* Fechas - formato free-search-card */}
        <div 
          className="mb-2 flex w-full border-t border-slate-200"
          style={{ paddingTop: '0.5rem' }}
        >
          <div className="flex flex-col items-start w-1/2 min-w-0">
            <span className="text-xs font-medium text-slate-500 mb-0.5">Apertura:</span>
            <span className="text-xs font-semibold text-slate-700 break-words">
              {formatDate(FechaDeApertura)}
            </span>
          </div>
          <div className="flex flex-col items-start w-1/2 min-w-0">
            <span className="text-xs font-medium text-slate-500 mb-0.5">Cierre:</span>
            <span className="text-xs font-semibold text-slate-700 break-words">
              {formatDate(FechaDeCierre)}
            </span>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col mt-auto w-full">
          {/* Metadata - exactamente como free-search-card */}
          <div 
            className="flex flex-col items-stretch border-t border-slate-200 mb-4 gap-2"
            style={{ paddingTop: '0.5rem' }}
          >
            {/* Topic y monto en línea superior */}
            <div className="flex justify-between items-center w-full">
              <span 
                className="inline-block whitespace-nowrap"
                style={{
                  background: 'rgba(139, 168, 136, 0.2)',
                  color: 'rgba(68, 98, 74, 1)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  lineHeight: '1.2'
                }}
              >
                {TipoDeBeneficio}
              </span>
              <div className="flex-shrink-0 w-5 h-5">
                {/* Espacio para bookmark si se necesita */}
              </div>
            </div>
            
            {/* Monto máximo */}
            {MontoMaximo > 0 && (
              <div 
                className="font-bold text-slate-800 w-full text-left break-words"
                style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.2'
                }}
              >
                {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(MontoMaximo)}
              </div>
            )}
          </div>

          {/* Botón - exactamente como free-search-card */}
          <button 
            onClick={() => navigate(`/Matcha/Select-Project/fondos/detalle/${ID}`)} 
            className="w-full text-white border-none cursor-pointer font-bold rounded-xl mt-auto"
            style={{
              background: 'linear-gradient(to right, #44624a 0%, #8ba888 50%, #44624a 100%)',
              backgroundSize: '200% 100%',
              backgroundPosition: '0% 0%',
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.6s ease'
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


// --- COMPONENTE PRINCIPAL ---
const FondosconPorcentaje: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProyectoSeleccionado | null>(null);
  const [fondos, setFondos] = useState<Fondo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoBeneficioFilter, setTipoBeneficioFilter] = useState('Todas');
  const [sortBy, setSortBy] = useState<'compatibilidad' | 'alfabetico' | 'presupuesto'>('compatibilidad');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // --- FUNCIONES ASÍNCRONAS ---

  const enviarProyectoAI = async (proyecto: Proyecto): Promise<void> => {
    const AI_API_URL = "https://ai.matchafunding.com/api/v1/projects/upsertusers";
    const payload = [{
      ID: proyecto.ID, Beneficiario: proyecto.Beneficiario, Titulo: proyecto.Titulo, Descripcion: proyecto.Descripcion,
      DuracionEnMesesMinimo: proyecto.DuracionEnMesesMinimo, DuracionEnMesesMaximo: proyecto.DuracionEnMesesMaximo,
      Alcance: proyecto.Alcance, Area: proyecto.Area,
    }];

    try {
      const response = await fetch(AI_API_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor de IA.' }));
        throw new Error(`El servidor de IA respondió con un error al registrar el proyecto (estado ${response.status}): ${errorData.message}`);
      }
    } catch (error) {
      console.error("Falló la comunicación con el endpoint de upsert de la IA:", error);
      throw error;
    }
  };

  // --- HOOKS DE EFECTO ---

  useEffect(() => {
    const CargarFondosConMatch = async () => {
      setIsLoading(true);
      setError(null);
      setFondos([]);

      const projectData = localStorage.getItem('selectedProject');
      if (!projectData) {
        setError("No se ha seleccionado ningún proyecto para buscar recomendaciones.");
        setIsLoading(false);
        return;
      }

      try {
        const project: Proyecto = JSON.parse(projectData);
        setSelectedProject({ id: project.ID, nombre: project.Titulo, resumen: project.Descripcion, area: project.Area });

        // PASO 1: "Upsert" del proyecto
        await enviarProyectoAI(project);
        
        // PASO 2: Obtener matches y lista de fondos
        const [matches, todosLosFondosResponse] = await Promise.all([
          getMatchProyectoFondosAsync({ idea_id: project.ID }) as Promise<MatchFondo[]>,
          VerFondosIAAsync() as Promise<VerFondosResponse>
        ]);

        const listaDeFondosCompleta: Fondo[] = todosLosFondosResponse?.funds || [];

        // PASO 3: Combinar los datos
        const fondosConMatch: Fondo[] = matches.reduce((acc: Fondo[], match) => {
          const fullFondoDetails = listaDeFondosCompleta.find(f => f.ID === match.call_id);
          if (fullFondoDetails) {
            acc.push({
              ...fullFondoDetails,
              compatibilidad: Math.floor(match.affinity * 100),
              semantic_score: match.semantic_score,
              topic_score: match.topic_score,
              rules_score: match.rules_score,
            });
          }
          return acc;
        }, []);

        setFondos(fondosConMatch);

      } catch (err: any) {
        setError(err.message || "Ocurrió un error al buscar los fondos recomendados.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    CargarFondosConMatch();
  }, []);

  // --- LÓGICA DE FILTRADO Y ORDENAMIENTO ---
  const tiposDeBeneficio = useMemo(() => ['Todas', ...new Set(fondos.map(f => f.TipoDeBeneficio).filter(Boolean))], [fondos]);
  
  const filteredFondos = useMemo(() => {
    let fondosFiltrados = [...fondos];
    if (searchTerm) { fondosFiltrados = fondosFiltrados.filter(f => f.Titulo.toLowerCase().includes(searchTerm.toLowerCase())); }
    if (tipoBeneficioFilter !== 'Todas') { fondosFiltrados = fondosFiltrados.filter(f => f.TipoDeBeneficio === tipoBeneficioFilter); }
    fondosFiltrados.sort((a, b) => {
      switch (sortBy) {
        case 'alfabetico': return a.Titulo.localeCompare(b.Titulo);
        case 'compatibilidad': return (b.compatibilidad ?? 0) - (a.compatibilidad ?? 0);
        case 'presupuesto': return b.MontoMaximo - a.MontoMaximo;
        default: return 0;
      }
    });
    return fondosFiltrados;
  }, [searchTerm, tipoBeneficioFilter, sortBy, fondos]);

  // --- RENDERIZADO ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
        <NavBar />
        <div className="flex flex-col items-center justify-center flex-1 space-y-6 px-4">
          <LoopAnimation />
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 animate-pulse text-center max-w-md sm:max-w-lg">
            Analizando tu proyecto y buscando los mejores fondos...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center text-center px-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-lg text-red-700">Ups, algo salió mal</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
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
              <h1 className="text-4xl font-bold text-[#505143]">Fondos Recomendados para</h1>
              <h2 className="text-3xl font-semibold text-[#44624a] mt-1">"{selectedProject.nombre}"</h2>
            </>
          ) : (
            <h1 className="text-4xl font-bold text-[#505143]">Explorar Todos los Fondos</h1>
          )}
        </div>

        <header className="bg-white p-4 sm:p-6 rounded-2xl shadow-md mb-8 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Busca un fondo recomendado..." className="w-full bg-slate-100 border border-slate-300 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#44624a]" />
          </div>
          <div className="flex items-center gap-2">
            <select value={tipoBeneficioFilter} onChange={(e) => setTipoBeneficioFilter(e.target.value)} className="bg-slate-200 text-slate-800 font-semibold py-3 px-5 rounded-lg cursor-pointer focus:outline-none">
              {tiposDeBeneficio.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)} 
            </select>
            <div className="relative">
              <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="bg-slate-200 text-slate-800 font-semibold py-3 px-5 rounded-lg transition-colors">Ordenar</button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10">
                  <button onClick={() => { setSortBy('compatibilidad'); setDropdownOpen(false); }} className="block px-4 py-2 text-slate-700 hover:bg-slate-100 w-full text-left">Porcentaje de match</button>
                  <button onClick={() => { setSortBy('alfabetico'); setDropdownOpen(false); }} className="block px-4 py-2 text-slate-700 hover:bg-slate-100 w-full text-left">Alfabético</button>
                  <button onClick={() => { setSortBy('presupuesto'); setDropdownOpen(false); }} className="block px-4 py-2 text-slate-700 hover:bg-slate-100 w-full text-left">Presupuesto</button>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {!selectedProject && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-8">
            <p className="font-bold">No has seleccionado un proyecto.</p>
            <p>Para ver recomendaciones personalizadas, <Link to="/Matcha/Select-Project" className="underline font-semibold">selecciona un proyecto primero</Link>.</p>
          </div>
        )}
        
        <div className="flex justify-center gap-4 sm:gap-6 flex-wrap" style={{ maxWidth: 'fit-content' }}>
          {filteredFondos.length > 0 ? (
            filteredFondos.map(fondo => (<FondoCard key={fondo.ID} {...fondo} />))
          ) : (
            <div className="w-full text-center py-12">
              <p className="text-xl text-gray-500">
                {selectedProject ? "No se encontraron fondos recomendados para este proyecto." : "Por favor, selecciona un proyecto para ver fondos recomendados."}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FondosconPorcentaje;