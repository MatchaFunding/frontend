import React from 'react';
import NavBar from '../../components/NavBar/navbar';
import { useNavigate } from 'react-router-dom';
import './Premium-options.css';

const PremiumOptions: React.FC = () => {
  const navigate = useNavigate();
    
  return (
    <div className="premium-options-container">
      <NavBar />

      <main className="premium-options-main">
        <div className="premium-options-grid">

          <div className="premium-card">
            <div className="premium-card__content">
              <img src="/fine-tuning-icon.png" alt="Fine Tuning Premium" className="premium-card__icon" />
              <h2 className="premium-card__title">
                Asistente Experto 
              </h2>
              <p className="premium-card__description">
                Utiliza nuestra IA entrenada para formular proyectos robustos para acceder al financiamiento.
              </p>
            </div>
            <button
              className="premium-card__button"
              onClick={() => navigate("/premium/fine-tuning")}
            >
              Acceder Fine Tuning
            </button>
          </div>

          <div className="premium-card">
            <div className="premium-card__content">
              <img src="/rag-icon.png" alt="RAG Premium" className="premium-card__icon" />
              <h2 className="premium-card__title">
                Chatea con tus Documentos
              </h2>
              <p className="premium-card__description">
                Pregúntale directo al documento. Asegura tu elegibilidad y no te pierdas nada.
              </p>
            </div>
            <button
              className="premium-card__button"
              onClick={() => navigate("/premium/rag")}
            >
              Acceder RAG
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PremiumOptions;