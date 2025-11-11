import React from 'react';
import { sendRagQuestion } from '../../api/RagChat';

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
   * Maneja las consultas del usuario enviándolas a la API RAG
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
      // Obtener el ID del fondo desde la URL
      const pathParts = window.location.pathname.split('/');
      const fondoIdStr = pathParts[pathParts.length - 1];
      const fondoId = parseInt(fondoIdStr, 10);

      console.log('🔍 Extrayendo ID del fondo:', {
        url: window.location.pathname,
        pathParts,
        fondoIdStr,
        fondoId,
        isValid: !isNaN(fondoId)
      });

      // Validar que tenemos un ID válido
      if (!fondoId || isNaN(fondoId)) {
        throw new Error('No se pudo obtener el ID del fondo desde la URL');
      }

      // Llamar a la API RAG con el ID del fondo
      const response = await sendRagQuestion(userMessage, fondoId);

      // Extraer la respuesta de la API
      const botResponse = response.answer || 'No pude obtener una respuesta.';

      // Extraer fuentes únicas de los PDFs
      let sourcesComponent = null;
      if (response.sources && Array.isArray(response.sources) && response.sources.length > 0) {
        // Extraer nombres únicos de archivos PDF
        const uniqueSources = [...new Set(
          response.sources
            .map(source => {
              if (source.source) {
                // Extraer el nombre del archivo desde la ruta
                const pathParts = source.source.split('/');
                const fileName = pathParts[pathParts.length - 1];
                return fileName;
              }
              return null;
            })
            .filter(Boolean) // Eliminar valores nulos
        )];

        if (uniqueSources.length > 0) {
          sourcesComponent = (
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '400', color: '#e5e7eb' }}>Fuentes:</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {uniqueSources.map((source, index) => (
                  <div key={index} style={{ 
                    fontSize: '13px', 
                    color: '#e5e7eb',
                    fontWeight: '800',
                    borderRadius: '4px',
                    display: 'inline-block',
                    maxWidth: 'fit-content'
                  }}>
                    {source}
                  </div>
                ))}
              </div>
            </div>
          );
        }
      }

      // Crear mensaje del bot con la respuesta y las fuentes
      const messageContent = (
        <div>
          <div>{botResponse}</div>
          {sourcesComponent}
        </div>
      );
      const message = this.createChatBotMessage(messageContent);

      // Actualizar el estado eliminando el mensaje de "pensando..." y agregando la respuesta real
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages.slice(0, -1), message],
      }));

    } catch (error) {
      console.error('Error al consultar la API RAG:', error);

      let errorMessage = 'Lo siento, hubo un error al procesar tu consulta.';

      // Mensajes de error más específicos
      if (error.message?.includes('NetworkError') || error.message?.includes('Failed to fetch')) {
        errorMessage = '🔌 No se pudo conectar con el servidor RAG (rag.matchafunding.com). Verifica que esté activo.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = '⏱️ La consulta tardó demasiado tiempo. Por favor, intenta de nuevo.';
      } else if (error.message?.includes('CORS')) {
        errorMessage = '🚫 Error de CORS. Contacta al administrador del sistema.';
      } else if (error.message?.includes('ID del fondo')) {
        errorMessage = '❌ Error: No se pudo identificar el fondo. Por favor, regresa y selecciona un fondo válido.';
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
