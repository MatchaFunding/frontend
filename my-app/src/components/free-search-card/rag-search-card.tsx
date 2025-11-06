import React from 'react';
import { useNavigate } from 'react-router-dom';
import './free-search-card.css';

interface RagSearchCardProps {
  id?: number;
  title?: string;
  description?: string;
  topic?: string;
  benefit?: string;
  image?: string;
  fechaApertura?: string;
  fechaCierre?: string;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop';

const getBenefitDisplayValue = (benefit: string): string => {
  const benefitMap: Record<string, string> = {
    'Reembolsable': '💰 Reembolsable',
    'No Reembolsable': '🎁 No Reembolsable',
    'Mixto': '🔄 Mixto',
  };
  return benefitMap[benefit] || benefit;
};

const getBenefitClassName = (benefit: string): string => {
  const classMap: Record<string, string> = {
    'Reembolsable': 'free-search-card__benefit--reembolsable',
    'No Reembolsable': 'free-search-card__benefit--no-reembolsable',
    'Mixto': 'free-search-card__benefit--mixto',
  };
  return `free-search-card__benefit ${classMap[benefit] || ''}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const RagSearchCard: React.FC<RagSearchCardProps> = ({ 
  id,
  title, 
  description, 
  topic, 
  benefit, 
  image, 
  fechaApertura, 
  fechaCierre 
}) => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    // Navegar al chat con el ID del fondo
    if (id) {
      navigate(`/premium/rag/${id}`);
    } else {
      console.error('No se puede navegar al chat: falta el ID del fondo');
    }
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
            </div>
            {renderBenefit(benefit || 'Beneficio no disponible')}
          </div>
          <button 
            className="free-search-card__button"
            onClick={handleChatClick}
          >
            Chatear con este Fondo
          </button>
        </div>
      </div>
    </div>
  );
};

export default RagSearchCard;
