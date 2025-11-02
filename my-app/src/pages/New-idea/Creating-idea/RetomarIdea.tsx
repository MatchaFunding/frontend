import React, { useState, useEffect } from "react";
import NavBar from "../../../components/NavBar/navbar";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/UI/buttons";
import { Card, CardContent } from "../../../components/UI/cards";
import { Textarea } from "../../../components/UI/textarea";
import { StepIndicator } from "../../../components/Shared/StepIndicator";
import { CambiarIdeaAsync } from "../../../api/CambiarIdea";
import { CrearIdeaIAAsync } from "../../../api/CrearIdeaIa";
import Idea from "../../../models/Idea";

interface IdeaForm {
  ID?: number;
  Campo: string;
  Problema: string;
  Publico: string;
  Innovacion: string;
  Propuesta?: string;
}

const colorPalette = {
  darkGreen: "#44624a",
  softGreen: "#8ba888",
  oliveGray: "#505143",
  lightGray: "#f1f5f9",
};

const camposDisponibles = [
  "Tecnología", "Salud", "Educación", "Medio Ambiente", "Energía", 
  "Agricultura", "Transporte", "Finanzas", "Entretenimiento", "Otros"
];

const RetomarIdea: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<IdeaForm>({
    Campo: "",
    Problema: "",
    Publico: "",
    Innovacion: "",
    Propuesta: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar la idea a retomar desde localStorage
    const ideaToRetake = localStorage.getItem('retomarIdea');
    if (ideaToRetake) {
      try {
        const parsedIdea = JSON.parse(ideaToRetake);
        setFormData({
          ID: parsedIdea.ID,
          Campo: parsedIdea.Campo || "",
          Problema: parsedIdea.Problema || "",
          Publico: parsedIdea.Publico || "",
          Innovacion: parsedIdea.Innovacion || "",
          Propuesta: parsedIdea.Propuesta || ""
        });
        console.log('Idea cargada para retomar:', parsedIdea);
      } catch (error) {
        console.error('Error al parsear idea a retomar:', error);
      }
    } else {
      // Si no hay idea para retomar, redirigir
      navigate('/Proyectos');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCampoSelect = (campo: string) => {
    setFormData(prev => ({ ...prev, Campo: campo }));
  };

  const validateCurrentStep = (): boolean => {
    switch (step) {
      case 1:
        return formData.Campo.trim() !== "";
      case 2:
        return formData.Problema.trim() !== "" && formData.Problema.length >= 10;
      case 3:
        return formData.Publico.trim() !== "" && formData.Publico.length >= 5;
      case 4:
        return formData.Innovacion.trim() !== "" && formData.Innovacion.length >= 10;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setStep(prev => prev + 1);
    } else {
      alert("Por favor completa correctamente los campos antes de continuar.");
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleGenerateAndSave = async () => {
    setIsProcessing(true);
    try {
      // Obtener el ID del usuario
      let usuarioId = 1; // fallback
      try {
        const storedUser = sessionStorage.getItem("usuario");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          usuarioId = userData.Usuario?.ID || 1;
        }
      } catch (userError) {
        console.error('Error al obtener usuario:', userError);
      }

      // Primero, limpiar el resumen actual editando la idea sin propuesta
      const ideaSinResumen = new Idea({
        ID: formData.ID,
        Usuario: usuarioId,
        Campo: formData.Campo,
        Problema: formData.Problema,
        Publico: formData.Publico,
        Innovacion: formData.Innovacion,
        Propuesta: "", // Limpiar resumen actual
        Oculta: false,
        FechaDeCreacion: new Date().toISOString().split('T')[0]
      });

      console.log('Limpiando resumen actual...');
      await CambiarIdeaAsync(formData.ID!, ideaSinResumen);

      // Crear idea con los datos actualizados para enviar a la API de IA
      const ideaParaIA = new Idea({
        ID: formData.ID,
        Usuario: usuarioId,
        Campo: formData.Campo,
        Problema: formData.Problema,
        Publico: formData.Publico,
        Innovacion: formData.Innovacion,
        Propuesta: "", // Sin resumen para generar uno completamente nuevo
        Oculta: false,
        FechaDeCreacion: new Date().toISOString().split('T')[0]
      });

      console.log('Generando resumen LLM completamente nuevo con IA...', ideaParaIA);
      
      // Llamar a la API de IA para generar el resumen LLM
      const aiResponse = await CrearIdeaIAAsync(ideaParaIA);
      console.log('Resumen LLM generado:', aiResponse);
      
      // Ahora actualizar la idea existente con el nuevo resumen LLM
      const ideaActualizada = new Idea({
        ID: formData.ID,
        Usuario: usuarioId,
        Campo: formData.Campo,
        Problema: formData.Problema,
        Publico: formData.Publico,
        Innovacion: formData.Innovacion,
        Propuesta: aiResponse.ResumenLLM, // Usar el resumen generado por IA
        Oculta: false,
        FechaDeCreacion: new Date().toISOString().split('T')[0]
      });

      // Usar la API de cambiar idea para actualizar (no crear nueva)
      const ideaGuardada = await CambiarIdeaAsync(formData.ID!, ideaActualizada);
      
      if (!ideaGuardada) {
        throw new Error('Error al actualizar la idea');
      }
      
      alert('¡Nueva idea refinada generada y guardada exitosamente!');
      
      // Limpiar localStorage
      localStorage.removeItem('retomarIdea');
      
      // Regresar a Mis Ideas
      navigate('/Proyectos');
      
    } catch (error) {
      console.error('Error al generar y guardar nueva idea refinada:', error);
      alert(`Error al generar nueva idea refinada: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateIdea = async () => {
    setIsUpdating(true);
    try {
      // Obtener el ID del usuario
      let usuarioId = 1; // fallback
      try {
        const storedUser = sessionStorage.getItem("usuario");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          usuarioId = userData.Usuario?.ID || 1;
        }
      } catch (userError) {
        console.error('Error al obtener usuario:', userError);
      }

      // Actualizar la idea en el backend
      const ideaToUpdate = new Idea({
        ID: formData.ID,
        Usuario: usuarioId,
        Campo: formData.Campo,
        Problema: formData.Problema,
        Publico: formData.Publico,
        Innovacion: formData.Innovacion,
        Propuesta: formData.Propuesta || "",
        Oculta: false,
        FechaDeCreacion: new Date().toISOString().split('T')[0]
      });

      // Usar la API de cambiar idea para actualizar (no crear nueva)
      const ideaGuardada = await CambiarIdeaAsync(formData.ID!, ideaToUpdate);
      
      if (!ideaGuardada) {
        throw new Error('Error al actualizar la idea');
      }
      
      alert('¡Idea actualizada exitosamente!');
      
      // Limpiar localStorage
      localStorage.removeItem('retomarIdea');
      
      // Regresar a Mis Ideas
      navigate('/Proyectos');
      
    } catch (error) {
      console.error('Error al actualizar idea:', error);
      alert(`Error al actualizar la idea: ${error}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <main className="flex flex-col items-center justify-center px-4 py-10 mt-[5%]">
        <div className="w-full max-w-3xl mb-8">
          <h1 className="text-3xl font-bold text-center mb-4" style={{ color: colorPalette.darkGreen }}>
            Retomar y editar idea
          </h1>
          <p className="text-center text-lg" style={{ color: colorPalette.oliveGray }}>
            Edita tu idea y genera un nuevo resumen con IA
          </p>
        </div>
        
        <StepIndicator currentStep={step} totalSteps={5} />
        
        <Card className="w-full max-w-3xl px-9 py-8">
          {step === 1 && (
            <CardContent className="space-y-6">
              <h2 className="text-2xl font-semibold text-center text-slate-800">Campo de la idea</h2>
              <p className="text-center text-gray-600">¿En qué área se enfoca tu idea?</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {camposDisponibles.map((campo) => (
                  <button
                    key={campo}
                    type="button"
                    onClick={() => handleCampoSelect(campo)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.Campo === campo
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {campo}
                  </button>
                ))}
              </div>
              
              {formData.Campo && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-700 font-medium">Campo seleccionado: {formData.Campo}</p>
                </div>
              )}
            </CardContent>
          )}

          {step === 2 && (
            <CardContent className="space-y-6">
              <h2 className="text-2xl font-semibold text-center text-slate-800">Problema a resolver</h2>
              <p className="text-center text-gray-600">Describe el problema que tu idea va a solucionar</p>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Problema (mínimo 10 caracteres)
                </label>
                <Textarea
                  name="Problema"
                  value={formData.Problema}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe detalladamente el problema que quieres resolver..."
                  minLength={10}
                  className="w-full"
                />
                <div className="mt-2 text-sm text-gray-500">
                  {formData.Problema.length}/10 caracteres mínimos
                </div>
              </div>
            </CardContent>
          )}

          {step === 3 && (
            <CardContent className="space-y-6">
              <h2 className="text-2xl font-semibold text-center text-slate-800">Público objetivo</h2>
              <p className="text-center text-gray-600">¿A quién está dirigida tu solución?</p>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Público objetivo (mínimo 5 caracteres)
                </label>
                <Textarea
                  name="Publico"
                  value={formData.Publico}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe tu público objetivo: empresas, estudiantes, adultos mayores, etc."
                  minLength={5}
                  className="w-full"
                />
                <div className="mt-2 text-sm text-gray-500">
                  {formData.Publico.length}/5 caracteres mínimos
                </div>
              </div>
            </CardContent>
          )}

          {step === 4 && (
            <CardContent className="space-y-6">
              <h2 className="text-2xl font-semibold text-center text-slate-800">Innovación</h2>
              <p className="text-center text-gray-600">¿Qué hace única a tu idea?</p>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Diferenciador/innovación (mínimo 10 caracteres)
                </label>
                <Textarea
                  name="Innovacion"
                  value={formData.Innovacion}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Explica qué hace diferente y único a tu proyecto frente a otras soluciones..."
                  minLength={10}
                  className="w-full"
                />
                <div className="mt-2 text-sm text-gray-500">
                  {formData.Innovacion.length}/10 caracteres mínimos
                </div>
              </div>
            </CardContent>
          )}

          {step === 5 && (
            <CardContent className="space-y-6">
              <h2 className="text-2xl font-semibold text-center text-slate-800">Resumen de tu idea</h2>
              
              <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-800">Campo:</h3>
                  <p className="text-gray-600">{formData.Campo}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Problema:</h3>
                  <p className="text-gray-600">{formData.Problema}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Público:</h3>
                  <p className="text-gray-600">{formData.Publico}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Innovación:</h3>
                  <p className="text-gray-600">{formData.Innovacion}</p>
                </div>
                {formData.Propuesta && (
                  <div>
                    <h3 className="font-semibold text-gray-800">Propuesta actual (IA):</h3>
                    <p className="text-gray-600">{formData.Propuesta}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  onClick={handleGenerateAndSave}
                  disabled={isProcessing}
                  style={{ backgroundColor: colorPalette.darkGreen }}
                  className="w-full"
                >
                  {isProcessing ? 'Generando con IA...' : 'Generar nueva idea refinada (guardar)'}
                </Button>
                
                <Button
                  onClick={handleUpdateIdea}
                  disabled={isUpdating}
                  variant="outline"
                  className="w-full"
                >
                  {isUpdating ? 'Actualizando...' : 'Solo actualizar idea (sin IA)'}
                </Button>
              </div>
            </CardContent>
          )}

          {step < 5 && (
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
                type="button" 
                onClick={nextStep}
                disabled={!validateCurrentStep()}
              >
                Siguiente
              </Button>
            </div>
          )}

          {step === 5 && (
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
              <Button 
                type="button" 
                onClick={prevStep} 
                variant="outline"
              >
                Anterior
              </Button>
              <Button 
                type="button" 
                onClick={() => navigate('/Proyectos')}
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default RetomarIdea;