class Miembro {
    ID: number;
    Persona: number;
    Beneficiario: number;
    constructor(json: any) {
        this.ID = json.ID;
        this.Persona = json.Persona;
        this.Beneficiario = json.Beneficiario;
    }
}
export default Miembro;