export interface MercadoOrigenResponse {
    ok:         boolean;
    MercadoOrigen: MercadoOrigen[];
    msg:        string;
}
export interface GetMercadoOrigenResponse {
    ok:         boolean;
    MercadoOrigen: MercadoOrigen;
    msg:        string;
}


export interface MercadoOrigen{
    MercadoOrigenID: number;
    MercadoOrigenDsc?: string;
    ewaycode?: string;
  }