

export interface ApiItemFileResponse {
  ok:         boolean;
  msg:        string;
  item: items[];
}


export interface GetApiItemFileResponse {
  ok:         boolean;
  item: items;
  msg:        string;
}



export interface items {
  gtin: string;
  idestado: string;
  ComercialLongDescription?: string;
  ComercialShortDescription?: string;
  IDCATEGORIA: number;
  idsubcategoria: number;
  idmarca: number;
  centro: string;
  factor_conversion?: number;
  unidadempaque?: string;
  tamanonx?: string;
  unidadmedida?: string;
  medida?: number;
  medidaescurrida?: number;
  ComercialPubliDescription?: string;
  ComercialFonetDescription?: string;
  ComercialHablaDescription?: string;
  indsuministro: number;
  indarticuloimportado: number;
  seccion5: number;
  indcanastabasica: number;
  indpagaimpuesto: number;
  indpack: number;
  IndOmitePorcCabys: number;
  indaceptadevoluciones?: boolean;
  idimpuesto: number;
  idimpuestodet?: number;
  cabysCode?: string;
  codigopais: number;
  CantDisp: number;
  RegistroSanitario?: string;
  RegistroSanitarioFecAprobacion?: string;
  RegistroSanitarioFecVencimiento?: string;
  IdTipoProducto?: number;
  IdClasificacionArt: number;
  IdMetodoCompraArt: number;
  idsegmentacionart: number;
  idsegmento?: number;
  CodigoPadre: number;
  textocongelamiento: string;
  observaciones: string;
}

