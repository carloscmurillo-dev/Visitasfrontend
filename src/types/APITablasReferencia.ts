export interface AsuntosResponse {
    ok:         boolean;
    asunto: AsuntosMsg[];
    msg:        string;
  }
  
  export interface getAsuntoResponse {
  ok:         boolean;
  asunto: AsuntosMsg;
  msg:        string;
  }
  
 

  export interface AsuntosMsg {
    asunto_id: number;
    asunto_dsc?: string;
    tipoAsunto?: string;
  }




  export interface PuestosResponse {
    ok:         boolean;
    puesto: Puestos[];
    msg:        string;
  }
  
  export interface getPuestoResponse {
  ok:         boolean;
  puesto: Puestos;
  msg:        string;
  }


  export interface Puestos {
    IdPuesto: number;
    DescripcionPuesto?: string;
  }