import React from 'react';
import './free-search-card.css';
import type { FreeSearchCard as FreeSearchCardProps } from './free-search-card';



const FreeSearchCard: React.FC<FreeSearchCardProps> = ({ title, description, topic, amount, currency, image }) => {  
  return (
    <div className="free-search-card">
      <img
        src={image || "/prueba.png"}
        alt="Imagen de la card"
        className="free-search-card__image"
      />
      <div className="free-search-card__content">
        <h2 className="free-search-card__title">{title}</h2>
        <p className="free-search-card__description">{description}</p>
        <span className="free-search-card__topic">{topic} </span>
        <span className="free-search-card__amount">${amount} {currency}</span>
        <button className="free-search-card__button">Ver más</button>
      </div>
    </div>
  );
};

export default FreeSearchCard;
