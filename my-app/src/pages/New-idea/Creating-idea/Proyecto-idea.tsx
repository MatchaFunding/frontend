import NavBar from "../../../components/NavBar/navbar";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../../components/UI/buttons";
import { Card, CardContent } from "../../../components/UI/cards";
import { Input } from "../../../components/UI/input";
import { Textarea } from "../../../components/UI/textarea";
import { StepIndicator } from "../../../components/Shared/StepIndicator";
import { VerMiUsuario } from '../../../api/VerMiUsuario';
import { VerMiBeneficiario } from '../../../api/VerMiBeneficiario';
import { VerMisProyectos } from '../../../api/VerMisProyectos';
import { VerMisPostulaciones } from '../../../api/VerMisPostulaciones';
import { VerMisMiembros } from '../../../api/VerMisMiembros';
import { VerMisIdeas } from '../../../api/VerMisIdeas';
import React from 'react';
import PersonaClass from "../../../models/Persona";


interface PersonaPayload {
  Nombre: string;
  Sexo: string;
  RUT: string;
  FechaDeNacimiento: string;
}

interface ProyectoForm {
  Beneficiario: number;
  Titulo: string;
  Descripcion: string;
  DuracionEnMesesMinimo: number;
  DuracionEnMesesMaximo: number;
  Alcance: string;
  Area: string;
  Miembros: string[];
  isFromConvertedIdea?: boolean; // Agregar bandera en el formData
}

interface Idea {
  id: number;
  field: string;
  problem: string;
  audience: string;
  uniqueness: string;
}

interface Fondo {
  id: number;
  nombre: string;
  categoria: string;
}

const colorPalette = {
  darkGreen: "#44624a",
  softGreen: "#8ba888",
  oliveGray: "#505143",
  lightGray: "#f1f5f9",
};

