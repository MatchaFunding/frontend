class Consorcio {
    ID: number;
    PrimerBeneficiario: number;
    SegundoBeneficiario: number;
    constructor(json: any) {
        this.ID = json.ID;
        this.PrimerBeneficiario = json.PrimerBeneficiario;
        this.SegundoBeneficiario = json.SegundoBeneficiario;
    }
}
export default Consorcio;