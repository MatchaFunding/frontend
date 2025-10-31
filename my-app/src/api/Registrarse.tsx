export async function Registrarse(formulario, nombre, contrasena, correo) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/registrarse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(
        {
          "Persona": {
              "Nombre":formulario.Nombre,
              "Sexo":formulario.Sexo,
              "RUT":formulario.RUT,
              "FechaDeNacimiento":formulario.FechaDeNacimiento
          },
          "Usuario": {
              "NombreDeUsuario":nombre,
              "Contrasena":contrasena,
              "Correo":correo
          },
          "Beneficiario": {
              "Nombre":formulario.NombreCompania,
              "FechaDeCreacion":formulario.CreacionCompania,
              "RegionDeCreacion":formulario.RegionCompania,
              "Direccion":formulario.DireccionCompania,
              "TipoDePersona":formulario.TipoPersonaCompania,
              "TipoDeEmpresa":formulario.TipoEmpresaCompania,
              "Perfil":formulario.PerfilCompania,
              "RUTdeEmpresa":formulario.RUTCompania,
              "RUTdeRepresentante":formulario.RUTRepresentanteCompania
          }
      }
      ),
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