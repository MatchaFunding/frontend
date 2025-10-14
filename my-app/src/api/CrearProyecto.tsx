// En tu archivo /api/CrearProyecto.ts

import Proyecto from "../models/Proyecto"; // Asegúrate de que la ruta del modelo sea correcta

export const CrearProyectoAsync = async (proyecto: Proyecto): Promise<Proyecto> => {
  try {
    const response = await fetch("https://backend.matchafunding.com/crearproyecto/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proyecto)
    });

    // Aunque la petición se envíe, el backend puede responder con un error (ej: validación)
    if (!response.ok) {
      // Intentamos obtener un mensaje de error más claro del cuerpo de la respuesta
      const errorBody = await response.json().catch(() => null); // Si el cuerpo no es JSON, no rompemos
      const errorMessage = errorBody?.message || errorBody?.detail || `Error del servidor: ${response.status} ${response.statusText}`;
      console.error("Error en la respuesta del backend:", errorMessage);
      throw new Error(errorMessage);
    }

    // Si la respuesta fue exitosa (ej: 201 Created), procesamos el cuerpo
    const dataCreada = await response.json();

    // Verificación CRÍTICA: ¿El backend realmente devolvió un objeto con ID?
    if (!dataCreada || typeof dataCreada.ID !== 'number') {
        console.error("Respuesta exitosa del backend, pero el formato es inesperado:", dataCreada);
        throw new Error("El backend no devolvió un proyecto válido con un ID numérico.");
    }
    
    console.log("Datos recibidos del backend tras crear proyecto:", dataCreada);
    
    // Devolvemos una nueva instancia del modelo para asegurar que el tipo es correcto
    return new Proyecto(dataCreada);

  } catch (error) {
    // Este catch captura errores de red (ej: no hay conexión) o los errores que lanzamos arriba
    console.error("Falló la llamada a CrearProyectoAsync:", error);
    // Re-lanzamos el error para que el componente que llama (NuevoProyecto) pueda manejarlo en su propio catch
    throw error;
  }
};