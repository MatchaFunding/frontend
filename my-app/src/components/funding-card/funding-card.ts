export interface FundingCardProps {
  matchPercent: number;
  title: string;
  description: string;
  topic: string;
  amount: string;
  currency: string;
}

// Función para interpolar entre dos colores hexadecimales
function interpolateColor(color1: string, color2: string, factor: number): string {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substr(0, 2), 16);
  const g1 = parseInt(hex1.substr(2, 2), 16);
  const b1 = parseInt(hex1.substr(4, 2), 16);
  
  const r2 = parseInt(hex2.substr(0, 2), 16);
  const g2 = parseInt(hex2.substr(2, 2), 16);
  const b2 = parseInt(hex2.substr(4, 2), 16);
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Función para obtener el color basado en el porcentaje
export function getColorByPercentage(percentage: number): string {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  
  if (clampedPercentage <= 50) {
    const factor = clampedPercentage / 50;
    return interpolateColor('#e54040', '#ecc94b', factor);
  } else {
    const factor = (clampedPercentage - 50) / 50;
    return interpolateColor('#ecc94b', '#38a169', factor);
  }
}

// Función para obtener el color de fondo del tópico basado en el porcentaje
export function getTopicBackgroundByPercentage(percentage: number): string {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  
  if (clampedPercentage <= 50) {
    const factor = clampedPercentage / 50;
    return interpolateColor('#fde8e8', '#fef9e7', factor);
  } else {
    const factor = (clampedPercentage - 50) / 50;
    return interpolateColor('#fef9e7', '#ecf6f0', factor);
  }
}
