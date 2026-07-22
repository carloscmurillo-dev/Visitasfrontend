export interface ActividadEconomicaResponse {
    ok:         boolean;
    actividadEcono: ActividadEconomica[];
    msg:        string;
}
export interface GetActividadEconomicaResponse {
    ok:         boolean;
    ActividadEconomica: ActividadEconomica;
    msg:        string;
}


export interface ActividadEconomica {
    ActividadEconomicaID: number;
    ActividadEconomicaDsc: string;
  }