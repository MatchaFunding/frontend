import Proyecto from "../models/Proyecto";

export const CrearProyecto = async (data: Proyecto): Promise<Proyecto> => {
  try {
    const response = await fetch("https://backend.matchafunding.com/proyectos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
		    'ID':data.ID,
		    'Titulo':data.Titulo,
		    'Descripcion':data.Descripcion,
		    'DuracionEnMesesMinimo':data.DuracionEnMesesMinimo,
		    'DuracionEnMesesMaximo':data.DuracionEnMesesMaximo,
		    'Alcance':data.Alcance,
		    'Area':data.Area,
		    'Beneficiario':data.Beneficiario,
		    'Innovacion':data.Innovacion,
		    'ObjetivoEspecifico':data.ObjetivoEspecifico,
		    'ObjetivoGeneral':data.ObjetivoGeneral,
		    'Proposito':data.Proposito,
		    'ResultadoEsperado':data.ResultadoEsperado,
		    'Usuario':data.Usuario
      })
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: Proyecto[] = await response.json();
    return result[0];
  }
  catch (error) {
    throw new Error('Error al obtener los datos');
  }
}