export interface SubCategoryResponse {
    ok:            boolean;
    subCategories: SubCategory[];
    msg:           string;
}
export interface GetSubCategoryResponse {
    ok:            boolean;
    SubCategory: SubCategory;
    msg:           string;
}
export interface SubCategory {
    categoria_id:     number;
    subcategoria_id:  number;
    subcategoria_dsc: string;
}