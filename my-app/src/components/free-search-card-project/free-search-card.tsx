import React from 'react';
import './free-search-card.css';
import type { FreeSearchCardProject as FreeSearchCardProjectProps } from './free-search-card';
import {
  DEFAULT_IMAGE,
  formatDuracion
} from './free-search-card';

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
    <div className="free-search-card">
      <div className="free-search-card__image-container">
        <img src={image || DEFAULT_IMAGE} alt="Imagen del proyecto" className="free-search-card__image"/>
      </div>
      <div className="free-search-card__content">
        <h2 className="free-search-card__title">{title || 'Título no disponible'}</h2>
        <p className="free-search-card__description">{description || 'Descripción no disponible'}</p>
        
        {/* Información de duración */}
        {(duracionMinima || duracionMaxima) && (
          <div className="free-search-card__dates">
            <div className="free-search-card__date">
              <span className="free-search-card__date-label">Duración:</span>
              <span className="free-search-card__date-value">{formatDuracion(duracionMinima, duracionMaxima)}</span>
            </div>
          </div>
        )}

        <div className="free-search-card__bottom-section">
          <div className="free-search-card__metadata">
            <div className="free-search-card__topic-bookmark">
              <span className="free-search-card__topic">{area || 'General'}</span>
            </div>
            <span className="free-search-card__benefit">{alcance || 'Alcance no especificado'}</span>
          </div>
          <button className="free-search-card__button">Ver detalles</button>
        </div>
      </div>
    </div>
  );
};

export default FreeSearchCardProject;
