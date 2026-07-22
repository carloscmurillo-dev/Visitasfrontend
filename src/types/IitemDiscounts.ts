export interface IitemDiscounts {
    ok:             boolean;
    msg:            string;
    itemsDiscounts: ItemsDiscount[];
}

export interface ItemsDiscount {
    gtin:      string;
    ruleType:  string;
    ruleCode:  string;
    value:     string;
    startDate: Date;
    endDate:   Date;
    secuency:  string;
    type:      string;
}

export interface DescFijos {
    ok:             boolean;
    msg:            string;
    descFijo: DescFijo[];
}

export interface DescFijo {
    proveedor_id:      string;
    categoria_id:  number;
    descfijo:  number;
   
}

export interface DescFijos {
    ok:             boolean;
    msg:            string;
    descFijo: DescFijo[];
}

export interface DescFijo {
    proveedor_id:      string;
    categoria_id:  number;
    descfijo:  number;
   
}