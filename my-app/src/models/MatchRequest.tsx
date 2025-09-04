class MatchRequest {
  idea_id: number;
  top_k: number;
  estado?: string;
  regiones?: string[];
  tipos_perfil?: string[];
  constructor(json : any) {
    this.idea_id = json.json.call_id;
    this.top_k =json.top_k;
    this.estado =json.estado;
    this.regiones =json.regiones;
    this.tipos_perfil =json.tipos_perfil;
    
  }
}

export default MatchRequest;