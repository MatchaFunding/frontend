import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import NavBar from '../../components/NavBar/navbar';
import FiltersIdea from '../../components/filters-ideas/filters-idea.tsx';
import { applyFiltersAndSorting } from '../../components/filters-ideas/filters-idea';
import type { FiltersIdeaValues } from '../../components/filters-ideas/filters-idea';
import Idea from "../../models/Idea";
import Postulacion from "../../models/Postulacion";
import { VerTodasLasPostulacionesAsync } from "../../api/VerTodasLasPostulaciones";
import { VerTodosLosInstrumentosAsync } from "../../api/VerTodosLosInstrumentos"; 

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
const ClockIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 mr-3"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
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
  const navigate = useNavigate();

  const [radarChartData, setRadarChartData] = useState<any[]>([]);
  const [loadingProyectos, setLoadingProyectos] = useState<boolean>(false);
  const [errorProyectos, setErrorProyectos] = useState<string | null>(null);

  const [pieChartData, setPieChartData] = useState<PostulacionData[]>([]);
  const [loadingEstadisticas, setLoadingEstadisticas] = useState<boolean>(true);
  const [errorEstadisticas, setErrorEstadisticas] = useState<string | null>(null);

  const [filtersIdea, setFiltersIdea] = useState<FiltersIdeaValues>({ campo: '', publico: '', orderBy: 'none', searchIdea: '', searchCampo: '', fecha: '' });

  // Convertir el estado de la postulación a texto legible
  const obtenerEstadoTexto = (estado: string): string => {
    const estadosMap: { [key: string]: string } = {
      'ADJ': 'Adjudicado',
      'PEN': 'Pendiente',
      'REC': 'Rechazado',
      'APR': 'Aprobado',
      'REV': 'En Revisión'
    };
    return estadosMap[estado] || estado;
  };

  // Obtener todos los fondos de un proyecto
  const obtenerFondosProyecto = async (proyectoId: number): Promise<FondoAsignado[]> => {
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
    } catch (error) {
      console.error("Error al obtener fondos del proyecto:", error);
      return [];
    }
  };

  const processRadarChartData = (postulaciones: Postulacion[]) => {
  if (postulaciones.length === 0) return [];

  const TARGET_AMOUNT = 10000000;      // Meta de $10,000,000 para el 100% en el gráfico
  const TARGET_DIVERSITY = 10;         // Meta de 10 fondos distintos para el 100%
  const TARGET_APPLICATIONS = 20;      // Meta de 20 postulaciones enviadas para el 100%
  const TARGET_RESPONSE_DAYS = 90;     // Un tiempo de respuesta "ideal" (menor es mejor)

 
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

  return [
    { categoria: 'Monto adjudicado', A: scoreMonto, fullMark: 100 },
    { categoria: 'Tasa de éxito', A: tasaExito, fullMark: 100 },
    { categoria: 'Postulaciones', A: scorePostulaciones, fullMark: 100 },
    { categoria: 'Tiempo respuesta', A: scoreTiempo, fullMark: 100 },
    { categoria: 'Diversidad fondos', A: scoreDiversidad, fullMark: 100 },
  ];
};
  
  useEffect(() => {
    const storedUser = sessionStorage.getItem("usuario");
    if (storedUser) {
      const datos = JSON.parse(storedUser);
      setIdeas(datos.Ideas || []);
      setFilteredIdeas(datos.Ideas || []);
    }
  }, []);

  useEffect(() => {
    const filtered = applyFiltersAndSorting(ideas, filtersIdea);
    setFilteredIdeas(filtered);
  }, [ideas, filtersIdea]);

  

  useEffect(() => {
    const fetchProyectos = async () => {
        const storedUser = sessionStorage.getItem("usuario");
        if (!storedUser) { setErrorProyectos("No se encontró información del usuario."); return; }
        const userData = JSON.parse(storedUser);
        console.log(userData)
        const empresaId = userData?.Beneficiario?.ID;
        if (!empresaId) { setErrorProyectos("No se pudo obtener el ID de la empresa."); return; }

        setLoadingProyectos(true);
        setErrorProyectos(null);
        try {
            const response = await fetch(`https://backend.matchafunding.com/verproyectosdeempresa/${empresaId}`);
            if (!response.ok) throw new Error(`Error ${response.status}`);
            const data: Proyecto[] = await response.json();
            const proyectosConFondo: ProyectoConFondo[] = await Promise.all(
                data.map(async (proyecto) => {
                    const fondosAsignados = await obtenerFondosProyecto(proyecto.ID);
                    return {
                        ...proyecto,
                        fondosAsignados
                    };
                })
            );
            setProyectos(proyectosConFondo || []); 
        } catch (error: any) {
            setErrorProyectos(error.message || "Ocurrió un error inesperado.");
        } finally {
            setLoadingProyectos(false);
        }
    };
    if (activeSection === 'proyectos') { fetchProyectos(); }
  }, [activeSection]);



  useEffect(() => {
    const fetchAndProcessPostulaciones = async () => {
      const storedUser = sessionStorage.getItem("usuario");
      if (!storedUser) {
        setErrorEstadisticas("No se encontró información del usuario para cargar estadísticas.");
        setLoadingEstadisticas(false);
        return;
      }

      const beneficiarioId = 112;
      if (!beneficiarioId) {
        setErrorEstadisticas("No se pudo obtener el ID del beneficiario.");
        setLoadingEstadisticas(false);
        return;
      }
      
      setLoadingEstadisticas(true);
      setErrorEstadisticas(null);

      try {
        const response = await fetch(`https://backend.matchafunding.com/vertodaslaspostulaciones`);
        if (!response.ok) {
          throw new Error(`Error al obtener postulaciones: ${response.statusText}`);
        }
        const allPostulaciones: Postulacion[] = await response.json();

    
        const userPostulaciones = allPostulaciones.filter(p => p.Beneficiario === beneficiarioId);
        
    
         const pieData = processPieChartData(userPostulaciones);
      const radarData = processRadarChartData(userPostulaciones); 

      setPieChartData(pieData);
      setRadarChartData(radarData); 

      } catch (error: any) {
        setErrorEstadisticas(error.message || "Ocurrió un error al cargar los datos.");
      } finally {
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
  const handleDeleteIdea = (idToDelete: number) => { if (window.confirm("¿Seguro que quieres eliminar esta idea?")) { const updated = ideas.filter(i => i.ID !== idToDelete); setIdeas(updated); } };
  const handleRetakeIdea = (idea: Idea) => { alert(`Retomando la idea: "${idea.Campo}".`); };
  const handleEditProyecto = (proyecto: ProyectoConFondo) => { alert(`Funcionalidad para editar el proyecto "${proyecto.Titulo}" no implementada.`); };
  const handleDeleteProyecto = (proyectoId: number) => { if (window.confirm("¿Seguro que quieres eliminar este proyecto?")) { alert(`Funcionalidad para eliminar el proyecto con ID ${proyectoId} no implementada.`); } };
  const postulacionesHistoricas: any[] = [];
 
  return (
    <div style={{ backgroundColor: colorPalette.background }} className="min-h-screen">
      <main className="p-6 md:p-10 mt-10 mt-[0%]">
        <NavBar />
        <div className=" w-[80%] mx-auto my-auto grid grid-cols-1 lg:grid-cols-4 gap-8 mt-[10%]">
          <aside className="lg:col-span-1">
            <nav className="space-y-2">
              <button onClick={() => setActiveSection('ideas')} className={`w-full flex items-center px-4 py-3 text-left font-semibold rounded-lg transition-colors duration-200`} style={{ backgroundColor: activeSection === 'ideas' ? colorPalette.softGreen : 'transparent', color: activeSection === 'ideas' ? 'white' : colorPalette.oliveGray }}><LightBulbIcon />Mis Ideas</button>
              <button onClick={() => setActiveSection('historial')} className={`w-full flex items-center px-4 py-3 text-left font-semibold rounded-lg transition-colors duration-200`} style={{ backgroundColor: activeSection === 'historial' ? colorPalette.softGreen : 'transparent', color: activeSection === 'historial' ? 'white' : colorPalette.oliveGray }}><ClockIcon />Historial</button>
              <button onClick={() => setActiveSection('proyectos')} className={`w-full flex items-center px-4 py-3 text-left font-semibold rounded-lg transition-colors duration-200`} style={{ backgroundColor: activeSection === 'proyectos' ? colorPalette.softGreen : 'transparent', color: activeSection === 'proyectos' ? 'white' : colorPalette.oliveGray }}><PaperAirplaneIcon  />Mis Proyectos</button>
              <button onClick={() => setActiveSection('estadisticas')} className={`w-full flex items-center px-4 py-3 text-left font-semibold rounded-lg transition-colors duration-200`} style={{ backgroundColor: activeSection === 'estadisticas' ? colorPalette.softGreen : 'transparent', color: activeSection === 'estadisticas' ? 'white' : colorPalette.oliveGray }}><ChartBarIcon />Estadísticas</button>
            </nav>
          </aside>
          
          <div className="lg:col-span-3">
          
            {activeSection === 'ideas' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold" style={{ color: colorPalette.darkGreen }}>Mis Ideas Guardadas</h1>
                
                  <div className="flex items-center gap-4">
                    <FiltersIdea 
                      filters={filtersIdea}
                      onApplyFilters={handleFiltersIdeaChange}
                    />
                    <button
                      onClick={() => navigate('/Matcha/New-idea')}
                      className="px-5 py-2 font-semibold text-white rounded-lg shadow-md transition-transform duration-300 hover:scale-105 flex items-center gap-2"
                      style={{ backgroundColor: colorPalette.darkGreen }}
                    >
                      Generar Nueva Idea
                      <img src="/svgs/plus2.svg" alt="Plus icon" className="w-4 h-4" style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }} />
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="flex gap-2 px-6 py-4 border-b border-slate-200 bg-slate-50" style={{ minWidth: '100%' }}>
                    <div className="text-sm font-semibold flex-shrink-0" style={{ color: colorPalette.oliveGray, width: '50%', minWidth: '50%', maxWidth: '50%' }}>Idea / Problema</div>
                    <div className="text-sm font-semibold flex-shrink-0" style={{ color: colorPalette.oliveGray, width: '25%', minWidth: '25%', maxWidth: '25%' }}>Campo</div>
                    <div className="text-sm font-semibold flex-shrink-0" style={{ color: colorPalette.oliveGray, width: '15%', minWidth: '15%', maxWidth: '15%' }}>Fecha</div>
                    <div className="text-sm font-semibold text-center flex-shrink-0" style={{ color: colorPalette.oliveGray, width: '10%', minWidth: '10%', maxWidth: '10%' }}>Acciones</div>
                  </div>
                  
                  {filteredIdeas.length > 0 ? (
                    filteredIdeas.map((idea) => (
                      <div key={idea.ID} className="flex gap-2 px-6 py-4 border-b border-slate-200 items-center last:border-b-0 hover:bg-slate-50 transition-colors" style={{ minWidth: '100%' }}>
                        <div className="flex-shrink-0" style={{ width: '50%', minWidth: '50%', maxWidth: '50%' }}>
                          <p className="font-medium text-ellipsis overflow-hidden" style={{ color: colorPalette.darkGreen, whiteSpace: 'nowrap' }}>{idea.Problema}</p>
                          <p className="text-sm text-ellipsis overflow-hidden" style={{ color: colorPalette.oliveGray, whiteSpace: 'nowrap' }}>{idea.Innovacion}</p>
                        </div>
                        <div className="flex-shrink-0" style={{ width: '25%', minWidth: '25%', maxWidth: '25%' }}>
                          <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full text-ellipsis overflow-hidden" style={{ backgroundColor: colorPalette.lightGreen, color: colorPalette.darkGreen, whiteSpace: 'nowrap', maxWidth: '100%' }}>
                            {idea.Campo}
                          </span>
                        </div>
                        <div className="flex-shrink-0" style={{ width: '15%', minWidth: '15%', maxWidth: '15%' }}>
                          <span className="text-sm text-ellipsis overflow-hidden" style={{ color: colorPalette.oliveGray, whiteSpace: 'nowrap' }}>
                            {idea.FechaDeCreacion ? (() => {
                              const [year, month, day] = idea.FechaDeCreacion.split('-');
                              const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                              return date.toLocaleDateString();
                            })() : 'Sin fecha'}
                          </span>
                        </div>
                        <div className="flex justify-center items-center space-x-1 flex-shrink-0" style={{ width: '10%', minWidth: '10%', maxWidth: '10%' }}>
                          <button onClick={() => handleRetakeIdea(idea)} title="Retomar Idea" className="p-1 rounded-full hover:bg-slate-200 transition-colors">
                            <PencilIcon className="h-4 w-4 text-[#505143]" />
                          </button>
                          <button onClick={() => handleDeleteIdea(idea.ID)} title="Eliminar Idea" className="p-1 rounded-full hover:bg-red-100 transition-colors">
                            <TrashIcon className="h-4 w-4"  />
                          </button>
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
              </div>
            )}
            {activeSection === 'historial' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold" style={{ color: colorPalette.darkGreen }}>Listado de postulaciones históricas</h1>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    {postulacionesHistoricas.length === 0 ? (<div className="flex flex-col items-center justify-center text-center py-20 space-y-4"><EmptyBoxIcon /><p style={{ color: colorPalette.oliveGray }}>No hay postulaciones históricas disponibles.</p></div>) : (<div></div>)}
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
                                    <>  {/* Títulos de las columnas */}
                                        <div className="flex border-b border-slate-200 bg-slate-50" style={{ paddingLeft: '12px', paddingRight: '76px', paddingTop: '16px', paddingBottom: '16px' }}>
                                            <div className="text-sm font-semibold" style={{ color: colorPalette.oliveGray, textAlign: 'left', width: '45%', paddingRight: '8px' }}>Proyecto</div>
                                            <div className="text-sm font-semibold" style={{ color: colorPalette.oliveGray, textAlign: 'left', width: '40%', paddingRight: '8px' }}>Fondo(s)</div>
                                            <div className="text-sm font-semibold" style={{ color: colorPalette.oliveGray, textAlign: 'left', width: '15%' }}>Estado</div>
                                        </div>
                                        {proyectos.map((proyecto) => (
                                            <div key={proyecto.ID} className="relative py-4 border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors">
                                                {/* Botones de acciones en la esquina superior derecha */}
                                                <div className="absolute top-1 right-2 flex space-x-1">
                                                    <button onClick={() => handleEditProyecto(proyecto)} title="Editar Proyecto" className="p-1 rounded-full hover:bg-slate-200 transition-colors"><PencilIcon className="h-4 w-4 text-[#505143]" /></button>
                                                    <button onClick={() => handleDeleteProyecto(proyecto.ID)} title="Eliminar Proyecto" className="p-1 rounded-full hover:bg-red-100 transition-colors"><TrashIcon className="h-4 w-4 text-red-500" /></button>
                                                </div>
                                                
                                                {/* Tabla */}
                                                <div className="flex items-start pt-2" style={{ paddingLeft: '12px', paddingRight: '76px' }}>
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
                      <div className="grid grid-cols-1 w-[110%] md:grid-cols-2 w-[100%] gap-8">
                      
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

                 
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 ">
  <h3 className="text-xl font-semibold mb-4" style={{ color: colorPalette.darkGreen }}>Rendimiento General</h3>
  <div style={{ height: 450 }} className='mx-[-4%]'>
    <ResponsiveContainer width="100%" height="100%">
    
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
        <PolarGrid />
        <PolarAngleAxis className= "" dataKey="categoria" tick={{ fontSize: 14, fill: colorPalette.oliveGray }} />
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
      </main>
    </div>
  );
};

export default MisPostulaciones;