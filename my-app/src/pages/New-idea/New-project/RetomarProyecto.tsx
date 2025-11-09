import React, { useState, useEffect } from "react";
import NavBar from "../../../components/NavBar/navbar";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/UI/buttons";
import { Card, CardContent } from "../../../components/UI/cards";
import { Textarea } from "../../../components/UI/textarea";
import { Input } from "../../../components/UI/input";
import { StepIndicator } from "../../../components/Shared/StepIndicator";
import { CambiarProyectoAsync } from "../../../api/CambiarProyecto";
import { VerMiUsuario } from '../../../api/VerMiUsuario';
import { VerMiBeneficiario } from '../../../api/VerMiBeneficiario';
import { VerMisProyectos } from '../../../api/VerMisProyectos';
import { VerMisPostulaciones } from '../../../api/VerMisPostulaciones';
import { VerMisMiembros } from '../../../api/VerMisMiembros';
import { VerMisIdeas } from '../../../api/VerMisIdeas';
import Proyecto from "../../../models/Proyecto";

interface ProyectoForm {
  ID?: number;
  Beneficiario: number;
  Titulo: string;
  Descripcion: string;
  DuracionEnMesesMinimo: number;
  DuracionEnMesesMaximo: number;
  Alcance: string;
  Area: string;
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

const opcionesArea = [
  "Salud", "Innovación", "Tecnología", "Construcción", 
  "Servicios", "Educación", "Medio Ambiente"
];

const RetomarProyecto: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProyectoForm>({
    Beneficiario: 0,
    Titulo: "",
    Descripcion: "",
    DuracionEnMesesMinimo: 6,
    DuracionEnMesesMaximo: 12,
    Alcance: "",
    Area: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el beneficiario del usuario actual
    const storedUser = sessionStorage.getItem("usuario");
    if (storedUser) {
      const usuario = JSON.parse(storedUser);
      setFormData((prev) => ({ ...prev, Beneficiario: usuario.Beneficiario.ID }));
    }

    // Cargar el proyecto a retomar desde localStorage
    const proyectoToRetake = localStorage.getItem('retomarProyecto');
    if (proyectoToRetake) {
      try {
        const parsedProyecto = JSON.parse(proyectoToRetake);
        const proyectoData = {
          ID: parsedProyecto.ID,
          Beneficiario: parsedProyecto.Beneficiario || 0,
          Titulo: parsedProyecto.Titulo || "",
          Descripcion: parsedProyecto.Descripcion || "",
          DuracionEnMesesMinimo: parsedProyecto.DuracionEnMesesMinimo || 6,
          DuracionEnMesesMaximo: parsedProyecto.DuracionEnMesesMaximo || 12,
          Alcance: parsedProyecto.Alcance || "",
          Area: parsedProyecto.Area || "",
        };
        setFormData(proyectoData);
        console.log('Proyecto cargado para editar:', parsedProyecto);
      } catch (error) {
        console.error('Error al parsear proyecto a editar:', error);
      }
    } else {
      // Si no hay proyecto para editar, redirigir
      navigate('/Proyectos');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name.includes("Duracion") ? Number(value) : value 
    }));
  };

  const validateCurrentStep = (): boolean => {
    switch (step) {
      case 1:
        return formData.Titulo.trim() !== "" && formData.Titulo.length >= 10;
      case 2:
        return formData.Descripcion.trim() !== "" && formData.Descripcion.length >= 10;
      case 3:
        return formData.DuracionEnMesesMinimo > 0 && 
               formData.DuracionEnMesesMaximo >= formData.DuracionEnMesesMinimo &&
               formData.Alcance !== "" &&
               formData.Area !== "";
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setStep(prev => prev + 1);
    } else {
      let message = "Por favor completa correctamente los campos antes de continuar.";
      if (step === 1 && formData.Titulo.length < 10) {
        message = "El título debe tener al menos 10 caracteres.";
      } else if (step === 2 && formData.Descripcion.length < 10) {
        message = "La descripción debe tener al menos 10 caracteres.";
      } else if (step === 3) {
        if (!formData.Alcance) {
          message = "Debes seleccionar una región.";
        } else if (!formData.Area) {
          message = "Debes seleccionar un área.";
        } else if (formData.DuracionEnMesesMaximo < formData.DuracionEnMesesMinimo) {
          message = "La duración máxima debe ser mayor o igual a la mínima.";
        }
      }
      alert(message);
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleUpdateProyecto = async () => {
    if (!formData.ID) {
      alert('Error: No se pudo identificar el proyecto a actualizar.');
      return;
    }

    setIsUpdating(true);
    try {
      // Obtener el ID del usuario
      let usuarioId = 1; // fallback
      try {
        const storedUser = localStorage.getItem("usuario");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          usuarioId = userData.Usuario?.ID || 1;
        }
      } catch (userError) {
        console.error('Error al obtener usuario:', userError);
      }

      // Crear el objeto Proyecto para actualizar
      const proyectoToUpdate = new Proyecto({
        ID: formData.ID,
        Beneficiario: formData.Beneficiario,
        Titulo: formData.Titulo,
        Descripcion: formData.Descripcion,
        DuracionEnMesesMinimo: formData.DuracionEnMesesMinimo,
        DuracionEnMesesMaximo: formData.DuracionEnMesesMaximo,
        Alcance: formData.Alcance,
        Area: formData.Area,
        Usuario: usuarioId
      });

      console.log('Actualizando proyecto:', proyectoToUpdate);

      // Usar la API de cambiar proyecto para actualizar
      const proyectoActualizado = await CambiarProyectoAsync(formData.ID, proyectoToUpdate);
      
      if (!proyectoActualizado) {
        throw new Error('Error al actualizar el proyecto');
      }

      // Actualizar el localStorage con los datos más recientes
      const usuario = await VerMiUsuario(usuarioId);
      const beneficiario = await VerMiBeneficiario(usuarioId);
      const proyectos = await VerMisProyectos(usuarioId);
      const postulaciones = await VerMisPostulaciones(usuarioId);
      const miembros = await VerMisMiembros(usuarioId);
      const ideas = await VerMisIdeas(usuarioId);
      
      const datos = {
        "Usuario": usuario,
        "Beneficiario": beneficiario,
        "Proyectos": proyectos,
        "Postulaciones": postulaciones,
        "Miembros": miembros,
        "Ideas": ideas
      };
      
      localStorage.setItem("usuario", JSON.stringify(datos));
      
      alert('¡Proyecto actualizado exitosamente!');
      
      // Limpiar localStorage
      localStorage.removeItem('retomarProyecto');
      
      // Regresar a Mis Proyectos
      navigate('/Proyectos');
      
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
      alert(`Error al actualizar el proyecto: ${error}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colorPalette.lightGray }}>
      <NavBar />
      <main className="flex flex-col items-center justify-center px-4 py-10 mt-[5%]">
        <div className="w-full max-w-3xl mb-8">
          <h1 className="text-3xl font-bold text-center mb-4" style={{ color: colorPalette.darkGreen }}>
            Editar Proyecto
          </h1>
          <p className="text-center text-lg" style={{ color: colorPalette.oliveGray }}>
            Modifica los detalles de tu proyecto
          </p>
        </div>
        
        <div className="w-full max-w-3xl mb-4 md:mb-6">
          <StepIndicator currentStep={step} totalSteps={3} />
        </div>
        
        <Card className="w-full max-w-3xl px-4 md:px-9 py-6 md:py-8">
          {step === 1 && (
            <CardContent className="space-y-6">
              <h2 className="text-2xl font-semibold text-center" style={{ color: colorPalette.darkGreen }}>
                Información Básica
              </h2>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>
                  Título del Proyecto
                </label>
                <Input
                  name="Titulo"
                  value={formData.Titulo}
                  onChange={handleInputChange}
                  minLength={10}
                  required
                  placeholder="Ingresa el título del proyecto (mínimo 10 caracteres)"
                />
                <p className="text-xs mt-1" style={{ color: colorPalette.oliveGray }}>
                  {formData.Titulo.length}/10 caracteres mínimos
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex-1"
                  style={{ backgroundColor: colorPalette.darkGreen }}
                >
                  Siguiente
                </Button>
              </div>
            </CardContent>
          )}

          {step === 2 && (
            <CardContent className="space-y-6">
              <h2 className="text-2xl font-semibold text-center" style={{ color: colorPalette.darkGreen }}>
                Descripción del Proyecto
              </h2>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>
                  Descripción
                </label>
                <Textarea
                  name="Descripcion"
                  value={formData.Descripcion}
                  onChange={handleInputChange}
                  rows={5}
                  minLength={10}
                  required
                  placeholder="Describe detalladamente tu proyecto (mínimo 10 caracteres)"
                />
                <p className="text-xs mt-1" style={{ color: colorPalette.oliveGray }}>
                  {formData.Descripcion.length}/10 caracteres mínimos
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="flex-1"
                >
                  Atrás
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex-1"
                  style={{ backgroundColor: colorPalette.darkGreen }}
                >
                  Siguiente
                </Button>
              </div>
            </CardContent>
          )}

          {step === 3 && (
            <CardContent className="space-y-6">
              <h2 className="text-2xl font-semibold text-center" style={{ color: colorPalette.darkGreen }}>
                Detalles y Alcance
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>
                    Duración mínima (meses)
                  </label>
                  <Input
                    name="DuracionEnMesesMinimo"
                    type="number"
                    value={formData.DuracionEnMesesMinimo}
                    onChange={handleInputChange}
                    min={1}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>
                    Duración máxima (meses)
                  </label>
                  <Input
                    name="DuracionEnMesesMaximo"
                    type="number"
                    value={formData.DuracionEnMesesMaximo}
                    onChange={handleInputChange}
                    min={1}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>
                  Alcance (Región)
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {opcionesAlcance.map(opcion => (
                    <button
                      type="button"
                      key={opcion.value}
                      onClick={() => setFormData({...formData, Alcance: opcion.value})}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors`}
                      style={{
                        backgroundColor: formData.Alcance === opcion.value ? colorPalette.darkGreen : 'rgb(243 244 246)',
                        color: formData.Alcance === opcion.value ? 'white' : 'rgb(55 65 81)',
                        borderColor: formData.Alcance === opcion.value ? colorPalette.softGreen : 'rgb(209 213 219)'
                      }}
                    >
                      {opcion.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>
                  Área
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {opcionesArea.map(opcion => (
                    <button
                      type="button"
                      key={opcion}
                      onClick={() => setFormData({...formData, Area: opcion})}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors`}
                      style={{
                        backgroundColor: formData.Area === opcion ? colorPalette.darkGreen : 'rgb(243 244 246)',
                        color: formData.Area === opcion ? 'white' : 'rgb(55 65 81)',
                        borderColor: formData.Area === opcion ? colorPalette.softGreen : 'rgb(209 213 219)'
                      }}
                    >
                      {opcion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="flex-1"
                >
                  Atrás
                </Button>
                <Button
                  type="button"
                  onClick={handleUpdateProyecto}
                  disabled={isUpdating}
                  className="flex-1"
                  style={{ backgroundColor: colorPalette.darkGreen }}
                >
                  {isUpdating ? 'Actualizando...' : 'Actualizar Proyecto'}
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </main>
    </div>
  );
};

export default RetomarProyecto;
