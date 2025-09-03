import React from 'react';
import './free-search-card.css';
import type { FreeSearchCard as FreeSearchCardProps } from './free-search-card';
import {
  DEFAULT_IMAGE,
  getBenefitDisplayValue,
  getBenefitClassName,
  formatDate
} from './free-search-card';

const FreeSearchCard: React.FC<FreeSearchCardProps> = ({ title, description, topic, benefit, image, fechaApertura, fechaCierre, EnlaceDelDetalle }) => {
  const renderBenefit = (benefit: string) => {
    return (
      <span className={getBenefitClassName(benefit)}>
        {getBenefitDisplayValue(benefit)}
      </span>
    );
  };

  const renderDates = () => {
    if (!fechaApertura && !fechaCierre) return null;
    
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

  const handleVerMasDetalles = () => {
    if (EnlaceDelDetalle) {
      window.open(EnlaceDelDetalle, '_blank', 'noopener,noreferrer');
    }
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
            <span className="free-search-card__topic">{topic || 'General'}</span>
            {renderBenefit(benefit || 'Beneficio no disponible')}
          </div>
          <button 
            className="free-search-card__button"
            onClick={handleVerMasDetalles}
            disabled={!EnlaceDelDetalle}
            style={{
              cursor: EnlaceDelDetalle ? 'pointer' : 'not-allowed',
              opacity: EnlaceDelDetalle ? 1 : 0.6
            }}
            type="button"
          >
            Ver más detalles
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeSearchCard;
