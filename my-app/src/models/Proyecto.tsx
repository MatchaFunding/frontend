class Proyecto {
    ID: number;
    Beneficiario: number;
    Titulo: string;
    Descripcion: string;
    DuracionEnMesesMinimo: number;
    DuracionEnMesesMaximo: number;
    Alcance: string;
    Area: string;
    Innovacion?: string;
    ObjetivoEspecifico?: string;
    ObjetivoGeneral?: string;
    Proposito?: string;
    ResultadoEsperado?: string;
    Usuario?: number;
    constructor(json: any) {
        this.ID = json.ID;
        this.Beneficiario = json.Beneficiario;
        this.Titulo = json.Titulo;
        this.Descripcion = json.Descripcion;
        this.DuracionEnMesesMinimo = json.DuracionEnMesesMinimo;
        this.DuracionEnMesesMaximo = json.DuracionEnMesesMaximo;
        this.Alcance = json.Alcance;
        this.Area = json.Area;
        this.Innovacion = json.Innovacion;
        this.ObjetivoEspecifico = json.ObjetivoEspecifico;
        this.ObjetivoGeneral = json.ObjetivoGeneral;
        this.Proposito = json.Proposito;
        this.ResultadoEsperado = json.ResultadoEsperado;
        this.Usuario = json.Usuario;
    }
}
export default Proyecto;