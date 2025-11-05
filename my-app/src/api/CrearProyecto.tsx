import Proyecto from "../models/Proyecto";

export const CrearProyecto = async (proyecto: Proyecto): Promise<Proyecto> => {
  try {
    const response = await fetch("http://127.0.0.1:8000/proyectos/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proyecto)
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => null); // Si el cuerpo no es JSON, no rompemos
      const errorMessage = errorBody?.message || errorBody?.detail || `Error del servidor: ${response.status} ${response.statusText}`;
      console.error("Error en la respuesta del backend:", errorMessage);
      throw new Error(errorMessage);
    }
    const dataCreada = await response.json();
    if (!dataCreada || typeof dataCreada.ID !== 'number') {
        console.error("Respuesta exitosa del backend, pero el formato es inesperado:", dataCreada);
        throw new Error("El backend no devolvió un proyecto válido con un ID numérico.");
    }
    console.log("Datos recibidos del backend tras crear proyecto:", dataCreada);
    return new Proyecto(dataCreada);
  }
  catch (error) {
    console.error("Falló la llamada a CrearProyecto:", error);
    throw error;
  }
};