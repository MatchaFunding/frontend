class Miembro {
    ID: number;
    Persona: number;
    Beneficiario: number;
    Usuario: number;
    constructor(json: any) {
        this.ID = json.ID;
        this.Persona = json.Persona;
        this.Beneficiario = json.Beneficiario;
        this.Usuario = json.Usuario;
    }
}
export default Miembro;