class IdeaRespuesta {
    ID: number;
    Usuario: number;
    ResumenLLM: string;
    
    constructor(json: any) {
        this.ID = json.ID;
        this.Usuario = json.Usuario;
        this.ResumenLLM = json.ResumenLLM;
        
    }
}
export default IdeaRespuesta;