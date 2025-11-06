import React, { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import NavBar from '../../components/NavBar/navbar';
import SuggestedQuestions from '../../components/chatbot/SuggestedQuestions';
import VerTodosLosInstrumentos from '../../api/VerTodosLosInstrumentos.tsx';
// @ts-ignore
import config from '../../components/chatbot/config.jsx';
// @ts-ignore
import MessageParser from '../../components/chatbot/MessageParser.jsx';
// @ts-ignore
import ActionProvider from '../../components/chatbot/ActionProvider.jsx';
// @ts-ignore
import { getActionProviderInstance } from '../../components/chatbot/ActionProvider.jsx';
import './RagChat.css';

const RagChat: React.FC = () => {
  const { idFondo } = useParams<{ idFondo: string }>();
  const instrumentos = VerTodosLosInstrumentos();

  // Buscar el nombre del fondo por ID
  const nombreFondo = useMemo(() => {
    if (!idFondo || !instrumentos || instrumentos.length === 0) {
      return null;
    }
    const fondoId = parseInt(idFondo, 10);
    const fondo = instrumentos.find((inst) => inst.ID === fondoId);
    return fondo ? fondo.Titulo : null;
  }, [idFondo, instrumentos]);

  // Efecto para controlar el botón de envío
  React.useEffect(() => {
    const setupInputValidation = () => {
      const chatInput = document.querySelector('.react-chatbot-kit-chat-input') as HTMLInputElement;
      const sendButton = document.querySelector('.react-chatbot-kit-chat-btn-send') as HTMLButtonElement;
      
      if (!chatInput || !sendButton) {
        setTimeout(setupInputValidation, 100);
        return;
      }
      const updateButtonState = () => {
        const isEmpty = !chatInput.value.trim();
        sendButton.disabled = isEmpty;
      };
      updateButtonState();

      chatInput.addEventListener('input', updateButtonState);
      chatInput.addEventListener('keyup', updateButtonState);

      return () => {
        chatInput.removeEventListener('input', updateButtonState);
        chatInput.removeEventListener('keyup', updateButtonState);
      };
    };

    const cleanup = setupInputValidation();
    return cleanup;
  }, []);

  const handleSuggestedQuestionClick = useCallback((question: string) => {
    const provider = getActionProviderInstance();
    if (!provider) {
      console.error('ActionProvider no está disponible');
      alert('El chat aún se está inicializando. Por favor, espera un momento e intenta de nuevo.');
      return;
    }
    if (typeof provider.handleSuggestedClick !== 'function') {
      console.error('handleSuggestedClick no está disponible');
      return;
    }
    
    provider.handleSuggestedClick(question);
  }, []);

  return (
    <div className="rag-chat-container">
      <NavBar />

      <div className="rag-chat-content">
        <div className="rag-chat-wrapper">
          {/* Columna Izquierda - Chat */}
          <div className="chat-column">
            <div className="chat-header">
              <h1>
                <FontAwesomeIcon icon={faComments} style={{ marginRight: '0.5rem' }} />
                Chat con Documentos
              </h1>
              <p>
                {nombreFondo 
                  ? `Consultando sobre: ${nombreFondo}`
                  : idFondo
                  ? `Cargando información del fondo...`
                  : 'Pregunta sobre los fondos de financiamiento'
                }
              </p>
            </div>

            <div className="chatbot-container">
              <Chatbot
                config={config}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
                headerText="Matchito - Asistente de Documentos"
                placeholderText="Escribe tu pregunta aquí..."
              />
            </div>
          </div>

          {/* Columna Derecha - Sugerencias */}
          <div className="suggestions-column">
            <SuggestedQuestions onQuestionClick={handleSuggestedQuestionClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RagChat;
