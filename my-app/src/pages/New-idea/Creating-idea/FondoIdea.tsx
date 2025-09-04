import React, { useState, useMemo, useEffect, useCallback } from 'react';
import NavBar from '../../../components/NavBar/navbar';
import { useNavigate } from 'react-router-dom';
import { DisclaimerModal } from '../../../components/Shared/Disclaimer';
import LoopAnimation from '../../../components/Shared/animationFrame';

// --- APIS ---
import { VerTodosLosFondosIAAsync } from '../../../api/VerTodosLosFondos';
import { VerCalceFondosIAAsync } from '../../../api/VerCalceFondosIA';


const colorPalette = {
  darkGreen: '#44624a',
  softGreen: '#8ba888',
  oliveGray: '#505143',
  lightGray: '#f1f5f9',
};

// --- INTERFACES ---

// Interfaz para el objeto de "calce" que devuelve tu API
interface CalceFondo {
  name: string;
  affinity: number;
  call_id?: number;
}

// Interfaz para un Fondo individual
interface Fondo {
  id: number;
  nombre: string;
  descripcion: string;
  presupuesto: string;
  categoria: string;
  imagenUrl: string;
  compatibilidad?: number; // Se añade dinámicamente
}

// Interfaz para la Idea. El ID es opcional porque puede que no lo tenga al inicio.
interface Idea {
  id?: number; // <-- ID es opcional ahora
  field: string;
  problem: string;
  audience: string;
  uniqueness: string;
}

// --- COMPONENTES DE UI (Sin cambios) ---
const SearchIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={colorPalette.oliveGray} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg> );
const GraduationCapIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={colorPalette.darkGreen} className="w-6 h-6"><path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-.07.002z" /></svg> );

const FondoCard: React.FC<{ fondo: Fondo }> = ({ fondo }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col border border-slate-200/80">
      <div className="relative h-52">
        <img src={fondo.imagenUrl} alt={fondo.nombre} className="w-full h-full object-cover" />
        <span className="absolute top-4 left-4 bg-[rgba(68,98,74,0.8)] backdrop-blur-sm text-white text-sm font-semibold py-1 px-3 rounded-lg">
          {fondo.compatibilidad}% compatibilidad
        </span>
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center">
          <GraduationCapIcon />
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-slate-800 mb-2">{fondo.nombre}</h2>
        <p className="text-slate-500 text-sm flex-grow mb-4">{fondo.descripcion}</p>
        <div className="flex justify-between items-center border-t border-slate-200 pt-4 mb-4">
          <span className="bg-[rgba(139,168,136,0.2)] text-[rgba(68,98,74,1)] text-xs font-semibold px-3 py-1 rounded-full">{fondo.categoria}</span>
          <span className="font-bold text-slate-700">{fondo.presupuesto}</span>
        </div>
        <button
          onClick={() => navigate("detalle")} // Considera pasar el ID: navigate(`detalle/${fondo.id}`)
          className="w-full bg-[#8ba888] hover:bg-[rgba(68,98,74,0.8)] text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300"
        >
          Ver más detalles
        </button>
      </div>
    </div>
  );
};


