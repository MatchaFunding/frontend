class Idea {
    ID: number;
    Usuario: number;
    Campo: string;
    Problema: string;
    Publico: string;
    Innovacion: string;
    constructor(json: any) {
        this.ID = json.ID;
        this.Usuario = json.Usuario;
        this.Campo = json.Campo;
        this.Problema = json.Problema;
        this.Publico = json.Publico;
        this.Innovacion = json.Innovacion;
    }
}
export default Idea;