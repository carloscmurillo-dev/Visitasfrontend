export interface AsuntosResponse {
  ok:         boolean;
  asunto: Asunto[];
  msg:        string;
}

export interface getAsuntosResponse {
  ok:         boolean;
  Asunto: Asunto;
  msg:        string;
}

export interface Asunto {
  asunto_id: number;
  asunto_dsc: string;
  tipoAsunto: string;
}