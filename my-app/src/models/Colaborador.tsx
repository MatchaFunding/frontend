class Colaborador {
    ID: number;
    Persona: number;
    Proyecto: number;
    constructor(json: any) {
        this.ID = json.ID;
        this.Persona = json.Persona;
        this.Proyecto = json.Proyecto;
    }
}
export default Colaborador;