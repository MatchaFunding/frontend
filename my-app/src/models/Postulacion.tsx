class Postulacion {
    ID: number;
    Beneficiario: number;
    Proyecto: number;
    Instrumento: number;
    Resultado: string;
    MontoObtenido: number;
    FechaDePostulacion: string;
    FechaDeResultado: string;
    Detalle: string;
    constructor(json: any) {
        this.ID = json.ID;
        this.Beneficiario = json.Beneficiario;
        this.Proyecto = json.Proyecto;
        this.Instrumento = json.Instrumento;
        this.Resultado = json.Resultado;
        this.MontoObtenido = json.MontoObtenido;
        this.FechaDePostulacion = json.FechaDePostulacion;
        this.FechaDeResultado = json.FechaDeResultado;
        this.Detalle = json.Detalle;
    }
}
export default Postulacion;