class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    // Procesar el mensaje del usuario
    const lowerCaseMessage = message.toLowerCase();

    // Llamar al action provider para manejar el mensaje
    this.actionProvider.handleUserQuery(message);
  }
}

export default MessageParser;
