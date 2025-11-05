import type { FiltersIdeaValues } from '../../components/filters-ideas/filters-idea.ts';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie } from 'recharts';
import { Cell, Tooltip } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import { Legend, RadarChart } from 'recharts';
import { PolarGrid, PolarAngleAxis } from 'recharts';
import { PolarRadiusAxis, Radar } from 'recharts';
import { applyFiltersAndSorting } from '../../components/filters-ideas/filters-idea';
import { getMatchFondosAsync } from '../../api/MatchFondos';
import { VerTodasLasPostulacionesAsync } from "../../api/VerTodasLasPostulaciones";
import { VerTodosLosInstrumentosAsync } from "../../api/VerTodosLosInstrumentos"; 
import { BorrarIdea } from '../../api/BorrarIdea';
import { useEffect, useState, useRef } from 'react';
import IdeaRefinadaModal from '../../components/IdeaRefinadaModal/IdeaRefinadaModal';
import FiltersIdea from '../../components/filters-ideas/filters-idea.tsx';
import Postulacion from "../../models/Postulacion"; 
import React from 'react';
import NavBar from '../../components/NavBar/navbar';
import Idea from "../../models/Idea";

interface PostulacionData {
  name: string;
  value: number;
  color: string;
}

interface Proyecto {
  ID: number;
  Titulo: string;
  Descripcion: string;
  estado?: string; 
  fondo_seleccionado?: string; 
}

interface FondoAsignado {
  nombreFondo: string;
  estado: string;
  instrumentoId: number;
}

interface ProyectoConFondo extends Proyecto {
  fondosAsignados: FondoAsignado[];
}

const colorPalette = {
  darkGreen: '#44624a',
  softGreen: '#8ba888',
  mediumGreen: '#c0d4ad',
  lightGreen: '#d5e7cf',
  tan: '#d5ccab',
  oliveGray: '#505143',
  background: '#f8f9fa',
  danger: '#e53e3e',
};

const ChartBarIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 mr-3"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>);
const PaperAirplaneIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 mr-3"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>);
const LightBulbIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 mr-3"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>);
const TrashIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const PencilIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>);
const EmptyBoxIcon = () => (<svg className="h-24 w-24" style={{ color: colorPalette.mediumGreen }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>);
const CustomTooltip = ({ active, payload }: any) => { if (active && payload && payload.length) { const data = payload[0].payload; return (<div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg"><p className="font-bold" style={{ color: data.color }}>{data.name}</p><p className="text-sm" style={{ color: colorPalette.oliveGray }}>{`Cantidad: ${data.value}`}</p></div>); } return null; };

const MisPostulaciones: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [proyectos, setProyectos] = useState<ProyectoConFondo[]>([]);
  const [activeSection, setActiveSection] = useState('ideas');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const navigate = useNavigate();

  const [radarChartData, setRadarChartData] = useState<any[]>([]);
  const [loadingProyectos, setLoadingProyectos] = useState<boolean>(false);
  const [errorProyectos, setErrorProyectos] = useState<string | null>(null);
  const [deletingIdeaId, setDeletingIdeaId] = useState<number | null>(null);
  const [matchingIdeaId, setMatchingIdeaId] = useState<number | null>(null);
  const isProcessingMatch = useRef(false);

  const [pieChartData, setPieChartData] = useState<PostulacionData[]>([]);
  const [loadingEstadisticas, setLoadingEstadisticas] = useState<boolean>(true);
  const [errorEstadisticas, setErrorEstadisticas] = useState<string | null>(null);
  const [filtersIdea, setFiltersIdea] = useState<FiltersIdeaValues>(
    {campo: '',
    publico: '',
    orderBy: 'none',
    searchIdea: '',
    searchCampo: '',
    fecha: ''
  });
  const [currentPageIdeas, setCurrentPageIdeas] = useState(1);
  const ITEMS_PER_PAGE_IDEAS = 5;
  
  // Función para truncar texto largo
  const truncateText = (text: string, maxLength: number = 120): string => {
    if (!text)
      return '';
    if (text.length <= maxLength)
      return text;
    return text.substring(0, maxLength).trim() + '...';
  };
  
  // Función para recargar ideas desde el backend
  const reloadIdeas = async () => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const datos = JSON.parse(storedUser);
      const ideas = datos.Ideas;
      
      if (ideas) {
        try {
          console.log(`Recargando Ideas de Usuario (cache): ${ideas}`);
          setIdeas(ideas);
          setFilteredIdeas(ideas);
          console.log('Ideas cargadas desde backend:', ideas);
        }
        catch (error) {
          console.error('Error al cargar ideas desde backend:', error);
          const ideas: Idea[] = (datos.Ideas || []).map((idea: any) => new Idea(idea));
          setIdeas(ideas);
          setFilteredIdeas(ideas);
          console.log('Usando ideas del localStorage como fallback');
        }
      }
      else {
        console.warn('No se pudo obtener usuarioId para recargar');
        setIdeas([]);
        setFilteredIdeas([]);
      }
    }
    else {
      console.warn('No se encontraron datos de usuario para recargar');
      setIdeas([]);
      setFilteredIdeas([]);
    }
  };

  // Convertir el estado de la postulación a texto legible
  const obtenerEstadoTexto = (estado: string): string => {
    const estadosMap: { [key: string]: string } = {
      'Adjudicado': 'Adjudicado',
      'Pendiente': 'Pendiente',
      'Rechazado': 'Rechazado',
      'Aprobado': 'Aprobado',
      'En Revision': 'En Revisión'
    };
    return estadosMap[estado] || estado;
  };

  // Obtener todos los fondos de un proyecto
  const ObtenerFondosProyecto = async (proyectoId: number): Promise<FondoAsignado[]> => {
    try {
      const postulaciones = await VerTodasLasPostulacionesAsync();
      const postulacionesProyecto = postulaciones.filter(postulacion => postulacion.Proyecto === proyectoId);
      if (postulacionesProyecto.length === 0) {
        return [];
      }
      const instrumentos = await VerTodosLosInstrumentosAsync();
      const fondosAsignados: FondoAsignado[] = postulacionesProyecto.map(postulacion => {
        const instrumento = instrumentos.find(inst => inst.ID === postulacion.Instrumento);
        return {
          nombreFondo: instrumento ? instrumento.Titulo : "Fondo no encontrado",
          estado: postulacion.Resultado,
          instrumentoId: postulacion.Instrumento
        };
      });
      return fondosAsignados;
    }
    catch (error) {
      console.error("Error al obtener fondos del proyecto:", error);
      return [];
    }
  };

  // La función ahora recibe el conteo de proyectos para calcular la nueva métrica
const processRadarChartData = (postulaciones: Postulacion[], proyectosEnPreparacionCount: number, totalProyectos: number) => {
    // Si no hay datos, devuelve un array vacío para evitar errores
    if (postulaciones.length === 0 && totalProyectos === 0)
      return [];

    // --- Métricas existentes (sin cambios) ---
    const TARGET_AMOUNT = 10000000;
    const TARGET_DIVERSITY = 10;
    const TARGET_APPLICATIONS = 20;
    const TARGET_RESPONSE_DAYS = 90;

    const totalPostulaciones = postulaciones.length;
    const conResultado = postulaciones.filter(p => p.Resultado.trim() !== 'PEN');
    const adjudicadas = conResultado.filter(p => p.Resultado.trim() === 'ADJ' || p.Resultado.trim() === 'APR');
    
    const tasaExito = conResultado.length > 0 ? (adjudicadas.length / conResultado.length) * 100 : 0;
    const montoTotalAdjudicado = adjudicadas.reduce((sum, p) => sum + (p.MontoObtenido || 0), 0);
    const scoreMonto = Math.min((montoTotalAdjudicado / TARGET_AMOUNT) * 100, 100);

    const uniqueInstrumentos = new Set(postulaciones.map(p => p.Instrumento)).size;
    const scoreDiversidad = Math.min((uniqueInstrumentos / TARGET_DIVERSITY) * 100, 100);

    const scorePostulaciones = Math.min((totalPostulaciones / TARGET_APPLICATIONS) * 100, 100);

    let totalDiasRespuesta = 0;
    conResultado.forEach(p => {
        const fechaInicio = new Date(p.FechaDePostulacion).getTime();
        const fechaFin = p.FechaDeResultado ? new Date(p.FechaDeResultado).getTime() : null;
        if (!isNaN(fechaInicio) && fechaFin && !isNaN(fechaFin) && fechaFin > fechaInicio) {
            totalDiasRespuesta += (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24);
        }
    });
    const avgDiasRespuesta = conResultado.length > 0 ? totalDiasRespuesta / conResultado.length : 0;
    const scoreTiempo = Math.max(0, (1 - (avgDiasRespuesta / TARGET_RESPONSE_DAYS)) * 100);

    // --- NUEVO: Métrica de Actividad en Pipeline ---
    // Calcula qué porcentaje de los proyectos totales está "En preparación".
    // Si no hay proyectos, el puntaje es 0 para evitar división por cero.
    const scorePipeline = totalProyectos > 0 
        ? (proyectosEnPreparacionCount / totalProyectos) * 100 
        : 0;

    return [
      { categoria: 'Monto adjudicado', A: scoreMonto, fullMark: 100 },
      { categoria: 'Tasa de éxito', A: tasaExito, fullMark: 100 },
      { categoria: 'Postulaciones', A: scorePostulaciones, fullMark: 100 },
      { categoria: 'Tiempo respuesta', A: scoreTiempo, fullMark: 100 },
      { categoria: 'Diversidad fondos', A: scoreDiversidad, fullMark: 100 },
      { categoria: 'Actividad Pipeline', A: scorePipeline, fullMark: 100 },
    ];
};
  
  useEffect(() => {
    const loadIdeasFromBackend = async () => {
      const storedUser = localStorage.getItem("usuario");
      if (storedUser) {
        const datos = JSON.parse(storedUser);
        const ideas = datos.Ideas;

        if (ideas) {
          try {
            setIdeas(ideas);
            setFilteredIdeas(ideas);
          }
          catch (error) {
            console.error('Error al cargar ideas desde backend:', error);
            const ideas: Idea[] = (datos.Ideas || []).map((idea: any) => new Idea(idea));
            setIdeas(ideas);
            setFilteredIdeas(ideas);
          }
        }
        else {
          console.warn('No se pudo obtener usuarioId del localStorage');
          setIdeas([]);
          setFilteredIdeas([]);
        }
      }
      else {
        console.warn('No se encontraron datos de Usuario');
        setIdeas([]);
        setFilteredIdeas([]);
      }
    };

    loadIdeasFromBackend();
  }, []);

  useEffect(() => {
    const filtered = applyFiltersAndSorting(ideas, filtersIdea);
    setFilteredIdeas(filtered);
    setCurrentPageIdeas(1); // Resetear página al cambiar filtros
  }, [ideas, filtersIdea]);

  // Auto-select first idea when entering ideas section or when selected idea is no longer available
  useEffect(() => {
    if (activeSection === 'ideas' && filteredIdeas.length > 0) {
      // Solo cambiar selectedIdea si no hay una seleccionada o si la seleccionada ya no existe
      const ideaExists = selectedIdea && filteredIdeas.find(idea => idea.ID === selectedIdea.ID);
      if (!selectedIdea || !ideaExists) {
        setSelectedIdea(filteredIdeas[0]);
      }
    }
  }, [activeSection, filteredIdeas]);

  // Listener para detectar cuando se regresa de crear una idea
  useEffect(() => {
    const handleFocus = () => {
      // Recargar ideas cuando la ventana recupera el foco (usuario regresa de otra página)
      if (activeSection === 'ideas') {
        reloadIdeas();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [activeSection]);

  // Cálculos para paginación de ideas
  const totalPagesIdeas = Math.ceil(filteredIdeas.length / ITEMS_PER_PAGE_IDEAS);
  const paginatedIdeas = filteredIdeas.slice(
    (currentPageIdeas - 1) * ITEMS_PER_PAGE_IDEAS,
    currentPageIdeas * ITEMS_PER_PAGE_IDEAS
  );

  useEffect(() => {
    const fetchProyectos = async () => {
        const storedUser = localStorage.getItem("usuario");
        if (!storedUser) {
          setErrorProyectos("No se encontró información del usuario.");
          return;
        }
        const userData = JSON.parse(storedUser);
        const empresaId = userData?.Beneficiario?.ID;
        if (!empresaId) {
          setErrorProyectos("No se pudo obtener el ID de la empresa.");
          return;
        }

        setLoadingProyectos(true);
        setErrorProyectos(null);
        try {
            const storedUser = localStorage.getItem("usuario");
            if (storedUser) {
              const datos = JSON.parse(storedUser);
              const proyectos = datos.Proyectos;
              const proyectosConFondo: ProyectoConFondo[] = await Promise.all(
                  proyectos.map(async (proyecto: Proyecto) => {
                      const fondosAsignados = await ObtenerFondosProyecto(proyecto.ID);
                      return {
                          ...proyecto,
                          fondosAsignados
                      };
                  })
              );
              setProyectos(proyectosConFondo || []); 
            }
        }
        catch (error: any) {
            setErrorProyectos(error.message || "Ocurrió un error inesperado.");
        }
        finally {
            setLoadingProyectos(false);
        }
    };
    if (activeSection === 'proyectos') { fetchProyectos(); }
  }, [activeSection]);


  useEffect(() => {
    const fetchAndProcessPostulaciones = async () => {
      const storedUser = localStorage.getItem("usuario");
      if (!storedUser) {
        setErrorEstadisticas("No se encontró información del usuario.");
        setLoadingEstadisticas(false);
        return;
      }
      const userData = JSON.parse(storedUser);
      const beneficiarioId = userData?.Beneficiario?.ID;
      const empresaId = userData?.Beneficiario?.ID;

      if (!beneficiarioId || !empresaId) {
        setErrorEstadisticas("No se pudo obtener el ID del beneficiario/empresa.");
        setLoadingEstadisticas(false);
        return;
      }
      
      setLoadingEstadisticas(true);
      setErrorEstadisticas(null);

      try {
        const storedUser = localStorage.getItem("usuario");
        if (storedUser) {
          const datos = JSON.parse(storedUser);
          const proyectos = datos.Proyectos;
          const postulaciones = datos.Postulaciones;
          const enPreparacion = proyectos.length;
          
          const pieData = processPieChartData(postulaciones);
          if (enPreparacion > 0) {
            pieData.push({
                name: 'En preparación',
                value: enPreparacion,
                color: colorPalette.oliveGray,
              });
          }
          const radarData = processRadarChartData(
              postulaciones,
              enPreparacion,
              proyectos.length
          );
          setPieChartData(pieData);
          setRadarChartData(radarData);
        }

      }
      catch (error: any) {
        setErrorEstadisticas(error.message || "Ocurrió un error al cargar los datos.");
      }
      finally {
        setLoadingEstadisticas(false);
      }
    };
    
    if (activeSection === 'estadisticas') {
      fetchAndProcessPostulaciones();
    }
  }, [activeSection]);

const colorPalette = {
  darkGreen: '#44624a',
  softGreen: '#8ba888',
  mediumGreen: '#c0d4ad',
  lightGreen: '#d5e7cf',
  tan: '#d5ccab',
  oliveGray: '#505143',
  background: '#f8f9fa',
  danger: '#e53e3e',
};

  const processPieChartData = (postulaciones: Postulacion[]): PostulacionData[] => {
    const statusMap: { [key: string]: { name: string; color: string } } = {
      'ADJ': { name: 'Adjudicadas', color: colorPalette.softGreen },
      'PEN': { name: 'Pendientes', color: colorPalette.darkGreen },
      'REC': { name: 'Rechazadas', color: colorPalette.tan},
      'APR': { name: 'Aprobadas', color: colorPalette.softGreen },
      'REV': { name: 'En Revisión', color: colorPalette.lightGreen },
    };

    const counts = postulaciones.reduce((acc, post) => {
      const status = post.Resultado.trim();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(counts).map(([status, value]) => ({
      name: statusMap[status]?.name || status,
      value,
      color: statusMap[status]?.color || colorPalette.oliveGray,
    }));
  };
  const handleFiltersIdeaChange = (newFilters: FiltersIdeaValues) => { setFiltersIdea(newFilters); };
  const handleDeleteIdea = async (idToDelete: number) => {
    const ideaToDelete = ideas.find(idea => idea.ID === idToDelete);
    const ideaTitulo = ideaToDelete ? ideaToDelete.Problema : `Idea #${idToDelete}`;

    const confirmacion = window.confirm(
      `¿Estás seguro de que quieres eliminar la idea "${ideaTitulo}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmacion) {
      return;
    }

    setDeletingIdeaId(idToDelete);

    try {
      console.log('Intentando eliminar idea con ID:', idToDelete);
      const result = await BorrarIdea(idToDelete);
      console.log('Resultado de eliminar idea:', result);
      const updated = ideas.filter(i => i.ID !== idToDelete);
      setIdeas(updated);
      setFilteredIdeas(prev => prev.filter(i => i.ID !== idToDelete));
      alert(`¡Idea eliminada exitosamente!\n\n"${ideaTitulo}" ha sido eliminada de tu lista de ideas.`);
    }
    catch (error: any) {
      console.error('Error al eliminar idea:', error);
      alert(`Error al eliminar la idea: ${error.message || 'Error desconocido'}`);
    }
    finally {
      setDeletingIdeaId(null);
    }
  };
  // Guardar la idea para convertir en proyecto
  const handleConvertToProject = (idea: Idea) => {
    const ideaData = {
      ID: idea.ID,
      Campo: idea.Campo,
      Problema: idea.Problema,
      Publico: idea.Publico,
      Innovacion: idea.Innovacion,
      Propuesta: idea.Propuesta
    };
    console.log('GUARDANDO IDEA PARA CONVERSION:', ideaData);
    localStorage.setItem('convertirAProyecto', JSON.stringify(ideaData));
    localStorage.setItem('convertirAProyecto', JSON.stringify(ideaData));
    navigate('/Matcha/Nuevo-proyecto');
  };

  const handleRetakeIdea = (idea: Idea) => {
    // Guardar la idea seleccionada en localStorage para retomar
    localStorage.setItem('retomarIdea', JSON.stringify({
      ID: idea.ID,
      Campo: idea.Campo,
      Problema: idea.Problema,
      Publico: idea.Publico,
      Innovacion: idea.Innovacion,
      Propuesta: idea.Propuesta,
      FechaDeCreacion: idea.FechaDeCreacion
    }));
    
    // Navegar a la página de editar idea SIN opción de match
    navigate('/Matcha/retomar-idea', {
      state: {
        disableMatchOption: true
      }
    });
  };
  
  const handleMatchIdea = async (idea: Idea) => {
    // Prevenir llamadas múltiples usando ref
    if (isProcessingMatch.current || matchingIdeaId !== null) {
      return;
    }
    
    isProcessingMatch.current = true;
    setMatchingIdeaId(idea.ID);
    
    try {
      // Llamar a la API para hacer el match
      const matchResults = await getMatchFondosAsync({
        idea_id: idea.ID,
        top_k: 10
      });
      console.log('Resultados del match:', matchResults);
      localStorage.setItem('matchResults', JSON.stringify(matchResults));
      
      const ideaData = {
        ID: idea.ID,
        Campo: idea.Campo,
        Problema: idea.Problema,
        Publico: idea.Publico,
        Innovacion: idea.Innovacion,
        Propuesta: idea.Propuesta
      };
      
      localStorage.setItem('ideaParaMatch', JSON.stringify(ideaData));
      navigate('/Matcha/New-idea/Creating-idea/FondoIdea');
    }
    catch (error) {
      console.error('Error al hacer match con IA:', error);
      alert('Error al buscar fondos compatibles. Por favor intenta nuevamente.');
    }
    finally {
      setMatchingIdeaId(null);
      isProcessingMatch.current = false;
    }
  };
  
  const handleViewIdeaDetails = (idea: Idea) => {
    setSelectedIdea(idea);
    setShowIdeaModal(true);
  };
  const handleEditProyecto = (proyecto: Proyecto) => { alert(`Funcionalidad para editar el proyecto "${proyecto.Titulo}" no implementada.`); };
  const handleDeleteProyecto = (proyectoId: number) => { if (window.confirm("¿Seguro que quieres eliminar este proyecto?")) { alert(`Funcionalidad para eliminar el proyecto con ID ${proyectoId} no implementada.`); } };
 
  return (
    <div style={{ backgroundColor: colorPalette.background }} className="min-h-screen">
      <main className="p-6 md:p-10 mt-10 mt-[0%]">
        <NavBar />
        <div className="w-[80%] mx-auto my-auto grid grid-cols-1 lg:grid-cols-4 gap-8 mt-[10%]">
          {/* Navigation - Responsive: horizontal mobile, vertical desktop */}
          <aside className="lg:col-span-1 lg:pt-16">
            {/* Mobile: Horizontal menu */}
            <nav className="lg:hidden flex overflow-x-auto space-x-2 pt-8 pb-4 mb-6 border-b border-slate-200">
              <button onClick={() => setActiveSection('ideas')} className={`flex items-center px-4 py-3 font-semibold rounded-lg transition-colors duration-200 whitespace-nowrap`} style={{ backgroundColor: activeSection === 'ideas' ? colorPalette.softGreen : 'transparent', color: activeSection === 'ideas' ? 'white' : colorPalette.oliveGray }}><LightBulbIcon className="h-5 w-5 mr-2" />Ideas</button>
              <button onClick={() => setActiveSection('proyectos')} className={`flex items-center px-4 py-3 font-semibold rounded-lg transition-colors duration-200 whitespace-nowrap`} style={{ backgroundColor: activeSection === 'proyectos' ? colorPalette.softGreen : 'transparent', color: activeSection === 'proyectos' ? 'white' : colorPalette.oliveGray }}><PaperAirplaneIcon className="h-5 w-5 mr-2" />Proyectos</button>
              <button onClick={() => setActiveSection('estadisticas')} className={`flex items-center px-4 py-3 font-semibold rounded-lg transition-colors duration-200 whitespace-nowrap`} style={{ backgroundColor: activeSection === 'estadisticas' ? colorPalette.softGreen : 'transparent', color: activeSection === 'estadisticas' ? 'white' : colorPalette.oliveGray }}><ChartBarIcon className="h-5 w-5 mr-2" />Estadísticas</button>
            </nav>
            
            {/* Desktop: Vertical menu */}
            <nav className="hidden lg:block space-y-2">
              <button onClick={() => setActiveSection('ideas')} className={`w-full flex items-center px-4 py-3 text-left font-semibold rounded-lg transition-colors duration-200`} style={{ backgroundColor: activeSection === 'ideas' ? colorPalette.softGreen : 'transparent', color: activeSection === 'ideas' ? 'white' : colorPalette.oliveGray }}><LightBulbIcon />Mis Ideas</button>
              <button onClick={() => setActiveSection('proyectos')} className={`w-full flex items-center px-4 py-3 text-left font-semibold rounded-lg transition-colors duration-200`} style={{ backgroundColor: activeSection === 'proyectos' ? colorPalette.softGreen : 'transparent', color: activeSection === 'proyectos' ? 'white' : colorPalette.oliveGray }}><PaperAirplaneIcon />Mis Proyectos</button>
              <button onClick={() => setActiveSection('estadisticas')} className={`w-full flex items-center px-4 py-3 text-left font-semibold rounded-lg transition-colors duration-200`} style={{ backgroundColor: activeSection === 'estadisticas' ? colorPalette.softGreen : 'transparent', color: activeSection === 'estadisticas' ? 'white' : colorPalette.oliveGray }}><ChartBarIcon />Estadísticas</button>
            </nav>
          </aside>
          
          <div className="lg:col-span-3">
          
            {activeSection === 'ideas' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h1 className="text-3xl font-bold" style={{ color: colorPalette.darkGreen }}>Mis ideas guardadas</h1>
                
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                    <FiltersIdea 
                      filters={filtersIdea}
                      onApplyFilters={handleFiltersIdeaChange}
                    />
                    <button
                      onClick={() => navigate('/Matcha/New-idea')}
                      className="px-5 py-2 font-semibold text-white rounded-lg shadow-md transition-transform duration-300 hover:scale-105 flex items-center justify-center gap-2 h-10"
                      style={{ backgroundColor: colorPalette.darkGreen }}
                    >
                      Generar Nueva Idea
                      <img src="/svgs/plus2.svg" alt="Plus icon" className="w-4 h-4" style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }} />
                    </button>
                  </div>
                </div>
                
                {/* Botones de acción principales */}
                {selectedIdea && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold" style={{ color: colorPalette.darkGreen }}>
                          Idea seleccionada: {selectedIdea.Problema}
                        </h3>
                        <p className="text-sm" style={{ color: colorPalette.oliveGray }}>
                          Campo: {selectedIdea.Campo}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedIdea(null)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Deseleccionar"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Botón 1: Match con IA */}
                      <button
                        onClick={() => handleMatchIdea(selectedIdea)}
                        disabled={matchingIdeaId === selectedIdea.ID}
                        className="flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        style={{ 
                          borderColor: colorPalette.softGreen, 
                          backgroundColor: 'white',
                          color: colorPalette.darkGreen
                        }}
                      >
                        {matchingIdeaId === selectedIdea.ID ? (
                          <>
                            <svg className="animate-spin h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <h4 className="font-bold text-base mb-1">Buscando fondos...</h4>
                            <p className="text-xs text-center" style={{ color: colorPalette.oliveGray }}>
                              Analizando compatibilidad con IA
                            </p>
                          </>
                        ) : (
                          <>
                            <svg className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <h4 className="font-bold text-base mb-1">Hacer Match con IA</h4>
                            <p className="text-xs text-center" style={{ color: colorPalette.oliveGray }}>
                              Encuentra fondos ideales para tu idea
                            </p>
                          </>
                        )}
                      </button>

                      {/* Botón 2: Convertir a Proyecto */}
                      <button
                        onClick={() => handleConvertToProject(selectedIdea)}
                        className="flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                        style={{ 
                          borderColor: colorPalette.softGreen,
                          backgroundColor: colorPalette.softGreen,
                          color: 'white'
                        }}
                      >
                        <svg className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h4 className="font-bold text-base mb-1">Convertir a Proyecto</h4>
                        <p className="text-xs text-center opacity-90">
                          Desarrolla tu idea en un proyecto completo
                        </p>
                      </button>

                      {/* Botón 3: Editar Idea */}
                      <button
                        onClick={() => handleRetakeIdea(selectedIdea)}
                        className="flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                        style={{ 
                          borderColor: colorPalette.softGreen,
                          backgroundColor: 'white',
                          color: colorPalette.darkGreen
                        }}
                      >
                        <PencilIcon className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-base mb-1">Editar Idea</h4>
                        <p className="text-xs text-center" style={{ color: colorPalette.oliveGray }}>
                          Modifica los detalles de tu idea
                        </p>
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  {/* DESKTOP: Table view (hidden on mobile) */}
                  <div className="hidden md:block">
                    {/* Títulos de las columnas */}
                    <div className="flex border-b border-slate-200 bg-slate-50 px-6 py-4">
                      <div className="text-sm font-semibold" style={{ color: colorPalette.oliveGray, textAlign: 'left', width: '35%', paddingRight: '8px' }}>Idea / Problema</div>
                      <div className="text-sm font-semibold" style={{ color: colorPalette.oliveGray, textAlign: 'left', width: '15%', paddingRight: '8px' }}>Campo</div>
                      <div className="text-sm font-semibold" style={{ color: colorPalette.oliveGray, textAlign: 'left', width: '12%', paddingRight: '8px' }}>Fecha</div>
                      <div className="text-sm font-semibold" style={{ color: colorPalette.oliveGray, textAlign: 'left', width: '33%', paddingRight: '8px' }}>Propuesta Refinada</div>
                      <div className="text-sm font-semibold text-center" style={{ color: colorPalette.oliveGray, textAlign: 'left', width: '5%' }}>Acciones</div>
                    </div>
                    
                    {paginatedIdeas.length > 0 ? (
                      paginatedIdeas.map((idea) => (
                        <div 
                          key={idea.ID} 
                          className={`relative py-4 border-b border-slate-200 last:border-b-0 transition-all duration-200 ${
                            selectedIdea?.ID === idea.ID 
                              ? 'bg-green-50 shadow-inner' 
                              : 'hover:bg-slate-50 cursor-pointer hover:shadow-sm'
                          }`}
                          onClick={() => setSelectedIdea(idea)}
                        >
                          {/* Indicador visual de selección */}
                          {selectedIdea?.ID === idea.ID && (
                            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: colorPalette.softGreen }}></div>
                          )}
                          
                          {/* Botón de acción en la esquina superior derecha */}
                          <div className="absolute top-2 right-6">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteIdea(idea.ID);
                              }}
                              title="Eliminar Idea" 
                              className="p-1 rounded-full hover:bg-red-100 transition-colors"
                              disabled={deletingIdeaId === idea.ID}
                            >
                              {deletingIdeaId === idea.ID ? (
                                <svg className="animate-spin h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <TrashIcon className="h-4 w-4 text-red-600" />
                              )}
                            </button>
                          </div>
                          
                          {/* Contenido de la tabla */}
                          <div className="flex items-start pt-2 px-6">
                            {/* Idea / Problema */}
                            <div style={{ textAlign: 'left', width: '35%', paddingRight: '8px' }}>
                              <p className="font-medium" style={{ color: colorPalette.darkGreen, textAlign: 'left' }}>{idea.Problema}</p>
                              <p className="text-sm truncate" style={{ color: colorPalette.oliveGray, textAlign: 'left' }}>{idea.Innovacion}</p>
                            </div>
                            
                            {/* Campo */}
                            <div style={{ textAlign: 'left', width: '15%', paddingRight: '8px', display: 'flex', alignItems: 'center' }}>
                              <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full truncate" style={{ backgroundColor: colorPalette.lightGreen, color: colorPalette.darkGreen, maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>
                                {idea.Campo}
                              </span>
                            </div>
                            
                            {/* Fecha */}
                            <div style={{ textAlign: 'left', width: '12%', paddingRight: '8px', display: 'flex', alignItems: 'center' }}>
                              <span className="text-sm" style={{ color: colorPalette.oliveGray }}>
                                {idea.FechaDeCreacion ? (() => {
                                  const [year, month, day] = idea.FechaDeCreacion.split('-');
                                  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                  return date.toLocaleDateString();
                                })() : 'Sin fecha'}
                              </span>
                            </div>
                            
                            {/* Propuesta Refinada */}
                            <div style={{ textAlign: 'left', width: '33%', paddingRight: '8px' }}>
                              {idea.Propuesta ? (
                                <div className="relative">
                                  <p className="text-sm leading-relaxed" style={{ color: colorPalette.oliveGray }}>
                                    {truncateText(idea.Propuesta, 150)}
                                  </p>
                                  {idea.Propuesta.length > 150 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewIdeaDetails(idea);
                                    }}
                                    className="text-xs mt-1 font-medium hover:underline"
                                    style={{ color: colorPalette.darkGreen }}
                                  >
                                    Leer más →
                                  </button>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2 text-sm" style={{ color: colorPalette.oliveGray }}>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="italic">Sin refinamiento IA</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Espacio para acciones (ocupado por el botón absolute) */}
                            <div style={{ width: '5%' }}></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
                        <EmptyBoxIcon />
                        <p style={{ color: colorPalette.oliveGray }}>
                          {ideas.length === 0 
                            ? 'Aún no has guardado ideas. ¡Genera una nueva!' 
                            : 'No hay ideas que coincidan con los filtros aplicados.'
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  {/* MOBILE: Card view */}
                  <div className="md:hidden space-y-4 p-4">
                    {paginatedIdeas.length > 0 ? (
                      paginatedIdeas.map((idea) => (
                        <div
                          key={idea.ID}
                          className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                            selectedIdea?.ID === idea.ID
                              ? 'border-green-500 bg-green-50 shadow-md'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                          }`}
                          onClick={() => setSelectedIdea(idea)}
                        >
                          {/* Delete button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteIdea(idea.ID);
                            }}
                            className="absolute top-2 right-2 p-2 rounded-full hover:bg-red-100 transition-colors"
                            disabled={deletingIdeaId === idea.ID}
                          >
                            {deletingIdeaId === idea.ID ? (
                              <svg className="animate-spin h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <TrashIcon className="h-4 w-4 text-red-600" />
                            )}
                          </button>

                          {/* Card content */}
                          <div className="space-y-3 pr-8">
                            <div>
                              <p className="font-bold text-lg" style={{ color: colorPalette.darkGreen }}>
                                {idea.Problema}
                              </p>
                              <p className="text-sm mt-1" style={{ color: colorPalette.oliveGray }}>
                                {idea.Innovacion}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-lg" style={{ backgroundColor: colorPalette.lightGreen, color: colorPalette.darkGreen }}>
                                {idea.Campo}
                              </span>
                              <span className="text-xs" style={{ color: colorPalette.oliveGray }}>
                                {idea.FechaDeCreacion ? (() => {
                                  const [year, month, day] = idea.FechaDeCreacion.split('-');
                                  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                  return date.toLocaleDateString();
                                })() : 'Sin fecha'}
                              </span>
                            </div>

                            {idea.Propuesta ? (
                              <div>
                                <p className="text-sm leading-relaxed" style={{ color: colorPalette.oliveGray }}>
                                  {truncateText(idea.Propuesta, 100)}
                                </p>
                                {idea.Propuesta.length > 100 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewIdeaDetails(idea);
                                    }}
                                    className="text-xs mt-1 font-medium hover:underline"
                                    style={{ color: colorPalette.darkGreen }}
                                  >
                                    Leer más →
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2 text-sm" style={{ color: colorPalette.oliveGray }}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="italic text-xs">Sin refinamiento IA</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
                        <EmptyBoxIcon />
                        <p style={{ color: colorPalette.oliveGray }}>
                          {ideas.length === 0
                            ? 'Aún no has guardado ideas. ¡Genera una nueva!'
                            : 'No hay ideas que coincidan con los filtros aplicados.'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Paginación */}
                  {filteredIdeas.length > ITEMS_PER_PAGE_IDEAS && (
                    <div className="flex justify-center py-4 gap-1 sm:gap-2 flex-wrap" style={{ marginTop: '40px' }}>
                      {/* Flecha izquierda */}
                      <button 
                        className={`px-2 sm:px-3 py-2 rounded-full font-semibold border ${
                          currentPageIdeas === 1 
                            ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed' 
                            : 'bg-white text-[#8ba888] border-[#8ba888]'
                        }`} 
                        onClick={() => setCurrentPageIdeas(prev => Math.max(prev - 1, 1))} 
                        disabled={currentPageIdeas === 1} 
                        aria-label="Anterior"
                      >
                        <img 
                          src="/svgs/right-arrow.svg" 
                          alt="Anterior" 
                          className="w-3 h-3 sm:w-4 sm:h-4" 
                          style={{ 
                            transform: 'rotate(180deg)', 
                            filter: currentPageIdeas === 1 
                              ? 'brightness(0) saturate(100%) invert(70%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(96%)' 
                              : 'brightness(0) saturate(100%) invert(63%) sepia(15%) saturate(357%) hue-rotate(73deg) brightness(95%) contrast(88%)' 
                          }} 
                        />
                      </button>
                      
                      {/* Página actual */}
                      <button className={`px-2 sm:px-3 py-1 rounded-full font-semibold bg-[#8ba888] text-white text-sm`} disabled>
                        {currentPageIdeas}
                      </button>
                      
                      {/* Página siguiente */}
                      {currentPageIdeas + 1 <= totalPagesIdeas && (
                        <button 
                          className={`px-2 sm:px-3 py-2 font-semibold text-[#8ba888] hover:bg-gray-100 text-sm`} 
                          onClick={() => setCurrentPageIdeas(currentPageIdeas + 1)}
                        >
                          {currentPageIdeas + 1}
                        </button>
                      )}
                      
                      {/* Página siguiente +1 - Solo visible en pantallas medianas y grandes */}
                      {currentPageIdeas + 2 <= totalPagesIdeas && (
                        <button
                          className={`hidden sm:block px-2 sm:px-3 py-2 font-semibold text-[#8ba888] hover:bg-gray-100 text-sm`}
                          onClick={() => setCurrentPageIdeas(currentPageIdeas + 2)}
                        >
                          {currentPageIdeas + 2}
                        </button>
                      )}
                      
                      {/* ... si hay más páginas entre medio - Solo visible en pantallas medianas y grandes */}
                      {currentPageIdeas + 3 < totalPagesIdeas && (
                        <span className="hidden sm:inline px-2">...</span>
                      )}
                      
                      {/* Última página si no es visible como subsiguiente - Solo visible en pantallas medianas y grandes */}
                      {totalPagesIdeas > 1 && currentPageIdeas !== totalPagesIdeas && (currentPageIdeas + 2 < totalPagesIdeas) && (
                        <button
                          className={`hidden sm:block px-2 sm:px-3 py-2 font-semibold text-[#8ba888] hover:bg-gray-100 text-sm`}
                          onClick={() => setCurrentPageIdeas(totalPagesIdeas)}
                        >
                          {totalPagesIdeas}
                        </button>
                      )}
                      
                      {/* Flecha derecha */}
                      <button
                        className={`px-2 sm:px-3 py-2 rounded-full font-semibold border ${
                          currentPageIdeas === totalPagesIdeas 
                            ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed' 
                            : 'bg-white text-[#8ba888] border-[#8ba888]'
                        }`}
                        onClick={() => setCurrentPageIdeas(prev => Math.min(prev + 1, totalPagesIdeas))}
                        disabled={currentPageIdeas === totalPagesIdeas}
                        aria-label="Siguiente"
                      >
                        <img 
                          src="/svgs/right-arrow.svg" 
                          alt="Siguiente" 
                          className="w-3 h-3 sm:w-4 sm:h-4" 
                          style={{ 
                            filter: currentPageIdeas === totalPagesIdeas 
                              ? 'brightness(0) saturate(100%) invert(70%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(96%)' 
                              : 'brightness(0) saturate(100%) invert(63%) sepia(15%) saturate(357%) hue-rotate(73deg) brightness(95%) contrast(88%)' 
                          }} 
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeSection === 'proyectos' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold" style={{ color: colorPalette.darkGreen }}>Mis Proyectos</h1>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        {loadingProyectos && <div className="text-center py-20" style={{ color: colorPalette.oliveGray }}>Cargando proyectos...</div>}
                        {errorProyectos && <div className="text-center py-20 text-red-600">Error: {errorProyectos}</div>}
                        {!loadingProyectos && !errorProyectos && (
                            <>
                                {proyectos.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
                                        <EmptyBoxIcon />
                                        <p style={{ color: colorPalette.oliveGray }}>Aún no tienes proyectos guardados.</p>
                                    </div>
                                ) : (
                                    <>
                                      {/* DESKTOP: Table view (hidden on mobile) */}
                                      <div className="hidden md:block">
                                        {/* Títulos de las columnas */}
                                        <div className="flex border-b border-slate-200 bg-slate-50 px-6 py-4">
                                            <div className="text-sm font-semibold" style={{ color: colorPalette.oliveGray, textAlign: 'left', width: '45%', paddingRight: '8px' }}>Proyecto</div>
                                            <div className="text-sm font-semibold" style={{ color: colorPalette.oliveGray, textAlign: 'left', width: '40%', paddingRight: '8px' }}>Fondo(s)</div>
                                            <div className="text-sm font-semibold" style={{ color: colorPalette.oliveGray, textAlign: 'left', width: '15%' }}>Estado</div>
                                        </div>
                                        {proyectos.map((proyecto) => (
                                            <div key={proyecto.ID} className="relative py-4 border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors">
                                                {/* Botones de acciones en la esquina superior derecha */}
                                                <div className="absolute top-1 right-6 flex space-x-1">
                                                    <button onClick={() => handleEditProyecto(proyecto)} title="Editar Proyecto" className="p-1 rounded-full hover:bg-slate-200 transition-colors"><PencilIcon className="h-4 w-4 text-[#505143]" /></button>
                                                    <button onClick={() => handleDeleteProyecto(proyecto.ID)} title="Eliminar Proyecto" className="p-1 rounded-full hover:bg-red-100 transition-colors"><TrashIcon className="h-4 w-4 text-red-500" /></button>
                                                </div>
                                                
                                                {/* Tabla */}
                                                <div className="flex items-start pt-2 px-6">
                                                    {/* Proyecto */}
                                                    <div style={{ textAlign: 'left', width: '45%', paddingRight: '8px' }}>
                                                        <p className="font-medium" style={{ color: colorPalette.darkGreen, textAlign: 'left' }}>{proyecto.Titulo}</p>
                                                        <p className="text-sm truncate" style={{ color: colorPalette.oliveGray, textAlign: 'left' }}>{proyecto.Descripcion}</p>
                                                    </div>
                                                    <div style={{ textAlign: 'left', width: '40%', paddingRight: '8px' }}>
                                                        {/* Si hay fondo(s) */}
                                                        {proyecto.fondosAsignados.length > 0 ? (
                                                            <div className="space-y-1">
                                                                {proyecto.fondosAsignados.map((fondo, index) => (
                                                                    <div key={index} style={{ minHeight: '32px', display: 'flex', alignItems: 'center' }}>
                                                                        <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full truncate" style={{ backgroundColor: colorPalette.lightGreen, color: colorPalette.darkGreen, maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }} title={fondo.nombreFondo}>
                                                                            {fondo.nombreFondo}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            // No hay fondos asignados
                                                            <div style={{ minHeight: '32px', display: 'flex', alignItems: 'center' }}>
                                                                <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full" style={{ backgroundColor: colorPalette.lightGreen, color: colorPalette.darkGreen, textAlign: 'left' }}>
                                                                    No asignado
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* Estado del fondo */}
                                                    <div className="text-sm font-semibold" style={{ color: colorPalette.darkGreen, textAlign: 'left', width: '15%' }}>
                                                        {proyecto.fondosAsignados.length > 0 ? (
                                                            <div className="space-y-1">
                                                                {proyecto.fondosAsignados.map((fondo, index) => (
                                                                    <div key={index} className="text-sm" style={{ minHeight: '32px', display: 'flex', alignItems: 'center', textAlign: 'left' }}>
                                                                        {obtenerEstadoTexto(fondo.estado)}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-sm" style={{ minHeight: '32px', display: 'flex', alignItems: 'center', textAlign: 'left' }}>
                                                                En preparación
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                      </div>

                                      {/* MOBILE: Card view */}
                                      <div className="md:hidden space-y-4 p-4">
                                        {proyectos.map((proyecto) => (
                                          <div key={proyecto.ID} className="relative p-4 rounded-lg border-2 border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all">
                                            {/* Action buttons */}
                                            <div className="absolute top-2 right-2 flex space-x-1">
                                              <button onClick={() => handleEditProyecto(proyecto)} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                                                <PencilIcon className="h-4 w-4 text-[#505143]" />
                                              </button>
                                              <button onClick={() => handleDeleteProyecto(proyecto.ID)} className="p-2 rounded-full hover:bg-red-100 transition-colors">
                                                <TrashIcon className="h-4 w-4 text-red-500" />
                                              </button>
                                            </div>

                                            {/* Card content */}
                                            <div className="space-y-3 pr-16">
                                              <div>
                                                <p className="font-bold text-lg" style={{ color: colorPalette.darkGreen }}>
                                                  {proyecto.Titulo}
                                                </p>
                                                <p className="text-sm mt-1" style={{ color: colorPalette.oliveGray }}>
                                                  {proyecto.Descripcion}
                                                </p>
                                              </div>

                                              <div>
                                                <p className="text-xs font-semibold mb-2" style={{ color: colorPalette.oliveGray }}>
                                                  Fondo(s):
                                                </p>
                                                {proyecto.fondosAsignados.length > 0 ? (
                                                  <div className="space-y-2">
                                                    {proyecto.fondosAsignados.map((fondo, index) => (
                                                      <div key={index} className="flex items-center justify-between gap-4">
                                                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-lg" style={{ backgroundColor: colorPalette.lightGreen, color: colorPalette.darkGreen }}>
                                                          {fondo.nombreFondo}
                                                        </span>
                                                        <span className="text-xs font-medium whitespace-nowrap" style={{ color: colorPalette.darkGreen }}>
                                                          {obtenerEstadoTexto(fondo.estado)}
                                                        </span>
                                                      </div>
                                                    ))}
                                                  </div>
                                                ) : (
                                                  <div className="flex items-center justify-between gap-4">
                                                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-lg" style={{ backgroundColor: colorPalette.lightGreen, color: colorPalette.darkGreen }}>
                                                      No asignado
                                                    </span>
                                                    <span className="text-xs font-medium whitespace-nowrap" style={{ color: colorPalette.darkGreen }}>
                                                      En preparación
                                                    </span>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
            
            {activeSection === 'estadisticas' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold" style={{ color: colorPalette.darkGreen }}>Resumen de Estadísticas</h2>
                
                {loadingEstadisticas && <div className="text-center py-20" style={{color: colorPalette.oliveGray}}>Cargando estadísticas...</div>}
                {errorEstadisticas && <div className="text-center py-20 text-red-600">Error: {errorEstadisticas}</div>}
                
                {!loadingEstadisticas && !errorEstadisticas && (
                  <>
                    {pieChartData.length === 0 ? (
                       <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center py-20 space-y-4">
                           <EmptyBoxIcon />
                           <p style={{ color: colorPalette.oliveGray }}>Aún no tienes datos de postulación para mostrar.</p>
                       </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                          <h3 className="text-xl font-semibold mb-4" style={{ color: colorPalette.darkGreen }}>Distribución por Resultado</h3>
                          <div style={{ height: 450 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3}>
                                  {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                 
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                          <h3 className="text-xl font-semibold mb-4" style={{ color: colorPalette.darkGreen }}>Rendimiento General</h3>
                          <div style={{ height: 450 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="categoria" tick={{ fontSize: 14, fill: colorPalette.oliveGray }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar name="Puntaje" dataKey="A" stroke={colorPalette.darkGreen} fill={colorPalette.softGreen} fillOpacity={0.6} />
                                <Tooltip />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                       
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Modal para mostrar detalles de la idea */}
        {selectedIdea && (
          <IdeaRefinadaModal
            idea={selectedIdea}
            isOpen={showIdeaModal}
            onClose={() => setShowIdeaModal(false)}
          />
        )}
      </main>
    </div>
  );
};

export default MisPostulaciones;