const FondosIdea: React.FC = () => {
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [fondos, setFondos] = useState<Fondo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de UI (sin cambios)
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('Todas');
  const [sortBy, setSortBy] = useState<'compatibilidad' | 'alfabetico' | 'presupuesto'>('compatibilidad');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // **PASO 1: LÓGICA REFACTORIZADA PARA CARGAR Y GUARDAR LA IDEA**
  useEffect(() => {
    const guardarIdeaYObtenerId = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const ideaData = localStorage.getItem('selectedIdea');
        if (!ideaData) {
          throw new Error("No hay una idea seleccionada en localStorage.");
        }
        

        const idea = JSON.parse(localStorage.getItem("userIdeas") || "[]").slice(-1)[0];
        idea.id = 130


        console.log("idea :", idea)
   



        // Si la idea NO tiene un ID, la guardamos en el backend para obtener uno.
        if (!idea.id) {
          console.log("Idea sin ID encontrada. Guardando en el backend...");
          // **¡ACCIÓN REQUERIDA!** Debes implementar esta llamada a la API.
          // Debería tomar el objeto 'idea' y devolver el mismo objeto con el 'id' asignado por la base de datos.
          const ideaGuardada = JSON.parse(localStorage.getItem("userIdeas") || "[]").slice(-1)[0];
          
        
          
          if (!ideaGuardada || !ideaGuardada.id) {
              throw new Error("La API no devolvió una idea con ID después de guardarla.");
          }
          
         
          
          // Actualizamos localStorage para futuras visitas a la página.
          localStorage.setItem('selectedIdea', JSON.stringify(idea));
          console.log("Idea guardada exitosamente. Nuevo ID:", idea.id);
        }

        setSelectedIdea(idea); // Establecemos la idea (con ID) en el estado.

      } catch (err: any) {
        console.error("Error al procesar la idea:", err);
        setError(err.message || "No se pudo cargar o guardar la idea seleccionada.");
        setIsLoading(false); // Detenemos la carga si hay un error aquí.
      }
    };

    guardarIdeaYObtenerId();
  }, []); // Se ejecuta solo una vez al montar el componente.


  // **PASO 2: LÓGICA REFACTORIZADA PARA OBTENER FONDOS Y CALCES**
  // Esta función es ahora casi idéntica a la del componente de Proyectos.
  const fetchFondosYCalce = useCallback(async (ideaId= 130) => {
    // Ya no se gestiona setIsLoading aquí, se hace en el flujo principal.
    setError(null);

    try {
      console.log(`Iniciando búsqueda de fondos y calces para la idea ID: ${ideaId}`);
      // Hacemos ambas llamadas en paralelo para mayor eficiencia.
      const [todosLosFondosResponse, calcesResponse] = await Promise.all([
        VerTodosLosFondosIAAsync(),
        VerCalceFondosIAAsync(ideaId)
      ]);

      // Verificación robusta de las respuestas de la API
      const listaDeFondos: Fondo[] = Array.isArray(todosLosFondosResponse?.funds) ? todosLosFondosResponse.funds : [];
      const calces: CalceFondo[] = Array.isArray(calcesResponse) ? calcesResponse : [];

      if (listaDeFondos.length === 0) console.warn("La API de todos los fondos devolvió una lista vacía.");
      if (calces.length === 0) console.warn("La API de calces no encontró afinidades para esta idea.");

      // Combinamos los datos: filtramos los fondos que tienen un calce y les añadimos la compatibilidad.
      const fondosConCompatibilidad = listaDeFondos
        .filter(fondo => calces.some(calce => calce.name === fondo.nombre))
        .map(fondo => {
          const match = calces.find(calce => calce.name === fondo.nombre);
          return {
            ...fondo,
            compatibilidad: Math.floor((match?.affinity || 0) * 100),
          };
        });
      
      console.log("Fondos finales con compatibilidad:", fondosConCompatibilidad);
      setFondos(fondosConCompatibilidad);

    } catch (err: any) {
      console.error("Error al obtener los fondos y su calce:", err);
      setError(err.message || "No se pudieron cargar los fondos. Por favor, intenta de nuevo más tarde.");
    } finally {
      setIsLoading(false); // Finaliza la carga, ya sea con éxito o con error.
    }
  }, []);

  // **PASO 3: EFECTO QUE DISPARA LA BÚSQUEDA CUANDO LA IDEA ESTÁ LISTA**
  useEffect(() => {
    // Este efecto se activa DESPUÉS de que el primer useEffect haya establecido 'selectedIdea' con un ID.
    if (selectedIdea && selectedIdea.id) {
      fetchFondosYCalce(selectedIdea.id);
    }
    // Si no hay idea, isLoading se mantendrá en true hasta que el primer useEffect falle o termine.
  }, [selectedIdea, fetchFondosYCalce]);


  // --- LÓGICA DE FILTRADO Y ORDENACIÓN (Sin cambios) ---
  const categorias = useMemo(() => ['Todas', ...new Set(fondos.map(f => f.categoria))], [fondos]);

  const matchedAndFilteredFondos = useMemo(() => {
    let fondosFiltrados = [...fondos];
    if (searchTerm) fondosFiltrados = fondosFiltrados.filter(f => f.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    if (categoriaFilter !== 'Todas') fondosFiltrados = fondosFiltrados.filter(f => f.categoria === categoriaFilter);

    fondosFiltrados.sort((a, b) => {
      switch (sortBy) {
        case 'alfabetico': return a.nombre.localeCompare(b.nombre);
        case 'compatibilidad': return (b.compatibilidad ?? 0) - (a.compatibilidad ?? 0);
        case 'presupuesto':
          const aPresupuesto = parseInt(a.presupuesto.replace(/[^0-9]/g, ''), 10);
          const bPresupuesto = parseInt(b.presupuesto.replace(/[^0-9]/g, ''), 10);
          return bPresupuesto - aPresupuesto;
        default: return 0;
      }
    });
    return fondosFiltrados;
  }, [fondos, searchTerm, categoriaFilter, sortBy]);


  // --- RENDERIZADO CONDICIONAL (Mejorado) ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
        <NavBar />
        <div className="flex flex-col items-center justify-center flex-1 space-y-6">
          <LoopAnimation />
          <p className="text-xl sm:text-2xl font-semibold text-gray-700 animate-pulse">
            Buscando los mejores fondos para tu idea...
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
                <h1 className="text-3xl font-bold text-red-600">Ocurrió un Error</h1>
                <p className="text-slate-500 mt-2">{error}</p>
            </main>
        </div>
    )
  }

  if (!selectedIdea) {
    return (
      <div className="min-h-screen bg-[#f1f5f9]">
        <NavBar />
        <main className="flex-grow p-10 max-w-screen-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-slate-700">No se ha encontrado una idea.</h1>
            <p className="text-slate-500 mt-2">Por favor, <a href="/Matcha/generate-idea" className="text-blue-600 underline">genera una idea</a> primero para poder encontrar fondos compatibles.</p>
        </main>
      </div>
    );
  }

  // --- RENDERIZADO PRINCIPAL (Sin cambios) ---
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
        
        {matchedAndFilteredFondos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {matchedAndFilteredFondos.map(fondo => <FondoCard key={fondo.id} fondo={fondo} />)}
            </div>
        ) : (
            <div className="text-center py-10">
                <h3 className="text-2xl font-semibold text-slate-700">No se encontraron fondos compatibles</h3>
                <p className="text-slate-500 mt-2">Prueba a ajustar los filtros o a generar una idea diferente.</p>
            </div>
        )}

      </main>
    </div>
  );
};

export default FondosIdea;