export interface GetProviders {
    ok:        boolean;
    msg:       string;
    providers: Provider[];
}

export interface Provider {
    proveedor_id:  string;
    proveedor_dsc: string;
    gln:           string;
}
