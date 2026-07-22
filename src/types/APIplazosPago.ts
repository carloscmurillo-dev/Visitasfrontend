export interface PlazosPagoResponse {
  ok:         boolean;
  plazosPago: PlazosPago[];
  msg:        string;
}
export interface GetPlazosPagoResponse {
  ok:         boolean;
  PlazosPago: PlazosPago;
  msg:        string;
}


export interface PlazosPago {
  PlazoPagoID: number;
  PlazoPagoDsc?: string;
}