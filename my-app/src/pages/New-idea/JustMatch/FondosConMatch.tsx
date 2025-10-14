import React, { useState, useMemo, useEffect } from 'react';
import NavBar from '../../../components/NavBar/navbar';
import { Link, useNavigate } from 'react-router-dom';
import { DisclaimerModal } from '../../../components/Shared/Disclaimer';
import LoopAnimation from '../../../components/Shared/animationFrame';

// --- IMPORTACIONES DE API Y MODELOS ---
// (Asegúrate de que las rutas y nombres de archivo sean correctos en tu proyecto)

import { VerCalceFondosIAAsync } from '../../../api/VerCalceFondosIA';
import type MatchResult from '../../../models/MatchResult';
import type Proyecto from '../../../models/Proyecto';
import { VerFondosIAAsync } from '../../../api/VerFondosIA';

const colorPalette = {
  darkGreen: '#44624a',
  softGreen: '#8ba888',
  oliveGray: '#505143',
  lightGray: '#f1f5f9',
};

// --- INTERFACES Y TIPOS ---
interface ProyectoSeleccionado {
  id: number;
  nombre: string;
  resumen: string;
  area: string;
}

// Interfaz de Fondo ajustada para datos de la API
interface Fondo {
  ID: number;
  Titulo: string;
  Descripcion: string;
  PresupuestoMaximo?: number;
  Categoria: string;
  ImagenUrl?: string;
  // Campos de compatibilidad y scores (opcionales)
  compatibilidad?: number;
  semantic_score?: number;
  topic_score?: number;
  rules_score?: number;
}

interface ScoreData {
  semantic_score?: number;
  topic_score?: number;
  rules_score?: number;
}

interface FondoCardProps extends Fondo {
  onRightClick: (event: React.MouseEvent, scores: ScoreData) => void;
}


// --- COMPONENTES AUXILIARES ---

const ScoreContextMenu: React.FC<{ x: number, y: number, scores: ScoreData }> = ({ x, y, scores }) => (
  <div
    style={{ top: y, left: x, position: 'fixed' }}
    className="bg-white p-4 rounded-lg shadow-xl z-50 border border-slate-200"
    onClick={(e) => e.stopPropagation()}
  >
    <h4 className="font-bold text-slate-800 mb-2 text-md">Scores del Calce de IA</h4>
    <ul className="text-sm text-slate-600 space-y-1">
      <li><strong>Semantic Score:</strong> {scores.semantic_score?.toFixed(4) ?? 'N/A'}</li>
      <li><strong>Topic Score:</strong> {scores.topic_score ?? 'N/A'}</li>
      <li><strong>Rules Score:</strong> {scores.rules_score ?? 'N/A'}</li>
    </ul>
  </div>
);

const SearchIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={colorPalette.oliveGray} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const GraduationCapIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={colorPalette.darkGreen} className="w-6 h-6">
    <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-.07.002z" />
  </svg>
);
const FondoCard: React.FC<FondoCardProps> = ({ 
    ID, // <--- 1. Asegúrate de recibir el ID desde las props
    Titulo, Descripcion, compatibilidad, PresupuestoMaximo, Categoria, ImagenUrl,
    semantic_score, topic_score, rules_score, onRightClick 
}) => {
  const navigate = useNavigate();
  const defaultImage = '/sin-foto.png';

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    onRightClick(event, { semantic_score, topic_score, rules_score });
  };

  const formattedPresupuesto = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(PresupuestoMaximo || 0);

  return (
    <div 
      onContextMenu={handleContextMenu}
      className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col border border-slate-200/80 cursor-pointer"
    >
      <div className="relative h-52">
        <img src={ImagenUrl || defaultImage} alt={Titulo} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = defaultImage; }} />
        {compatibilidad !== undefined && (
          <span className="absolute top-4 left-4 bg-[rgba(68,98,74,0.8)] backdrop-blur-sm text-white text-sm font-semibold py-1 px-3 rounded-lg">
            {compatibilidad}% compatibilidad
          </span>
        )}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center">
          <GraduationCapIcon />
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-slate-800 mb-2">{Titulo}</h2>
        <p className="text-slate-500 text-sm flex-grow mb-4 line-clamp-4">{Descripcion}</p>
        <div className="flex justify-between items-center border-t border-slate-200 pt-4 mb-4">
          <span className="bg-[rgba(139,168,136,0.2)] text-[rgba(68,98,74,1)] text-xs font-semibold px-3 py-1 rounded-full">{Categoria}</span>
          <span className="font-bold text-slate-700">{formattedPresupuesto}</span>
        </div>
        <button
          // 2. Modificamos el onClick para usar el ID en la URL
          onClick={() => navigate(`/Matcha/Select-Project/fondos/detalle/${ID}`)}
          className="w-full bg-[#8ba888] hover:bg-[rgba(68,98,74,0.8)] text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300"
        >
          Ver más detalles
        </button>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

