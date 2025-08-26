class Financiador {
    ID: number;
    Nombre: string;
    FechaDeCreacion: string;
    RegionDeCreacion: string;
    Direccion: string;
    TipoDePersona: string;
    TipoDeEmpresa: string;
    Perfil: string;
    RUTdeEmpresa: string;
    RUTdeRepresentante: string;
    constructor(json: any) {
        this.ID = json.ID;
        this.Nombre = json.Nombre;
        this.FechaDeCreacion = json.FechaDeCreacion;
        this.RegionDeCreacion = json.RegionDeCreacion;
        this.Direccion = json.Direccion;
        this.TipoDePersona = json.TipoDePersona;
        this.TipoDeEmpresa = json.TipoDeEmpresa;
        this.Perfil = json.Perfil;
        this.RUTdeEmpresa = json.RUTdeEmpresa;
        this.RUTdeRepresentante = json.RUTdeRepresentante;
    }
}
export default Financiador;