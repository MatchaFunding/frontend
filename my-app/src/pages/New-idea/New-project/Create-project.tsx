import React, { useState, useEffect } from "react";
import NavBar from "../../../components/NavBar/navbar";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../components/UI/cards";
import { Input } from "../../../components/UI/input";
import { Button } from "../../../components/UI/buttons";
import { Textarea } from "../../../components/UI/textarea";
import { StepIndicator } from "../../../components/Shared/StepIndicator";
import { CrearProyectoAsync } from "../../../api/CrearProyecto";
import { CrearColaboradorAsync } from "../../../api/CrearColaborador";
import PersonaClass from "../../../models/Persona";
import Proyecto from "../../../models/Proyecto";
import Colaborador from "../../../models/Colaborador";

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
}

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

const NuevoProyecto: React.FC = () => {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"presentacion" | "publico">("presentacion");
  const [formData, setFormData] = useState<ProyectoForm>({
    Beneficiario: 0, Titulo: "", Descripcion: "", DuracionEnMesesMinimo: 6,
    DuracionEnMesesMaximo: 12, Alcance: "", Area: "", Miembros: [],
  });
  const [personas, setPersonas] = useState<PersonaClass[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevaPersonaData, setNuevaPersonaData] = useState<PersonaPayload>({
    Nombre: "", Sexo: "OTR", RUT: "", FechaDeNacimiento: ""
  });
  const navigate = useNavigate();
  const storedUser = sessionStorage.getItem("usuario");

  useEffect(() => {
    if (storedUser) {
      const usuario = JSON.parse(storedUser);
      setFormData((prev) => ({ ...prev, Beneficiario: usuario.Beneficiario.ID }));
      setPersonas(usuario.Miembros.map((m: any) => new PersonaClass(m)));
    }
  }, [storedUser]);

  console.log("Personas de la empresa: " + JSON.stringify(personas));

  const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name.includes("Duracion") ? Number(value) : value, });
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
        const resPersona = await fetch("https://referral-charlotte-fee-powers.trycloudflare.com/crearpersona/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(nuevaPersonaData) });
        if (!resPersona.ok) throw new Error("No se pudo crear la persona. Verifique los datos.");
        const personaCreada = await resPersona.json();
        setFormData(prev => ({ ...prev, Miembros: [...prev.Miembros, personaCreada.Nombre] }));
        setPersonas(prev => [...prev, new PersonaClass(personaCreada)]);
        alert("Persona creada y añadida al proyecto exitosamente.");
        setIsModalOpen(false);
        setNuevaPersonaData({ Nombre: "", Sexo: "OTR", RUT: "", FechaDeNacimiento: "" });
    }
    catch (error) {
        if (error instanceof Error) alert(error.message);
        else alert("Ocurrió un error inesperado al crear la persona.");
    }
  };

  const EnviarProyecto = async () => {
    if (formData.Titulo.length < 10) { alert("El título debe tener al menos 10 caracteres."); return; }
    if (formData.Descripcion.length < 10) { alert("La descripción debe tener al menos 10 caracteres."); return; }
    if (formData.DuracionEnMesesMinimo <= 0 || formData.DuracionEnMesesMaximo <= 0) { alert("La duración debe ser mayor a cero."); return; }
    if (formData.DuracionEnMesesMinimo > formData.DuracionEnMesesMaximo) { alert("La duración mínima no puede ser mayor que la máxima."); return; }
    if (!formData.Alcance || !formData.Area) { alert("Debes seleccionar un Alcance y un Área."); return; }

    try {
      const json_proy = {
        Beneficiario: formData.Beneficiario,
        Titulo: formData.Titulo,
        Descripcion: formData.Descripcion,
        DuracionEnMesesMinimo: formData.DuracionEnMesesMinimo,
        DuracionEnMesesMaximo: formData.DuracionEnMesesMaximo,
        Alcance: formData.Alcance,
        Area: formData.Area
      };
      const proyecto: Proyecto = new Proyecto(json_proy);
      const proyectoCreado: Proyecto = await CrearProyectoAsync(proyecto);
      
      if (storedUser) {
        const usuario = JSON.parse(storedUser);
        const miembros = usuario.Miembros;
        for (let p = 0; p < personas.length; p++) {
          if (miembros.includes(personas[p]) === false) {
            const json_colab = {
              Persona: personas[p].ID,
              Proyecto: proyectoCreado.ID
            };
            const colaborador: Colaborador = new Colaborador(json_colab);
            await CrearColaboradorAsync(colaborador);
          }
        }
      }
      else {
        console.log('No se encontraron datos de usuario en sessionStorage');
      }

      alert("¡Proyecto y colaboradores creados exitosamente!");
      navigate("/Home-i");
    } 
    catch (error) {
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
      <main className="flex flex-col items-center justify-center px-4 py-10 mt-[5%]">
        <StepIndicator currentStep={step} totalSteps={4} />
        <Card className="w-full max-w-3xl px-9 py-8">
          <form onSubmit={(e) => { e.preventDefault(); if (step < 4) nextStep(); else EnviarProyecto(); }}>
            {step === 1 && (
              <CardContent className="space-y-6">
                <h2 className="text-2xl font-semibold text-center text-slate-800">Información Básica</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Título del Proyecto</label>
                  <Input name="Titulo" value={formData.Titulo} onChange={handleChange} minLength={10} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                  <Textarea name="Descripcion" rows={5} value={formData.Descripcion} onChange={handleChange} minLength={10} required />
                </div>
              </CardContent>
            )}

            {step === 2 && (
              <CardContent className="space-y-6">
                <h2 className="text-2xl font-semibold text-center text-slate-800">Detalles y Alcance</h2>
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Área</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {opcionesArea.map(opcion => (<button type="button" key={opcion} onClick={() => setFormData({...formData, Area: opcion})} className={`px-3 py-1 text-sm rounded-full border transition-colors ${formData.Area === opcion ? 'bg-green-600 text-white border-green-700' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>{opcion}</button>))}
                  </div>
                </div>
              </CardContent>
            )}

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

export default NuevoProyecto;