import React, { useState, useMemo, useEffect } from 'react';
import NavBar from '../../../components/NavBar/navbar';
import { useNavigate } from 'react-router-dom';
import { DisclaimerModal } from '../../../components/Shared/Disclaimer';
import LoopAnimation from '../../../components/Shared/animationFrame';
import { getMatchFondosAsync, processIdeaAsync, checkCollectionsHealth, type ProcessIdeaRequest } from '../../../api/MatchFondos';

const colorPalette = {
  darkGreen: '#44624a',
  softGreen: '#8ba888',
  oliveGray: '#505143',
  lightGray: '#f1f5f9',
};


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

const SearchIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={colorPalette.oliveGray} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg> );
const GraduationCapIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={colorPalette.darkGreen} className="w-6 h-6"><path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-.07.002z" /></svg> );
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
  return new Date(dateString).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
interface FondoCardProps extends Fondo {
  onRightClick: (event: React.MouseEvent, scores: ScoreData) => void;
}
interface ScoreData {
  semantic_score?: number;
  topic_score?: number;
  rules_score?: number;
}

const FondoCard: React.FC<FondoCardProps> = ({ ID, Titulo, Descripcion, compatibilidad, Estado, FechaDeCierre, MontoMaximo, TipoDeBeneficio, EnlaceDeLaFoto, semantic_score, topic_score, rules_score, onRightClick }) => {
  const navigate = useNavigate();
  const defaultImage = '/sin-foto.png';
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
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



const FondosIdea: React.FC = () => {
  const [selectedIdea, setSelectedIdea] = useState<IdeaLocal | null>(null);
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
    const loadIdeaAndMatch = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar la idea seleccionada con manejo seguro
        let ideaData: IdeaLocal | null = null;
        
        try {
          const selectedIdeaData = localStorage.getItem('selectedIdea');
          console.log('Raw selectedIdea data:', selectedIdeaData);
          
          if (selectedIdeaData && selectedIdeaData !== 'undefined' && selectedIdeaData.trim() !== '') {
            const parsed = JSON.parse(selectedIdeaData);
            // Validar que sea un objeto válido y normalizarlo
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
          console.error('Error parsing selectedIdea from localStorage:', parseError);
        }
        
        // Fallback: usar la última idea del localStorage
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
        
        setSelectedIdea(ideaData);
        
        console.log('Iniciando match para idea ID:', ideaData.id);
        
        // Hacer match con la API de IA
        if (ideaData.id) {
          try {
            console.log('Haciendo match para idea ID:', ideaData.id);
            
            // Primero procesar la idea en la API de IA para guardarla en Qdrant
            console.log('Procesando idea...');
            
            // Obtener el ID del usuario desde sessionStorage
            let usuarioId = 1; // fallback
            try {
              const storedUser = sessionStorage.getItem("usuario");
              if (storedUser) {
                const userData = JSON.parse(storedUser);
                usuarioId = userData.Usuario?.ID || 1;
              }
            } catch (userError) {
              console.error('Error al obtener usuario:', userError);
            }
            
            const processRequest: ProcessIdeaRequest = {
              ID: ideaData.id,
              Usuario: usuarioId,
              Campo: ideaData.field,
              Problema: ideaData.problem,
              Publico: ideaData.audience,
              Innovacion: ideaData.uniqueness
            };
            
            try {
              await processIdeaAsync(processRequest);
              console.log('Idea procesada exitosamente');
            } catch (processError) {
              console.error('Error al procesar idea:', processError);
            console.log('Continuando con match aunque falló el procesamiento (puede que ya esté procesada)');
              // Continuar con el match aunque falle el procesamiento
              // En caso de que la idea ya esté procesada
            }
            
            // Ahora hacer el match con el nuevo endpoint GET simplificado
            const matches = await getMatchFondosAsync({
              idea_id: ideaData.id,
              top_k: 10
            });
            
            console.log('Matches recibidos:', matches);
            
            if (!matches || matches.length === 0) {
              console.log('No se recibieron matches de la API');
              console.warn('API de IA: Puede que las colecciones de fondos no estén cargadas.');
              
              // Verificar estado de colecciones
              try {
                const healthStatus = await checkCollectionsHealth();
                console.log('Estado de colecciones verificado:', healthStatus);
                if (healthStatus.collections.funds === 0) {
                  console.log('Para cargar fondos: Ejecutar await subir_instrumentos_del_backend(provider) en la API de IA');
                }
              } catch (healthError) {
                console.error('No se pudo verificar estado de colecciones:', healthError);
              }
              
              setError('No se encontraron fondos compatibles');
              setLoading(false);
              return;
            }
            
            // Convertir MatchResult a Fondo (usando datos reales de la API)
            const fondosFromMatch: Fondo[] = matches.map((match, index) => ({
              ID: match.call_id,
              Titulo: match.name,
              Descripcion: match.explanations.length > 0 
                ? `${match.explanations.join(', ')}. Compatibilidad: ${(match.affinity * 100).toFixed(1)}%`
                : `Compatibilidad: ${(match.affinity * 100).toFixed(1)}% (Semántico: ${(match.semantic_score * 100).toFixed(1)}%, Temático: ${(match.topic_score * 100).toFixed(1)}%)`,
              Beneficios: '', // Valor por defecto
              Requisitos: '', // Valor por defecto
              Estado: 'ABI', // Valor por defecto, ajustar si tienes el dato
              FechaDeApertura: '', // Valor por defecto
              FechaDeCierre: '', // Valor por defecto
              MontoMinimo: 0, // Valor por defecto
              MontoMaximo: 0, // Valor por defecto
              DuracionEnMeses: 0, // Valor por defecto
              Alcance: '', // Valor por defecto
              TipoDeBeneficio: '', // Valor por defecto
              TipoDePerfil: '', // Valor por defecto
              EnlaceDeLaFoto: `https://images.unsplash.com/photo-${1542744173000 + index}?auto=format&fit=crop&w=800&q=60`,
              EnlaceDelDetalle: '', // Valor por defecto
              compatibilidad: Math.round(match.affinity * 100),
              semantic_score: match.semantic_score,
              topic_score: match.topic_score,
              rules_score: match.rules_score
            }));
            
            console.log('Fondos convertidos exitosamente:', fondosFromMatch.length, 'fondos');
            setMatchedFondos(fondosFromMatch);
          } catch (matchError) {
            console.error('Error al hacer match con la API:', matchError);
            setError(`Error al conectar con la API de matching: ${matchError}`);
          }
        }
        
      } catch (generalError) {
        console.error('Error general al cargar idea y match:', generalError);
        setError(`Error general: ${generalError}`);
      } finally {
        setLoading(false);
      }
    };

    loadIdeaAndMatch();
  }, []);

  const categorias = useMemo(() => {
    const allCategorias = matchedFondos.map(f => f.Alcance).filter(Boolean);
    return ['Todas', ...new Set(allCategorias)];
  }, [matchedFondos]);

  const matchedAndFilteredFondos = useMemo(() => {
    if (!selectedIdea || matchedFondos.length === 0) {
      return [];
    }

    let fondosConMatch: Fondo[] = [...matchedFondos];

    if (searchTerm) fondosConMatch = fondosConMatch.filter(f => f.Titulo.toLowerCase().includes(searchTerm.toLowerCase()));
    if (categoriaFilter !== 'Todas') fondosConMatch = fondosConMatch.filter(f => f.Alcance === categoriaFilter);

    fondosConMatch.sort((a, b) => {
      switch (sortBy) {
        case 'alfabetico': return a.Titulo.localeCompare(b.Titulo);
        case 'compatibilidad': return (b.compatibilidad ?? 0) - (a.compatibilidad ?? 0);
        case 'presupuesto':
          // Para presupuestos de API que son "Consultar en detalle", mantener el orden actual
          const aPresupuesto = a.MontoMinimo || 0;
          const bPresupuesto = b.MontoMaximo || 0;
          return bPresupuesto - aPresupuesto;
        default: return 0;
      }
    });

    return fondosConMatch;
  }, [selectedIdea, matchedFondos, searchTerm, categoriaFilter, sortBy]);


  if (loading || showAnimation) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
        <NavBar />
        <div className="flex flex-col items-center justify-center flex-1 space-y-6">
          <LoopAnimation />
          <p className="text-xl sm:text-2xl font-semibold text-gray-700 animate-pulse">
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
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
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
      <main className="flex-grow p-6 md:p-10 max-w-screen-2xl mx-auto mt-[5%]">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {matchedAndFilteredFondos.map(fondo => (
            <FondoCard
              key={fondo.ID}
              ID={fondo.ID}
              Titulo={fondo.Titulo}
              Descripcion={fondo.Descripcion}
              Beneficios={fondo.Beneficios}
              Requisitos={fondo.Requisitos}
              Estado={fondo.Estado}
              FechaDeApertura={fondo.FechaDeApertura}
              FechaDeCierre={fondo.FechaDeCierre}
              MontoMinimo={fondo.MontoMinimo}
              MontoMaximo={fondo.MontoMaximo}
              DuracionEnMeses={fondo.DuracionEnMeses}
              Alcance={fondo.Alcance}
              TipoDeBeneficio={fondo.TipoDeBeneficio}
              TipoDePerfil={fondo.TipoDePerfil}
              EnlaceDeLaFoto={fondo.EnlaceDeLaFoto}
              EnlaceDelDetalle={fondo.EnlaceDelDetalle}
              compatibilidad={fondo.compatibilidad}
              semantic_score={fondo.semantic_score}
              topic_score={fondo.topic_score}
              rules_score={fondo.rules_score}
              onRightClick={() => {}}
            />
          ))}
        </div>

      </main>
    </div>
  );
};

export default FondosIdea;