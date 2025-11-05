export async function IniciarSesion(correo: string, contrasena: string) {
  try {
    const response = await fetch(`https://backend.matchafunding.com/iniciar-sesion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        "NombreDeUsuario":correo,
        "Contrasena":contrasena,
        "Correo":correo
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result = await response.json();
    return result;
  }
  catch (error) {
    throw new Error('Error al obtener los datos');
  }
}