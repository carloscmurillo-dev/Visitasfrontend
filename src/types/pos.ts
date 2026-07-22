export interface GetPOS {
    ok:  boolean;
    msg: string;
    POS: Po[];
}

export interface Po {
    puntoVenta_id:  number;
    puntoVenta_dsc: string;
    tipoPDV:        TipoPDV;
}

export enum TipoPDV {
    Altas = "ALTAS",
    Conveniencia = "CONVENIENCIA",
    Grandes = "GRANDES",
    Pequeñas = "PEQUEÑAS",
    Premiun = "PREMIUN",
    Regulares = "REGULARES",
    Turisticas = "TURISTICAS",
}