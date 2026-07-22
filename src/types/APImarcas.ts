export interface MarcaResponse {
    ok:         boolean;
    marcas: Marca[];
    msg:        string;
}
export interface GetMarcaResponse {
    ok:         boolean;
    Marca: Marca;
    msg:        string;
}


export interface Marca {
    MarcaID: number;
    MarcaDsc: string;
  }