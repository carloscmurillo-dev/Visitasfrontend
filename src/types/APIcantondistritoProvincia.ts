export interface CantonDistritoProvinciaResponse {
    ok:         boolean;
    cantones: CantonDistritoProvincia[];
    msg:        string;
}
export interface GetCantonDistritoProvinciaResponse {
    ok:         boolean;
    cantones: CantonDistritoProvincia;
    msg:        string;
}


export interface CantonDistritoProvincia {
    CantonID: number;
  Distrito?: string;
  Canton?: string;
  Provincia?: string;
  CodigoPostal?: number;
  }