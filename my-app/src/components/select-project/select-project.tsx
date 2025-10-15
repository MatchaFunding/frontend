import React, { useState, useEffect } from 'react';
import './select-project.css';
import type { SelectProjectModalProps, Proyecto } from './select-project';
import { CrearPostulacionAsync } from '../../api/CrearPostulacion';
import { BorrarPostulacionAsync } from '../../api/BorrarPostulacion';
import { ObtenerPostulacionAsync } from '../../api/VerificarPostulacion';
import Postulacion from '../../models/Postulacion';

const SelectProjectModal: React.FC<SelectProjectModalProps> = ({ 
  isOpen, 
  onClose,
  fondoTitle,
  instrumentoId,
  onPostulacionCreated,
  mode = 'create',
  onPostulacionDeleted
}) => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postulacionActual, setPostulacionActual] = useState<Postulacion | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch de proyectos y postulación actual
  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return;
      const storedUser = sessionStorage.getItem("usuario");
      if (!storedUser) { 
        setError("No se encontró información del usuario."); 
        return; 
      }
      const userData = JSON.parse(storedUser);
      const empresaId = userData?.Beneficiario?.ID;
      if (!empresaId) { 
        setError("No se pudo obtener el ID de la empresa."); 
        return; 
      }

      setLoading(true);
      setError(null);
      try {
        if (mode === 'unlink' && instrumentoId) {
          const postulacion = await ObtenerPostulacionAsync(empresaId, instrumentoId);
          setPostulacionActual(postulacion);
        }
        const response = await fetch(`https://backend.matchafunding.com/verproyectosdeempresa/${empresaId}`);
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        setProyectos(data || []); 
      } catch (error: any) {
        setError(error.message || "Ocurrió un error inesperado.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, mode, instrumentoId]);

  // Limpiar selección si el proyecto seleccionado no coincide con la búsqueda
  useEffect(() => {
    if (selectedProject && searchTerm) {
      const proyecto = proyectos.find(p => p.ID.toString() === selectedProject);
      if (proyecto && !proyecto.Titulo.toLowerCase().includes(searchTerm.toLowerCase())) {
        setSelectedProject('');
      }
    }
  }, [searchTerm, selectedProject, proyectos]);

  const handleUnlinkPostulacion = async () => {
    if (!postulacionActual) {
      alert('No se encontró la postulación a desvincular.');
      return;
    }

    const confirmacion = window.confirm(
      `¿Estás seguro de que quieres desvincular el proyecto "${proyectos.find(p => p.ID === postulacionActual.Proyecto)?.Titulo}" del fondo "${fondoTitle}"?\n\nEsta acción eliminará la postulación.`
    );

    if (!confirmacion) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Intentando eliminar postulación con ID:', postulacionActual.ID);
      const result = await BorrarPostulacionAsync(postulacionActual.ID);
      console.log('Resultado de eliminar postulación:', result);
      
      alert(`¡Postulación eliminada exitosamente!\n\nEl proyecto ya no está vinculado al fondo "${fondoTitle}".`);
      
      // Notificar al componente padre que se eliminó la postulación
      if (onPostulacionDeleted) {
        onPostulacionDeleted();
      }
      
      // Cerrar el modal
      handleClose();
      
    } catch (error: any) {
      console.error('Error al eliminar postulación:', error);
      alert(`Error al eliminar la postulación: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreatePostulacion = async () => {
    if (!selectedProject) {
      alert('Por favor selecciona un proyecto');
      return;
    }

    if (!instrumentoId) {
      alert('Error: No se pudo identificar el fondo seleccionado.');
      return;
    }

    setIsSubmitting(true);

    try {
      const storedUser = sessionStorage.getItem("usuario");
      if (!storedUser) {
        throw new Error('No se encontró información del usuario.');
      }

      const userData = JSON.parse(storedUser);
      const empresaId = userData?.Beneficiario?.ID;
      if (!empresaId) {
        throw new Error('No se pudo obtener el ID de la empresa.');
      }

      // Crear el objeto Postulacion usando tu modelo
      const postulacionData = new Postulacion({
        ID: 0, // Se asigna automáticamente por la base de datos
        Beneficiario: empresaId,
        Proyecto: parseInt(selectedProject),
        Instrumento: instrumentoId,
        Resultado: 'PEN', // Usar valor correcto del modelo Django: "PEN" = Pendiente
        MontoObtenido: 0, // 0 en lugar de null (el backend no acepta null)
        FechaDePostulacion: new Date().toISOString().split('T')[0],
        FechaDeResultado: new Date().toISOString().split('T')[0], // Fecha actual en lugar de null
        Detalle: `Postulación realizada a través de MatchaFunding para el fondo: ${fondoTitle || 'Fondo'}`
      });

      console.log('Datos a enviar:', {
        'empresaId': empresaId,
        'selectedProject': selectedProject,
        'instrumentoId': instrumentoId,
        'postulacionData': postulacionData,
        'JSON que se enviará': {
          'Beneficiario': postulacionData.Beneficiario,
          'Proyecto': postulacionData.Proyecto,
          'Instrumento': postulacionData.Instrumento,
          'Resultado': postulacionData.Resultado,
          'MontoObtenido': postulacionData.MontoObtenido,
          'FechaDePostulacion': postulacionData.FechaDePostulacion,
          'FechaDeResultado': postulacionData.FechaDeResultado,
          'Detalle': postulacionData.Detalle,
        }
      });

      // Usar tu función CrearPostulacionAsync
      const result = await CrearPostulacionAsync(postulacionData);
      console.log('Postulación creada:', result);
      
      const proyecto = proyectos.find(p => p.ID.toString() === selectedProject);
      
      // Mostrar mensaje de éxito
      alert(`¡Postulación creada exitosamente!\n\nProyecto: "${proyecto?.Titulo}"\nFondo: "${fondoTitle}"\nEstado: Pendiente`);
      
      // Notificar al componente padre que se creó la postulación
      if (onPostulacionCreated) {
        onPostulacionCreated();
      }
      
      // Cerrar el modal y limpiar estado
      handleClose();
      
    } catch (error: any) {
      console.error('Error al crear postulación:', error);
      alert(`Error al crear la postulación: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedProject('');
    setSearchTerm('');
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="select-project-modal-overlay" onClick={handleClose}>
      <div className="select-project-modal" onClick={(e) => e.stopPropagation()}>
        <div className="select-project-modal__header">
          <h2 className="select-project-modal__title">
            {mode === 'unlink' ? 'Eliminar Postulación' : 'Crear Postulación'}
          </h2>
          <button className="select-project-modal__close" onClick={handleClose}>
            ×
          </button>
        </div>
        <div className="select-project-modal__content">
          {/* Eliminar postulación */}
          {mode === 'unlink' ? (
            <div className="select-project-modal__unlink-section">
              {loading ? (
                <div className="select-project-modal__loading">
                  Cargando información...
                </div>
              ) : error ? (
                <div className="select-project-modal__error">
                  Error: {error}
                </div>
              ) : postulacionActual ? (
                <div className="select-project-modal__current-postulacion">
                  <div className="select-project-modal__postulacion-info">
                    <p><strong>Proyecto:</strong> {proyectos.find(p => p.ID === postulacionActual.Proyecto)?.Titulo || 'Proyecto no encontrado'}</p>
                    <p><strong>Fondo:</strong> {fondoTitle || 'Fondo sin título'}</p>
                    <p><strong>Fecha de postulación:</strong> {postulacionActual.FechaDePostulacion}</p>
                  </div>
                  <p className="select-project-modal__unlink-warning">
                    ¿Estás seguro de que quieres desvincular este proyecto del fondo? Esta acción eliminará la postulación permanentemente.
                  </p>
                </div>
              ) : (
                <div className="select-project-modal__error">
                  No se encontró la postulación a desvincular.
                </div>
              )}
            </div>
          ) : (
            // Crear postulación
            <div className="select-project-modal__projects-section">
              <div className="select-project-modal__disclaimer">
                <p>
                  <strong>Importante:</strong> Este proceso registra la postulación en su sistema de seguimiento personal. 
                  La postulación oficial al fondo debe realizarse directamente a través de los canales oficiales 
                  del financiador correspondiente. Esta funcionalidad tiene fines de gestión y monitoreo interno.
                </p>
              </div>
              <h3>Selecciona un proyecto:</h3>
              <div className="select-project-modal__search-container">
                <input
                  type="text"
                  placeholder="Buscar por título del proyecto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="select-project-modal__search-input"
                />
              </div>
              {loading ? (
                <div className="select-project-modal__loading">
                  Cargando proyectos...
                </div>
              ) : error ? (
                <div className="select-project-modal__error">
                  Error: {error}
                </div>
              ) : (
                <div className="select-project-modal__projects-list">
                  {proyectos.length > 0 ? (
                    proyectos
                      .filter(proyecto => 
                        proyecto.Titulo.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((proyecto) => (
                      <div 
                        key={proyecto.ID} 
                        className={`select-project-modal__project-item ${
                          selectedProject === proyecto.ID.toString() ? 'selected' : ''
                        }`}
                        onClick={() => setSelectedProject(proyecto.ID.toString())}
                      >
                        <input 
                          type="radio" 
                          name="project" 
                          value={proyecto.ID.toString()}
                          checked={selectedProject === proyecto.ID.toString()}
                          onChange={() => setSelectedProject(proyecto.ID.toString())}
                        />
                        <div className="select-project-modal__project-info">
                          <h4>{proyecto.Titulo}</h4>
                          <p className="select-project-modal__project-description">
                            {proyecto.Descripcion}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : proyectos.length > 0 ? (
                    <div className="select-project-modal__no-projects">
                      No se encontraron proyectos que coincidan con "{searchTerm}".
                    </div>
                  ) : (
                    <div className="select-project-modal__no-projects">
                      Aún no tienes proyectos guardados.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="select-project-modal__footer">
          <button 
            className="select-project-modal__button select-project-modal__button--cancel" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          {mode === 'unlink' ? (
            <button 
              className="select-project-modal__button select-project-modal__button--unlink" 
              onClick={handleUnlinkPostulacion}
              disabled={!postulacionActual || loading || isSubmitting}
            >
              {isSubmitting ? 'Desvinculando...' : 'Desvincular Postulación'}
            </button>
          ) : (
            <button 
              className="select-project-modal__button select-project-modal__button--assign" 
              onClick={handleCreatePostulacion}
              disabled={!selectedProject || loading || isSubmitting}
            >
              {isSubmitting ? 'Creando postulación...' : 'Crear Postulación'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectProjectModal;
