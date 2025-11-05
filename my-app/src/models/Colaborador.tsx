class Colaborador {
    ID: number;
    Persona: number;
    Proyecto: number;
    Usuario?: number;
    constructor(json: any) {
        this.ID = json.ID;
        this.Persona = json.Persona;
        this.Proyecto = json.Proyecto;
        this.Usuario = json.Usuario;
    }
}
export default Colaborador;