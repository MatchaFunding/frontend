import NavBar from "../../components/NavBar/navbar";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { CardContent} from "../../components/UI/cards";
import { Textarea } from "../../components/UI/textarea";
import { Button } from "../../components/UI/buttons";
import { Input } from "../../components/UI/input";
import { Card } from "../../components/UI/cards";
import { VerMiUsuario } from '../../api/VerMiUsuario';
import { VerMiBeneficiario } from '../../api/VerMiBeneficiario';
import { VerMisProyectos } from '../../api/VerMisProyectos';
import { VerMisPostulaciones } from '../../api/VerMisPostulaciones';
import { VerMisMiembros } from '../../api/VerMisMiembros';
import { VerMisIdeas } from '../../api/VerMisIdeas';
import { CrearColaborador } from "../../api/CrearColaborador";
import { CrearProyecto } from "../../api/CrearProyecto";
import { CrearPersona } from "../../api/CrearPersona";
import { AnimatePresence, motion } from "framer-motion";
import Colaborador from "../../models/Colaborador";
import Proyecto from "../../models/Proyecto";
import Persona from "../../models/Persona";
import React from "react";

const BASE_URL = "https://ai.matchafunding.com/api/v1/premium";
const ENDPOINTS = {
  problema: `${BASE_URL}/problema`,
  solucion: `${BASE_URL}/solucion`,
  pubob: `${BASE_URL}/pubob`,       
  obgen: `${BASE_URL}/Obgen`,       
  obes: `${BASE_URL}/Obes`,          
  resultado: `${BASE_URL}/resultado`,
};

interface ProyectoForm {
  Beneficiario: number; Titulo: string; Descripcion: string;
  DuracionEnMesesMinimo: number; DuracionEnMesesMaximo: number;
  Alcance: string; Area: string; Miembros: string[];
  Problema: string; PublicoObjetivo: string; ObjetivoGeneral: string;
  ObjetivoEspecifico: string; Proposito: string; Innovacion: string;
  ResultadoEsperado: string; isFromConvertedIdea?: boolean;
}

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
const opcionesAlcance =  [
  { value: 'Arica y Parinacota', label: 'Arica y Parinacota' },
  { value: 'Tarapaca', label: 'Tarapacá' },
  { value: 'Antofagasta', label: 'Antofagasta' },
  { value: 'Atacama', label: 'Atacama' },
  { value: 'Coquimbo', label: 'Coquimbo' },
  { value: 'Valparaiso', label: 'Valparaíso' },
  { value: 'RM', label: 'Metropolitana' },
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


const CrearProyectoFine: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const [aiResponses, setAiResponses] = useState({
    problema: '',
    solucion: '',
    pubob: '',
    obgen: '',
    obes: '',
    resultado: '',
  });

  const { idea = defaultIdea, fondo = defaultFondo } = (location.state as { idea: Idea; fondo: Fondo }) || {};

  const [formData, setFormData] = useState<ProyectoForm>(() => ({
    Beneficiario: 0, Titulo: "", Descripcion: "", DuracionEnMesesMinimo: 6,
    DuracionEnMesesMaximo: 12, Alcance: "", Area: "", Miembros: [],
    Problema: "", PublicoObjetivo: "", ObjetivoGeneral: "", ObjetivoEspecifico: "",
    Proposito: "", Innovacion: "", ResultadoEsperado: "",
    isFromConvertedIdea: false
}));
  

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevaPersonaData, setNuevaPersonaData] = useState<Persona>({
    ID: 0,
    Nombre: "",
    Sexo: "Otro",
    RUT: "",
    FechaDeNacimiento: ""
  });
  const [isFromConvertedIdea, setIsFromConvertedIdea] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const storedUser = sessionStorage.getItem("usuario");

  const EnviarProyectoAI = async (proyecto: Proyecto) => {
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
      const response = await fetch("https://ai.matchafunding.com/api/v1/projects/upsertusers", {
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
    }
    catch (error) {
      console.error("Falló la comunicación con el endpoint de la IA:", error);
    }
  };

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
      }
      catch (e) {
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
    if (storedUser) {
        const usuario = JSON.parse(storedUser);

        // 1. Establece el Beneficiario Y AÑADE AL USUARIO COMO MIEMBRO INICIAL
        setFormData((prev) => ({
            ...prev,
            Beneficiario: usuario.Beneficiario.ID,
            // Añadimos su nombre a la lista de miembros del proyecto
            Miembros: [usuario.Beneficiario.Nombre] 
        }));

        // 2. La lógica para poblar la lista de personas seleccionables sigue igual
        const usuarioPrincipal = new Persona(usuario.Beneficiario);
        const otrosMiembros = (usuario.Miembros || []).map((m: any) => new Persona(m));
        
        setPersonas([usuarioPrincipal, ...otrosMiembros]);
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
        //const resPersona = await fetch("https://backend.matchafunding.com/persona", {
        //  method: "POST",
        //  headers: { "Content-Type": "application/json" }, body: JSON.stringify(nuevaPersonaData) });
        //if (!resPersona.ok) throw new Error("No se pudo crear la persona. Verifique los datos.");
        //
        //const personaCreada = await resPersona.json();
        const persona = await CrearPersona(nuevaPersonaData);
        setFormData(prev => ({ ...prev, Miembros: [...prev.Miembros, persona.Nombre] }));
        setPersonas(prev => [...prev, persona]);
        
        alert("Persona creada y añadida al proyecto exitosamente.");
        setIsModalOpen(false);
        setNuevaPersonaData({
          ID: 0,
          Nombre: "",
          Sexo: "Otro",
          RUT: "",
          FechaDeNacimiento: ""
        });
    }
    catch (error) {
        if (error instanceof Error)
          alert(error.message);
        else
          alert("Ocurrió un error inesperado al crear la persona.");
    }
  };

   // En tu archivo ProyectoFinetuning.tsx
