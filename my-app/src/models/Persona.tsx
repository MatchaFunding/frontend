class Persona {
    ID: number;
    Nombre: string;
    Sexo: string;
    RUT: string;
    constructor(json: any) {
        this.ID = json.ID;
        this.Nombre = json.Nombre;
        this.Sexo = json.Sexo;
        this.RUT = json.RUT;
    }
}
export default Persona;