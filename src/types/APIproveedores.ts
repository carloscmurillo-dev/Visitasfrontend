import { string } from "prop-types";

export interface ProveedoresResponse {
    ok:         boolean;
    Proveedores: Proveedor[];
    msg:        string;
}
export interface GetProveedorResponse {
    ok:         boolean;
    proveedor: Proveedor;
    msg:        string;
}
export interface Proveedor {
  proveedor_id: string;
  proveedor_dsc: string;
  gln: string;
  fechaSolicitud: Date;
  CedJuridica: string;
  RazonSocial: string;
  RepreLegal: string;
  GerenteGeneral: string;
  GerenteVentas: string;
  AgenteVentas: string;
  ContactoFinanc: string;
  Direccion: string;
  canton_id: number;
  Barrio: string;
  Tel1: string;
  Tel2: string;
  NombreContactoFactElec: string;
  TelContactoFactElec: string;
  EmailContactoFactElec: string;
  EmailReciboContactoFactElec: string;
  CantidadLineasXFactura: number;
  TipoEntrega: number;
  AceptaDevoluc: boolean;
  OrdenCompra: boolean;
  DescuentoFijo: boolean;
  PorDescuentofijo: number;
  DescuentoConfidencial: boolean;
  PorcDescuentoConfidencial: number;
  DescuentoIntroduccion: boolean;
  PorcDescuentoIntroduccion: number;
  PartDinamicasComerciales: boolean;
  PartEspaciosPromocionales: boolean;
  PartDisplays: boolean;
  FrecuenciaVisitaTiendas: number;
  AportaCodigoCABYS: boolean;
  CodigoCABYS: string;
  ActividadEconomicaID: number;
  PlazoPagoID: number;
  DocEntregaFacElect: boolean;
  DocEntregaGuiaDespacho: boolean;
}



export interface ProveedoresolResponse {
  ok:         boolean;
  Proveedores: Proveedorsol[];
  msg:        string;
}
export interface GetProveedorsolResponse {
  ok:         boolean;
  proveedor: Proveedorsol;
  msg:        string;
}
export interface Proveedorsol {
proveedor_id: number;
proveedor_dsc: string;
categoria_id: number;
gln: string;
fechaSolicitud: Date;
CedJuridica: string;
RazonSocial: string;
RepreLegal: string;
GerenteGeneral: string;
GerenteVentas: string;
AgenteVentas: string;
ContactoFinanc: string;
Direccion: string;
canton_id: number;
Barrio: string;
Tel1: string;
Tel2: string;
NombreContactoFactElec: string;
TelContactoFactElec: string;
EmailContactoFactElec: string;
EmailReciboContactoFactElec: string;
CantidadLineasXFactura: number;
TipoEntrega: number;
AceptaDevoluc: boolean;
OrdenCompra: boolean;
DescuentoFijo: boolean;
PorDescuentofijo: number;
DescuentoConfidencial: boolean;
PorcDescuentoConfidencial: number;
DescuentoIntroduccion: boolean;
PorcDescuentoIntroduccion: number;
PartDinamicasComerciales: boolean;
PartEspaciosPromocionales: boolean;
PartDisplays: boolean;
FrecuenciaVisitaTiendas: number;
AportaCodigoCABYS: boolean;
CodigoCABYS: string;
ActividadEconomicaID: number;
PlazoPagoID: number;
DocEntregaFacElect: boolean;
DocEntregaGuiaDespacho: boolean;
status: string ;
Distrito: string; 
Canton: string; 
Provincia: string; 
ActividadEconomicaDsc: string; 
PlazoPagoDsc: string; 
}