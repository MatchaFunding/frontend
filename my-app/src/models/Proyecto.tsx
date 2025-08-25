class Proyecto {
    ID: number;
    Beneficiario: number;
    Titulo: string;
    Descripcion: string;
    DuracionEnMesesMinimo: number;
    DuracionEnMesesMaximo: number;
    Alcance: string;
    Area: string;
    constructor(json: any) {
        this.ID = json.ID;
        this.Beneficiario = json.Beneficiario;
        this.Titulo = json.Titulo;
        this.Descripcion = json.Descripcion;
        this.DuracionEnMesesMinimo = json.DuracionEnMesesMinimo;
        this.DuracionEnMesesMaximo = json.DuracionEnMesesMaximo;
        this.Alcance = json.Alcance;
        this.Area = json.Area;
    }
}
export default Proyecto;