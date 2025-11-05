import React, { useState, useMemo, useEffect, useRef } from 'react';
import NavBar from '../../../components/NavBar/navbar';
import { useNavigate } from 'react-router-dom';
import { DisclaimerModal } from '../../../components/Shared/Disclaimer';
import LoopAnimation from '../../../components/Shared/animationFrame';
import { getMatchFondosAsync, processIdeaAsync, type ProcessIdeaRequest } from '../../../api/MatchFondos';

const colorPalette = {
  darkGreen: '#44624a',
  softGreen: '#8ba888',
  oliveGray: '#505143',
  lightGray: '#f1f5f9',
};

// --- INTERFACES ---
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

interface IdeaLocal {
  id: number;
  field: string;
  problem: string;
  audience: string;
  uniqueness: string;
  propuesta?: string;
}

// --- COMPONENTES AUXILIARES Y FUNCIONES DE FORMATO ---
const SearchIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={colorPalette.oliveGray} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg> );

const StatusBadge: React.FC<{ estado: string; className?: string }> = ({ estado, className }) => {
  const isAbierto = estado === 'ABI';
  const bgColor = isAbierto ? 'bg-green-100' : 'bg-red-100';
  const textColor = isAbierto ? 'text-green-800' : 'text-red-800';
  const text = isAbierto ? 'Abierto' : 'Cerrado';
  const ringColor = isAbierto ? 'ring-green-200' : 'ring-red-200';
  return (<span className={`px-3 py-1 text-xs font-bold rounded-full ring-2 ring-inset ${bgColor} ${textColor} ${ringColor} ${className}`}>{text}</span>);
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'No especificada';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch (error) {
    return 'Fecha inválida';
  }
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
};

// --- COMPONENTE DE TARJETA DE FONDO ACTUALIZADO ---
interface FondoCardProps extends Fondo {
}

const FondoCard: React.FC<FondoCardProps> = ({ 
  ID, Titulo, Descripcion, compatibilidad, Estado, FechaDeApertura, FechaDeCierre, MontoMinimo, MontoMaximo, TipoDeBeneficio, EnlaceDeLaFoto,
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
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col border border-slate-200/80 cursor-pointer h-auto sm:min-h-[380px]">
      {/* Imagen oculta en móvil como en búsqueda libre */}
      <div className="relative h-52 flex-shrink-0 hidden sm:block">
        <img 
          src={EnlaceDeLaFoto || defaultImage} 
          alt={Titulo} 
          className="w-full h-full object-cover" 
          onError={(e) => { e.currentTarget.src = defaultImage; }}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        {compatibilidad !== undefined && (<span className="absolute top-4 left-4 bg-[rgba(68,98,74,0.8)] backdrop-blur-sm text-white text-sm font-semibold py-1 px-3 rounded-lg">{compatibilidad}% compatibilidad</span>)}
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

      <div className="p-4 sm:p-6 flex flex-col flex-grow">
        {/* Badges móviles - solo visibles en móvil */}
        <div className="flex justify-between items-center mb-2 sm:hidden">
          {compatibilidad !== undefined && (
            <span className="bg-[rgba(68,98,74,0.8)] text-white text-sm font-semibold py-1 px-3 rounded-lg">
              {compatibilidad}% compatibilidad
            </span>
          )}
          <StatusBadge estado={Estado} />
        </div>
        
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 line-clamp-2 h-auto sm:h-14">{Titulo}</h2>
        <p className="text-slate-500 text-sm mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-4 h-auto sm:h-16">{Descripcion}</p>
        
        <div className="mt-3 sm:mt-auto border-t border-slate-200 pt-3 sm:pt-4 space-y-2 sm:space-y-3">
            <div className="flex items-center text-sm text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-slate-400 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /></svg>
                <strong>Apertura:</strong><span className="ml-2">{formatDate(FechaDeApertura)}</span>
            </div>
            <div className="flex items-center text-sm text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-slate-400 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /></svg>
                <strong>Cierre:</strong><span className="ml-2">{formatDate(FechaDeCierre)}</span>
            </div>

            {MontoMinimo > 0 && (
                <div className="flex items-center text-sm text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-slate-400 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <strong>Monto Mín:</strong><span className="ml-2">{formatCurrency(MontoMinimo)}</span>
                </div>
            )}
            {MontoMaximo > 0 && (
                <div className="flex items-center text-sm text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-slate-400 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <strong>Monto Máx:</strong><span className="ml-2">{formatCurrency(MontoMaximo)}</span>
                </div>
            )}

            <div className="flex justify-start pt-1 sm:pt-2">
                <span className="bg-[rgba(139,168,136,0.2)] text-[rgba(68,98,74,1)] text-xs font-semibold px-3 py-1 rounded-full">{TipoDeBeneficio || 'No especificado'}</span>
            </div>
        </div>

        <button 
          onClick={() => navigate(`/Matcha/Select-Project/fondos/detalle/${ID}`)} 
          className="w-full text-white font-bold py-2 sm:py-3 px-4 rounded-xl mt-3 sm:mt-6"
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
  );
};


