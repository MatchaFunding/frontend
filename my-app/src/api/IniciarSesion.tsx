export async function IniciarSesion(correo, contrasena) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/iniciar-sesion`, {
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