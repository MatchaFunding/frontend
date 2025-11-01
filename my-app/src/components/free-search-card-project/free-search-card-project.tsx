import React from 'react';
import './free-search-card-project.css';
import type { FreeSearchCardProject as FreeSearchCardProjectProps } from './free-search-card-project';
import {
  DEFAULT_IMAGE,
  formatDuracion
} from './free-search-card-project';

const FreeSearchCardProject: React.FC<FreeSearchCardProjectProps> = ({ 
  title, 
  description, 
  area, 
  alcance, 
  duracionMinima, 
  duracionMaxima,
  image 
}) => {

  return (
    <div className="free-search-card free-search-card--project">
      <div className="free-search-card__image-container">
        <img src={image || DEFAULT_IMAGE} alt="Imagen del proyecto" className="free-search-card__image"/>
      </div>
      <div className="free-search-card__content">
        <h2 className="free-search-card__title">{title || 'Título no disponible'}</h2>
        <p className="free-search-card__description">{description || 'Descripción no disponible'}</p>
        
        {/* Información de duración y alcance */}
        <div className="free-search-card__dates">
          <div className="free-search-card__date">
            <span className="free-search-card__date-label">Duración:</span>
            <span className="free-search-card__date-value">{formatDuracion(duracionMinima, duracionMaxima)}</span>
          </div>
          <div className="free-search-card__date">
            <span className="free-search-card__date-label">Alcance:</span>
            <span className="free-search-card__date-value">{alcance || 'No especificado'}</span>
          </div>
          <div className="free-search-card__topic-container">
            <span className="free-search-card__topic">{area || 'General'}</span>
          </div>
        </div>

        <div className="free-search-card__bottom-section">
        </div>
      </div>
    </div>
  );
};

export default FreeSearchCardProject;
