class MatchResult {
  call_id: number;
  name: string;
  agency?: string; // optional
  affinity: number;
  semantic_score: number;
  rules_score: number;
  topic_score: number;
  explanations: string[]; // default empty array handled in constructor if needed
  constructor(json : any) {
    this.call_id = json.json.call_id;
    this.name =json.name;
    this.agency =json.agency;
    this.affinity =json.affinity;
    this.semantic_score =json.semantic_score;
    this.rules_score =json.rules_score;
    this.topic_score =json.topic_score;
    this.explanations =json.explanations;
  }
}


export default MatchResult;