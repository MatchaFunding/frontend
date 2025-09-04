import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/NavBar/navbar";
import { CrearIdeaAsync } from "../../../api/CrearIdea";
import { CrearIdeaIAAsync } from "../../../api/CrearIdeaIa";
import { VerEmpresaCompletaAsync } from "../../../api/VerEmpresaCompleta";
import Idea from '../../../models/Idea.tsx';
//import IdeaRespuesta from '../../../models/IdeaRespuesta'


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
      setError(`⚠️ Máximo ${MAX_CHARS} caracteres`);
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
      const ideaBackend = await CrearIdeaAsync(IdeaDato);
      console.log(ideaBackend)

      if (ideaBackend && ideaBackend.ID) {
        IdeaDato.ID = ideaBackend.ID;
        const ideaRespuesta = await CrearIdeaIAAsync(IdeaDato);
         const storedUser = sessionStorage.getItem("usuario");
         if (storedUser) {
          const datos = JSON.parse(storedUser);
          const usuario = datos.Usuario;
          const opiniones = datos.OpinionesIAdeIdea;
          opiniones.push(ideaRespuesta);;
          if (usuario.ID) {
            const resultado = await VerEmpresaCompletaAsync(usuario.ID);
            resultado.OpinionesIAdeIdea = opiniones;
            if (resultado) {
              sessionStorage.setItem('usuario', JSON.stringify(resultado));
              console.log(resultado);
            }
          }
        }
        else {
          console.log('No se encontraron datos de usuario en sessionStorage');
        }
        console.log(ideaRespuesta)
        
        return ideaRespuesta
      }
    } catch (error) {
      console.error("Error creating idea:", error);
    }
  }
  const handleConfirmAndSaveIdea = () => {
    try {
      //const existingIdeas = JSON.parse(localStorage.getItem("userIdeas") || "[]");
      //const newIdea = {
      //  id: Date.now(),
      //  ...previewData,
      //  createdAt: new Date().toISOString(),
      //};
      //localStorage.setItem("userIdeas", JSON.stringify([...existingIdeas, newIdea]));
      const JSONidea = {
        Usuario : 5,
        Campo : previewData.field,
        Problema : previewData.problem,
        Publico : previewData.audience,
        Innovacion : previewData.uniqueness,
        FechaDeCreacion : "2000-07-01"

      }
      const IdeaDato = new Idea(JSONidea);
      handleCreateIdea(IdeaDato);
      setAnswers([previewData.field, previewData.problem, previewData.audience, previewData.uniqueness]);
      setIsCompleted(true);
      setShowPreview(false);
    } catch (error) {
      console.error("Error al guardar la idea en localStorage:", error);
      alert("Hubo un error al guardar tu idea.");
    }
  };

  const handleCreateAnother = () => {
    setStep(0);
    setAnswers([]);
    setInput("");
    setIsCompleted(false);
  };

  const handleNavigateToFondos = () => {
    const lastIdea = JSON.parse(localStorage.getItem("userIdeas") || "[]").slice(-1)[0];
    localStorage.setItem("selectedIdea", JSON.stringify(lastIdea));
    navigate("/Matcha/New-idea/Fondo-idea");
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colorPalette.background }}>
      <Navbar />
      <div className="flex-grow flex flex-col lg:flex-row justify-center items-center p-6 lg:p-12 gap-8 mt-[5%]">
        {/* Imagen */}
        <div className="w-full lg:w-[40%] flex justify-center items-center">
          <img
            src="/ideamatch.png"
            alt="Idea creativa"
            className="w-[80%] max-w-md rounded-2xl shadow-lg"
          />
        </div>

        {/* Chat y Inputs */}
        <div className="w-full lg:w-[60%] h-[70vh] bg-white p-6 rounded-2xl shadow-xl flex flex-col">
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
                {step < questions.length && (
                  <div className="p-3 rounded-lg w-fit max-w-[80%]" style={{ backgroundColor: colorPalette.bubbleBot, color: colorPalette.textPrimary }}>
                    {questions[step]}
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
                    disabled={showPreview}
                  />
                  <button
                    onClick={handleSend}
                    className="text-white px-5 py-2 rounded-r-md transition-colors duration-300"
                    style={{ backgroundColor: colorPalette.secondary }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = colorPalette.primary)}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = colorPalette.secondary)}
                    disabled={showPreview}
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
                className="px-6 py-2 font-semibold border rounded-lg transition-colors"
                style={{ color: colorPalette.textSecondary, borderColor: '#cbd5e1' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmAndSaveIdea}
                className="px-6 py-2 font-semibold text-white rounded-lg hover:scale-105 transition-transform"
                style={{ backgroundColor: colorPalette.primary }}
              >
                Confirmar y Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateIdea;
