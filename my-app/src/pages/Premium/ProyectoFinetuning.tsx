import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar/navbar";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../components/UI/buttons";
import { Card } from "../../components/UI/cards";
import { CardContent} from "../../components/UI/cards";
import { Input } from "../../components/UI/input";
import { Textarea } from "../../components/UI/textarea";




import PersonaClass from "../../models/Persona";

interface ProyectoForm {
  Beneficiario: number; Titulo: string; Descripcion: string;
  DuracionEnMesesMinimo: number; DuracionEnMesesMaximo: number;
  Alcance: string; Area: string; Miembros: string[];
  Problema: string; PublicoObjetivo: string; ObjetivoGeneral: string;
  ObjetivoEspecifico: string; Proposito: string; Innovacion: string;
  ResultadoEsperado: string; isFromConvertedIdea?: boolean;
}


interface PaginatorProps {
  data: ProyectoForm;
  colorPalette: { [key: string]: string };
}

const ProjectPreviewPaginator: React.FC<PaginatorProps> = ({ data, colorPalette }) => {

  const [currentPage, setCurrentPage] = React.useState(0);
  const pages = [
    {
      title: "Información General",
      content: (
        <>
          <p><strong>Título:</strong> {data.Titulo}</p>
          <p className="text-slate-600 text-sm mt-1">{data.Descripcion}</p>
        </>
      ),
    },
    {
      title: "Problema y Objetivos",
      content: (
        <>
          <p><strong>Problema:</strong> {data.Problema}</p>
          <p className="mt-1"><strong>Público Objetivo:</strong> {data.PublicoObjetivo}</p>
          <p className="mt-1"><strong>Objetivo General:</strong> {data.ObjetivoGeneral}</p>
        </>
      ),
    },
    {
      title: "Propuesta de Valor",
      content: (
        <>
          <p><strong>Propósito:</strong> {data.Proposito}</p>
          <p className="mt-1"><strong>Innovación:</strong> {data.Innovacion}</p>
          <p className="mt-1"><strong>Resultados Esperados:</strong> {data.ResultadoEsperado}</p>
        </>
      ),
    },
  ];


  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, pages.length - 1));
  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 0));

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold border-b pb-2 mb-3" style={{ color: colorPalette.darkGreen }}>
        {pages[currentPage].title}
      </h3>
      
      <div className="text-slate-700 space-y-2 min-h-[120px]">
        {pages[currentPage].content}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="px-4 py-2 rounded-full text-sm font-medium transition disabled:opacity-50"
          style={{ backgroundColor: colorPalette.lightGray, color: colorPalette.oliveGray }}
        >
          ← Anterior
        </button>

        <span className="text-sm font-medium" style={{ color: colorPalette.softGreen }}>
          {currentPage + 1} / {pages.length}
        </span>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage === pages.length - 1}
          className="px-4 py-2 rounded-full text-sm font-medium transition disabled:opacity-50"
          style={{ backgroundColor: colorPalette.darkGreen, color: "white" }}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
};
export const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => {
  const colorPalette = {
    darkGreen: "#44624a",
    softGreen: "#8ba888",
    oliveGray: "#505143",
    lightGray: "#f1f5f9",
  };

  const stepLabels = [
    "Básicos", "Detalles", "Problema", "Objetivos",
    "Propuesta", "Miembros", "Vista previa",
  ];

  return (
  
    <div className="mb-4 md:mb-8 w-full max-w-3xl mx-auto">
      <div className="flex items-start">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isDone = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 text-sm md:text-base ${
                    isActive ? "scale-110" : ""
                  }`}
                  style={{
                    backgroundColor: isDone ? colorPalette.softGreen : isActive ? colorPalette.darkGreen : "#d1d5db",
                    color: isDone || isActive ? "white" : colorPalette.oliveGray,
                  }}
                >
                  {isDone ? "✓" : stepNumber}
                </div>
                <p
                  className={`mt-1 md:mt-2 text-xs md:text-sm text-center ${
                    isActive ? "font-bold" : ""
                  }`}
                  style={{
                    color: isActive ? colorPalette.darkGreen : colorPalette.oliveGray,
                  }}
                >
                  {stepLabels[index] || `Paso ${stepNumber}`}
                </p>
              </div>
              {stepNumber < totalSteps && (
                
                <div className="flex-grow flex items-center pt-4 md:pt-5 px-1">
                  <div
                    className="h-0.5 w-full"
                    style={{
                      backgroundColor: isDone ? colorPalette.softGreen : "#d1d5db",
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
interface PersonaPayload { Nombre: string; Sexo: string; RUT: string; FechaDeNacimiento: string; }
interface ProyectoForm {
  Beneficiario: number;
  Titulo: string;
  Descripcion: string;
  DuracionEnMesesMinimo: number;
  DuracionEnMesesMaximo: number;
  Alcance: string;
  Area: string;
  Miembros: string[];

  Problema: string;
  PublicoObjetivo: string;
  ObjetivoGeneral: string;
  ObjetivoEspecifico: string;
  Proposito: string;
  Innovacion: string;
  ResultadoEsperado: string;
 
  isFromConvertedIdea?: boolean;
}
interface Idea { id: number; field: string; problem: string; audience: string; uniqueness: string; }
interface Fondo { id: number; nombre: string; categoria: string; }

const colorPalette = {
  darkGreen: "#44624a",
  softGreen: "#8ba888",
  oliveGray: "#505143",
  lightGray: "#f1f5f9",
};

const opcionesAlcance = [
    { value: 'AP', label: 'Arica y Parinacota' }, { value: 'TA', label: 'Tarapacá' },
    { value: 'AN', label: 'Antofagasta' }, { value: 'AT', label: 'Atacama' },
    { value: 'CO', label: 'Coquimbo' }, { value: 'VA', label: 'Valparaíso' },
    { value: 'RM', label: 'Metropolitana' }, { value: 'LI', label: 'O\'Higgins' },
    { value: 'ML', label: 'Maule' }, { value: 'NB', label: 'Ñuble' },
    { value: 'BI', label: 'Biobío' }, { value: 'AR', label: 'La Araucanía' },
    { value: 'LR', label: 'Los Ríos' }, { value: 'LL', label: 'Los Lagos' },
    { value: 'AI', label: 'Aysén' }, { value: 'MA', label: 'Magallanes' }
];
const opcionesArea = [ "Salud", "Innovación", "Tecnología", "Construcción", "Servicios", "Educación", "Medio Ambiente" ];

const defaultIdea: Idea = {
    id: 1,
    field: "",
    problem: "",
    audience: "",
    uniqueness: "",
};

const defaultFondo: Fondo = {
    id: 101,
    nombre: "",
    categoria: "",
};


const CrearProyectoFine: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  const { idea = defaultIdea, fondo = defaultFondo } = (location.state as { idea: Idea; fondo: Fondo }) || {};

  const [formData, setFormData] = useState<ProyectoForm>(() => ({
    Beneficiario: 0, Titulo: "", Descripcion: "", DuracionEnMesesMinimo: 6,
    DuracionEnMesesMaximo: 12, Alcance: "", Area: "", Miembros: [],
    // --- NUEVOS CAMPOS INICIALIZADOS ---
    Problema: "", PublicoObjetivo: "", ObjetivoGeneral: "", ObjetivoEspecifico: "",
    Proposito: "", Innovacion: "", ResultadoEsperado: "",
    // --- FIN NUEVOS CAMPOS ---
    isFromConvertedIdea: false
}));
  

  const [personas, setPersonas] = useState<PersonaClass[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevaPersonaData, setNuevaPersonaData] = useState<PersonaPayload>({
    Nombre: "", Sexo: "OTR", RUT: "", FechaDeNacimiento: ""
  });
  const [isFromConvertedIdea, setIsFromConvertedIdea] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const storedUser = sessionStorage.getItem("usuario");


  useEffect(() => {
    console.log('INICIO CARGA DE DATOS - CONVERSION');
    
   
    const ideaAConvertir = localStorage.getItem('convertirAProyecto') || 
                          sessionStorage.getItem('convertirAProyecto');
    console.log('localStorage convertirAProyecto:', localStorage.getItem('convertirAProyecto'));
    console.log('sessionStorage convertirAProyecto:', sessionStorage.getItem('convertirAProyecto'));
    console.log('ideaAConvertir final:', ideaAConvertir);
    
    if (ideaAConvertir) {
      try {
        const ideaParsed = JSON.parse(ideaAConvertir);
        console.log('IDEA PARSEADA:', ideaParsed);
     
        const resumenLLM = ideaParsed.Propuesta || 
                          ideaParsed.ResumenLLM || 
                          ideaParsed.propuesta || 
                          ideaParsed.resumenLLM ||
                          "";
        
        const descripcionDeIdea = resumenLLM || 
          `Proyecto basado en la idea que resuelve: ${ideaParsed.Problema || 'problema no especificado'}`;
        
        console.log('DESCRIPCION A ESTABLECER:', descripcionDeIdea);
        
     
const formDataToSet = {
  Beneficiario: 0,
  Titulo: "", 
  Descripcion: descripcionDeIdea, 
  DuracionEnMesesMinimo: 6,
  DuracionEnMesesMaximo: 12,
  Alcance: "", 
  Area: ideaParsed.Campo || "", 
  Miembros: [],
  isFromConvertedIdea: true,

  Problema: "",
  PublicoObjetivo: "",
  ObjetivoGeneral: "",
  ObjetivoEspecifico: "",
  Proposito: "",
  Innovacion: "",
  ResultadoEsperado: ""
};
        
        console.log('FORMDATA A ESTABLECER:', formDataToSet);
        setFormData(formDataToSet);
        setIsFromConvertedIdea(true);
        
        localStorage.removeItem('convertirAProyecto');
        sessionStorage.removeItem('convertirAProyecto');
        
      
        setIsDataLoaded(true);
        
        console.log('CONVERSION COMPLETADA');
        return;
      } catch (e) {
        console.error('Error al parsear idea para convertir:', e);
        setIsFromConvertedIdea(false);
      }
    }
    
  
    setIsDataLoaded(true);
  }, []); 

 
  useEffect(() => {
    
    if (!isDataLoaded || formData.isFromConvertedIdea) return;
    
    console.log('INICIO FLUJO NORMAL');
    
   
    const ideaActiva = idea || JSON.parse(localStorage.getItem("selectedIdea") || JSON.stringify(defaultIdea));


    let descripcionSugerida = "";
    const storedApiResponse = localStorage.getItem('ideaRespuestaIA');

    if (storedApiResponse) {
      try {
        const respuestaParseada = JSON.parse(storedApiResponse);
        if (respuestaParseada && respuestaParseada.ResumenLLM) {
          descripcionSugerida = respuestaParseada.ResumenLLM;
        }
      } catch (e) {
        console.error("No se pudo parsear la respuesta de la IA desde localStorage.", e);
      }
    }

    
    const tituloSugerido = (ideaActiva.field && fondo.nombre) ? 
      `Proyecto de ${ideaActiva.field}: Aplicación a ${fondo.nombre}` : "";

    setFormData((prevData) => ({
      ...prevData,
      Titulo: tituloSugerido,
      Descripcion: descripcionSugerida,
      Area: ideaActiva.field || "",
      isFromConvertedIdea: false
    }));
    

    localStorage.removeItem('ideaRespuestaIA');

  }, [idea, fondo, isDataLoaded]); 



  useEffect(() => {

    if (storedUser && !isFromConvertedIdea) {
      const usuario = JSON.parse(storedUser);
      setFormData((prev) => ({ ...prev, Beneficiario: usuario.Beneficiario.ID }));
      setPersonas(usuario.Miembros.map((m: any) => new PersonaClass(m)));
    } else if (storedUser && isFromConvertedIdea) {
    
      const usuario = JSON.parse(storedUser);
      setFormData((prev) => ({ ...prev, Beneficiario: usuario.Beneficiario.ID }));
      setPersonas(usuario.Miembros.map((m: any) => new PersonaClass(m)));
    }
  }, [storedUser, isFromConvertedIdea]);


  useEffect(() => {
    if (formData.isFromConvertedIdea) {
      console.log('CONVERSION DEBUG - Descripción:', formData.Descripcion.length > 0 ? 'Cargada correctamente' : 'VACÍA');
    }
  }, [formData]);

 
  if (formData.isFromConvertedIdea) {
    console.log('RENDER - Conversión detectada, descripción:', formData.Descripcion ? 'presente' : 'FALTA');
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name.includes("Duracion") ? Number(value) : value });
  };
  
  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNuevaPersonaData({ ...nuevaPersonaData, [e.target.name]: e.target.value });
  };
  

  const handleCrearNuevaPersona = async (e: React.FormEvent) => {
    e.preventDefault();
    const expression = /^[0-9]{1,2}[\.]{0,1}[0-9]{3}[\.]{0,1}[0-9]{3}[\-]{1}[0-9|K|k]{1}$/;
    if (!expression.test(nuevaPersonaData.RUT)) {
        alert("El formato del RUT no es válido. Ejemplo: 12.345.678-9");
        return;
    }
    try {
        const resPersona = await fetch("https://backend.matchafunding.com/crearpersona/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(nuevaPersonaData) });
        if (!resPersona.ok) throw new Error("No se pudo crear la persona. Verifique los datos.");
        
        const personaCreada = await resPersona.json();
        setFormData(prev => ({ ...prev, Miembros: [...prev.Miembros, personaCreada.Nombre] }));
        setPersonas(prev => [...prev, new PersonaClass(personaCreada)]);
        
        alert("Persona creada y añadida al proyecto exitosamente.");
        setIsModalOpen(false);
        setNuevaPersonaData({ Nombre: "", Sexo: "OTR", RUT: "", FechaDeNacimiento: "" });
    } catch (error) {
        if (error instanceof Error) alert(error.message);
        else alert("Ocurrió un error inesperado al crear la persona.");
    }
  };

  const crearProyecto = async () => {
    if (formData.Titulo.length < 10) { alert("El título debe tener al menos 10 caracteres."); return; }
    if (formData.Descripcion.length < 10) { alert("La descripción debe tener al menos 10 caracteres."); return; }
    if (formData.DuracionEnMesesMinimo <= 0 || formData.DuracionEnMesesMaximo <= 0) { alert("La duración debe ser mayor a cero."); return; }
    if (formData.DuracionEnMesesMinimo > formData.DuracionEnMesesMaximo) { alert("La duración mínima no puede ser mayor que la máxima."); return; }
    if (!formData.Alcance || !formData.Area) { alert("Debes seleccionar un Alcance y un Área."); return; }
    try {
      const proyectoData = { ...formData };
      const resProyecto = await fetch("https://backend.matchafunding.com/crearproyecto/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(proyectoData) });
      if (!resProyecto.ok) {
        if (resProyecto.status === 400) throw new Error("Los datos enviados no son válidos. Por favor, revise todos los campos.");
        throw new Error(`Error del servidor: ${resProyecto.status}`);
      }
      const proyectoCreado = await resProyecto.json();
      if (formData.Miembros.length > 0) {
        for (const nombreMiembro of formData.Miembros) {
          let persona = personas.find((p) => p.Nombre === nombreMiembro);
          if (!persona) throw new Error(`No se encontró la persona ${nombreMiembro}.`);
          const colaboradorPayload = { Persona: persona.ID, Proyecto: proyectoCreado.ID };
          const resColaborador = await fetch("https://backend.matchafunding.com/crearcolaborador/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(colaboradorPayload) });
          if (!resColaborador.ok) throw new Error(`Error al crear el colaborador para ${nombreMiembro}`);
        }
      }
      alert("¡Tu proyecto ha sido creado con éxito!");
      navigate("/Proyectos");
    } catch (error) {
      console.error("Falló el proceso de creación:", error);
      if (error instanceof Error) alert(error.message);
      else alert("Ha ocurrido un error inesperado.");
    }
  };
  

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);


  return (

    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <main className="flex flex-col items-center justify-center px-4 py-10 mt-16 md:mt-20 lg:mt-[5%]">
        {formData.isFromConvertedIdea && (
          <div className="w-full max-w-3xl mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-blue-800 font-semibold">Proyecto creado desde tu idea</h4>
                <p className="text-blue-700 text-sm">La descripción se ha pre-cargado con tu propuesta refinada por IA. Completa los demás campos según necesites.</p>
              </div>
            </div>
          </div>
        )}
        <StepIndicator currentStep={step} totalSteps={7} />
        
        {/* El contenedor Card ahora es más ancho para el nuevo diseño */}
        <Card className="w-full max-w-4xl px-9 py-8">
            {/* Se mantiene una altura mínima consistente para el formulario */}
            <form className="flex flex-col min-h-[580px]" onSubmit={(e) => { e.preventDefault(); if (step < 7) nextStep(); else crearProyecto(); }}>
                
                {/* Contenedor de pasos con altura mínima para evitar "saltos" */}
                <div className="flex-grow min-h-[480px] transition-opacity duration-300 ease-in-out">
                    
                    {step === 1 && (
                        <CardContent className="space-y-6">
                            <h2 className="text-2xl font-semibold text-center text-slate-800">Información Básica</h2>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Título del Proyecto</label>
                                <Input name="Titulo" value={formData.Titulo} onChange={handleChange} minLength={10} required 
                                    className="p-2.5 text-base"
                                    onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('El título debe tener al menos 10 caracteres.')}
                                    onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
                                    placeholder="Ej: Plataforma de apoyo para agricultores locales"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción del Proyecto</label>
                                <Textarea name="Descripcion" rows={6} value={formData.Descripcion} onChange={handleChange} minLength={10} required 
                                    className="p-2.5 text-base leading-relaxed"
                                    onInvalid={e => (e.target as HTMLTextAreaElement).setCustomValidity('La descripción debe tener al menos 10 caracteres.')}
                                    onInput={e => (e.target as HTMLTextAreaElement).setCustomValidity('')}
                                    placeholder="Describe la esencia de tu proyecto, qué es y qué busca lograr."
                                />
                            </div>
                        </CardContent>
                    )}

                    {step === 2 && (
                        <CardContent className="space-y-6">
                            <h2 className="text-2xl font-semibold text-center text-slate-800">Completa los Detalles</h2>
                            {/* MEJORA: Grid responsivo, se apila en móviles */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Duración mínima (meses)</label>
                                    <Input name="DuracionEnMesesMinimo" type="number" value={formData.DuracionEnMesesMinimo} onChange={handleChange} min={1} required 
                                         className="p-2.5 text-base"
                                         onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('La duración debe ser un número positivo.')}
                                         onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Duración máxima (meses)</label>
                                    <Input name="DuracionEnMesesMaximo" type="number" value={formData.DuracionEnMesesMaximo} onChange={handleChange} min={formData.DuracionEnMesesMinimo} required 
                                         className="p-2.5 text-base"
                                         onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Debe ser mayor o igual a la duración mínima.')}
                                         onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Alcance (Región)</label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {opcionesAlcance.map(opcion => (<button type="button" key={opcion.value} onClick={() => setFormData({...formData, Alcance: opcion.value})} className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${formData.Alcance === opcion.value ? 'bg-green-600 text-white border-green-700' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}>{opcion.label}</button>))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Área Temática</label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {opcionesArea.map(opcion => (<button type="button" key={opcion} onClick={() => setFormData({...formData, Area: opcion})} className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${formData.Area === opcion ? 'bg-green-600 text-white border-green-700' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}>{opcion}</button>))}
                                </div>
                            </div>
                        </CardContent>
                    )}

                    {/* --- Pasos 3, 4, 5 y 6 con validaciones mejoradas --- */}
                    {step === 3 && (
                        <CardContent className="space-y-6">
                            <h2 className="text-2xl font-semibold text-center text-slate-800">Problema y Público Objetivo</h2>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Problema</label>
                                <Textarea name="Problema" rows={5} value={formData.Problema} onChange={handleChange} required placeholder="Describe en detalle el problema o la necesidad que tu proyecto busca resolver." className="p-2.5 text-base" onInvalid={e => (e.target as HTMLTextAreaElement).setCustomValidity('Por favor, describe el problema.')} onInput={e => (e.target as HTMLTextAreaElement).setCustomValidity('')} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Público Objetivo</label>
                                <Textarea name="PublicoObjetivo" rows={5} value={formData.PublicoObjetivo} onChange={handleChange} required placeholder="¿A quién está dirigido tu proyecto? Describe tu público, usuarios o mercado meta." className="p-2.5 text-base" onInvalid={e => (e.target as HTMLTextAreaElement).setCustomValidity('Por favor, define tu público objetivo.')} onInput={e => (e.target as HTMLTextAreaElement).setCustomValidity('')} />
                            </div>
                        </CardContent>
                    )}


{step === 4 && (
  <CardContent className="space-y-6">
    <h2 className="text-2xl font-semibold text-center text-slate-800">Objetivos del Proyecto</h2>
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Objetivo General</label>
      <Textarea name="ObjetivoGeneral" rows={5} value={formData.ObjetivoGeneral} onChange={handleChange} required placeholder="Define el objetivo principal y de alto nivel de tu proyecto. ¿Qué es lo más importante que quieres lograr?" />
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Objetivos Específicos</label>
      <Textarea name="ObjetivoEspecifico" rows={5} value={formData.ObjetivoEspecifico} onChange={handleChange} required placeholder="Detalla los objetivos específicos, medibles y alcanzables que contribuyen al objetivo general. Puedes listarlos." />
    </div>
  </CardContent>
)}


{step === 5 && (
  <CardContent className="space-y-6">
    <h2 className="text-2xl font-semibold text-center text-slate-800">Propuesta de Valor</h2>
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Propósito</label>
      <Textarea name="Proposito" rows={4} value={formData.Proposito} onChange={handleChange} required placeholder="¿Cuál es el propósito o la misión de tu proyecto? ¿Por qué es importante?" />
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Innovación</label>
      <Textarea name="Innovacion" rows={4} value={formData.Innovacion} onChange={handleChange} required placeholder="¿Qué hace que tu proyecto sea innovador, diferente o único en comparación con otras soluciones?" />
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Resultado Esperado</label>
      <Textarea name="ResultadoEsperado" rows={4} value={formData.ResultadoEsperado} onChange={handleChange} required placeholder="Describe los resultados concretos y tangibles que esperas lograr al finalizar el proyecto." />
    </div>
  </CardContent>
)}
            {step === 6 && (
                <CardContent className="space-y-6">
                    <h2 className="text-2xl font-semibold text-center" style={{ color: colorPalette.oliveGray }}>Añadir Miembros</h2>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {personas.map((p) => (<span key={p.ID} draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", p.Nombre)} className="px-4 py-2 rounded-full cursor-grab shadow-sm hover:shadow-md transition" style={{ backgroundColor: colorPalette.lightGray, color: colorPalette.darkGreen, border: `1px solid ${colorPalette.softGreen}` }}>{p.Nombre}</span>))}
                    </div>
                    <div className="min-h-[140px] rounded-2xl flex flex-wrap items-center gap-3 p-4 shadow-inner" style={{ border: `2px dashed ${colorPalette.softGreen}`, backgroundColor: colorPalette.lightGray }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const droppedName = e.dataTransfer.getData("text/plain"); if (droppedName && !formData.Miembros.includes(droppedName)) { setFormData({ ...formData, Miembros: [...formData.Miembros, droppedName] }); } }}>
                      {formData.Miembros.length === 0 ? (<p className="text-sm italic" style={{ color: colorPalette.oliveGray }}>Arrastra aquí los miembros existentes</p>) : (formData.Miembros.map((m, i) => (<span key={i} className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm" style={{ backgroundColor: colorPalette.softGreen, color: colorPalette.lightGray, border: `1px solid ${colorPalette.oliveGray}` }}>{m}<button type="button" onClick={() => setFormData({ ...formData, Miembros: formData.Miembros.filter((mi) => mi !== m) })} className="w-5 h-5 flex items-center justify-center rounded-full hover:scale-110 transition" style={{ backgroundColor: colorPalette.darkGreen }}><span className="text-xs text-white">×</span></button></span>)))}
                    </div>
                    <div className="text-center pt-4">
                      <Button type="button" onClick={() => setIsModalOpen(true)}>Crear Nuevo Colaborador</Button>
                    </div>
                </CardContent>
            )}
         
{step === 7 && (
  <CardContent className="space-y-10">
    <h2 className="text-2xl font-semibold text-center" style={{ color: colorPalette.darkGreen }}>
      Revisa y Confirma tu Proyecto
    </h2>

   
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Duración */}
        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-slate-600 text-sm mb-2">Duración del Proyecto</h4>
            <div className="flex items-center gap-3 text-xl font-bold" style={{ color: colorPalette.oliveGray }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {formData.DuracionEnMesesMinimo}-{formData.DuracionEnMesesMaximo} Meses
            </div>
        </div>
        {/* Área */}
        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-slate-600 text-sm mb-2">Área y Alcance</h4>
            <div className="flex items-center gap-3 text-xl font-bold" style={{ color: colorPalette.oliveGray }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {formData.Area}
            </div>
            <p className="text-xs text-slate-500 mt-1">{opcionesAlcance.find(o => o.value === formData.Alcance)?.label}</p>
        </div>
        {/* Equipo */}
        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-slate-600 text-sm mb-2">Equipo</h4>
            <div className="flex items-center gap-3 text-xl font-bold" style={{ color: colorPalette.oliveGray }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.274-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.274.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {formData.Miembros.length} Miembro(s)
            </div>
        </div>
    </div>
    
   
    <ProjectPreviewPaginator data={formData} colorPalette={colorPalette} />

  </CardContent>
)}


                </div>

                <div className="flex justify-between items-center mt-auto pt-6 border-t border-slate-200">
                    <Button type="button" onClick={prevStep} disabled={step === 1} variant="outline">Anterior</Button>
                    <Button type="submit">{step < 7 ? "Siguiente" : "Crear Proyecto"}</Button>
                </div>
            </form>
        </Card>
      </main>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <form onSubmit={handleCrearNuevaPersona}>
                    <CardContent className="p-8 space-y-4">
                        <h3 className="text-xl font-semibold text-center text-slate-800">Crear Nueva Persona</h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                            <Input name="Nombre" value={nuevaPersonaData.Nombre} onChange={handleModalChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">RUT</label>
                            <Input name="RUT" placeholder="12.345.678-9" value={nuevaPersonaData.RUT} onChange={handleModalChange} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Sexo</label>
                                <select name="Sexo" value={nuevaPersonaData.Sexo} onChange={handleModalChange} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                    <option value="VAR">Varón</option>
                                    <option value="MUJ">Mujer</option>
                                    <option value="OTR">Otro</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Nacimiento</label>
                                <Input name="FechaDeNacimiento" type="date" value={nuevaPersonaData.FechaDeNacimiento} onChange={handleModalChange} required />
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                            <Button type="submit">Guardar y Añadir</Button>
                        </div>
                    </CardContent>
                    
                </form>
            </Card>
        </div>
      )}
    </div>
  );
};

export default CrearProyectoFine;