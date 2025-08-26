////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Estructura de los datos que se muestran en la card

/*
Propongo expandir esta carta para incluir mas informacion respecto a los fondos
*/
export interface FreeSearchCard {
  title: string;
  description: string;
  topic: string;
  benefit: string;
  image?: string;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Constantes
export const DEFAULT_IMAGE = "/prueba.png";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Toma un string que representa un monto y le quita todos los puntos
export const formatAmount = (amount: string): string => {
  return amount.replace(/\./g, '');
};
// Determina si el string representa un monto económico.
export const isBenefitAmount = (benefit: string): boolean => {
  const benefitParts = benefit.split(',');
  return benefitParts.length === 2 && !isNaN(Number(benefitParts[0].replace(/\./g, '')));
};
// Analiza el string y determina si representa un monto económico, además de separar sus partes.
export const parseBenefit = (benefit: string): { isAmount: boolean; parts: string[] } => {
  const benefitParts = benefit.split(',');
  const isAmount = benefitParts.length === 2 && !isNaN(Number(benefitParts[0].replace(/\./g, '')));
  return {
    isAmount,
    parts: benefitParts
  };
};
// Devuelve una versión formateada si es plata
export const getBenefitDisplayValue = (benefit: string): string => {
  const { isAmount, parts } = parseBenefit(benefit);
  if (isAmount) {
    return `$${parts[0]} ${parts[1]}`;
  }
  return benefit;
};
// Devuelve el nombre de la clase CSS que se debe aplicar según si el beneficio es un monto económico o no
export const getBenefitClassName = (benefit: string): string => {
  const { isAmount } = parseBenefit(benefit);
  return isAmount ? "free-search-card__amount" : "free-search-card__benefit";
};
