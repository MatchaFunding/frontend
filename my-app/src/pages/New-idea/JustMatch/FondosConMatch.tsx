import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import NavBar from '../../../components/NavBar/navbar';
import { DisclaimerModal } from '../../../components/Shared/Disclaimer';
import LoopAnimation from '../../../components/Shared/animationFrame';

import { VerFondosIAAsync } from '../../../api/VerFondosIA';
import { getMatchProyectoFondosAsync } from '../../../api/MatchFondos';
import type Proyecto from '../../../models/Proyecto';

const colorPalette = {
  darkGreen: '#44624a',
  softGreen: '#8ba888',
  oliveGray: '#505143',
  lightGray: '#f1f5f9',
};

// --- INTERFACES ---

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

interface ScoreData {
  semantic_score?: number;
  topic_score?: number;
  rules_score?: number;
}

interface FondoCardProps extends Fondo {
  onRightClick: (event: React.MouseEvent, scores: ScoreData) => void;
}

// --- COMPONENTE PARA EL MENÚ CONTEXTUAL (SCORE CONTEXT MENU) ---

interface ContextMenuProps {
    x: number;
    y: number;
    scores: ScoreData;
    onClose: () => void;
}

const ScoreContextMenu: React.FC<ContextMenuProps> = ({ x, y, scores, onClose }) => {
  const formatScore = (score?: number) => {
    if (score === undefined || score === null) return 'N/A';
    return `${(score * 100).toFixed(1)}%`;
  };

  return (
    <div
      style={{ top: y, left: x }}
      className="absolute bg-white rounded-lg shadow-2xl p-4 z-50 border border-slate-200 w-64 animate-fade-in-fast"
      // Detiene la propagación del click dentro del menú para que no se cierre inmediatamente
      onContextMenu={(e) => e.stopPropagation()} 
      onClick={(e) => e.stopPropagation()}
    >
      <h4 className="font-bold text-slate-800 text-lg mb-2">Detalle de Afinidad</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-slate-600">Puntaje Semántico:</span>
          <span className="font-semibold text-slate-800 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            {formatScore(scores.semantic_score)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-600">Puntaje Temático:</span>
          <span className="font-semibold text-slate-800 bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
            {formatScore(scores.topic_score)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-600">Puntaje por Reglas:</span>
          <span className="font-semibold text-slate-800 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
            {formatScore(scores.rules_score)}
          </span>
        </div>
      </div>
       <p className="text-xs text-slate-400 mt-3 italic">Estos puntajes miden qué tan bien coincide tu proyecto con el fondo en diferentes aspectos.</p>
    </div>
  );
};


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

// --- COMPONENTE FondoCard (Corregido) ---
const FondoCard: React.FC<FondoCardProps> = ({ ID, Titulo, Descripcion, compatibilidad, Estado, FechaDeCierre, MontoMaximo, TipoDeBeneficio, EnlaceDeLaFoto, semantic_score, topic_score, rules_score, onRightClick }) => {
  const navigate = useNavigate();
  const defaultImage = '/sin-foto.png';

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation(); // Importante: Detener la propagación
    onRightClick(event, { semantic_score, topic_score, rules_score });
  };

  return (
    <div onContextMenu={handleContextMenu} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col border border-slate-200/80 cursor-pointer h-[560px]">
      <div className="relative h-52 flex-shrink-0">
        <img src={EnlaceDeLaFoto || defaultImage} alt={Titulo} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = defaultImage; }} />
        {compatibilidad !== undefined && (<span className="absolute top-4 left-4 bg-[rgba(68,98,74,0.8)] backdrop-blur-sm text-white text-sm font-semibold py-1 px-3 rounded-lg">{compatibilidad}% compatibilidad</span>)}
        <StatusBadge estado={Estado} className="absolute top-4 right-4" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">{Titulo}</h2>
        <p className="text-slate-500 text-sm mb-4 line-clamp-3">{Descripcion}</p>
        <div className="mt-auto border-t border-slate-200 pt-4 space-y-3">
          <div className="flex items-center text-sm text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /></svg>
            <strong>Cierre:</strong><span className="ml-2">{formatDate(FechaDeCierre)}</span>
          </div>
          {MontoMaximo > 0 && (
            <div className="flex items-center text-sm text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <strong>Monto Máx:</strong><span className="ml-2">{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(MontoMaximo)}</span>
            </div>
          )}
          <div className="flex justify-start">
            <span className="bg-[rgba(139,168,136,0.2)] text-[rgba(68,98,74,1)] text-xs font-semibold px-3 py-1 rounded-full">{TipoDeBeneficio}</span>
          </div>
        </div>
        <button onClick={() => navigate(`/Matcha/Select-Project/fondos/detalle/${ID}`)} className="w-full bg-[#8ba888] hover:bg-[rgba(68,98,74,0.8)] text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300 mt-4">
          Ver más detalles
        </button>
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
  
  // Estado para el menú contextual
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; scores: ScoreData } | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  
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

  // --- useEffect CORREGIDO para cerrar el menú ---
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);

    if (contextMenu) {
      // Añadir listeners solo cuando el menú está visible
      window.addEventListener('click', handleClickOutside);
      window.addEventListener('contextmenu', handleClickOutside);
    }

    return () => {
      // Limpiar listeners al desmontar o al cerrar el menú
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('contextmenu', handleClickOutside);
    };
  }, [contextMenu]); // Dependencia clave

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, tipoBeneficioFilter, sortBy]);

  // --- LÓGICA DE FILTRADO, ORDENAMIENTO Y PAGINACIÓN ---
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
  
  const paginatedFondos = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFondos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, filteredFondos]);

  const totalPages = Math.ceil(filteredFondos.length / ITEMS_PER_PAGE);

  // --- MANEJADORES DE EVENTOS ---
  const handleCardRightClick = (event: React.MouseEvent, scores: ScoreData) => {
    setContextMenu({ x: event.clientX, y: event.clientY, scores });
  };

  // --- RENDERIZADO ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
        <NavBar />
        <div className="flex flex-col items-center justify-center flex-1 space-y-6">
          <LoopAnimation />
          <p className="text-xl sm:text-2xl font-semibold text-gray-700 animate-pulse">Analizando tu proyecto y buscando los mejores fondos...</p>
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
      <main className="flex-grow p-6 md:p-10 max-w-screen-2xl mx-auto mt-[5%]">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {paginatedFondos.length > 0 ? (
            paginatedFondos.map(fondo => (<FondoCard key={fondo.ID} {...fondo} onRightClick={handleCardRightClick} />))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-500">
                {selectedProject ? "No se encontraron fondos recomendados para este proyecto." : "Por favor, selecciona un proyecto para ver fondos recomendados."}
              </p>
            </div>
          )}
        </div>
        
        <footer className="flex flex-col sm:flex-row justify-between items-center mt-10 text-slate-600">
          <p>Mostrando {paginatedFondos.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredFondos.length)} de {filteredFondos.length} fondos</p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed">&lt;</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                <button key={pageNumber} onClick={() => setCurrentPage(pageNumber)} className={`px-3 py-1 border rounded-lg ${currentPage === pageNumber ? 'bg-[#44624a] text-white border-[#44624a]' : 'hover:bg-slate-200'}`}>
                  {pageNumber}
                </button>
              ))}
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed">&gt;</button>
            </div>
          )}
        </footer>
      </main>
      
      {/* Renderiza el menú contextual si el estado no es null */}
      {contextMenu && (
        <ScoreContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          scores={contextMenu.scores} 
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

export default FondosconPorcentaje;