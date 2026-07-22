export interface UnidadEmpaqueResponse {
    ok:         boolean;
    UnidadEmpaque: UnidadEmpaque[];
    msg:        string;
}
export interface GetUnidadEmpaqueResponse {
    ok:         boolean;
    UnidadEmpaque: UnidadEmpaque;
    msg:        string;
}

export interface UnidadEmpaque {
    IdUnidadEmpaque: string;
    DescriUnidadEmpaque: string;
  }
