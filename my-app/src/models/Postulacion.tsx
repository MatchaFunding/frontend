class Postulacion {
    ID: number;
    Beneficiario: number;
    Proyecto: number;
    Instrumento: number;
    Resultado: string;
    MontoObtenido: number | null;
    FechaDePostulacion: string;
    FechaDeResultado: string | null;
    Detalle: string;
    Usuario: number;
    constructor(json: any) {
        this.ID = json.ID;
        this.Beneficiario = json.Beneficiario;
        this.Proyecto = json.Proyecto;
        this.Instrumento = json.Instrumento;
        this.Resultado = json.Resultado;
        this.MontoObtenido = json.MontoObtenido !== undefined ? json.MontoObtenido : null;
        this.FechaDePostulacion = json.FechaDePostulacion;
        this.FechaDeResultado = json.FechaDeResultado !== undefined ? json.FechaDeResultado : null;
        this.Detalle = json.Detalle;
        this.Usuario =  json.Usuario;
    }
}
export default Postulacion;