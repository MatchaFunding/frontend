class Persona {
    ID: number;
    Nombre: string;
    Sexo: string;
    RUT: string;
    FechaDeNacimiento: string;
    constructor(json: any) {
        this.ID = json.ID;
        this.Nombre = json.Nombre;
        this.Sexo = json.Sexo;
        this.RUT = json.RUT;
        this.FechaDeNacimiento = json.FechaDeNacimiento;
    }
}
export default Persona;