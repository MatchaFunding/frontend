class Usuario {
    ID: number;
    Persona: number;
    NombreDeUsuario: string;
    Contrasena: string;
    Correo: string;
    constructor(json: any) {
        this.ID = json.ID;
        this.Persona = json.Persona;
        this.NombreDeUsuario = json.NombreDeUsuario;
        this.Contrasena = json.Contrasena;
        this.Correo = json.Correo;
    }
}
export default Usuario;