import React from 'react';
import NavBar from '../../components/NavBar/navbar';
import { useNavigate } from 'react-router-dom';
import './Generate-idea.css';

const SelectIdea: React.FC = () => {
  const navigate = useNavigate();
    
  return (
    <div className="generate-idea-container">
      <NavBar />

      <main className="generate-idea-main">
      
        <div className="generate-idea-grid">

          <div className="idea-card">
            <div className="idea-card__content">
              <img src="/ideamatchito.png" alt="Ilustración de taza de té" className="idea-card__icon" />
              <h2 className="idea-card__title">
                ¿Tienes una idea?
              </h2>
              <p className="idea-card__description">
                Aquí te ayudamos a convertir esa idea suelta en algo concreto. Inspírate, estructura y comienza a darle forma a tu proyecto desde cero.
              </p>
            </div>
            <button
              className="idea-card__button"
              onClick={() => navigate("/Matcha/New-idea")}
            >
              Generar Idea
            </button>
          </div>

          <div className="idea-card">
            <div className="idea-card__content">
              <img src="/Tevolador.png" alt="Ilustración de taza de té" className="idea-card__icon" />
              <h2 className="idea-card__title">
                Construye tu proyecto
              </h2>
              <p className="idea-card__description">
               Te guiamos paso a paso para desarrollar una postulación robusta y bien alineada con los criterios de evaluación de los fondos públicos o privados.
              </p>
            </div>
            <button
              className="idea-card__button"
              onClick={() => navigate("/Matcha/Nuevo-proyecto")}
            >
              Generar Proyecto
            </button>
          </div>

          <div className="idea-card">
            <div className="idea-card__content">
              <img src="/Matchitograduado.png" alt="Ilustración de taza de té" className="idea-card__icon" />
              <h2 className="idea-card__title">
                Compara tu proyecto
              </h2>
              <p className="idea-card__description">
                Revisa cómo se alinea tu idea o proyecto con iniciativas previas exitosas y aprende de ellas para fortalecer tu postulación.
              </p>
            </div>
            <button
              className="idea-card__button"
              onClick={() => navigate("/Matcha/My-projects")}
            >
              Generar Match histórico
            </button>
          </div>

          <div className="idea-card">
            <div className="idea-card__content">
              <img src="/matchachoro.png" alt="Ilustración de taza de té" className="idea-card__icon" />
              <h2 className="idea-card__title">
                Encuentra tu fondo ideal
              </h2>
              <p className="idea-card__description">
                Compara tu idea o proyecto con las múltiples oportunidades de financiamiento disponibles.
              </p>
            </div>
            <button
              className="idea-card__button"
              onClick={() => navigate("/Matcha/Select-Project")}
            >
              Hacer Match
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default SelectIdea;