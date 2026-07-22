export interface TiposGravadosResponse {
    ok:         boolean;
    tiposGravados: TiposGravados[];
    msg:        string;
}
export interface GetTiposGravadosResponse {
    ok:         boolean;
    TiposGravados: TiposGravados;
    msg:        string;
}


export interface TiposGravados {
    GravadoID: number;
    GravadoDsc?: string;
  }