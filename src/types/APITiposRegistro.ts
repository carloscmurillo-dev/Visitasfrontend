export interface TiposRegistroResponse {
  ok:         boolean;
  tiposregistro: TiposRegistro[];
  msg:        string;
}
export interface GetTiposRegistroResponse {
  ok:         boolean;
  tiposregistro: TiposRegistro;
  msg:        string;
}


export interface TiposRegistro {
  TipoRegistro_ID: number;
  DescripcionTR?: string;
}