const opcionesAlcance = [
  { value: '', label: 'Seleccionar región' },
  { value: 'Arica y Parinacota', label: 'Arica y Parinacota' },
  { value: 'Tarapaca', label: 'Tarapacá' },
  { value: 'Antofagasta', label: 'Antofagasta' },
  { value: 'Atacama', label: 'Atacama' },
  { value: 'Coquimbo', label: 'Coquimbo' },
  { value: 'Valparaiso', label: 'Valparaíso' },
  { value: 'Santiago', label: 'Metropolitana' },
  { value: 'O\'Higgins', label: 'O\'Higgins' },
  { value: 'Maule', label: 'Maule' },
  { value: 'Nuble', label: 'Ñuble' },
  { value: 'Biobio', label: 'Biobío' },
  { value: 'La Araucania', label: 'La Araucanía' },
  { value: 'Los Rios', label: 'Los Ríos' },
  { value: 'Los Lagos', label: 'Los Lagos' },
  { value: 'Aysen', label: 'Aysén' },
  { value: 'Magallanes', label: 'Magallanes' }
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

const CrearProyectoMatch: React.FC = () => {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"presentacion" | "publico">("presentacion");
  const navigate = useNavigate();
  const location = useLocation();

  const { idea = defaultIdea, fondo = defaultFondo } = (location.state as { idea: Idea; fondo: Fondo }) || {};

  const [formData, setFormData] = useState<ProyectoForm>(() => {
    // Inicialización lazy para evitar reinicios
    return {
      Beneficiario: 0, Titulo: "", Descripcion: "", DuracionEnMesesMinimo: 6,
      DuracionEnMesesMaximo: 12, Alcance: "", Area: "", Miembros: [],
      isFromConvertedIdea: false
    };
  });
  

  const [personas, setPersonas] = useState<PersonaClass[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevaPersonaData, setNuevaPersonaData] = useState<PersonaPayload>({
    Nombre: "", Sexo: "Otro", RUT: "", FechaDeNacimiento: ""
  });
  const [isFromConvertedIdea, setIsFromConvertedIdea] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const storedUser = localStorage.getItem("usuario");

  // useEffect para manejar conversión de ideas - solo se ejecuta una vez
  useEffect(() => {
    console.log('INICIO CARGA DE DATOS - CONVERSION');
    
    // Verificar si viene una idea para convertir en proyecto
    const ideaAConvertir = localStorage.getItem('convertirAProyecto') || 
                          localStorage.getItem('convertirAProyecto');
    console.log('localStorage convertirAProyecto:', localStorage.getItem('convertirAProyecto'));
    console.log('localStorage convertirAProyecto:', localStorage.getItem('convertirAProyecto'));
    console.log('ideaAConvertir final:', ideaAConvertir);
    
    if (ideaAConvertir) {
      try {
        const ideaParsed = JSON.parse(ideaAConvertir);
        console.log('IDEA PARSEADA:', ideaParsed);
        
        // Para ideas convertidas, usar la propuesta LLM como descripción
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
          isFromConvertedIdea: true
        };
        
        console.log('FORMDATA A ESTABLECER:', formDataToSet);
        setFormData(formDataToSet);
        setIsFromConvertedIdea(true);
        
        // Limpiar ambos storage después de usar la idea
        localStorage.removeItem('convertirAProyecto');
        localStorage.removeItem('convertirAProyecto');
        
        // Marcar que los datos se han cargado
        setIsDataLoaded(true);
        
        console.log('CONVERSION COMPLETADA');
        return;
      }
      catch (e) {
        console.error('Error al parsear idea para convertir:', e);
        setIsFromConvertedIdea(false);
      }
    }
    
    // Si no hay conversión, marcar como cargado para permitir flujo normal
    setIsDataLoaded(true);
  }, []); // SIN DEPENDENCIAS - solo se ejecuta una vez al montar

  // useEffect separado para flujo normal (cuando NO hay conversión)
  useEffect(() => {
    // Solo ejecutar si ya se verificó conversión y no hay conversión pendiente
    if (!isDataLoaded || formData.isFromConvertedIdea)
      return;
    console.log('INICIO FLUJO NORMAL');
    // Procesamiento normal para ideas que vienen del flujo estándar
    const ideaActiva = idea || JSON.parse(localStorage.getItem("selectedIdea") || JSON.stringify(defaultIdea));
    // Solo usar descripción sugerida si hay respuesta de IA guardada
    let descripcionSugerida = "";
    const storedApiResponse = localStorage.getItem('ideaRespuestaIA');

    if (storedApiResponse) {
      try {
        const respuestaParseada = JSON.parse(storedApiResponse);
        if (respuestaParseada && respuestaParseada.ResumenLLM) {
          descripcionSugerida = respuestaParseada.ResumenLLM;
        }
      }
      catch (e) {
        console.error("No se pudo parsear la respuesta de la IA desde localStorage.", e);
      }
    }
    // Solo precargar datos si tenemos información válida de la idea y fondo
    const tituloSugerido = (ideaActiva.field && fondo.nombre) ? 
      `Proyecto de ${ideaActiva.field}: Aplicación a ${fondo.nombre}` : "";

    setFormData((prevData) => ({
      ...prevData,
      Titulo: tituloSugerido,
      Descripcion: descripcionSugerida,
      Area: ideaActiva.field || "",
      isFromConvertedIdea: false
    }));
    // Limpiar localStorage de respuesta IA
    localStorage.removeItem('ideaRespuestaIA');
  }, [idea, fondo, isDataLoaded]); // Solo depende de idea/fondo para flujo normal

  useEffect(() => {
    // Solo actualizar datos de usuario si NO viene de conversión de idea
    if (storedUser && !isFromConvertedIdea) {
      const usuario = JSON.parse(storedUser);
      setFormData((prev) => ({ ...prev, Beneficiario: usuario.Beneficiario.ID }));
      setPersonas(usuario.Miembros.map((m: any) => new PersonaClass(m)));
    }
    // Si viene de conversión, solo actualizar el Beneficiario sin tocar otros campos
    else if (storedUser && isFromConvertedIdea) {
      const usuario = JSON.parse(storedUser);
      setFormData((prev) => ({ ...prev, Beneficiario: usuario.Beneficiario.ID }));
      setPersonas(usuario.Miembros.map((m: any) => new PersonaClass(m)));
    }
  }, [storedUser, isFromConvertedIdea]);

  // useEffect adicional para debuggear el estado del formData (temporal)
  useEffect(() => {
    if (formData.isFromConvertedIdea) {
      console.log('CONVERSION DEBUG - Descripción:', formData.Descripcion.length > 0 ? 'Cargada correctamente' : 'VACÍA');
    }
  }, [formData]);

  // Log del render para verificar el estado
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
        const resPersona = await fetch("http://127.0.0.1:8000/personas", {
          method: "POST", 
          headers: {
            "Content-Type": "application/json" 
          },
          body: JSON.stringify(nuevaPersonaData) 
        });

        if (!resPersona.ok)
          throw new Error("No se pudo crear la persona. Verifique los datos.");
        
        const personaCreada = await resPersona.json();
        setFormData(prev => ({ ...prev, Miembros: [...prev.Miembros, personaCreada.Nombre] }));
        setPersonas(prev => [...prev, new PersonaClass(personaCreada)]);
        
        alert("Persona creada y añadida al proyecto exitosamente.");
        setIsModalOpen(false);
        setNuevaPersonaData({ Nombre: "", Sexo: "Otro", RUT: "", FechaDeNacimiento: "" });
    }
    catch (error) {
        if (error instanceof Error) alert(error.message);
        else alert("Ocurrió un error inesperado al crear la persona.");
    }
  };

  const CrearProyecto = async () => {
    if (formData.Titulo.length < 10) {
      alert("El título debe tener al menos 10 caracteres."); 
      return;
    }
    if (formData.Descripcion.length < 10) {
      alert("La descripción debe tener al menos 10 caracteres."); 
      return;
    }
    if (formData.DuracionEnMesesMinimo <= 0 || formData.DuracionEnMesesMaximo <= 0) {
      alert("La duración debe ser mayor a cero.");
      return;
    }
    if (formData.DuracionEnMesesMinimo > formData.DuracionEnMesesMaximo) {
      alert("La duración mínima no puede ser mayor que la máxima.");
      return;
    }
    if (!formData.Alcance || !formData.Area) {
      alert("Debes seleccionar un Alcance y un Área.");
      return;
    }
    try {
      const userData = localStorage.getItem("usuario");
      if (userData) {
        const parsedData = JSON.parse(userData);
        const miUsuario = parsedData?.Usuario;
        if (miUsuario) {
          const id = miUsuario.ID;
          var proyectoData = { ...formData };
          const resProyecto = await fetch("http://127.0.0.1:8000/proyectos", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            }, 
            body: JSON.stringify({
              "Beneficiario":proyectoData.Beneficiario,
              "Titulo":proyectoData.Titulo,
              "Descripcion":proyectoData.Descripcion,
              "DuracionEnMesesMinimo":proyectoData.DuracionEnMesesMinimo,
              "DuracionEnMesesMaximo":proyectoData.DuracionEnMesesMaximo,
              "Alcance":proyectoData.Alcance,
              "Area":proyectoData.Area,
              "Usuario":id
            })
          });
          if (!resProyecto.ok) {
            if (resProyecto.status === 400)
              throw new Error("Los datos enviados no son válidos. Por favor, revise todos los campos.");
            throw new Error(`Error del servidor: ${resProyecto.status}`);
          }
          const proyectoCreado = await resProyecto.json();
          if (formData.Miembros.length > 0) {
            for (const nombreMiembro of formData.Miembros) {
              let persona = personas.find((p) => p.Nombre === nombreMiembro);
              if (!persona)
                throw new Error(`No se encontró la persona ${nombreMiembro}.`);
              const colaboradorPayload = {
                Persona: persona.ID,
                Proyecto: proyectoCreado[0].ID,
                Usuario:id
              };
              const resColaborador = await fetch("http://127.0.0.1:8000/colaboradores", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                }, 
                body: JSON.stringify(colaboradorPayload)
              });
              if (!resColaborador.ok)
                throw new Error(`Error al crear el colaborador para ${nombreMiembro}`);
            }
          }

          const usuario = await VerMiUsuario(id);
          const beneficiario = await VerMiBeneficiario(id);
          const proyectos = await VerMisProyectos(id);
          const postulaciones = await VerMisPostulaciones(id);
          const miembros = await VerMisMiembros(id);
          const ideas = await VerMisIdeas(id);
          const datos = {
            "Usuario":usuario,
            "Beneficiario":beneficiario,
            "Proyectos":proyectos,
            "Postulaciones":postulaciones,
            "Miembros":miembros,
            "Ideas":ideas
          }
          localStorage.setItem("usuario", JSON.stringify(datos));

          alert("¡Tu proyecto ha sido creado con éxito!");
          navigate("/Proyectos");
        }
      }
    }
    catch (error) {
      console.error("Falló el proceso de creación:", error);
      if (error instanceof Error)
        alert(error.message);
      else 
        alert("Ha ocurrido un error inesperado.");
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
        
        <StepIndicator currentStep={step} totalSteps={4} />
        <Card className="w-full max-w-3xl px-9 py-8">
          <form onSubmit={(e) => { e.preventDefault(); if (step < 4) nextStep(); else CrearProyecto(); }}>
            {step === 1 && (
              <CardContent className="space-y-6">
                <h2 className="text-2xl font-semibold text-center text-slate-800">
                  {formData.isFromConvertedIdea ? "Información Básica (Pre-cargada desde tu Idea)" : "Información Básica (Sugerida)"}
                </h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Título del Proyecto
                    {formData.isFromConvertedIdea && <span className="text-green-600 text-xs ml-2">(Personalízalo como desees)</span>}
                  </label>
                  <Input name="Titulo" value={formData.Titulo} onChange={handleChange} minLength={10} required 
                    placeholder={formData.isFromConvertedIdea ? "Ingresa un título descriptivo para tu proyecto..." : "Título del proyecto"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Descripción del Proyecto
                    {formData.isFromConvertedIdea && <span className="text-green-600 text-xs ml-2">(Pre-cargada con IA - puedes editarla)</span>}
                  </label>
                  <Textarea 
                    name="Descripcion" 
                    rows={6} 
                    value={formData.Descripcion} 
                    onChange={handleChange} 
                    minLength={10} 
                    required 
                    placeholder={formData.isFromConvertedIdea ? "Descripción generada por IA - edítala si es necesario..." : "Descripción del proyecto"}
                    onFocus={() => console.log('TEXTAREA FOCUS - Valor actual:', formData.Descripcion)}
                  />
                </div>
              </CardContent>
            )}
            {step === 2 && (
              <CardContent className="space-y-6">
                <h2 className="text-2xl font-semibold text-center text-slate-800">Completa los Detalles</h2>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Duración mínima (meses)</label>
                        <Input name="DuracionEnMesesMinimo" type="number" value={formData.DuracionEnMesesMinimo} onChange={handleChange} min={1} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Duración máxima (meses)</label>
                        <Input name="DuracionEnMesesMaximo" type="number" value={formData.DuracionEnMesesMaximo} onChange={handleChange} min={1} required />
                    </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Alcance (Región)</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {opcionesAlcance.map(opcion => (<button type="button" key={opcion.value} onClick={() => setFormData({...formData, Alcance: opcion.value})} className={`px-3 py-1 text-sm rounded-full border transition-colors ${formData.Alcance === opcion.value ? 'bg-green-600 text-white border-green-700' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>{opcion.label}</button>))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Área (Sugerida)</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {opcionesArea.map(opcion => (<button type="button" key={opcion} onClick={() => setFormData({...formData, Area: opcion})} className={`px-3 py-1 text-sm rounded-full border transition-colors ${formData.Area === opcion ? 'bg-green-600 text-white border-green-700' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>{opcion}</button>))}
                  </div>
                </div>
              </CardContent>
            )}
            {/* ... resto del JSX ... */}
            {step === 3 && (
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
            {step === 4 && (
              <CardContent>
                <h2 className="text-2xl font-semibold text-center mb-6" style={{ color: colorPalette.darkGreen }}>Vista Previa del Proyecto</h2>
                <div className="flex justify-center space-x-2 mb-6">
                  <button type="button" onClick={() => setActiveTab("presentacion")} className="px-6 py-2 border rounded-md font-semibold transition-colors duration-200" style={{ color: activeTab === "presentacion" ? colorPalette.darkGreen : colorPalette.softGreen, borderColor: activeTab === "presentacion" ? colorPalette.softGreen : "#e2e8f0", borderWidth: "2px" }}>PRESENTACIÓN</button>
                  <button type="button" onClick={() => setActiveTab("publico")} className="px-6 py-2 border rounded-md font-semibold transition-colors duration-200" style={{ color: activeTab === "publico" ? colorPalette.darkGreen : colorPalette.softGreen, borderColor: activeTab === "publico" ? colorPalette.softGreen : "#e2e8f0", borderWidth: "2px" }}>DETALLE</button>
                </div>
                {activeTab === "presentacion" && (<Card><div className="p-6 md:p-8"><h3 className="text-xl font-semibold mb-4" style={{ color: colorPalette.darkGreen }}>Presentación</h3><div className="space-y-4 leading-relaxed" style={{ color: colorPalette.oliveGray }}>{formData.Titulo && <p><strong>Título:</strong> {formData.Titulo}</p>}{formData.Descripcion && <p><strong>Descripción:</strong> {formData.Descripcion}</p>}{(formData.DuracionEnMesesMinimo > 0 || formData.DuracionEnMesesMaximo > 0) && <p><strong>Duración:</strong> {formData.DuracionEnMesesMinimo || "?"} - {formData.DuracionEnMesesMaximo || "?"} meses</p>}</div></div></Card>)}
                {activeTab === "publico" && (<Card><div className="p-6 md:p-8"><h3 className="text-xl font-semibold mb-4" style={{ color: colorPalette.darkGreen }}>Detalle</h3><div className="space-y-4 leading-relaxed" style={{ color: colorPalette.oliveGray }}>{formData.Alcance && <p><strong>Alcance:</strong> {opcionesAlcance.find(o => o.value === formData.Alcance)?.label}</p>}{formData.Area && <p><strong>Área:</strong> {formData.Area}</p>}{formData.Miembros.length > 0 ? (<p><strong>Miembros:</strong> {formData.Miembros.join(", ")}</p>) : (<p className="italic text-slate-500">No hay miembros agregados</p>)}</div></div></Card>)}
              </CardContent>
            )}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
              <Button type="button" onClick={prevStep} disabled={step === 1} variant="outline">Anterior</Button>
              <Button type="submit">{step < 4 ? "Siguiente" : "Crear Proyecto"}</Button>
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
                                    <option value="Hombre">Hombre</option>
                                    <option value="Mujer">Mujer</option>
                                    <option value="Otro">Otro</option>
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

export default CrearProyectoMatch;