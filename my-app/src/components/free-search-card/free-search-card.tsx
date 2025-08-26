import React from 'react';
import './free-search-card.css';
import type { FreeSearchCard as FreeSearchCardProps } from './free-search-card';
import {
  DEFAULT_IMAGE,
  getBenefitDisplayValue,
  getBenefitClassName
} from './free-search-card';

const FreeSearchCard: React.FC<FreeSearchCardProps> = ({ title, description, topic, benefit, image }) => {
  const renderBenefit = (benefit: string) => {
    return (
      <span className={getBenefitClassName(benefit)}>
        {getBenefitDisplayValue(benefit)}
      </span>
    );
  };

  return (
    <div className="free-search-card">
      <img src={image || DEFAULT_IMAGE}alt="Imagen de la card"className="free-search-card__image"/>
      <div className="free-search-card__content">
        <h2 className="free-search-card__title">{title}</h2>
        <p className="free-search-card__description">{description}</p>
        <div className="free-search-card__bottom-section">
          <span className="free-search-card__topic">{topic}</span>
          {renderBenefit(benefit)}
          <button className="free-search-card__button">Ver más</button>
        </div>
      </div>
    </div>
  );
};

export default FreeSearchCard;