const EnviarProyecto = async () => {
  // Tu console.log inicial está bien para depurar el formulario completo
  console.log(`Datos completos del formulario: ${JSON.stringify(formData)}`);
  // --- Tus validaciones se quedan igual ---
  if (formData.Titulo.length < 10) {
    alert("El título debe tener al menos 10 caracteres.");
    return;
  }
  if (!formData.Alcance || !formData.Area) {
    alert("Debes seleccionar un Alcance y un Área.");
    return;
  }

  try {
    const storedUser = localStorage.getItem("usuario");
    if (!storedUser) {
        throw new Error("No se encontró información del usuario. Por favor, inicie sesión.");
    }
      
    const datos = JSON.parse(storedUser);
    const enteId = datos.Beneficiario?.ID;
    const id = datos.Usuario?.ID;

    if (!id || !enteId) {
        throw new Error("Información de usuario incompleta. No se pudo obtener el ID del usuario o beneficiario.");
    }
    
    const proyectoParaEnviar = {
      ID: 0,
      Beneficiario: enteId,
      Usuario: id,
      Titulo: formData.Titulo,
      Descripcion: formData.Descripcion,
      DuracionEnMesesMinimo: formData.DuracionEnMesesMinimo,
      DuracionEnMesesMaximo: formData.DuracionEnMesesMaximo,
      Alcance: formData.Alcance,
      Area: formData.Area,
      Innovacion: formData.Innovacion,
      ObjetivoEspecifico: formData.ObjetivoEspecifico,
      ObjetivoGeneral: formData.ObjetivoGeneral,
      Proposito: formData.Proposito,
      ResultadoEsperado: formData.ResultadoEsperado,
    };
    // Opcional pero recomendado: un log para ver exactamente lo que envías
    console.log("Objeto ajustado que se envía al servicio CrearProyecto:", JSON.stringify(proyectoParaEnviar));
    // Llamamos al servicio con el objeto limpio y ajustado
    const creado = await CrearProyecto(proyectoParaEnviar);
    const vector = await EnviarProyectoAI(creado);
    if (creado) {
      for (let i =0; i < personas.length; i++) {
        const payload = new Colaborador({
          ID: 0,
          Persona: personas[i].ID,
          Proyecto: creado.ID,
          Usuario: id
        })
        const colaborador = await CrearColaborador(payload);
        console.log(`Se creo un Colaborador: ${colaborador}`);
      }
    }
    console.log(`Proyecto creado: ${JSON.stringify(creado)}`);
    console.log(`Proyecto creado (AI): ${JSON.stringify(vector)}`);

    if (creado) {
      console.log(`Proyecto creado exitosamente: ${JSON.stringify(creado)}`);
      const usuario = await VerMiUsuario(id);
      const beneficiario = await VerMiBeneficiario(id);
      const proyectos = await VerMisProyectos(id);
      const postulaciones = await VerMisPostulaciones(id);
      const miembros = await VerMisMiembros(id);
      const ideas = await VerMisIdeas(id);
      
      const datosActualizados = {
        "Usuario": usuario,
        "Beneficiario": beneficiario,
        "Proyectos": proyectos,
        "Postulaciones": postulaciones,
        "Miembros": miembros,
        "Ideas": ideas
      };

      localStorage.setItem("usuario", JSON.stringify(datosActualizados));
      alert("¡Proyecto creado exitosamente!");
      navigate("/Home-i");
    }
  }
  catch (error) {
    console.error("FALLÓ LA CREACIÓN DEL PROYECTO (capturado en .catch):", error);
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
    alert(`No se pudo crear el proyecto: ${errorMessage}`);
  }
};

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
 
  // 🧠 useEffect opcional: detectar cambios o debug
  useEffect(() => {
    console.log("Datos actuales:", formData);
  }, [formData]);

   const [previewData, setPreviewData] = useState({
    field: "",
    problem: "",
    audience: "",
    uniqueness: "",
  });
  const [refinedIdea, setRefinedIdea] = useState("");
  const [showRefinedIdea, setShowRefinedIdea] = useState(false);

  // 🔹 Estado de carga (mientras se espera respuesta)
  const [isProcessing, setIsProcessing] = useState(false);

  // 🔹 Control de vista: formulario inicial o siguiente paso
  
  // 🧩 Maneja cambios en los inputs
  const handlePreviewChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPreviewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmAndSaveIdea = async () => {
  // 1. Validación inicial (igual que la original)
  if (!previewData.field || !previewData.problem) { // Asegúrate que las claves coincidan con tu estado 'previewData'
    alert("Por favor completa al menos el campo y el problema antes de enviar.");
    return;
  }
  setMostrarFormulario(true)
  setStep(1)

  setIsProcessing(true);
  setShowRefinedIdea(false);

  // 2. Creamos el payload para la API, añadiendo ID y Usuario en 0.
  // Es importante que las claves (Campo, Problema, etc.) coincidan con lo que la API espera.
  const payload = {
    ID: 0,
    Usuario: 0,
    Campo: previewData.field,
    Problema: previewData.problem,
    Publico: previewData.audience,
    Innovacion: previewData.uniqueness,
  };

  // 3. Creamos un array de "promesas" de fetch, una para cada endpoint.
  try {
    const fetchPromises = Object.values(ENDPOINTS).map(endpointUrl =>
      fetch(endpointUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    );
    // 4. Ejecutamos todas las llamadas a la API en paralelo y esperamos a que todas terminen.
    const responses = await Promise.all(fetchPromises);
    // Verificamos que todas las respuestas fueron exitosas (código 2xx).
    for (const response of responses) {
      if (!response.ok) {
        // Si alguna falla, lanzamos un error para detener la ejecución.
        throw new Error(`Error en la respuesta del servidor para ${response.url}: ${response.statusText}`);
      }
    }
    // 5. Convertimos todas las respuestas a formato JSON.
    const jsonResponses = await Promise.all(responses.map(res => res.json()));
    // 6. Guardamos la respuesta de cada endpoint en su propia constante.
    const [
      respuestaProblema,
      respuestaSolucion,
      respuestaPubob,
      respuestaObgen,
      respuestaObes,
      respuestaResultado,
    ] = jsonResponses;

    // ¡Listo! Ahora puedes usar los datos de cada respuesta.
    // Por ejemplo, los mostramos en la consola para verificar.
    console.log("✅ Respuesta de /problema:", respuestaProblema);
    console.log("✅ Respuesta de /solucion:", respuestaSolucion);
    console.log("✅ Respuesta de /pubob:", respuestaPubob);
    console.log("✅ Respuesta de /obgen:", respuestaObgen);
    console.log("✅ Respuesta de /obes:", respuestaObes);
    console.log("✅ Respuesta de /resultado:", respuestaResultado);

    setAiResponses({
      problema: respuestaProblema.ResumenLLM || '',
      solucion: respuestaSolucion.ResumenLLM || '', 
      pubob: respuestaPubob.ResumenLLM || '',
      obgen: respuestaObgen.ResumenLLM || '',
      obes: respuestaObes.ResumenLLM || '',
      resultado: respuestaResultado.ResumenLLM || '',
    });
    // 7. Actualizamos la interfaz de usuario con la información que necesites.
    // Aquí, por ejemplo, mostramos la solución refinada como en tu código original.
    setRefinedIdea(respuestaSolucion.refinedIdea || "No se pudo generar una propuesta de solución.");
    setShowRefinedIdea(true);

  }
  catch (error) {
    console.error("Error enviando datos a la IA:", error);
    alert("Ocurrió un error al procesar tu idea. Revisa la consola para más detalles.");
  }
  finally {
    setIsProcessing(false);
  }
};
const stepVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };
const problemaRef = useRef<HTMLTextAreaElement | null>(null);
useEffect(() => {
    if (problemaRef.current) {
      const el = problemaRef.current;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [formData.Problema]);

  return (
    <div className="min-h-screen w-full bg-slate-50">
    <NavBar />

    <main className="flex flex-col w-full items-center justify-center px-4 py-10 mt-16 md:mt-20 lg:mt-[5%]">
      {!mostrarFormulario ? (
   <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-4xl p-2"
        >
            <Card className="w-full p-8 max-w-10xl mx-auto text-center shadow-md">
                <CardContent className="p-10 space-y-6">
                    {/* --- CONTENIDO FIJO --- */}
                    <h2 className="text-2xl font-semibold text-slate-800">Crear nuevo proyecto</h2>
                    <img
                        src="/editandoMatch.png"
                        alt="Ilustración de perfil de usuario"
                        className="w-40 h-auto mb-4 mx-auto"
                    />
                    <p className="text-slate-600 leading-relaxed">
                        Ingresa una idea base. Estos datos se enviarán a la IA para que te devuelva una versión refinada del tema o enfoque del proyecto.
                    </p>

                    {/* --- CONTENIDO DINÁMICO POR PASOS --- */}
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                variants={stepVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                                {/* Campo o área */}
                                <div>
                                    <label className="mt-10 block text-sm font-medium text-slate-700 mb-1">
                                        Campo o área de la idea
                                    </label>
                                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                                        {opcionesArea.map((opcion) => (
                                            <button
                                                type="button"
                                                key={opcion}
                                                onClick={() => setPreviewData({ ...previewData, field: opcion })}
                                                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                                                    previewData.field === opcion
                                                        ? "bg-[#44624a] text-white border-[#44624a]"
                                                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                                }`}
                                            >
                                                {opcion}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Problema */}
                                <div>
                                    <label className="mt-10 block text-sm font-medium text-slate-700 mb-1">
                                        Problema que resuelve
                                    </label>
                                    <textarea
                                        name="problem"
                                        value={previewData.problem}
                                        onChange={handlePreviewChange}
                                        placeholder="Ej: Sappea busca cerrar la brecha en el acceso y acción científica..."
                                        className="mt-3 w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        rows={3}
                                    />
                                </div>
                                
                                {/* Botón para ir al siguiente paso */}
                                <div className="flex justify-center pt-6">
                                    <Button onClick={() => setStep(2)} className="px-8 py-3 rounded-full" style={{ backgroundColor: colorPalette.darkGreen }}>
                                        Siguiente →
                                    </Button>
                                    
                                </div>
                                
                                
                            </motion.div>
                        )}

                        {step === 2 && (
                             <motion.div
                                key="step2"
                                variants={stepVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                                {/* Público */}
                                <div>
                                    <label className="mt-10 block text-sm font-medium text-slate-700 mb-1">
                                        Público objetivo
                                    </label>
                                    <textarea
                                        name="audience"
                                        value={previewData.audience}
                                        onChange={handlePreviewChange}
                                        placeholder="Ej: Comunidad científica, escolares, interesados en biodiversidad..."
                                        className="mt-3 w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        rows={2}
                                    />
                                </div>

                                {/* Innovación */}
                                <div>
                                    <label className="mt-10 block text-sm font-medium text-slate-700 mb-1">
                                        Innovación o elemento diferenciador
                                    </label>
                                    <textarea
                                        name="uniqueness"
                                        value={previewData.uniqueness}
                                        onChange={handlePreviewChange}
                                        placeholder="Ej: Reconocimiento en tiempo real de vocalizaciones de anfibios..."
                                        className="mt-3 w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        rows={2}
                                    />
                                </div>

                                {/* Botones finales y de navegación */}
                                <div className="flex justify-center items-center gap-4 pt-6">
                                    <Button variant="outline" onClick={() => setStep(1)} className="px-6 py-3 rounded-full">
                                        ← Atrás
                                    </Button>
                                    <Button
                                        onClick={handleConfirmAndSaveIdea}
                                        disabled={isProcessing}
                                        className="px-6 py-3 text-white font-semibold rounded-full"
                                        style={{ backgroundColor: colorPalette.darkGreen }}
                                    >
                                        {isProcessing ? "Procesando con IA..." : "Enviar a IA 🧠"}
                                    </Button>
                                </div>
                                 
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Resultado IA (se mantiene fuera del flujo de pasos) */}
                    {showRefinedIdea && refinedIdea && (
                        <div className="mt-8 p-4 border border-green-300 rounded-lg bg-green-50 text-left">
                            <h3 className="font-semibold text-green-800 mb-2">🌱 Propuesta refinada por IA:</h3>
                            <p className="text-slate-700 whitespace-pre-line">{refinedIdea}</p>
                            <div className="flex justify-center mt-4">
                                <Button
                                    onClick={() => setMostrarFormulario(true)}
                                    className="px-5 py-2 text-white rounded-full"
                                    style={{ backgroundColor: colorPalette.darkGreen }}
                                >
                                    Usar esta idea →
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>): (
  // Aquí sigue tu formulario completo del proyecto
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="w-full flex flex-col items-center"
  >
          {formData.isFromConvertedIdea && (
            <div className="w-full max-w-3xl mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 className="text-blue-800 font-semibold">
                    Proyecto creado desde tu idea
                  </h4>
                  <p className="text-blue-700 text-sm">
                    La descripción se ha pre-cargado con tu propuesta refinada por IA.
                    Completa los demás campos según necesites.
                  </p>
                </div>
              </div>
            </div>
          )}
         

          <StepIndicator currentStep={step} totalSteps={7} />
          
          

          <Card className="w-full max-w-4xl px-9 py-8">
            <form
              className="flex flex-col min-h-[580px]"
              onSubmit={(e) => {
                e.preventDefault();
                if (step < 7) nextStep();
                else EnviarProyecto();
              }}
            >
                {/* Contenedor de pasos con altura mínima para evitar "saltos" */}
                <div className="flex-grow min-h-[480px] transition-opacity duration-300 ease-in-out">
                   <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-3xl"
        >
                    
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
  {/* Alcance (Región) */}
  <label className="block text-sm font-medium text-slate-700 mb-1">
    Alcance (Región)
  </label>
  <div className=" flex flex-wrap gap-2 mt-4 justify-center">
    {opcionesAlcance.map((opcion) => (
      <button
        type="button"
        key={opcion.value}
        onClick={() =>
          setFormData({ ...formData, Alcance: opcion.value })
        }
        className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
          formData.Alcance === opcion.value
            ? `bg-[${colorPalette.darkGreen}] text-white border-[${colorPalette.darkGreen}]`
            : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
        }`}
      >
        {opcion.label}
      </button>
    ))}
  </div>
</div>

<div>
  {/* Área Temática */}
  <label className="block text-sm font-medium text-slate-700 mb-1 ">
    Área Temática
  </label>
  <div className="flex flex-wrap gap-2 mt-4 justify-center">
    {opcionesArea.map((opcion) => (
      <button
        type="button"
        key={opcion}
        onClick={() => setFormData({ ...formData, Area: opcion })}
        className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
          formData.Area === opcion
            ? `bg-[${colorPalette.darkGreen}] text-white border-[${colorPalette.darkGreen}]`
            : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
        }`}
      >
        {opcion}
      </button>
    ))}
  </div>
</div>

                        </CardContent>
                    )}

                    {/* --- Pasos 3, 4, 5 y 6 con validaciones mejoradas --- */}
                    {step === 3 && (
    <CardContent className="space-y-6">
        <h2 className="text-2xl font-semibold text-center text-slate-800">Problema y Público Objetivo</h2>

        {/* --- SECCIÓN DEL PROBLEMA --- */}
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Problema</label>
            <Textarea 
                name="Problema" 
                rows={5} 
                value={formData.Problema} 
                onChange={handleChange} 
                required 
                placeholder="Describe en detalle el problema o la necesidad que tu proyecto busca resolver." 
                className="p-2.5 text-base w-full"
                onInvalid={e => (e.target as HTMLTextAreaElement).setCustomValidity('Por favor, describe el problema.')} 
                onInput={e => (e.target as HTMLTextAreaElement).setCustomValidity('')} 
            />
            
            {/* Contenedor para alinear el botón a la derecha */}
            <div className="flex justify-end mt-2">
                {aiResponses.problema && (
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, Problema: aiResponses.problema }))}
                        className="px-3 py-1 text-xs font-semibold rounded-full shadow-sm transition-colors"
                        style={{
                            backgroundColor: colorPalette.lightGray,
                            color: colorPalette.darkGreen,
                            border: `1px solid ${colorPalette.softGreen}`,
                        }}
                    >
                        ✨ Usar sugerencia de IA
                    </button>
                )}
            </div>
        </div>
                            
        {/* --- SECCIÓN DEL PÚBLICO OBJETIVO (con el mismo diseño) --- */}
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Público Objetivo</label>
            <Textarea 
                name="PublicoObjetivo" 
                rows={5} 
                value={formData.PublicoObjetivo} 
                onChange={handleChange} 
                required 
                placeholder="¿A quién está dirigido tu proyecto? Describe tu público, usuarios o mercado meta." 
                className="p-2.5 text-base w-full"
                onInvalid={e => (e.target as HTMLTextAreaElement).setCustomValidity('Por favor, define tu público objetivo.')} 
                onInput={e => (e.target as HTMLTextAreaElement).setCustomValidity('')} 
            />
            
            {/* Contenedor para alinear el botón a la derecha */}
            <div className="flex justify-end mt-2">
                {aiResponses.pubob && (
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, PublicoObjetivo: aiResponses.pubob }))}
                        className="px-3 py-1 text-xs font-semibold rounded-full shadow-sm transition-colors"
                        style={{
                            backgroundColor: colorPalette.lightGray,
                            color: colorPalette.darkGreen,
                            border: `1px solid ${colorPalette.softGreen}`,
                        }}
                    >
                        ✨ Usar sugerencia de IA
                    </button>
                )}
            </div>
        </div>
    </CardContent>
)}

{step === 4 && (
  <CardContent className="space-y-6">
    <h2 className="text-2xl font-semibold text-center text-slate-800">Objetivos del Proyecto</h2>
    
    {/* --- SECCIÓN DE OBJETIVO GENERAL --- */}
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Objetivo General</label>
      <Textarea 
        name="ObjetivoGeneral" 
        rows={5} 
        value={formData.ObjetivoGeneral} 
        onChange={handleChange} 
        required 
        placeholder="Define el objetivo principal y de alto nivel de tu proyecto. ¿Qué es lo más importante que quieres lograr?" 
        className="p-2.5 text-base w-full"
      />
      {/* Contenedor para alinear el botón a la derecha */}
      <div className="flex justify-end mt-2">
        {aiResponses.obgen && (
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, ObjetivoGeneral: aiResponses.obgen }))}
            className="px-3 py-1 text-xs font-semibold rounded-full shadow-sm transition-colors"
            style={{
              backgroundColor: colorPalette.lightGray,
              color: colorPalette.darkGreen,
              border: `1px solid ${colorPalette.softGreen}`,
            }}
          >
            ✨ Usar sugerencia de IA
          </button>
        )}
      </div>
    </div>

    {/* --- SECCIÓN DE OBJETIVOS ESPECÍFICOS --- */}
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Objetivos Específicos</label>
      <Textarea 
        name="ObjetivoEspecifico" 
        rows={5} 
        value={formData.ObjetivoEspecifico} 
        onChange={handleChange} 
        required 
        placeholder="Detalla los objetivos específicos, medibles y alcanzables que contribuyen al objetivo general. Puedes listarlos." 
        className="p-2.5 text-base w-full"
      />
      {/* Contenedor para alinear el botón a la derecha */}
      <div className="flex justify-end mt-2">
        {aiResponses.obes && (
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, ObjetivoEspecifico: aiResponses.obes }))}
            className="px-3 py-1 text-xs font-semibold rounded-full shadow-sm transition-colors"
            style={{
              backgroundColor: colorPalette.lightGray,
              color: colorPalette.darkGreen,
              border: `1px solid ${colorPalette.softGreen}`,
            }}
          >
            ✨ Usar sugerencia de IA
          </button>
        )}
      </div>
    </div>
  </CardContent>
)}
{step === 5 && (
  <CardContent className="space-y-6">
    <h2 className="text-2xl font-semibold text-center text-slate-800">Propuesta de Valor</h2>
   
    {/* --- SECCIÓN DE SOLUCIÓN (INNOVACIÓN) --- */}
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Solución</label>
      <Textarea 
        name="Innovacion" 
        rows={4} 
        value={formData.Innovacion} 
        onChange={handleChange} 
        required 
        placeholder="¿Qué hace que tu proyecto sea innovador, diferente o único en comparación con otras soluciones?" 
        className="p-2.5 text-base w-full"
      />
      {/* Contenedor para alinear el botón a la derecha */}
      <div className="flex justify-end mt-2">
        {/* Nota: Usamos aiResponses.solucion para el campo Innovacion, ya que corresponde a la "Solución" */}
        {aiResponses.solucion && (
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, Innovacion: aiResponses.solucion }))}
            className="px-3 py-1 text-xs font-semibold rounded-full shadow-sm transition-colors"
            style={{
              backgroundColor: colorPalette.lightGray,
              color: colorPalette.darkGreen,
              border: `1px solid ${colorPalette.softGreen}`,
            }}
          >
            ✨ Usar sugerencia de IA
          </button>
        )}
      </div>
    </div>

    {/* --- SECCIÓN DE RESULTADO ESPERADO --- */}
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Resultado Esperado</label>
      <Textarea 
        name="ResultadoEsperado" 
        rows={4} 
        value={formData.ResultadoEsperado} 
        onChange={handleChange} 
        required 
        placeholder="Describe los resultados concretos y tangibles que esperas lograr al finalizar el proyecto." 
        className="p-2.5 text-base w-full"
      />
      {/* Contenedor para alinear el botón a la derecha */}
      <div className="flex justify-end mt-2">
        {aiResponses.resultado && (
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, ResultadoEsperado: aiResponses.resultado }))}
            className="px-3 py-1 text-xs font-semibold rounded-full shadow-sm transition-colors"
            style={{
              backgroundColor: colorPalette.lightGray,
              color: colorPalette.darkGreen,
              border: `1px solid ${colorPalette.softGreen}`,
            }}
          >
            ✨ Usar sugerencia de IA
          </button>
        )}
      </div>
    </div>
  </CardContent>
)}
            {step === 6 && (
                <CardContent className="space-y-6">
                                   <h2 className="text-2xl font-semibold text-center" style={{ color: colorPalette.oliveGray }}>Añadir Miembros</h2>
                                   <div className="flex flex-wrap gap-3 mb-6">
                                     {personas.map((p) => (
                                       <span key={p.ID} draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", p.Nombre)} onClick={() => {
                                           if (!formData.Miembros.includes(p.Nombre)) {
                                             setFormData({ ...formData, Miembros: [...formData.Miembros, p.Nombre] });
                                           }
                                         }}
                                         className="px-4 py-2 rounded-full cursor-pointer select-none shadow-sm hover:shadow-md transition active:scale-95" 
                                         style={{ 
                                           backgroundColor: formData.Miembros.includes(p.Nombre) ? colorPalette.softGreen : colorPalette.lightGray, 
                                           color: formData.Miembros.includes(p.Nombre) ? 'white' : colorPalette.darkGreen, 
                                           border: `1px solid ${colorPalette.softGreen}` 
                                         }}
                                       >
                                         {p.Nombre}
                                       </span>
                                     ))}
                                   </div>
                                   <div className="min-h-[140px] rounded-2xl flex flex-wrap items-center gap-3 p-4 shadow-inner" style={{ border: `2px dashed ${colorPalette.softGreen}`, backgroundColor: colorPalette.lightGray }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const droppedName = e.dataTransfer.getData("text/plain"); if (droppedName && !formData.Miembros.includes(droppedName)) { setFormData({ ...formData, Miembros: [...formData.Miembros, droppedName] }); } }}>
                                     {formData.Miembros.length === 0 ? (<p className="text-sm italic" style={{ color: colorPalette.oliveGray }}>Arrastra aquí los miembros existentes o toca para seleccionar</p>) : (formData.Miembros.map((m, i) => (<span key={i} className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm" style={{ backgroundColor: colorPalette.softGreen, color: colorPalette.lightGray, border: `1px solid ${colorPalette.oliveGray}` }}>{m}<button type="button" onClick={() => setFormData({ ...formData, Miembros: formData.Miembros.filter((mi) => mi !== m) })} className="w-5 h-5 flex items-center justify-center rounded-full hover:scale-110 transition" style={{ backgroundColor: colorPalette.darkGreen }}><span className="text-xs text-white">×</span></button></span>)))}
                                   </div>
                                   <div className="text-center pt-4">
                                     <Button type="button" onClick={() => setIsModalOpen(true)}>Crear Nuevo Colaborador</Button>
                                   </div>
                               </CardContent>
            )}
         
{step === 7 && (
  <CardContent className="flex flex-col items-center justify-center w-full">
    <div className="max-w-4xl w-full bg-white rounded-2xl px-8 py-10 space-y-10 shadow-sm">

      {/* ====== Título general ====== */}
      <h2
        className="text-3xl font-semibold text-center tracking-tight"
        style={{ color: colorPalette.darkGreen }}
      >
        Revisa y Confirma tu Proyecto
      </h2>

      {/* ====== Tarjetas resumen ====== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Duración */}
        <div className="bg-slate-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow transition-shadow">
          <h4 className="font-medium text-slate-700 text-sm mb-1">Duración del Proyecto</h4>
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formData.DuracionEnMesesMinimo}-{formData.DuracionEnMesesMaximo} Meses
          </div>
        </div>

        {/* Área */}
        <div className="bg-slate-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow transition-shadow">
          <h4 className="font-medium text-slate-700 text-sm mb-1">Área y Alcance</h4>
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {formData.Area}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {opcionesAlcance.find(o => o.value === formData.Alcance)?.label}
          </p>
        </div>

        {/* Equipo */}
        <div className="bg-slate-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow transition-shadow">
          <h4 className="font-medium text-slate-700 text-sm mb-1">Equipo</h4>
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.274-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.274.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0zM7 10a2 2 0 11-4 0 2 2 0z" />
            </svg>
            {formData.Miembros.length} Miembro(s)
          </div>
        </div>
      </div>

      {/* ====== Contenido Detallado ====== */}
      <div className="space-y-8">
        {/* Información general */}
        <section className="bg-slate-50 rounded-xl border border-gray-200 p-8 shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-slate-800 border-b border-gray-300 pb-2">
            Información General
          </h3>
          <p><span className="font-semibold">Título:</span> {formData.Titulo}</p>
          <p className="mt-2 text-slate-700">{formData.Descripcion}</p>
        </section>

        {/* Problema y objetivos */}
        <section className="bg-slate-50 rounded-xl border border-gray-200 p-8 shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-slate-800 border-b border-gray-300 pb-2">
            Problema y Objetivos
          </h3>
          <p><span className="font-semibold">Problema:</span> {formData.Problema}</p>
          <p className="mt-2"><span className="font-semibold">Público Objetivo:</span> {formData.PublicoObjetivo}</p>
          <p className="mt-2"><span className="font-semibold">Objetivo General:</span> {formData.ObjetivoGeneral}</p>
        </section>

        {/* Propuesta de valor */}
        <section className="bg-slate-50 rounded-xl border border-gray-200 p-8 shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-slate-800 border-b border-gray-300 pb-2">
            Propuesta de Valor
          </h3>
          <p><span className="font-semibold">Propósito:</span> {formData.Proposito}</p>
          <p className="mt-2"><span className="font-semibold">Innovación:</span> {formData.Innovacion}</p>
          <p className="mt-2"><span className="font-semibold">Resultados Esperados:</span> {formData.ResultadoEsperado}</p>
        </section>
      </div>
    </div>
  </CardContent>
)}


</motion.div>
                </div>
                

                <div className="flex justify-between items-center mt-auto pt-6 border-t border-slate-200">
                    <Button type="button" onClick={prevStep} disabled={step === 1} variant="outline">Anterior</Button>
                    <Button type="submit">{step < 7 ? "Siguiente" : "Crear Proyecto"}</Button>
                </div>
            </form>
        </Card>
         </motion.div> 
  )}
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

export default CrearProyectoFine;