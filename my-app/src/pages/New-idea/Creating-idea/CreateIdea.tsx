import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/NavBar/navbar";
import { CrearIdeaAsync } from "../../../api/CrearIdea";
import { CrearIdeaIAAsync } from "../../../api/CrearIdeaIa";
import { CambiarIdeaAsync } from "../../../api/CambiarIdea";
import { VerEmpresaCompletaAsync } from "../../../api/VerEmpresaCompleta";
import Idea from '../../../models/Idea.tsx';


const colorPalette = {
  primary: "#4c7500",
  secondary: "#a3ae3e",
  background: "#f8fafc",
  card: "#ffffff",
  textPrimary: "#1e293b",
  textSecondary: "#64748b",
  bubbleUser: "#a3ae3e",
  bubbleBot: "#f1f5f9",
};

const questions = [
  "¿De qué campo es tu idea? (ej: tecnología, educación, salud...)",
  "Describe brevemente el problema que resuelve tu idea.",
  "¿Quién es tu público objetivo?",
  "¿Qué hace a tu idea única o diferente de lo que ya existe?",
];

const ideaFields = {
  field: "Campo",
  problem: "Problema que resuelve",
  audience: "Público objetivo",
  uniqueness: "Elemento único / Diferenciador",
};

const CheckIcon = () => (
  <svg
    className="w-16 h-16 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

type IdeaData = {
  field: string;
  problem: string;
  audience: string;
  uniqueness: string;
};

const MAX_CHARS = 1000;

const CreateIdea: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [refinedIdea, setRefinedIdea] = useState<string>("");
  const [showRefinedIdea, setShowRefinedIdea] = useState(false);
  const navigate = useNavigate();

  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<IdeaData>({
    field: "",
    problem: "",
    audience: "",
    uniqueness: "",
  });

  // Maneja el input principal con límite
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > MAX_CHARS) {
      setError(`Máximo ${MAX_CHARS} caracteres`);
      return;
    }
    setInput(e.target.value);
    setError("");
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const updatedAnswers = [...answers, input];

    if (step < questions.length - 1) {
      setAnswers(updatedAnswers);
      setInput("");
      setStep(step + 1);
    } else {
      const finalAnswersData: IdeaData = {
        field: updatedAnswers[0],
        problem: updatedAnswers[1],
        audience: updatedAnswers[2],
        uniqueness: updatedAnswers[3],
      };
      setPreviewData(finalAnswersData);
      setShowPreview(true);
      setAnswers(updatedAnswers);
      setInput("");
    }
  };

  // Maneja cambios en el preview (inputs y textareas) con límite
  const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (value.length > MAX_CHARS) return;
    setPreviewData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCancelPreview = () => setShowPreview(false);
  async function handleCreateIdea(IdeaDato:Idea) {
    try {
      setIsProcessing(true);
      console.log('Creando idea con datos:', IdeaDato);
      const ideaBackend = await CrearIdeaAsync(IdeaDato);
      console.log('Idea creada en backend:', ideaBackend);

      if (ideaBackend && ideaBackend.ID) {
        IdeaDato.ID = ideaBackend.ID;
        
        // Obtener el refinamiento de IA
        console.log('Solicitando refinamiento de IA para idea:', IdeaDato);
        const ideaRespuesta = await CrearIdeaIAAsync(IdeaDato);
        console.log('Respuesta de IA recibida:', ideaRespuesta);
        
        if (ideaRespuesta && ideaRespuesta.ResumenLLM) {
          try {
            // Obtener el usuario actual para crear el objeto Idea completo
            const storedUser = sessionStorage.getItem("usuario");
            if (storedUser) {
              const datos = JSON.parse(storedUser);
              const usuarioId = datos.Usuario?.ID;
              
              // Crear una idea completa con todos los campos necesarios
              const ideaCompleta = new Idea({
                ID: ideaBackend.ID,
                Usuario: usuarioId,
                Campo: ideaBackend.Campo,
                Problema: ideaBackend.Problema,
                Publico: ideaBackend.Publico,
                Innovacion: ideaBackend.Innovacion,
                Oculta: ideaBackend.Oculta || false,
                FechaDeCreacion: ideaBackend.FechaDeCreacion,
                Propuesta: ideaRespuesta.ResumenLLM
              });
              
              console.log('Datos de la idea que se enviará al backend:');
              console.log('- ID:', ideaCompleta.ID);
              console.log('- Usuario:', ideaCompleta.Usuario);
              console.log('- Campo:', ideaCompleta.Campo);
              console.log('- Problema:', ideaCompleta.Problema);
              console.log('- Publico:', ideaCompleta.Publico);
              console.log('- Innovacion:', ideaCompleta.Innovacion);
              console.log('- Oculta:', ideaCompleta.Oculta);
              console.log('- FechaDeCreacion:', ideaCompleta.FechaDeCreacion);
              console.log('- Propuesta:', ideaCompleta.Propuesta?.substring(0, 100) + '...');
              
              console.log('Actualizando idea completa con propuesta IA:', ideaCompleta);
              const resultadoActualizacion = await CambiarIdeaAsync(ideaBackend.ID, ideaCompleta);
              console.log('Resultado de actualización:', resultadoActualizacion);
              
              if (resultadoActualizacion) {
                console.log('Propuesta IA guardada correctamente en la idea:', ideaBackend.ID);
                
                // Actualizar el sessionStorage
                const resultado = await VerEmpresaCompletaAsync(usuarioId);
                if (resultado) {
                  sessionStorage.setItem('usuario', JSON.stringify(resultado));
                  console.log('SessionStorage actualizado con nueva idea');
                }

                // Actualizar localStorage con la idea completa
                try {
                  const existingIdeas = JSON.parse(localStorage.getItem("userIdeas") || "[]");
                  existingIdeas.push(resultadoActualizacion);
                  localStorage.setItem("userIdeas", JSON.stringify(existingIdeas));
                  console.log('Idea guardada en localStorage userIdeas:', resultadoActualizacion.ID);
                } catch (localStorageError) {
                  console.error('Error al guardar en localStorage:', localStorageError);
                }
                
              } else {
                console.error('No se recibió respuesta de la actualización de propuesta');
              }
            }
            
          } catch (error) {
            console.error('Error al guardar la propuesta IA:', error);
            // Continuar aunque falle el guardado de la propuesta
          }
        } else {
          console.log('No se recibió refinamiento de IA o ResumenLLM está vacío');
        }
        
        console.log(ideaRespuesta);
        setIsProcessing(false);
        return ideaRespuesta;
      }
    } catch (error) {
      console.error("Error creating idea:", error);
      setIsProcessing(false);
      throw error;
    }
  }
  const handleConfirmAndSaveIdea = async () => {
    try {
      // Obtener el ID del usuario actual desde sessionStorage
      const storedUser = sessionStorage.getItem("usuario");
      let usuarioId = null;
      
      if (storedUser) {
        const datos = JSON.parse(storedUser);
        usuarioId = datos.Usuario?.ID;
        console.log('Datos completos del usuario:', datos.Usuario);
        console.log('ID del usuario para crear idea:', usuarioId);
      }
      
      if (!usuarioId) {
        throw new Error('No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.');
      }
      
      const fechaActual = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
      
      const JSONidea = {
        Usuario : usuarioId,
        Campo : previewData.field,
        Problema : previewData.problem,
        Publico : previewData.audience,
        Innovacion : previewData.uniqueness,
        Oculta : false,
        FechaDeCreacion : fechaActual,
        Propuesta : null // Se llenará después con la IA
      }
      
      console.log('Datos de la idea a crear:', JSONidea);
      
      const IdeaDato = new Idea(JSONidea);
      const ideaRefinada = await handleCreateIdea(IdeaDato);
      
      if (ideaRefinada && ideaRefinada.ResumenLLM) {
        setRefinedIdea(ideaRefinada.ResumenLLM);
        setShowRefinedIdea(true);
        // Ya no hay timeout automático, solo avanza cuando el usuario hace clic en "Continuar"
      } else {
        // Si no hay idea refinada, completar inmediatamente
        setIsCompleted(true);
      }
      
      setAnswers([previewData.field, previewData.problem, previewData.audience, previewData.uniqueness]);
      setShowPreview(false);
      
    } catch (error) {
      console.error("Error al guardar la idea:", error);
      alert("Hubo un error al procesar tu idea. Por favor, inténtalo de nuevo.");
      setIsProcessing(false);
    }
  };

  const handleCreateAnother = () => {
    setStep(0);
    setAnswers([]);
    setInput("");
    setIsCompleted(false);
    setIsProcessing(false);
    setRefinedIdea("");
    setShowRefinedIdea(false);
    setShowPreview(false);
  };

  const handleNavigateToFondos = () => {
    try {
      const userIdeas = JSON.parse(localStorage.getItem("userIdeas") || "[]");
      if (userIdeas.length > 0) {
        const lastIdea = userIdeas[userIdeas.length - 1];
        console.log('Navegando a fondos con idea:', lastIdea);
        localStorage.setItem("selectedIdea", JSON.stringify(lastIdea));
        navigate("/Matcha/New-idea/Fondo-idea");
      } else {
        console.error('No hay ideas guardadas para hacer match');
        // Opcionalmente mostrar un mensaje de error al usuario
      }
    } catch (error) {
      console.error('Error al acceder a userIdeas:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colorPalette.background }}>
      <Navbar />
      <div className="flex-grow flex flex-col lg:flex-row justify-center items-center p-4 lg:p-12 gap-8 mt-[5%]">
        {/* Imagen - Hidden on mobile */}
        <div className="hidden lg:flex w-full lg:w-[40%] justify-center items-center">
          <img
            src="/ideamatch.png"
            alt="Idea creativa"
            className="w-[80%] max-w-md rounded-2xl shadow-lg"
          />
        </div>

        {/* Chat y Inputs */}
        <div className="w-full lg:w-[60%] h-[70vh] lg:h-[70vh] bg-white p-4 lg:p-6 rounded-2xl shadow-xl flex flex-col">
          {!isCompleted ? (
            <>
              <h1 className="text-2xl font-bold text-center mb-4" style={{ color: colorPalette.primary }}>
                Crear Nueva Idea 💡
              </h1>

              <div className="flex-1 overflow-y-auto space-y-4 p-2">
                {answers.map((answer, index) => (
                  <div key={index} className="space-y-2">
                    <div className="p-3 rounded-lg w-fit max-w-[80%]" style={{ backgroundColor: colorPalette.bubbleBot, color: colorPalette.textPrimary }}>
                      {questions[index]}
                    </div>
                    <div className="text-white p-3 rounded-lg w-fit max-w-[80%] ml-auto" style={{ backgroundColor: colorPalette.bubbleUser }}>
                      {answer}
                    </div>
                  </div>
                ))}
                
                {/* Mostrar pregunta actual */}
                {step < questions.length && !showPreview && !isProcessing && !showRefinedIdea && (
                  <div className="p-3 rounded-lg w-fit max-w-[80%]" style={{ backgroundColor: colorPalette.bubbleBot, color: colorPalette.textPrimary }}>
                    {questions[step]}
                  </div>
                )}
                
                {/* Mostrar mensaje de procesamiento */}
                {isProcessing && (
                  <div className="p-3 rounded-lg w-fit max-w-[80%]" style={{ backgroundColor: colorPalette.bubbleBot, color: colorPalette.textPrimary }}>
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                      <span>Estoy refinando tu idea con IA... Esto puede tomar unos momentos ⚡</span>
                    </div>
                  </div>
                )}
                
                {/* Mostrar idea refinada */}
                {showRefinedIdea && refinedIdea && (
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg w-fit max-w-[80%]" style={{ backgroundColor: colorPalette.bubbleBot, color: colorPalette.textPrimary }}>
                      ¡Excelente! He refinado tu idea. Aquí tienes una versión mejorada: 🚀
                    </div>
                    <div className="p-4 rounded-lg border-l-4 max-w-[90%]" style={{ 
                      backgroundColor: '#f0f9ff', 
                      borderLeftColor: colorPalette.primary,
                      color: colorPalette.textPrimary 
                    }}>
                      <div className="font-semibold mb-2" style={{ color: colorPalette.primary }}>
                        💡 Idea Refinada por IA:
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed mb-4">
                        {refinedIdea}
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => setIsCompleted(true)}
                          className="px-4 py-2 text-sm font-semibold text-white rounded-lg hover:scale-105 transition-transform"
                          style={{ backgroundColor: colorPalette.primary }}
                        >
                          Continuar ✓
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input y botón enviar */}
              <div className="mt-4 flex flex-col">
                <div className="flex">
                  <input
                    type="text"
                    value={input}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Escribe tu respuesta..."
                    className={`flex-1 border rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 ${
                      error ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{ "--tw-ring-color": colorPalette.primary } as React.CSSProperties}
                    disabled={showPreview || isProcessing}
                  />
                  <button
                    onClick={handleSend}
                    className="text-white px-5 py-2 rounded-r-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: colorPalette.secondary }}
                    onMouseOver={(e) => !isProcessing && !showPreview && (e.currentTarget.style.backgroundColor = colorPalette.primary)}
                    onMouseOut={(e) => !isProcessing && !showPreview && (e.currentTarget.style.backgroundColor = colorPalette.secondary)}
                    disabled={showPreview || isProcessing}
                  >
                    Enviar
                  </button>
                </div>
                <div className="text-sm mt-1 text-right" style={{ color: error ? "red" : colorPalette.textSecondary }}>
                  {error ? error : `${input.length}/${MAX_CHARS}`}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: colorPalette.secondary }}>
                <CheckIcon />
              </div>
              <h2 className="text-3xl font-bold" style={{ color: colorPalette.primary }}>¡Idea Guardada con Éxito!</h2>
              <p className="max-w-md" style={{ color: colorPalette.textSecondary }}>
                Aquí está el resumen de tu idea: <br />
                <strong>Campo:</strong> {answers[0]} <br />
                <strong>Problema:</strong> {answers[1]} <br />
                <strong>Público:</strong> {answers[2]} <br />
                <strong>Diferencia:</strong> {answers[3]}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => navigate(-1)} className="px-6 py-3 font-semibold border rounded-lg" style={{ color: colorPalette.primary, borderColor: colorPalette.primary }}>
                  ⬅ Regresar
                </button>
                <button onClick={handleCreateAnother} className="px-6 py-3 font-semibold border rounded-lg" style={{ color: colorPalette.primary, borderColor: colorPalette.primary }}>
                  Crear Otra Idea
                </button>
                <button onClick={() => navigate("/Proyectos")} className="px-6 py-3 font-semibold text-white rounded-lg hover:scale-105 transition-transform" style={{ backgroundColor: colorPalette.secondary }}>
                  Ver mis Ideas
                </button>
                <button onClick={handleNavigateToFondos} className="px-6 py-3 font-semibold text-white rounded-lg hover:scale-105 transition-transform" style={{ backgroundColor: colorPalette.secondary }}>
                  Hacer Match con un fondo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-11/12 max-w-2xl transform transition-all">
            <h2 className="text-2xl font-bold text-center mb-4" style={{ color: colorPalette.primary }}>
              Revisa tu Idea
            </h2>
            <p className="text-center mb-6" style={{ color: colorPalette.textSecondary }}>
              ¿Estás seguro de que quieres guardar esta idea? Puedes editar cualquier campo antes de confirmar.
            </p>

            <div className="space-y-4">
              {(Object.keys(ideaFields) as Array<keyof IdeaData>).map((key, index) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium mb-1" style={{ color: colorPalette.textPrimary }}>
                    {ideaFields[key]}
                  </label>
                  {index === 0 || index === 2 ? (
                    <div className="flex flex-col">
                      <input
                        type="text"
                        id={key}
                        name={key}
                        value={previewData[key]}
                        onChange={handlePreviewChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2"
                        style={{ "--tw-ring-color": colorPalette.primary } as React.CSSProperties}
                      />
                      <div className="text-sm mt-1 text-right text-gray-500">
                        {previewData[key].length}/{MAX_CHARS}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <textarea
                        id={key}
                        name={key}
                        value={previewData[key]}
                        onChange={handlePreviewChange}
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2"
                        style={{ "--tw-ring-color": colorPalette.primary } as React.CSSProperties}
                      />
                      <div className="text-sm mt-1 text-right text-gray-500">
                        {previewData[key].length}/{MAX_CHARS}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={handleCancelPreview}
                className="px-6 py-2 font-semibold border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: colorPalette.textSecondary, borderColor: '#cbd5e1' }}
                disabled={isProcessing}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmAndSaveIdea}
                className="px-6 py-2 font-semibold text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ backgroundColor: colorPalette.primary }}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Procesando...</span>
                  </div>
                ) : (
                  "Confirmar y Guardar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateIdea;
