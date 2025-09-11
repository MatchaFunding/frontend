import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import NavBar from '../../components/NavBar/navbar';
import FiltersIdea from '../../components/filters-ideas/filters-idea.tsx';
import { applyFiltersAndSorting } from '../../components/filters-ideas/filters-idea';
import type { FiltersIdeaValues } from '../../components/filters-ideas/filters-idea';
import Idea from "../../models/Idea";

interface PostulacionData {
  name: string;
  value: number;
  color: string;
}

/*
interface Idea {
  id: number;
  field: string;
  problem: string;
  audience: string;
  uniqueness: string;
  createdAt: string;
}
  */

interface Proyecto {
  ID: number;
  Titulo: string;
  Descripcion: string;
  estado?: string; 
  fondo_seleccionado?: string; 
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
const SearchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: colorPalette.oliveGray }} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>);
const ChevronDownIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>);
const EmptyBoxIcon = () => (<svg className="h-24 w-24" style={{ color: colorPalette.mediumGreen }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>);
const CustomTooltip = ({ active, payload }: any) => { if (active && payload && payload.length) { const data = payload[0].payload; return (<div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg"><p className="font-bold" style={{ color: data.color }}>{data.name}</p><p className="text-sm" style={{ color: colorPalette.oliveGray }}>{`Postulaciones: ${data.value}`}</p></div>); } return null; };


const MisPostulaciones: React.FC = () => {
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [activeSection, setActiveSection] = useState('ideas');
  const navigate = useNavigate();
  
  const [filtersIdea, setFiltersIdea] = useState<FiltersIdeaValues>({
    campo: '',
    publico: '',
    orderBy: 'none',
    searchIdea: '',
    searchCampo: '',
    fecha: ''
  });

  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loadingProyectos, setLoadingProyectos] = useState<boolean>(false);
  const [errorProyectos, setErrorProyectos] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("usuario");
    if (storedUser) {
      const datos = JSON.parse(storedUser);
      if (!datos) {
        setErrorProyectos("No se encontró información del usuario.");
        return;
      }
      const userIdeas = datos.Ideas;
      setIdeas(userIdeas);
      setFilteredIdeas(userIdeas);
      console.log("Mis ideas: " + JSON.stringify(userIdeas));
    }
  }, []);

  useEffect(() => {
    const filtered = applyFiltersAndSorting(ideas, filtersIdea);
    setFilteredIdeas(filtered);
  }, [ideas, filtersIdea]);

  useEffect(() => {
    const fetchProyectos = async () => {
      const storedUser = sessionStorage.getItem("usuario");
      if (!storedUser) {
        setErrorProyectos("No se encontró información del usuario.");
        return;
      }
      try {
        const userData = JSON.parse(storedUser);
        const empresaId = userData?.Beneficiario?.ID;

        if (!empresaId) {
          setErrorProyectos("No se pudo obtener el ID de la empresa.");
          return;
        }
        setLoadingProyectos(true);
        setErrorProyectos(null);
        const response = await fetch(`https://struggle-smooth-earnings-girlfriend.trycloudflare.com/verproyectosdeempresa/${empresaId}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudo obtener la lista de proyectos.`);
        }
        const data = await response.json();
        setProyectos(data || []); 
      }
      catch (error: any) {
        console.error("Error al obtener los proyectos:", error);
        setErrorProyectos(error.message || "Ocurrió un error inesperado.");
      } finally {
        setLoadingProyectos(false);
      }
    };

    if (activeSection === 'proyectos') {
      fetchProyectos();
    }
  }, [activeSection]); 

  // Función para manejar los cambios de filtros de ideas
  const handleFiltersIdeaChange = (newFilters: FiltersIdeaValues) => {
    setFiltersIdea(newFilters);
    // Aplicar filtros y ordenamiento
    const filtered = applyFiltersAndSorting(ideas, newFilters);
    setFilteredIdeas(filtered);
    console.log('Filtros de ideas cambiados:', newFilters);
    console.log('Ideas filtradas:', filtered);
  };

  const handleDeleteIdea = (idToDelete: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta idea? Esta acción no se puede deshacer.")) {
      const updatedIdeas = ideas.filter(idea => idea.ID !== idToDelete);
      setIdeas(updatedIdeas);
      localStorage.setItem("userIdeas", JSON.stringify(updatedIdeas));
    }
  };

  const handleRetakeIdea = (idea: Idea) => {
    console.log("Retomando idea:", idea);
    alert(`Retomando la idea: "${idea.Campo}". Revisa la consola para ver los detalles.`);
  };

  const handleEditProyecto = (proyecto: Proyecto) => {
    console.log("Editando proyecto:", proyecto);
    alert(`Funcionalidad para editar el proyecto "${proyecto.Titulo}" no implementada.`);
  };
    
  const handleDeleteProyecto = (proyectoId: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
      console.log("Eliminando proyecto con ID:", proyectoId);
      alert(`Funcionalidad para eliminar el proyecto con ID ${proyectoId} no implementada.`);
    }
  };

  const initialPostulacionesData: PostulacionData[] = [{ name: 'Aprobadas', value: 320, color: '#8ba888' }, { name: 'Adjudicadas', value: 90, color: '#d5ccab' }, { name: 'En Revisión', value: 39, color: '#d5e7cf' }, { name: 'Pendientes', value: 52, color: '#44624a' }, { name: 'Rechazadas', value: 24, color: '#c0d4ad' }, { name: 'Canceladas', value: 33, color: '#505143' }];
  const postulacionesPorMes = [{ mes: 'Ene', Aprobadas: 40, Rechazadas: 10, Pendientes: 5 }, { mes: 'Feb', Aprobadas: 60, Rechazadas: 5, Pendientes: 10 }, { mes: 'Mar', Aprobadas: 50, Rechazadas: 8, Pendientes: 7 }, { mes: 'Abr', Aprobadas: 70, Rechazadas: 6, Pendientes: 9 }];
  const postulacionesEnviadas = [{ id: 1, nombre: 'Wenapiolin', programa: 'bardiculo', estado: 'Aprobadas' }, { id: 2, nombre: 'MatchaFunding', programa: 'feria de software', estado: 'Pendientes' }];
  const postulacionesHistoricas: any[] = [];
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, name }: any) => {
    const radius = outerRadius + 35;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill={colorPalette.oliveGray} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={14}>
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };
  return (
    <div style={{ backgroundColor: colorPalette.background }} className="min-h-screen">
      <NavBar />
      <main className="p-6 md:p-10 mt-10 mt-[6%]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <nav className="space-y-2">
              <button onClick={() => setActiveSection('ideas')} className={`w-full flex items-center px-4 py-3 text-left font-semibold rounded-lg transition-colors duration-200`} style={{ backgroundColor: activeSection === 'ideas' ? colorPalette.darkGreen : 'transparent', color: activeSection === 'ideas' ? 'white' : colorPalette.oliveGray }}><LightBulbIcon />Mis Ideas</button>
              <button onClick={() => setActiveSection('historial')} className={`w-full flex items-center px-4 py-3 text-left font-semibold rounded-lg transition-colors duration-200`} style={{ backgroundColor: activeSection === 'historial' ? colorPalette.darkGreen : 'transparent', color: activeSection === 'historial' ? 'white' : colorPalette.oliveGray }}><ClockIcon />Historial</button>
              <button onClick={() => setActiveSection('proyectos')} className={`w-full flex items-center px-4 py-3 text-left font-semibold rounded-lg transition-colors duration-200`} style={{ backgroundColor: activeSection === 'proyectos' ? colorPalette.darkGreen : 'transparent', color: activeSection === 'proyectos' ? 'white' : colorPalette.oliveGray }}><PaperAirplaneIcon  />Mis Proyectos</button>
              <button onClick={() => setActiveSection('estadisticas')} className={`w-full flex items-center px-4 py-3 text-left font-semibold rounded-lg transition-colors duration-200`} style={{ backgroundColor: activeSection === 'estadisticas' ? colorPalette.darkGreen : 'transparent', color: activeSection === 'estadisticas' ? 'white' : colorPalette.oliveGray }}><ChartBarIcon />Estadísticas</button>
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
                              // Crear la fecha sin conversión de zona horaria
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



             

            {activeSection === 'enviadas' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold" style={{ color: colorPalette.darkGreen }}>Mis postulaciones enviadas</h1>
                  <div className="relative w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
                    <input type="text" placeholder="Search" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:border-transparent" style={{'--tw-ring-color': colorPalette.darkGreen} as React.CSSProperties}/>
                  </div>
                </div>
                <div className="mb-4">
                  <button className="inline-flex items-center bg-white px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50" style={{ color: colorPalette.oliveGray }}>
                    Programa <ChevronDownIcon />
                  </button>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-slate-200" style={{ backgroundColor: '#f8fafc' }}>
                      <div className="text-sm font-semibold" style={{ color: colorPalette.oliveGray }}>Nombre del emprendimiento</div>
                      <div className="text-sm font-semibold" style={{ color: colorPalette.oliveGray }}>Programa</div>
                      <div className="text-sm font-semibold" style={{ color: colorPalette.oliveGray }}>Estado de postulación</div>
                  </div>
                  {postulacionesEnviadas.map((postulacion) => (
                    <div key={postulacion.id} className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-slate-200 items-center">
                      <div className="font-medium" style={{ color: colorPalette.darkGreen }}>{postulacion.nombre}</div>
                      <div><span className="inline-block px-3 py-1 text-sm font-semibold rounded-full" style={{ backgroundColor: colorPalette.lightGreen, color: colorPalette.darkGreen }}>{postulacion.programa}</span></div>
                      <div style={{ color: colorPalette.oliveGray }}>{postulacion.estado}</div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-4">
                      <span className="text-sm" style={{ color: colorPalette.oliveGray }}>1 of 1</span>
                      <div className="flex items-center gap-2">
                          <button className="px-3 py-1 text-sm rounded-md hover:bg-slate-100 disabled:opacity-50" style={{ color: colorPalette.oliveGray }} disabled>Back</button>
                          <button className="px-3 py-1 text-sm rounded-md hover:bg-slate-100 disabled:opacity-50" style={{ color: colorPalette.oliveGray }} disabled>Next</button>
                      </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'historial' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold" style={{ color: colorPalette.darkGreen }}>Listado de postulaciones históricas</h1>
                    <div className="relative w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
                        <input type="text" placeholder="Search" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:border-transparent" style={{'--tw-ring-color': colorPalette.darkGreen} as React.CSSProperties}/>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="inline-flex items-center bg-white px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50" style={{ color: colorPalette.oliveGray }}>Programa <ChevronDownIcon /></button>
                    <button className="inline-flex items-center bg-white px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50" style={{ color: colorPalette.oliveGray }}>Estado de evaluación <ChevronDownIcon /></button>
                    <button className="inline-flex items-center bg-white px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50" style={{ color: colorPalette.oliveGray }}>Programa-Versión <ChevronDownIcon /></button>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    {postulacionesHistoricas.length === 0 ? (<div className="flex flex-col items-center justify-center text-center py-20 space-y-4"><EmptyBoxIcon /><p style={{ color: colorPalette.oliveGray }}>No hay disponibles</p></div>) : (<div></div>)}
                </div>
              </div>
            )}

              {activeSection === 'proyectos' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h1 className="text-3xl font-bold" style={{ color: colorPalette.darkGreen }}>Mis Proyectos</h1>
                                    <div className="relative w-64">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
                                        <input type="text" placeholder="Buscar por título..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:border-transparent" style={{'--tw-ring-color': colorPalette.darkGreen} as React.CSSProperties}/>
                                    </div>
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
                                                
                                                    <div className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-slate-200 bg-slate-50">
                                                        <div className="text-sm font-semibold col-span-2" style={{ color: colorPalette.oliveGray }}>Título del Proyecto</div>
                                                        <div className="text-sm font-semibold" style={{ color: colorPalette.oliveGray }}>Fondo</div>
                                                        <div className="text-sm font-semibold" style={{ color: colorPalette.oliveGray }}>Estado</div>
                                                        <div className="text-sm font-semibold text-center" style={{ color: colorPalette.oliveGray }}>Acciones</div>
                                                    </div>
                                                    {/* Filas de la tabla */}
                                                    {proyectos.map((proyecto) => (
                                                        <div key={proyecto.ID} className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-slate-200 items-center last:border-b-0 hover:bg-slate-50 transition-colors">
                                                            <div className="col-span-2">
                                                                <p className="font-medium" style={{ color: colorPalette.darkGreen }}>{proyecto.Titulo}</p>
                                                                <p className="text-sm truncate" style={{ color: colorPalette.oliveGray }}>{proyecto.Descripcion}</p>
                                                            </div>
                                                            <div>
                                                                <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full" style={{ backgroundColor: colorPalette.lightGreen, color: colorPalette.darkGreen }}>
                                                                    {/* NOTA: Ajusta `proyecto.fondo_seleccionado` al nombre real del campo de la API */}
                                                                    {proyecto.fondo_seleccionado || "No asignado"}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm font-semibold" style={{ color: colorPalette.darkGreen }}>
                                                                {/* El estado inicial debe ser "En preparación" */}
                                                                {proyecto.estado || "En preparación"}
                                                            </div>
                                                            <div className="flex justify-center items-center space-x-3">
                                                                <button onClick={() => handleEditProyecto(proyecto)} title="Editar Proyecto" className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                                                                    <PencilIcon className="h-5 w-5 text-[#505143]" />
                                                                </button>
                                                                <button onClick={() => handleDeleteProyecto(proyecto.ID)} title="Eliminar Proyecto" className="p-2 rounded-full hover:bg-red-100 transition-colors">
                                                                    <TrashIcon className="h-5 w-5 text-red-500" />
                                                                </button>
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
      <h2 className="text-3xl font-bold" style={{ color: colorPalette.darkGreen }}>Resumen de Postulaciones</h2>

     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
  <h3 className="text-xl font-semibold mb-4" style={{ color: colorPalette.darkGreen }}>Distribución de Postulaciones</h3>
  <div style={{ height: 350 }}>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
        <Pie
          data={initialPostulacionesData}
          cx="50%"
          cy="50%"
          labelLine={true} 
          label={renderCustomizedLabel} 
          innerRadius={65}
          outerRadius={90}
          fill="#8884d8"
          dataKey="value"
          paddingAngle={5}
        >
          {initialPostulacionesData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-semibold mb-4" style={{ color: colorPalette.darkGreen }}>Postulaciones por Mes</h3>
        <div style={{ height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={postulacionesPorMes}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Aprobadas" stroke={colorPalette.softGreen} strokeWidth={3} />
              <Line type="monotone" dataKey="Rechazadas" stroke={colorPalette.mediumGreen} strokeWidth={3} />
              <Line type="monotone" dataKey="Pendientes" stroke={colorPalette.darkGreen} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default MisPostulaciones;