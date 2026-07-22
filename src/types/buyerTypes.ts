export interface GetBuyerTypesResponse {
    ok:         boolean;
    msg:        string;
    buyerTypes: BuyerType[];
}

export interface BuyerType {
    tipoCompra_id:  number;
    tipoCompra_dsc: string;
}