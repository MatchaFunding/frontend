import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/NavBar/navbar";

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

const CreateIdea: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();

  const handleSend = () => {
    if (!input.trim()) return;

    const updatedAnswers = [...answers, input];
    setAnswers(updatedAnswers);
    setInput("");

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      handleSaveIdea(updatedAnswers);
    }
  };

  const handleSaveIdea = (finalAnswers: string[]) => {
    try {
      const existingIdeas = JSON.parse(localStorage.getItem("userIdeas") || "[]");
      const newIdea = {
        id: Date.now(),
        field: finalAnswers[0],
        problem: finalAnswers[1],
        audience: finalAnswers[2],
        uniqueness: finalAnswers[3],
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("userIdeas", JSON.stringify([...existingIdeas, newIdea]));
      setIsCompleted(true);
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

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: colorPalette.background }}
    >
      <Navbar />
      <div className="flex-grow flex flex-col lg:flex-row justify-center items-center p-6 lg:p-12 gap-8 mt-[5%]">
        <div className="w-full lg:w-[40%] flex justify-center items-center">
          <img
            src="/ideamatch.png"
            alt="Idea creativa"
            className="w-[80%] max-w-md rounded-2xl shadow-lg"
          />
        </div>

        <div className="w-full lg:w-[60%] h-[70vh] bg-white p-6 rounded-2xl shadow-xl flex flex-col">
          {!isCompleted ? (
            <>
              <h1
                className="text-2xl font-bold text-center mb-4"
                style={{ color: colorPalette.primary }}
              >
                Crear Nueva Idea 💡
              </h1>
              <div className="flex-1 overflow-y-auto space-y-4 p-2">
                {answers.map((answer, index) => (
                  <div key={index} className="space-y-2">
                    <div
                      className="p-3 rounded-lg w-fit max-w-[80%]"
                      style={{
                        backgroundColor: colorPalette.bubbleBot,
                        color: colorPalette.textPrimary,
                      }}
                    >
                      {questions[index]}
                    </div>
                    <div
                      className="text-white p-3 rounded-lg w-fit max-w-[80%] ml-auto"
                      style={{ backgroundColor: colorPalette.bubbleUser }}
                    >
                      {answer}
                    </div>
                  </div>
                ))}

                {step < questions.length && (
                  <div
                    className="p-3 rounded-lg w-fit max-w-[80%]"
                    style={{
                      backgroundColor: colorPalette.bubbleBot,
                      color: colorPalette.textPrimary,
                    }}
                  >
                    {questions[step]}
                  </div>
                )}
              </div>

              <div className="mt-4 flex">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Escribe tu respuesta..."
                  className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2"
                  style={
                    { "--tw-ring-color": colorPalette.primary } as React.CSSProperties
                  }
                />
                <button
                  onClick={handleSend}
                  className="text-white px-5 py-2 rounded-r-md transition-colors duration-300"
                  style={{ backgroundColor: colorPalette.secondary }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = colorPalette.primary)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = colorPalette.secondary)
                  }
                >
                  Enviar
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colorPalette.secondary }}
              >
                <CheckIcon />
              </div>
              <h2
                className="text-3xl font-bold"
                style={{ color: colorPalette.primary }}
              >
                ¡Idea Guardada con Éxito!
              </h2>
              <p
                className="max-w-md"
                style={{ color: colorPalette.textSecondary }}
              >
                Aquí está el resumen de tu idea:  
                <br />
                <strong>Campo:</strong> {answers[0]} <br />
                <strong>Problema:</strong> {answers[1]} <br />
                <strong>Público:</strong> {answers[2]} <br />
                <strong>Diferencia:</strong> {answers[3]}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 font-semibold border rounded-lg"
                  style={{
                    color: colorPalette.primary,
                    borderColor: colorPalette.primary,
                  }}
                >
                  ⬅ Regresar
                </button>
                <button
                  onClick={handleCreateAnother}
                  className="px-6 py-3 font-semibold border rounded-lg"
                  style={{
                    color: colorPalette.primary,
                    borderColor: colorPalette.primary,
                  }}
                >
                  Crear Otra Idea
                </button>
                <button
                  onClick={() => navigate("/Proyectos")}
                  className="px-6 py-3 font-semibold text-white rounded-lg hover:scale-105 transition-transform"
                  style={{ backgroundColor: colorPalette.secondary }}
                >
                  Ver mis Ideas
                </button>
                 <button
                  onClick={() => navigate("/Matcha/New-idea/Fondo-idea")}
                  className="px-6 py-3 font-semibold text-white rounded-lg hover:scale-105 transition-transform"
                  style={{ backgroundColor: colorPalette.secondary }}
                >
                  Hacer Match con un fondo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateIdea;
