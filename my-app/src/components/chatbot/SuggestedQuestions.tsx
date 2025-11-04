import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarDays, 
  faFileLines, 
  faUsers, 
  faSackDollar, 
  faChartColumn, 
  faClock,
  faLightbulb,
  faRobot
} from '@fortawesome/free-solid-svg-icons';

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onQuestionClick }) => {
  const questions = [
    {
      id: 1,
      text: "¿Cuáles son los plazos de postulación?",
      icon: faCalendarDays
    },
    {
      id: 2,
      text: "¿Qué documentos necesito para postular?",
      icon: faFileLines
    },
    {
      id: 3,
      text: "¿Quiénes pueden postular a este fondo?",
      icon: faUsers
    },
    {
      id: 4,
      text: "¿Cuál es el monto máximo de financiamiento?",
      icon: faSackDollar
    },
    {
      id: 5,
      text: "¿Qué criterios de evaluación se utilizan?",
      icon: faChartColumn
    },
    {
      id: 6,
      text: "¿Cuánto tiempo tarda el proceso de evaluación?",
      icon: faClock
    }
  ];

  return (
    <>
      {/* Card de Preguntas Sugeridas */}
      <div className="suggestions-card">
        <h2>
          <FontAwesomeIcon icon={faLightbulb} style={{ marginRight: '0.5rem' }} />
          Preguntas Frecuentes
        </h2>
        <div className="suggestions-list">
          {questions.map((question) => (
            <button
              key={question.id}
              className="suggestion-button"
              onClick={() => onQuestionClick(question.text)}
            >
              <FontAwesomeIcon icon={question.icon} style={{ marginRight: '0.5rem' }} />
              {question.text}
            </button>
          ))}
        </div>
      </div>

      {/* Card de Información */}
      <div className="suggestions-card info-card">
        <h3>
          <FontAwesomeIcon icon={faRobot} style={{ marginRight: '0.5rem' }} />
          Asistente de Documentos
        </h3>
        <p>
          Este chatbot utiliza tecnología RAG (Retrieval-Augmented Generation) para
          responder tus preguntas basándose en la documentación oficial del fondo.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          <strong>Tip:</strong> Haz preguntas específicas para obtener respuestas más precisas.
        </p>
      </div>
    </>
  );
};

export default SuggestedQuestions;
