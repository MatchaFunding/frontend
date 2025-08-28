import React, { useState } from "react";
import NavBar from "../../../components/NavBar/navbar";
import { useNavigate } from "react-router-dom";

interface Proyecto {
  ID: number;
  Beneficiario: number;
  Titulo: string;
  Descripcion: string;
  DuracionEnMesesMinimo: number;
  DuracionEnMesesMaximo: number;
  Alcance: string;
  Area: string;
}

// ---- PALETA ---- //
const colorPalette = {
  darkGreen: "#44624a",
  softGreen: "#8ba888",
  oliveGray: "#505143",
  lightGray: "#f1f5f9",
};

// ---- COMPONENTES ---- //
const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "outline" }
> = ({ children, className = "", variant = "solid", ...props }) => (
  <button
    className={`px-4 py-2 rounded-lg font-semibold shadow-sm transition-all duration-200
                ${
                  variant === "outline"
                    ? "border border-slate-300 text-slate-700 bg-white hover:bg-slate-100"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }
                disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div
    className={`bg-white rounded-3xl shadow-lg border border-slate-200/80 ${className}`}
  >
    {children}
  </div>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <div className={`p-6 md:p-8 ${className}`}>{children}</div>;

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className = "",
  ...props
}) => (
  <input
    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 
                outline-none border-slate-300 ${className}`}
    {...props}
  />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  className = "",
  ...props
}) => (
  <textarea
    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 
                outline-none border-slate-300 ${className}`}
    {...props}
  />
);

// ---- STEP INDICATOR ---- //
const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => (
  <div className="mb-8 w-full max-w-md mx-auto">
    <div className="flex items-center">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isDone = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        return (
          <React.Fragment key={stepNumber}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300
                  ${
                    isDone
                      ? "bg-emerald-600 text-white"
                      : isActive
                      ? "bg-emerald-800 text-white scale-110"
                      : "bg-slate-300 text-slate-600"
                  }`}
              >
                {isDone ? "✓" : stepNumber}
              </div>
              <p
                className={`mt-2 text-xs text-center ${
                  isActive ? "font-bold text-emerald-800" : "text-slate-500"
                }`}
              >
                {stepNumber === 1
                  ? "Básicos"
                  : stepNumber === 2
                  ? "Detalles"
                  : "Vista previa"}
              </p>
            </div>
            {stepNumber < totalSteps && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  isDone ? "bg-emerald-600" : "bg-slate-300"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

// ---- FORMULARIO WIZARD ---- //
const NuevoProyecto: React.FC = () => {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"presentacion" | "publico">("presentacion");
  const [formData, setFormData] = useState<Proyecto>({
    ID: 0,
    Beneficiario: 0,
    Titulo: "",
    Descripcion: "",
    DuracionEnMesesMinimo: 0,
    DuracionEnMesesMaximo: 0,
    Alcance: "",
    Area: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "ID" ||
        name === "Beneficiario" ||
        name.includes("Duracion")
          ? Number(value)
          : value,
    });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const labelClasses = "block text-sm font-medium text-slate-700 mb-1";
  const navigate = useNavigate(); // 👈 inicializa el hook

 



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
    } else {
      console.log("Proyecto enviado 🚀", formData);
      navigate("/Home-i"); // 👈 redirige al finalizar
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <main className="flex flex-col items-center justify-center px-4 py-10 mt-[5%]">
        <StepIndicator currentStep={step} totalSteps={3} />

        <Card className="w-full max-w-3xl px-9 py-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              step < 3 ? nextStep() : alert("Proyecto enviado 🚀");
            }}
          >
            {/* --- PASO 1 --- */}
            {step === 1 && (
              <CardContent className="space-y-6">
                <h2 className="text-2xl font-semibold text-center text-slate-800">
                  Información Básica
                </h2>
                <div>
                  <label htmlFor="Titulo" className={labelClasses}>
                    Título del Proyecto
                  </label>
                  <Input
                    id="Titulo"
                    name="Titulo"
                    value={formData.Titulo}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="Descripcion" className={labelClasses}>
                    Descripción
                  </label>
                  <Textarea
                    id="Descripcion"
                    name="Descripcion"
                    rows={5}
                    value={formData.Descripcion}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            )}

            {/* --- PASO 2 --- */}
            {step === 2 && (
              <CardContent className="space-y-6">
                <h2 className="text-2xl font-semibold text-center text-slate-800">
                  Detalles y Alcance
                </h2>
                <div>
                  <label htmlFor="DuracionEnMesesMinimo" className={labelClasses}>
                    Duración mínima (meses)
                  </label>
                  <Input
                    id="DuracionEnMesesMinimo"
                    name="DuracionEnMesesMinimo"
                    type="number"
                    value={formData.DuracionEnMesesMinimo}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="DuracionEnMesesMaximo" className={labelClasses}>
                    Duración máxima (meses)
                  </label>
                  <Input
                    id="DuracionEnMesesMaximo"
                    name="DuracionEnMesesMaximo"
                    type="number"
                    value={formData.DuracionEnMesesMaximo}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="Alcance" className={labelClasses}>
                    Alcance
                  </label>
                  <Input
                    id="Alcance"
                    name="Alcance"
                    value={formData.Alcance}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="Area" className={labelClasses}>
                    Área
                  </label>
                  <Input
                    id="Area"
                    name="Area"
                    value={formData.Area}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            )}

            {/* --- PASO 3: VISTA PREVIA ESTILO "DETALLEFONDO" --- */}
            {step === 3 && (
              <CardContent>
                <h2
                  className="text-2xl font-semibold text-center mb-6"
                  style={{ color: colorPalette.darkGreen }}
                >
                  Vista Previa del Proyecto
                </h2>

                {/* Tabs */}
                <div className="flex justify-center space-x-2 mb-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab("presentacion")}
                    className="px-6 py-2 border rounded-md font-semibold transition-colors duration-200"
                    style={{
                      color:
                        activeTab === "presentacion"
                          ? colorPalette.darkGreen
                          : colorPalette.softGreen,
                      borderColor:
                        activeTab === "presentacion"
                          ? colorPalette.softGreen
                          : "#e2e8f0",
                      borderWidth: "2px",
                    }}
                  >
                    PRESENTACIÓN
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("publico")}
                    className="px-6 py-2 border rounded-md font-semibold transition-colors duration-200"
                    style={{
                      color:
                        activeTab === "publico"
                          ? colorPalette.darkGreen
                          : colorPalette.softGreen,
                      borderColor:
                        activeTab === "publico"
                          ? colorPalette.softGreen
                          : "#e2e8f0",
                      borderWidth: "2px",
                    }}
                  >
                    DETALLE
                  </button>
                </div>

                {/* Contenido de tabs */}
                {activeTab === "presentacion" && (
                  <Card>
                    <div className="p-6 md:p-8">
                      <h3
                        className="text-xl font-semibold mb-4"
                        style={{ color: colorPalette.darkGreen }}
                      >
                        Presentación
                      </h3>
                      <div
                        className="space-y-4 leading-relaxed"
                        style={{ color: colorPalette.oliveGray }}
                      >
                        <p><strong>Título:</strong> {formData.Titulo}</p>
                        <p><strong>Descripción:</strong> {formData.Descripcion}</p>
                        <p>
                          <strong>Duración:</strong>{" "}
                          {formData.DuracionEnMesesMinimo} - {formData.DuracionEnMesesMaximo} meses
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                {activeTab === "publico" && (
                  <Card>
                    <div className="p-6 md:p-8">
                      <h3
                        className="text-xl font-semibold mb-4"
                        style={{ color: colorPalette.darkGreen }}
                      >
                        Detalle
                      </h3>
                      <div
                        className="space-y-4 leading-relaxed"
                        style={{ color: colorPalette.oliveGray }}
                      >
                        <p><strong>Alcance:</strong> {formData.Alcance}</p>
                        <p><strong>Área:</strong> {formData.Area}</p>
                        <p><strong>Beneficiario ID:</strong> {formData.Beneficiario}</p>
                      </div>
                    </div>
                  </Card>
                )}
              </CardContent>
            )}

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
              <Button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                variant="outline"
              >
                Anterior
              </Button>
              <Button
                type="submit"
                onClick={step < 3 ? undefined : () => navigate("/Home-i")}
              >
                {step < 3 ? "Siguiente" : "Crear Proyecto"}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default NuevoProyecto;
