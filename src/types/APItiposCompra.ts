export interface TipoCompraResponse {
  ok:         boolean;
  tipocompra: TipoCompra[];
  msg:        string;
}
export interface GetTipoCompraResponse {
  ok:         boolean;
  TipoCompra: TipoCompra;
  msg:        string;
}




export interface TipoCompra {
  tipoCompra_id: number;
  tipoCompra_dsc?: string;
}