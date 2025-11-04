import { createChatBotMessage } from 'react-chatbot-kit';

const config = {
  initialMessages: [
    createChatBotMessage(
      `¡Hola! Soy tu asistente RAG especializado en fondos de financiamiento. 
      
Puedo ayudarte a entender mejor los requisitos, plazos, documentación y todo lo relacionado con este fondo.

¿En qué puedo ayudarte hoy?`
    )
  ],
  botName: 'Matchito',
  customStyles: {
    botMessageBox: {
      backgroundColor: '#44624a',
    },
    chatButton: {
      backgroundColor: '#44624a',
    },
    botAvatar: {
      backgroundColor: '#44624a',
      borderRadius: '50%',
    },
  },
  // Personalizar letra del avatar
  botAvatarLetter: 'M',
  customComponents: {
    // Aquí puedes agregar componentes personalizados si lo necesitas
  },
};

export default config;