// --- COMPONENTE PRINCIPAL DE LA PÁGINA ---
const FondosIdea: React.FC = () => {
  const [selectedIdea, setSelectedIdea] = useState<IdeaLocal | null>(null);
  const hasLoadedRef = useRef(false);
  const [matchedFondos, setMatchedFondos] = useState<Fondo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('Todas');
  const [sortBy, setSortBy] = useState<'compatibilidad' | 'alfabetico' | 'presupuesto'>('compatibilidad');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
      const timer = setTimeout(() => setShowAnimation(false), 5000);
      return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Prevenir ejecuciones múltiples causadas por React StrictMode
    if (hasLoadedRef.current) {
      return;
    }
    hasLoadedRef.current = true;

    const loadIdeaAndMatch = async () => {
      try {
        setLoading(true);
        setError(null);
        let ideaData: IdeaLocal | null = null;
        
        try {
          // Primero intentar obtener de 'ideaParaMatch' (viene desde Projects.tsx)
          let selectedIdeaData = localStorage.getItem('ideaParaMatch');
          
          // Fallback a 'selectedIdea' para compatibilidad
          if (!selectedIdeaData || selectedIdeaData === 'undefined' || selectedIdeaData.trim() === '') {
            selectedIdeaData = localStorage.getItem('selectedIdea');
          }
          
          if (selectedIdeaData && selectedIdeaData !== 'undefined' && selectedIdeaData.trim() !== '') {
            const parsed = JSON.parse(selectedIdeaData);
            if (parsed && typeof parsed === 'object') {
              ideaData = { 
                id: parsed.ID || parsed.id, 
                field: parsed.Campo || parsed.field, 
                problem: parsed.Problema || parsed.problem, 
                audience: parsed.Publico || parsed.audience, 
                uniqueness: parsed.Innovacion || parsed.uniqueness, 
                propuesta: parsed.Propuesta || parsed.propuesta 
              };
            }
          }
        } catch (parseError) { 
          console.error('Error parsing idea from localStorage:', parseError); 
        }
        
        if (!ideaData) {
          try {
            const allIdeas = JSON.parse(localStorage.getItem("userIdeas") || "[]");
            if (allIdeas.length > 0) {
              const lastIdea = allIdeas[allIdeas.length - 1];
              ideaData = { 
                id: lastIdea.ID || lastIdea.id, 
                field: lastIdea.Campo || lastIdea.field, 
                problem: lastIdea.Problema || lastIdea.problem, 
                audience: lastIdea.Publico || lastIdea.audience, 
                uniqueness: lastIdea.Innovacion || lastIdea.uniqueness, 
                propuesta: lastIdea.Propuesta || lastIdea.propuesta 
              };
            }
          } catch (fallbackError) { 
            console.error('Error parsing userIdeas from localStorage:', fallbackError); 
          }
        }
        
        if (!ideaData) {
          setError('No se pudo cargar la idea seleccionada');
          setLoading(false);
          return;
        }

        // Limpiar localStorage después de usar la idea
        localStorage.removeItem('ideaParaMatch');
        setSelectedIdea(ideaData);
        
        // Obtener usuario
        let usuarioId = 1;
        try {
          const storedUser = sessionStorage.getItem("usuario");
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            usuarioId = userData?.Usuario?.ID || 1;
          }
        } catch (userError) { 
          console.error('Error al obtener usuario:', userError); 
        }
        
        // Procesar idea si es necesario
        const processRequest: ProcessIdeaRequest = { 
          ID: ideaData.id, 
          Usuario: usuarioId, 
          Campo: ideaData.field, 
          Problema: ideaData.problem, 
          Publico: ideaData.audience, 
          Innovacion: ideaData.uniqueness 
        };
        
        try {
          if (!ideaData.propuesta || ideaData.propuesta.trim() === "") {
            await processIdeaAsync(processRequest);
          }
        } catch (processError) { 
          console.error('Error al procesar idea:', processError); 
        }
        
        // Hacer match de fondos
        const matches = await getMatchFondosAsync({ idea_id: ideaData.id, top_k: 10 });
        
        if (!matches || matches.length === 0) {
          setError('No se encontraron fondos compatibles');
          setLoading(false);
          return;
        }

        // Obtener la lista completa de fondos
        const { VerFondosIAAsync } = await import('../../../api/VerFondosIA');
        const fondosResponse = await VerFondosIAAsync();
        
        if (!fondosResponse || !fondosResponse.funds) {
          setError('No se pudo obtener la información completa de los fondos');
          setLoading(false);
          return;
        }
        
        const todosLosFondos = fondosResponse.funds;
        
        // Combinar datos del matching con datos reales de los fondos
        const fondosFromMatch: Fondo[] = matches.reduce((acc: Fondo[], match) => {
          const fondoCompleto = todosLosFondos.find((f: Fondo) => f.ID === match.call_id);
          if (fondoCompleto) {
            acc.push({
              ...fondoCompleto,
              compatibilidad: Math.round(match.affinity * 100),
              semantic_score: match.semantic_score,
              topic_score: match.topic_score,
              rules_score: match.rules_score
            });
          }
          return acc;
        }, []);
        
        if (fondosFromMatch.length === 0) {
          setError('No se encontraron fondos válidos en la base de datos');
          setLoading(false);
          return;
        }
        
        setMatchedFondos(fondosFromMatch);
        
      } catch (error) { 
        console.error('Error:', error); 
        setError('Ocurrió un error al cargar los fondos'); 
      } finally { 
        setLoading(false); 
      }
    };
    
    loadIdeaAndMatch();
  }, []);

  const categorias = useMemo(() => ['Todas', ...new Set(matchedFondos.map(f => f.Alcance).filter(Boolean))], [matchedFondos]);

  const matchedAndFilteredFondos = useMemo(() => {
    if (!selectedIdea || matchedFondos.length === 0) return [];
    let fondos = [...matchedFondos];
    if (searchTerm) fondos = fondos.filter(f => f.Titulo.toLowerCase().includes(searchTerm.toLowerCase()));
    if (categoriaFilter !== 'Todas') fondos = fondos.filter(f => f.Alcance === categoriaFilter);
    fondos.sort((a, b) => {
      switch (sortBy) {
        case 'alfabetico': return a.Titulo.localeCompare(b.Titulo);
        case 'compatibilidad': return (b.compatibilidad ?? 0) - (a.compatibilidad ?? 0);
        case 'presupuesto': return (b.MontoMaximo || 0) - (a.MontoMaximo || 0);
        default: return 0;
      }
    });
    return fondos;
  }, [selectedIdea, matchedFondos, searchTerm, categoriaFilter, sortBy]);

  if (loading || showAnimation) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
        <NavBar />
        <div className="flex flex-col items-center justify-center flex-1 space-y-6 px-4">
          <LoopAnimation />
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 animate-pulse text-center max-w-md sm:max-w-lg">
            {loading ? 'Buscando fondos compatibles...' : 'Cargando...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f1f5f9]">
        <NavBar />
        <main className="flex-grow p-10 max-w-screen-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-red-600">Error al cargar fondos</h1>
          <p className="text-slate-500 mt-2">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Reintentar</button>
        </main>
      </div>
    );
  }
    
  if (!selectedIdea) {
    return (
      <div className="min-h-screen bg-[#f1f5f9]">
        <NavBar />
        <main className="flex-grow p-10 max-w-screen-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-slate-700">No se ha seleccionado una idea.</h1>
          <p className="text-slate-500 mt-2">Por favor, <a href="/Matcha/New-idea" className="text-blue-600 underline">crea una nueva idea</a> para encontrar fondos compatibles.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <NavBar />
      {showDisclaimer && <DisclaimerModal onClose={() => setShowDisclaimer(false)} />}

      <main className="flex-grow p-6 md:p-10 max-w-screen-2xl mx-auto mt-24 sm:mt-32">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#505143]">Fondos Recomendados para tu Idea</h1>
          <h2 className="text-3xl font-semibold text-[#44624a] mt-1">"{selectedIdea.field}"</h2>
        </div>

        <header className="bg-white p-4 sm:p-6 rounded-2xl shadow-md mb-8 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Busca tu fondo manualmente" className="w-full bg-[rgba(241,245,249,1)] border border-[rgba(80,81,67,0.3)] rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[rgba(68,98,74,1)]"/>
            </div>
            <div className="flex items-center gap-2">
                <select value={categoriaFilter} onChange={(e) => setCategoriaFilter(e.target.value)} className="bg-[rgba(139,168,136,0.2)] text-[rgba(80,81,67,1)] font-semibold py-3 px-5 rounded-lg cursor-pointer focus:outline-none">
                    {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <div className="relative">
                    <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="bg-[rgba(139,168,136,0.2)] text-[rgba(80,81,67,1)] font-semibold py-3 px-5 rounded-lg transition-colors">Ordenar</button>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {matchedAndFilteredFondos.map(fondo => (
            <FondoCard
              key={fondo.ID}
              {...fondo}
            />
          ))}
        </div>
        
        {matchedAndFilteredFondos.length === 0 && !loading && (
          <div className="text-center col-span-full py-16">
            <h3 className="text-2xl font-bold text-slate-700">No se encontraron resultados</h3>
            <p className="text-slate-500 mt-2">Intenta cambiar los filtros o el término de búsqueda.</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default FondosIdea;