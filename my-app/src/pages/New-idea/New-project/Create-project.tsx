import React, { useState } from "react";
import NavBar from "../../../components/NavBar/navbar";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../components/UI/cards";
import { Input } from "../../../components/UI/input";
import { Button } from "../../../components/UI/buttons";
import { Textarea } from "../../../components/UI/textarea";
import { StepIndicator } from "../../../components/Shared/StepIndicator";

interface Proyecto {
  ID: number;
  Beneficiario: number;
  Titulo: string;
  Descripcion: string;
  DuracionEnMesesMinimo: number;
  DuracionEnMesesMaximo: number;
  Alcance: string;
  Area: string;
  Miembros: string[];
}

// ---- PALETA ---- //
const colorPalette = {
  darkGreen: "#44624a",
  softGreen: "#8ba888",
  oliveGray: "#505143",
  lightGray: "#f1f5f9",
};



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
    Miembros: [],
  });
  const [nuevoMiembro, setNuevoMiembro] = useState("");

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

  const agregarMiembro = () => {
    if (nuevoMiembro.trim()) {
      setFormData({ ...formData, Miembros: [...formData.Miembros, nuevoMiembro] });
      setNuevoMiembro("");
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <main className="flex flex-col items-center justify-center px-4 py-10 mt-[5%]">
        <StepIndicator currentStep={step} totalSteps={4} />

        <Card className="w-full max-w-3xl px-9 py-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              step < 4 ? nextStep() : navigate("/Home-i");
            }}
          >
            {/* --- PASO 1 --- */}
            {step === 1 && (
              <CardContent className="space-y-6">
                <h2 className="text-2xl font-semibold text-center text-slate-800">
                  Información Básica
                </h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Título del Proyecto
                  </label>
                  <Input
                    name="Titulo"
                    value={formData.Titulo}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Descripción
                  </label>
                  <Textarea
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Duración mínima (meses)
                  </label>
                  <Input
                    name="DuracionEnMesesMinimo"
                    type="number"
                    value={formData.DuracionEnMesesMinimo}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Duración máxima (meses)
                  </label>
                  <Input
                    name="DuracionEnMesesMaximo"
                    type="number"
                    value={formData.DuracionEnMesesMaximo}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Alcance
                  </label>
                  <Input
                    name="Alcance"
                    value={formData.Alcance}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Área
                  </label>
                  <Input
                    name="Area"
                    value={formData.Area}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            )}

            {/* --- PASO 3: MIEMBROS --- */}
{step === 3 && (
  <CardContent className="space-y-6">
    <h2 className="text-2xl font-semibold text-center" style={{ color: colorPalette.oliveGray }}>
      Añadir Miembros
    </h2>

    {/* Globitos arrastrables de ejemplo */}
    <div className="flex flex-wrap gap-3 mb-6">
      {["Max Bardi", "Maiki Soto", "Miranda Alvear", "Oscar Barahona", "Alvaro Feria", "Javiera Osorio"].map((mock) => (
        <span
          key={mock}
          draggable
          onDragStart={(e) => e.dataTransfer.setData("text/plain", mock)}
          className="px-4 py-2 rounded-full cursor-grab shadow-sm hover:shadow-md transition"
          style={{
            backgroundColor: colorPalette.lightGray,
            color: colorPalette.darkGreen,
            border: `1px solid ${colorPalette.softGreen}`,
          }}
        >
          {mock}
        </span>
      ))}
    </div>


    <div
      className="min-h-[140px] rounded-2xl flex flex-wrap items-center gap-3 p-4 shadow-inner"
      style={{
        border: `2px dashed ${colorPalette.softGreen}`,
        backgroundColor: colorPalette.lightGray,
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const droppedName = e.dataTransfer.getData("text/plain");
        if (droppedName && !formData.Miembros.includes(droppedName)) {
          setFormData({
            ...formData,
            Miembros: [...formData.Miembros, droppedName],
          });
        }
      }}
    >
      {formData.Miembros.length === 0 ? (
        <p className="text-sm italic" style={{ color: colorPalette.oliveGray }}>
          Arrastra aquí los miembros para agregarlos al proyecto
        </p>
      ) : (
        formData.Miembros.map((m, i) => (
          <span
            key={i}
            className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm"
            style={{
              backgroundColor: colorPalette.softGreen,
              color: colorPalette.lightGray,
              border: `1px solid ${colorPalette.oliveGray}`,
            }}
          >
            {m}
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  Miembros: formData.Miembros.filter((mi) => mi !== m),
                })
              }
              className="w-5 h-5 flex items-center justify-center rounded-full hover:scale-110 transition"
              style={{ backgroundColor: colorPalette.darkGreen }}
            >
              <span className="text-xs text-white">×</span>
            </button>
          </span>
        ))
      )}
    </div>


    <div className="flex gap-2 mt-4">
      <Input
        placeholder="Escribe un nombre"
        value={nuevoMiembro}
        onChange={(e) => setNuevoMiembro(e.target.value)}
      />
      <Button
        type="button"
        onClick={() => {
          if (nuevoMiembro.trim() && !formData.Miembros.includes(nuevoMiembro)) {
            setFormData({
              ...formData,
              Miembros: [...formData.Miembros, nuevoMiembro],
            });
            setNuevoMiembro("");
          }
        }}
      >
        Agregar
      </Button>
    </div>
  </CardContent>
)}


            {step === 4 && (
  <CardContent>
    <h2
      className="text-2xl font-semibold text-center mb-6"
      style={{ color: colorPalette.darkGreen }}
    >
      Vista Previa del Proyecto
    </h2>
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
            activeTab === "presentacion" ? colorPalette.softGreen : "#e2e8f0",
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
            activeTab === "publico" ? colorPalette.softGreen : "#e2e8f0",
          borderWidth: "2px",
        }}
      >
        DETALLE
      </button>
    </div>

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
            {formData.Titulo && (
              <p>
                <strong>Título:</strong> {formData.Titulo}
              </p>
            )}
            {formData.Descripcion && (
              <p>
                <strong>Descripción:</strong> {formData.Descripcion}
              </p>
            )}
            {(formData.DuracionEnMesesMinimo > 0 ||
              formData.DuracionEnMesesMaximo > 0) && (
              <p>
                <strong>Duración:</strong>{" "}
                {formData.DuracionEnMesesMinimo > 0
                  ? formData.DuracionEnMesesMinimo
                  : "?"}{" "}
                -{" "}
                {formData.DuracionEnMesesMaximo > 0
                  ? formData.DuracionEnMesesMaximo
                  : "?"}{" "}
                meses
              </p>
            )}
          </div>
        </div>
      </Card>
    )}

    {/* --- DETALLE --- */}
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
            {formData.Alcance && (
              <p>
                <strong>Alcance:</strong> {formData.Alcance}
              </p>
            )}
            {formData.Area && (
              <p>
                <strong>Área:</strong> {formData.Area}
              </p>
            )}
            {formData.Miembros.length > 0 && (
              <p>
                <strong>Miembros:</strong> {formData.Miembros.join(", ")}
              </p>
            )}
          </div>
        </div>
      </Card>
    )}
  </CardContent>
)}


            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
              <Button type="button" onClick={prevStep} disabled={step === 1} variant="outline">
                Anterior
              </Button>
              <Button type="submit">
                {step < 4 ? "Siguiente" : "Crear Proyecto"}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default NuevoProyecto;
