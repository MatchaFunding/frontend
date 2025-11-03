import React from 'react';
import axios from 'axios';

// Instancia global para acceso desde componentes externos
let globalActionProviderInstance = null;

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage, ...args) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.isProcessing = false; // Flag para rastrear si hay una consulta en progreso
    
    // Solo guardar instancia global SI tiene funciones válidas
    // (React Strict Mode puede llamar al constructor múltiples veces con undefined)
    if (typeof setStateFunc === 'function' && typeof createChatBotMessage === 'function') {
      globalActionProviderInstance = this;
    }
  }

  /**
   * Deshabilita el input y botón de envío
   */
  disableInput() {
    const chatInput = document.querySelector('.react-chatbot-kit-chat-input');
    const sendButton = document.querySelector('.react-chatbot-kit-chat-btn-send');
    const suggestedButtons = document.querySelectorAll('.suggestion-button');
    
    if (chatInput) {
      chatInput.disabled = true;
      chatInput.placeholder = 'Esperando respuesta...';
    }
    if (sendButton) {
      sendButton.disabled = true;
    }
    // Deshabilitar botones de preguntas sugeridas
    suggestedButtons.forEach(button => {
      button.disabled = true;
      button.style.cursor = 'not-allowed';
      button.style.opacity = '0.5';
    });
  }

  /**
   * Habilita el input y botón de envío
   * Respeta la validación de mensajes vacíos
   */
  enableInput() {
    const chatInput = document.querySelector('.react-chatbot-kit-chat-input');
    const sendButton = document.querySelector('.react-chatbot-kit-chat-btn-send');
    const suggestedButtons = document.querySelectorAll('.suggestion-button');
    
    if (chatInput) {
      chatInput.disabled = false;
      chatInput.placeholder = 'Escribe tu pregunta aquí...';
    }
    if (sendButton) {
      // Solo habilitar el botón si el input tiene contenido
      // Esto respeta la validación de mensajes vacíos
      const hasContent = chatInput && chatInput.value.trim().length > 0;
      sendButton.disabled = !hasContent;
    }
    // Habilitar botones de preguntas sugeridas
    suggestedButtons.forEach(button => {
      button.disabled = false;
      button.style.cursor = 'pointer';
      button.style.opacity = '1';
    });
  }

  /**
   * Maneja las consultas del usuario enviándolas a la API RAG externa
   * 
   * IMPORTANTE: CONFIGURACIÓN DE CORS
   * ================================
   * Para que esta implementación funcione correctamente, la API RAG externa DEBE tener
   * CORS (Cross-Origin Resource Sharing) habilitado para permitir peticiones desde el
   * dominio del frontend (ej: localhost:3000 en desarrollo, o tu dominio en producción).
   * 
   * En el backend de tu compañero, debe incluir headers como:
   * - Access-Control-Allow-Origin: http://localhost:3000 (o *)
   * - Access-Control-Allow-Methods: POST, GET, OPTIONS
   * - Access-Control-Allow-Headers: Content-Type
   * 
   * Si están usando FastAPI, pueden usar:
   * from fastapi.middleware.cors import CORSMiddleware
   * 
   * Si usan Flask:
   * from flask_cors import CORS
   * 
   * @param {string} userMessage - El mensaje/pregunta del usuario
   */
  async handleUserQuery(userMessage) {
    // Verificar si ya hay una consulta en proceso
    if (this.isProcessing) {
      console.log('⚠️ Ya hay una consulta en proceso. Ignorando nueva solicitud.');
      return;
    }

    // Marcar como procesando y deshabilitar input
    this.isProcessing = true;
    this.disableInput();

    // Mostrar mensaje de "pensando..." mientras se procesa
    const thinkingMessage = this.createChatBotMessage(
      <div className="chatbot-loader">
        <span></span>
        <span></span>
        <span></span>
      </div>
    );

    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, thinkingMessage],
    }));

    try {
      // URL de la API RAG externa - CAMBIAR ESTA URL POR LA REAL
      const API_URL = 'http://localhost:8000/api/rag/query'; // Ejemplo: Ajusta según la API de tu compañero
      
      // Realizar la petición POST a la API RAG
      const response = await axios.post(
        API_URL,
        {
          query: userMessage,
          // Puedes agregar parámetros adicionales según la API:
          // fondo_id: fondoId, // Si necesitas especificar el fondo
          // max_results: 5,    // Número máximo de resultados
          // context: true,     // Si quieres contexto adicional
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          // Timeout de 30 segundos
          timeout: 30000,
        }
      );

      // Extraer la respuesta de la API
      // AJUSTAR según la estructura de respuesta de tu API
      const botResponse = response.data.answer || response.data.response || 'No pude obtener una respuesta.';

      // Crear mensaje del bot con la respuesta
      const message = this.createChatBotMessage(botResponse);

      // Actualizar el estado eliminando el mensaje de "pensando..." y agregando la respuesta real
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages.slice(0, -1), message],
      }));

    } catch (error) {
      console.error('Error al consultar la API RAG:', error);

      let errorMessage = 'Lo siento, hubo un error al procesar tu consulta.';

      // Mensajes de error más específicos
      if (error.code === 'ECONNABORTED') {
        errorMessage = '⏱️ La consulta tardó demasiado tiempo. Por favor, intenta de nuevo.';
      } else if (error.response) {
        // El servidor respondió con un código de error
        errorMessage = `❌ Error del servidor: ${error.response.status}. ${error.response.data?.message || 'Por favor, intenta más tarde.'}`;
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        errorMessage = '🔌 No se pudo conectar con el servidor. Verifica que la API RAG esté activa y que CORS esté habilitado.';
      }

      const message = this.createChatBotMessage(errorMessage);

      // Actualizar el estado eliminando el mensaje de "pensando..." y agregando el error
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages.slice(0, -1), message],
      }));
    } finally {
      // Siempre reactivar el input al finalizar (éxito o error)
      this.isProcessing = false;
      this.enableInput();
    }
  }

  /**
   * Maneja los clics en las preguntas sugeridas
   * 
   * Esta función:
   * 1. Crea un mensaje del cliente con la pregunta sugerida
   * 2. Lo añade al chat para que aparezca como si el usuario lo hubiera escrito
   * 3. Llama a handleUserQuery para obtener la respuesta de la API
   * 
   * @param {string} question - La pregunta sugerida que se hizo clic
   */
  handleSuggestedClick(question) {
    // Verificar si ya hay una consulta en proceso
    if (this.isProcessing) {
      console.log('⚠️ Ya hay una consulta en proceso. Pregunta sugerida bloqueada.');
      return;
    }

    // Crear un mensaje del usuario manualmente
    const userMessage = {
      type: 'user',
      message: question,
      id: Date.now(),
    };

    // Añadir el mensaje al estado del chat
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    // Procesar la consulta como si el usuario la hubiera escrito
    this.handleUserQuery(question);
  }
}

// Exportar función helper para acceder a la instancia global
export const getActionProviderInstance = () => globalActionProviderInstance;

export default ActionProvider;
