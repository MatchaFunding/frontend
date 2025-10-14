// En un archivo como: src/api/VerFondosIA.ts

export async function VerFondosIAAsync() {
  try {
    // Usamos el endpoint /api/v1/funds/all como solicitaste
    const response = await fetch(`https://ai.matchafunding.com/api/v1/funds/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Verificamos si la respuesta de la red fue exitosa
    if (!response.ok) {
      // Si no fue exitosa, lanzamos un error para que sea capturado por el bloque catch
      throw new Error('Error al obtener los datos de los fondos');
    }

    // Convertimos la respuesta a formato JSON
    const data = await response.json();
    
    // Devolvemos los datos obtenidos
    return data;
  }
  catch (error) {
    // Si ocurre cualquier error durante el proceso, lo mostramos en la consola
    console.error('Error en VerFondosIAAsync:', error);
    
    // Devolvemos un objeto con una propiedad 'funds' como un array vacío.
    // Esto es más seguro para tu componente, ya que evitará un error si intentas acceder a .funds
    // en un resultado vacío (por ejemplo, `undefined.funds`).
    return { funds: [] };
  }
}