class Instrumento {
    ID: number;
    Titulo: string;
    Financiador: number;
    Alcance: string;
    Descripcion: string;
    FechaDeApertura: string;
    FechaDeCierre: string;
    DuracionEnMeses: number;
    Beneficios: string;
    Requisitos: string;
    MontoMinimo: number;
    MontoMaximo: number;
    Estado: string;
    TipoDeBeneficio: string;
    TipoDePerfil: string;
    EnlaceDelDetalle: string;
    EnlaceDeLaFoto: string;
    constructor(json: any) {
        this.ID = json.ID;
        this.Titulo = json.Titulo;
        this.Financiador = json.Financiador;
        this.Alcance = json.Alcance;
        this.Descripcion = json.Descripcion;
        this.FechaDeApertura = json.FechaDeApertura;
        this.FechaDeCierre = json.FechaDeCierre;
        this.DuracionEnMeses = json.DuracionEnMeses;
        this.Beneficios = json.Beneficios;
        this.Requisitos = json.Requisitos;
        this.MontoMinimo = json.MontoMinimo;
        this.MontoMaximo = json.MontoMaximo;
        this.Estado = json.Estado;
        this.TipoDeBeneficio = json.TipoDeBeneficio;
        this.TipoDePerfil = json.TipoDePerfil;
        this.EnlaceDelDetalle = json.EnlaceDelDetalle;
        this.EnlaceDeLaFoto = json.EnlaceDeLaFoto;
    }
}
export default Instrumento;