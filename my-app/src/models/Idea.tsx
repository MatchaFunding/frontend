class Idea {
    ID: number;
    Usuario: number;
    Campo: string;
    Problema: string;
    Publico: string;
    Innovacion: string;
    Oculta: boolean;
    FechaDeCreacion: string | null;
    Propuesta: string | null;
    constructor(json: any) {
        this.ID = json.ID;
        this.Usuario = json.Usuario;
        this.Campo = json.Campo;
        this.Problema = json.Problema;
        this.Publico = json.Publico;
        this.Innovacion = json.Innovacion;
        this.Oculta = json.Oculta || false;
        this.FechaDeCreacion = json.FechaDeCreacion || null;
        this.Propuesta = json.Propuesta || null;
    }
}
export default Idea;