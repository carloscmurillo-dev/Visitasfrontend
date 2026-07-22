export interface ProductNew {
  ArticuloID: number;
  DescripcionProducto: string;
  MarcaID: number;
  EAN13: string;
  categoria_id: number;
}
// To parse this data:
//
//   import { Convert, ProductResponse } from "./file";
//
//   const productResponse = Convert.toProductResponse(json);

export interface ProductNewResponse {
  ok: boolean;
  msg: string;
  articulos: Articulo [];
}
export interface GetProductNewResponse {
  ok: boolean;
  msg: string;
  articulo: Articulo;
}
export interface Articulo {
  ProveedorID: string;
  ArticuloID: number;
  DescripcionProducto: string;
  MarcaID: number;
  TamanoGessa: string;
  IdUnidadEmpaque: string;
  EAN13: string;
  DUN14: string;
  CompraEnUnidades: boolean;
  DescripcionLarga: string;
  DescripcionPublicacion: string;
  UnidadMedida: string;
  SaborAroma: string;
  categoria_id: number;
  subcategoria_id: number;
  DepartamentoID: number;
  SeccionID: number;
  SegmentoID: number;
  PlazoPagoID: number;
  tipoCompra_id: number;
  CabysCodigo: string;
  CostoEmpaque: number;
  CostoUnitario: number;
  GravadoID: number;
  GravadoOExento: boolean;
  PorcImpConsumo: number;
  MercadoOrigenID: number;
  TiempoVigencia: number;
  MedProdAnchoProducto: number;
  MedProdAltoProducto: number;
  MedProdLargoProducto: number;
  MedProdPesoNeto: number;
  MedProdPesoBruto: number;
  MedProdPesoEscurrido: number;
  MedProdDiametro: number;
  MedCajaAnchoProducto: number;
  MedCajaAltoProducto: number;
  MedCajaLargoProducto: number;
  FotoProductoFrente: any;
  FotoProductoLado: any;
  FotoProductoArribaBAse: any;
  DescuentoConfidencialDC: number;
  DescuentoIntroduccionDEI: number;
  DescuentoFijoDFI: number;
  DescuentoNoDevolucionDND: number;
  CentroDistribucionTAE: number;
  PromocionalPAE: number;
  status: string;
  categoria_dsc: string;
  subcategoria_dsc: string;
  MarcaDsc: string;
  tipoCompra_dsc: string;
  PlazoPagoDsc: string;
  GravadoDsc: string;
  DescriUnidadEmpaque: string;
  CambioPrecio: boolean;
  
}


