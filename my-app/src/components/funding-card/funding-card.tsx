import React from 'react';
import './funding-card.css';
import type { FundingCardProps } from './funding-card';
import { getColorByPercentage, getTopicBackgroundByPercentage } from './funding-card';


const FundingCard: React.FC<FundingCardProps> = ({ matchPercent, title, description, topic, amount, currency }) => {
  const dynamicColor = getColorByPercentage(matchPercent);
  const dynamicTopicBackground = getTopicBackgroundByPercentage(matchPercent);
  
  return (
    <div className="funding-card">
      <div className="funding-card__percent-col">
        <span 
          className="funding-card__percent"
          style={{ color: dynamicColor }}
        >
          {matchPercent}%
        </span>
        <span 
          className="funding-card__compat"
          style={{ color: dynamicColor }}
        >
          de compatibilidad
        </span>
      </div>
      <h2 className="funding-card__title">{title}</h2>
      <p className="funding-card__description">{description}</p>
      <span 
        className="funding-card__topic"
        style={{ 
          color: dynamicColor,
          backgroundColor: dynamicTopicBackground 
        }}
      >
        {topic}
      </span>
      <span className="funding-card__amount">${amount} {currency}</span>
      <button className="funding-card__button">Ver más</button>
    </div>
  );
};

export default FundingCard;