const FondosconPorcentaje: React.FC = () => {
  // Estados para datos y carga
  const [selectedProject, setSelectedProject] = useState<ProyectoSeleccionado | null>(null);
  const [fondos, setFondos] = useState<Fondo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para UI y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('Todas');
  const [sortBy, setSortBy] = useState<'compatibilidad' | 'alfabetico' | 'presupuesto'>('compatibilidad');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
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

  useEffect(() => {
    const CargarFondosYCalces = async () => {
      setIsLoading(true);
      setError(null);

      let project: Proyecto | undefined = undefined;
      const projectData = localStorage.getItem('selectedProject');
      
      if (projectData) {
        try {
          project = JSON.parse(projectData);
          setSelectedProject({id: project!.ID, nombre: project!.Titulo, resumen: project!.Descripcion, area: project!.Area});
          await enviarProyectoAI(project!); // Envía el proyecto a la IA
        } catch (err) {
          console.error("Error procesando proyecto seleccionado:", err);
          setError("No se pudo leer el proyecto seleccionado del almacenamiento local.");
          setIsLoading(false);
          return;
        }
      }

      try {
        const todosLosFondosResponse = await VerFondosIAAsync();
        const listaDeFondos: Fondo[] = todosLosFondosResponse?.funds || [];

        if (project && project.ID) {
          const calces: MatchResult[] = await VerCalceFondosIAAsync(project.ID);
          const fondosConCompatibilidad = listaDeFondos.map(fondo => {
            const match = calces.find(c => c.name === fondo.Titulo);
            return {
              ...fondo,
              compatibilidad: match ? Math.floor((match.affinity || 0) * 100) : 0,
              semantic_score: match?.semantic_score,
              topic_score: match?.topic_score,
              rules_score: match?.rules_score,
            };
          });
          setFondos(fondosConCompatibilidad);
        } else {
          setFondos(listaDeFondos);
        }
      } catch (err: any) {
        setError(err.message || "Ocurrió un error al cargar los fondos.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    CargarFondosYCalces();
  }, []);
   useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);
    const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  
    useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);
  
  const categorias = useMemo(() => ['Todas', ...new Set(fondos.map(f => f.Categoria))], [fondos]);

  const filteredFondos = useMemo(() => {
    let fondosFiltrados = [...fondos];
    if (searchTerm) fondosFiltrados = fondosFiltrados.filter(f => f.Titulo.toLowerCase().includes(searchTerm.toLowerCase()));
    if (categoriaFilter !== 'Todas') fondosFiltrados = fondosFiltrados.filter(f => f.Categoria === categoriaFilter);
    fondosFiltrados.sort((a, b) => {
      switch (sortBy) {
        case 'alfabetico': return a.Titulo.localeCompare(b.Titulo);
        case 'compatibilidad': return (b.compatibilidad ?? 0) - (a.compatibilidad ?? 0);
        case 'presupuesto': return (b.PresupuestoMaximo ?? 0) - (a.PresupuestoMaximo ?? 0);
        default: return 0;
      }
    });
    return fondosFiltrados;
  }, [searchTerm, categoriaFilter, sortBy, fondos]);

  // --- PAGINACIÓN: Paso 2 -> useEffect para resetear la página cuando cambian los filtros ---
  // Esto evita que te quedes en una página que ya no existe después de filtrar.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoriaFilter, sortBy]);

  // --- PAGINACIÓN: Paso 3 -> Calcular los fondos a mostrar en la página actual ---
  const paginatedFondos = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFondos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, filteredFondos]);

  const handleCardRightClick = (event: React.MouseEvent, scores: ScoreData) => {
    setContextMenu({ x: event.clientX, y: event.clientY, scores });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
        <NavBar />
        <div className="flex flex-col items-center justify-center flex-1 space-y-6">
          <LoopAnimation />
          <p className="text-xl sm:text-2xl font-semibold text-gray-700 animate-pulse">
            Buscando los mejores fondos para ti...
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
  const totalPages = Math.ceil(filteredFondos.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <NavBar />
      {showDisclaimer && <DisclaimerModal onClose={() => setShowDisclaimer(false)} />}
      <main className="flex-grow p-6 md:p-10 max-w-screen-2xl mx-auto mt-[5%]">
        
        {/* --- TU CÓDIGO DEL TÍTULO REINTEGRADO --- */}
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

        {/* --- TU CÓDIGO DEL HEADER REINTEGRADO --- */}
        <header className="bg-white p-4 sm:p-6 rounded-2xl shadow-md mb-8 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Busca tu fondo manualmente"
              className="w-full bg-[rgba(241,245,249,1)] border border-[rgba(80,81,67,0.3)] rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[rgba(68,98,74,1)]"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={categoriaFilter}
              onChange={(e) => setCategoriaFilter(e.target.value)}
              className="bg-[rgba(139,168,136,0.2)] text-[rgba(80,81,67,1)] font-semibold py-3 px-5 rounded-lg cursor-pointer focus:outline-none"
            >
              {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <div className="relative">
              <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="bg-[rgba(139,168,136,0.2)] text-[rgba(80,81,67,1)] font-semibold py-3 px-5 rounded-lg transition-colors">
                Ordenar
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10">
                  <button onClick={() => { setSortBy('alfabetico'); setDropdownOpen(false); }} className="block px-4 py-2 text-[rgba(80,81,67,1)] hover:bg-[rgba(139,168,136,0.2)] w-full text-left">Alfabético</button>
                  <button onClick={() => { setSortBy('compatibilidad'); setDropdownOpen(false); }} className="block px-4 py-2 text-[rgba(80,81,67,1)] hover:bg-[rgba(139,168,136,0.2)] w-full text-left">Porcentaje de match</button>
                  <button onClick={() => { setSortBy('presupuesto'); setDropdownOpen(false); }} className="block px-4 py-2 text-[rgba(80,81,67,1)] hover:bg-[rgba(139,168,136,0.2)] w-full text-left">Presupuesto</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* --- BANNER OPCIONAL REINTEGRADO --- */}
        {!selectedProject && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-8">
            <p className="font-bold">No has seleccionado un proyecto.</p>
            <p>Mostrando todos los fondos disponibles. Para ver recomendaciones personalizadas, <Link to="/Matcha/Select-Project" className="underline font-semibold">selecciona un proyecto primero</Link>.</p>
          </div>
        )}

        {/* --- GRID DE TARJETAS (Ahora usa paginatedFondos) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {paginatedFondos.length > 0 ? (
            paginatedFondos.map(fondo => (
              <FondoCard 
                key={fondo.ID} 
                {...fondo}
                onRightClick={handleCardRightClick}
              />
            ))
          ) : (
             <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-500">No se encontraron fondos que coincidan con los filtros.</p>
            </div>
          )}
        </div>

        {/* --- FOOTER CON PAGINACIÓN DINÁMICA --- */}
        <footer className="flex flex-col sm:flex-row justify-between items-center mt-10 text-[rgba(80,81,67,1)]">
          <p>
            Mostrando {Math.min(paginatedFondos.length, filteredFondos.length > 0 ? 1 : 0) > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0} 
            - {Math.min(currentPage * ITEMS_PER_PAGE, filteredFondos.length)} de {filteredFondos.length} fondos
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-lg hover:bg-[rgba(139,168,136,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt;
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                <button 
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 py-1 border rounded-lg ${
                    currentPage === pageNumber 
                    ? 'bg-[rgba(68,98,74,1)] text-white border-[rgba(68,98,74,1)]' 
                    : 'hover:bg-[rgba(139,168,136,0.2)]'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-lg hover:bg-[rgba(139,168,136,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &gt;
              </button>
            </div>
          )}
        </footer>
      </main>

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

export default FondosconPorcentaje;