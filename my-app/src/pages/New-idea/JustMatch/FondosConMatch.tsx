import React, { useState, useMemo, useEffect } from 'react';
import NavBar from '../../../components/NavBar/navbar';
import { Link, useNavigate } from 'react-router-dom';
import { DisclaimerModal } from '../../../components/Shared/Disclaimer';
import LoopAnimation from '../../../components/Shared/animationFrame';

const colorPalette = {
  darkGreen: '#44624a',
  softGreen: '#8ba888',
  oliveGray: '#505143',
  lightGray: '#f1f5f9',
};

interface Fondo {
  id: number;
  nombre: string;
  descripcion: string;
  compatibilidad: number;
  presupuesto: string;
  categoria: string;
  imagenUrl: string;
}
interface Proyecto {
  id: number;
  nombre: string;
  resumen: string;
  area: string;
}

const mockFondos: Fondo[] = [
  { id: 1, nombre: 'Fondo de Innovación Educativa', descripcion: 'Financia proyectos que mejoren el aprendizaje con tecnología y metodologías innovadoras.', compatibilidad: 85, presupuesto: '$150.000.000 CLP', categoria: 'Educación', imagenUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=60' },
  { id: 2, nombre: 'Fondo de Desarrollo Sostenible', descripcion: 'Apoyo a iniciativas que promuevan la ecología y el uso de energías limpias en la comunidad.', compatibilidad: 92, presupuesto: '$200.000.000 CLP', categoria: 'Sostenibilidad', imagenUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=60' },
  { id: 3, nombre: 'Fondo de Emprendimiento Digital', descripcion: 'Impulso para startups tecnológicas con alto potencial de crecimiento y escalabilidad.', compatibilidad: 78, presupuesto: '$120.000.000 CLP', categoria: 'Tecnología', imagenUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=800&q=60' },
  { id: 5, nombre: 'Fondo de Innovación en Salud', descripcion: 'Proyectos que utilizan la tecnología para mejorar el acceso y la calidad de la atención médica.', compatibilidad: 95, presupuesto: '$250.000.000 CLP', categoria: 'Salud', imagenUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=60' },
  { id: 6, nombre: 'Fondo de Inclusión Social', descripcion: 'Apoyo a iniciativas que promuevan la igualdad de oportunidades para grupos vulnerables.', compatibilidad: 82, presupuesto: '$110.000.000 CLP', categoria: 'Social', imagenUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=60' },
];

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
const FondoCard: React.FC<Fondo> = ({ nombre, descripcion, compatibilidad, presupuesto, categoria, imagenUrl }) => {
  const navigate = useNavigate(); 
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col border border-slate-200/80">
      <div className="relative h-52">
        <img src={imagenUrl} alt={nombre} className="w-full h-full object-cover" />
        <span className="absolute top-4 left-4 bg-[rgba(68,98,74,0.8)] backdrop-blur-sm text-white text-sm font-semibold py-1 px-3 rounded-lg">
          {compatibilidad}% compatibilidad
        </span>
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center">
          <GraduationCapIcon />
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-slate-800 mb-2">{nombre}</h2>
        <p className="text-slate-500 text-sm flex-grow mb-4">{descripcion}</p>
        <div className="flex justify-between items-center border-t border-slate-200 pt-4 mb-4">
          <span className="bg-[rgba(139,168,136,0.2)] text-[rgba(68,98,74,1)] text-xs font-semibold px-3 py-1 rounded-full">{categoria}</span>
          <span className="font-bold text-slate-700">{presupuesto}</span>
        </div>
        <button
          onClick={() => navigate("/Matcha/Select-Project/fondos/detalle")}
          className="w-full bg-[#8ba888] hover:bg-[rgba(68,98,74,0.8)] text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300"
        >
          Ver más detalles
        </button>
      </div>
    </div>
  );
};


const FondosconPorcentaje: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Proyecto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('Todas');
  const [sortBy, setSortBy] = useState<'compatibilidad' | 'alfabetico' | 'presupuesto'>('compatibilidad');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
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
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const categorias = useMemo(() => ['Todas', ...new Set(mockFondos.map(f => f.categoria))], []);

  const filteredFondos = useMemo(() => {
    let fondos = [...mockFondos];
    if (searchTerm) fondos = fondos.filter(f => f.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    if (categoriaFilter !== 'Todas') fondos = fondos.filter(f => f.categoria === categoriaFilter);
    fondos.sort((a, b) => {
      switch (sortBy) {
        case 'alfabetico': return a.nombre.localeCompare(b.nombre);
        case 'compatibilidad': return b.compatibilidad - a.compatibilidad;
        case 'presupuesto':
          const aPresupuesto = parseInt(a.presupuesto.replace(/[^0-9]/g, ''), 10);
          const bPresupuesto = parseInt(b.presupuesto.replace(/[^0-9]/g, ''), 10);
          return bPresupuesto - aPresupuesto;
        default: return 0;
      }
    });
    return fondos;
  }, [searchTerm, categoriaFilter, sortBy]);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
 if (showAnimation) {
  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
      <NavBar />
      <div className="flex flex-col items-center justify-center flex-1 space-y-6">
        <LoopAnimation />
        <p className="text-xl sm:text-2xl font-semibold text-gray-700 animate-pulse">
          Cargando...
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
              <h1 className="text-4xl font-bold text-[#505143]">Fondos Recomendados para</h1>
              <h2 className="text-3xl font-semibold text-[#44624a] mt-1">"{selectedProject.nombre}"</h2>
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
                  <button onClick={() => { setSortBy('presupuesto'); setDropdownOpen(false); }} className="block px-4 py-2 text-[rgba(80,81,67,1)] hover:bg-[rgba(139,168,136,0.2)] w-full text-left">Presupuesto</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {!selectedProject && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-8">
            <p className="font-bold">No has seleccionado un proyecto.</p>
            <p>Mostrando todos los fondos disponibles. Para ver recomendaciones personalizadas, <Link to="/Matcha/Select-Project" className="underline font-semibold">selecciona un proyecto primero</Link>.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredFondos.map(fondo => <FondoCard key={fondo.id} {...fondo} />)}
        </div>

        <footer className="flex flex-col sm:flex-row justify-between items-center mt-10 text-[rgba(80,81,67,1)]">
          <p>Mostrando {filteredFondos.length} de {mockFondos.length} items</p>
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

export default FondosconPorcentaje;
