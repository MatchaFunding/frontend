import React, { useState, useEffect } from 'react';
import './free-search-card.css';
import type { FreeSearchCard as FreeSearchCardProps } from './free-search-card';
import SelectProjectModal from '../select-project/select-project.tsx';
import VerificarPostulacionAsync from '../../api/VerificarPostulacion';
import {
  DEFAULT_IMAGE,
  getBenefitDisplayValue,
  getBenefitClassName,
  formatDate
} from './free-search-card';

const FreeSearchCard: React.FC<FreeSearchCardProps> = ({ id, title, description, topic, benefit, image, fechaApertura, fechaCierre, link }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasPostulacion, setHasPostulacion] = useState(false);
  const [isCheckingPostulacion, setIsCheckingPostulacion] = useState(true);

  // Mostrar por consola para que compile con Vite
  console.log(isCheckingPostulacion);

  // Verificar si existe postulación al montar el componente
  useEffect(() => {
    const VerificarPostulacion = async () => {
      const storedUser = sessionStorage.getItem("usuario");
      if (!storedUser) {
        setIsCheckingPostulacion(false);
        return;
      }
      try {
        const userData = JSON.parse(storedUser);
        const empresaId = userData?.Beneficiario?.ID;
        if (!empresaId) {
          setIsCheckingPostulacion(false);
          return;
        }
        const existe = await VerificarPostulacionAsync(empresaId, id || 0);
        setHasPostulacion(existe);
      }
      catch (error) {
        console.error('Error al verificar postulación:', error);
      }
      finally {
        setIsCheckingPostulacion(false);
      }
    };

    VerificarPostulacion();
  }, [id]);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Actualizar el estado después de crear postulación
  const handlePostulacionCreated = () => {
    setHasPostulacion(true);
    setIsModalOpen(false);
  };

  // Actualizar el estado después de eliminar postulación
  const handlePostulacionDeleted = () => {
    setHasPostulacion(false);
    setIsModalOpen(false);
  };
  const renderBenefit = (benefit: string) => {
    return (
      <span className={getBenefitClassName(benefit)}>
        {getBenefitDisplayValue(benefit)}
      </span>
    );
  };

  const renderDates = () => {
    if (!fechaApertura && !fechaCierre) 
      return null;
    return (
      <div className="free-search-card__dates">
        {fechaApertura && (
          <div className="free-search-card__date">
            <span className="free-search-card__date-label">Apertura:</span>
            <span className="free-search-card__date-value">{formatDate(fechaApertura)}</span>
          </div>
        )}
        {fechaCierre && (
          <div className="free-search-card__date">
            <span className="free-search-card__date-label">Cierre:</span>
            <span className="free-search-card__date-value">{formatDate(fechaCierre)}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="free-search-card">
      <div className="free-search-card__image-container">
        <img src={image || DEFAULT_IMAGE} alt="Imagen de la card" className="free-search-card__image"/>
      </div>
      <div className="free-search-card__content">
        <h2 className="free-search-card__title">{title || 'Título no disponible'}</h2>
        <p className="free-search-card__description">{description || 'Descripción no disponible'}</p>
        {renderDates()}
        <div className="free-search-card__bottom-section">
          <div className="free-search-card__metadata">
            <div className="free-search-card__topic-bookmark">
              <span className="free-search-card__topic">{topic || 'General'}</span>
              <div title={hasPostulacion ? "Desvincular postulación de este fondo" : "Crear postulación a este fondo"} onClick={handleBookmarkClick} style={{ cursor: 'pointer' }}>
                <img src={hasPostulacion ? "/svgs/bookmark-fill.svg" : "/svgs/bookmark-empty.svg"} alt={hasPostulacion ? "Postulación existente" : "Crear postulación"} className="free-search-card__bookmark"/>
              </div>
            </div>
            {renderBenefit(benefit || 'Beneficio no disponible')}
          </div>
          <a href={link} target="_blank" rel="noopener noreferrer">
            <button className="free-search-card__button">Ver más detalles</button>
          </a>
        </div>
      </div>
      {/* Modal para seleccionar proyecto */}
      <SelectProjectModal isOpen={isModalOpen} onClose={handleCloseModal} fondoTitle={title} instrumentoId={id} mode={hasPostulacion ? 'unlink' : 'create'} onPostulacionCreated={handlePostulacionCreated} onPostulacionDeleted={handlePostulacionDeleted} />
    </div>
  );
};

export default FreeSearchCard;
