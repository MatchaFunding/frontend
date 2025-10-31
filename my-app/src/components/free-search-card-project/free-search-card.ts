////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Estructura de los datos que se muestran en la card de proyectos

export interface FreeSearchCardProject {
  id?: number; // ID del proyecto
  title?: string; // Título del proyecto
  description?: string; // Descripción del proyecto
  area?: string; // Área del proyecto
  alcance?: string; // Alcance del proyecto
  duracionMinima?: number; // Duración en meses mínima
  duracionMaxima?: number; // Duración en meses máxima
  beneficiarioId?: number; // ID del beneficiario
  image?: string; // Imagen del proyecto
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Constantes
export const DEFAULT_IMAGE = "/sin-foto.png";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Función para formatear la duración del proyecto
export const formatDuracion = (min?: number, max?: number): string => {
  if (!min && !max) return 'No especificada';
  if (min && max && min === max) return `${min} meses`;
  if (min && max) return `${min} - ${max} meses`;
  if (min) return `Desde ${min} meses`;
  if (max) return `Hasta ${max} meses`;
  return 'No especificada';
};
