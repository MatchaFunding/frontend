class Idea {
    ID: number;
    Usuario: number;
    Campo: string;
    Problema: string;
    Publico: string;
    Innovacion: string;
    FechaDeCreacion: string;
    constructor(json: any) {
        this.ID = json.ID;
        this.Usuario = json.Usuario;
        this.Campo = json.Campo;
        this.Problema = json.Problema;
        this.Publico = json.Publico;
        this.Innovacion = json.Innovacion;
        this.FechaDeCreacion = json.FechaDeCreacion;
    }
}
export default Idea;