//import React, { useState, useEffect } from "react";
import React, { useState } from "react";
import NavBar from "../../../components/NavBar/navbar";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../components/UI/cards";
import { Input } from "../../../components/UI/input";
import { Button } from "../../../components/UI/buttons";
import { Textarea } from "../../../components/UI/textarea";
import { StepIndicator } from "../../../components/Shared/StepIndicator";
import { CrearProyecto } from "../../../api/CrearProyecto"; 
import { VerMiUsuario } from '../../../api/VerMiUsuario';
import { VerMiBeneficiario } from '../../../api/VerMiBeneficiario';
import { VerMisProyectos } from '../../../api/VerMisProyectos';
import { VerMisPostulaciones } from '../../../api/VerMisPostulaciones';
import { VerMisMiembros } from '../../../api/VerMisMiembros';
import { VerMisIdeas } from '../../../api/VerMisIdeas';
import { CrearPersona } from "../../../api/CrearPersona"; 
import Proyecto from "../../../models/Proyecto";
import Persona from "../../../models/Persona";

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

const opcionesAlcance =  [
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
const opcionesArea = [
  "Salud",
  "Innovación",
  "Tecnología",
  "Construcción",
  "Servicios",
  "Educación",
  "Medio Ambiente"
];

const NuevoProyecto: React.FC = () => {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"presentacion" | "publico">("presentacion");
  const [formData, setFormData] = useState<ProyectoForm>({
    Beneficiario: 0, Titulo: "", Descripcion: "", DuracionEnMesesMinimo: 6,
    DuracionEnMesesMaximo: 12, Alcance: "", Area: "", Miembros: [],
  });
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevaPersonaData, setNuevaPersonaData] = useState<Persona>({
    ID: 0,
    Nombre: "",
    Sexo: "Otro",
    RUT: "",
    FechaDeNacimiento: ""
  });
  const navigate = useNavigate();
  /**
  const storedUser = localStorage.getItem("usuario");
  
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
        const errorData = await response.json().catch(() => ({
          message: 'Error desconocido del servidor de IA.'
        }));
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
    if (storedUser) {
      const usuario = JSON.parse(storedUser);
      setFormData((prev) => ({ ...prev, Beneficiario: usuario.Beneficiario.ID }));
      setPersonas(usuario.Miembros.map((m: any) => new Persona(m)));
    }
  }, [storedUser]);
  */

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
        const persona: Persona = await CrearPersona(nuevaPersonaData);
        if (!persona)
          throw new Error("No se pudo crear la persona. Verifique los datos.");
        setFormData(prev => ({ ...prev, Miembros: [...prev.Miembros, persona.Nombre] }));
        setPersonas(prev => [...prev, new Persona(persona)]);
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

  
  const EnviarProyecto = async () => {
    console.log(`Formulario" ${JSON.stringify(formData)}`);

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
      if (storedUser) {
        const datos = JSON.parse(storedUser);
        const enteId = datos.Beneficiario?.ID;
        const id = datos.Usuario?.ID;
        if (id && enteId) {
          const proyectoParaEnviar = new Proyecto({
            ID: 0,
            Beneficiario: enteId,
            Titulo: formData.Titulo,
            Descripcion: formData.Descripcion,
            DuracionEnMesesMinimo: formData.DuracionEnMesesMinimo,
            DuracionEnMesesMaximo: formData.DuracionEnMesesMaximo,
            Alcance: formData.Alcance,
            Area: formData.Area,
            Innovacion: "",
            ObjetivoEspecifico: "",
            ObjetivoGeneral: "",
            Proposito: "",
            ResultadoEsperado: "",
            Usuario: id
          });
          const creado = await CrearProyecto(proyectoParaEnviar);
          console.log(`Proyecto creado: ${JSON.stringify(creado)}`);
          
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
          alert("¡Proyecto creado exitosamente!");
          navigate("/Home-i");
        }
      }
    }
    catch (error) {
      console.error("FALLÓ LA CREACIÓN DEL PROYECTO (capturado en .catch):", error);
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
      alert(`No se pudo crear el proyecto: ${errorMessage}`);
    }
  };

  // --- INICIO: Bloque para reemplazar ---
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: colorPalette.lightGray }}>
      <NavBar />
      <main className="flex flex-col items-center justify-center px-4 py-6 md:py-10 mt-20 md:mt-[5%] w-full">
        <div className="w-full max-w-3xl mb-4 md:mb-6">
          <StepIndicator currentStep={step} totalSteps={4} />
        </div>
        <Card className="w-full max-w-3xl px-4 md:px-9 py-6 md:py-8">
          <form onSubmit={(e) => { e.preventDefault(); if (step < 4) nextStep(); else EnviarProyecto(); }}>
            {step === 1 && (
              <CardContent className="space-y-6">
                <h2 className="text-2xl font-semibold text-center" style={{ color: colorPalette.darkGreen }}>Información Básica</h2>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>Título del Proyecto</label>
                  <Input name="Titulo" value={formData.Titulo} onChange={handleChange} minLength={10} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>Descripción</label>
                  <Textarea name="Descripcion" rows={5} value={formData.Descripcion} onChange={handleChange} minLength={10} required />
                </div>
              </CardContent>
            )}

            {step === 2 && (
              <CardContent className="space-y-6">
                <h2 className="text-2xl font-semibold text-center" style={{ color: colorPalette.darkGreen }}>Detalles y Alcance</h2>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>Duración mínima (meses)</label>
                        <Input name="DuracionEnMesesMinimo" type="number" value={formData.DuracionEnMesesMinimo} onChange={handleChange} min={1} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>Duración máxima (meses)</label>
                        <Input name="DuracionEnMesesMaximo" type="number" value={formData.DuracionEnMesesMaximo} onChange={handleChange} min={1} required />
                    </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>Alcance (Región)</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {opcionesAlcance.map(opcion => (<button type="button" key={opcion.value} onClick={() => setFormData({...formData, Alcance: opcion.value})} className={`px-3 py-1 text-sm rounded-full border transition-colors`} style={{backgroundColor: formData.Alcance === opcion.value ? colorPalette.darkGreen : 'rgb(243 244 246)', color: formData.Alcance === opcion.value ? 'white' : 'rgb(55 65 81)', borderColor: formData.Alcance === opcion.value ? colorPalette.softGreen : 'rgb(209 213 219)'}}>{opcion.label}</button>))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>Área</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {opcionesArea.map(opcion => (<button type="button" key={opcion} onClick={() => setFormData({...formData, Area: opcion})} className={`px-3 py-1 text-sm rounded-full border transition-colors`} style={{backgroundColor: formData.Area === opcion ? colorPalette.darkGreen : 'rgb(243 244 246)', color: formData.Area === opcion ? 'white' : 'rgb(55 65 81)', borderColor: formData.Area === opcion ? colorPalette.softGreen : 'rgb(209 213 219)'}}>{opcion}</button>))}
                  </div>
                </div>
              </CardContent>
            )}

            {step === 3 && (
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

            {step === 4 && (
              <CardContent>
                <h2 className="text-2xl font-semibold text-center mb-6" style={{ color: colorPalette.darkGreen }}>Vista Previa del Proyecto</h2>
                <div className="flex justify-center space-x-2 mb-6">
                  <button type="button" onClick={() => setActiveTab("presentacion")} className="px-6 py-2 border rounded-md font-semibold transition-colors duration-200" style={{ color: activeTab === "presentacion" ? colorPalette.darkGreen : colorPalette.softGreen, borderColor: activeTab === "presentacion" ? colorPalette.softGreen : "#e2e8f0", borderWidth: "2px" }}>PRESENTACIÓN</button>
                  <button type="button" onClick={() => setActiveTab("publico")} className="px-6 py-2 border rounded-md font-semibold transition-colors duration-200" style={{ color: activeTab === "publico" ? colorPalette.darkGreen : colorPalette.softGreen, borderColor: activeTab === "publico" ? colorPalette.softGreen : "#e2e8f0", borderWidth: "2px" }}>DETALLE</button>
                </div>
                {activeTab === "presentacion" && (<Card><div className="p-6 md:p-8"><h3 className="text-xl font-semibold mb-4" style={{ color: colorPalette.darkGreen }}>Presentación</h3><div className="space-y-4 leading-relaxed" style={{ color: colorPalette.oliveGray }}>{formData.Titulo && <div><strong>Título:</strong> <p className="break-words overflow-hidden text-ellipsis line-clamp-2 mt-1">{formData.Titulo}</p></div>}{formData.Descripcion && <div><strong>Descripción:</strong> <p className="break-words overflow-hidden text-ellipsis line-clamp-3 mt-1">{formData.Descripcion}</p></div>}{(formData.DuracionEnMesesMinimo > 0 || formData.DuracionEnMesesMaximo > 0) && <p><strong>Duración:</strong> {formData.DuracionEnMesesMinimo || "?"} - {formData.DuracionEnMesesMaximo || "?"} meses</p>}</div></div></Card>)}
                {activeTab === "publico" && (<Card><div className="p-6 md:p-8"><h3 className="text-xl font-semibold mb-4" style={{ color: colorPalette.darkGreen }}>Detalle</h3><div className="space-y-4 leading-relaxed" style={{ color: colorPalette.oliveGray }}>{formData.Alcance && <p><strong>Alcance:</strong> {opcionesAlcance.find(o => o.value === formData.Alcance)?.label}</p>}{formData.Area && <p><strong>Área:</strong> {formData.Area}</p>}{formData.Miembros.length > 0 ? (<p><strong>Miembros:</strong> {formData.Miembros.join(", ")}</p>) : (<p className="italic" style={{ color: colorPalette.softGreen }}>No hay miembros agregados</p>)}</div></div></Card>)}
              </CardContent>
            )}

            <div className="flex justify-between items-center mt-8 pt-6" style={{ borderTop: `1px solid ${colorPalette.softGreen}` }}>
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
                        <h3 className="text-xl font-semibold text-center" style={{ color: colorPalette.darkGreen }}>Crear Nueva Persona</h3>
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>Nombre Completo</label>
                            <Input name="Nombre" value={nuevaPersonaData.Nombre} onChange={handleModalChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>RUT</label>
                            <Input name="RUT" placeholder="12.345.678-9" value={nuevaPersonaData.RUT} onChange={handleModalChange} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>Sexo</label>
                                <select name="Sexo" value={nuevaPersonaData.Sexo} onChange={handleModalChange} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base rounded-md" style={{ borderColor: colorPalette.softGreen, color: colorPalette.oliveGray }}>
                                    <option value="Hombre">Hombre</option>
                                    <option value="Mujer">Mujer</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>Fecha de Nacimiento</label>
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