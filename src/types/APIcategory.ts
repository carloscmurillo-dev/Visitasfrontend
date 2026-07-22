export interface CategoryResponse {
    ok:         boolean;
    categories: Category[];
    msg:        string;
}
export interface GetCategoryResponse {
    ok:         boolean;
    Category: Category;
    msg:        string;
}
export interface Category {
    categoria_id:  number;
    categoria_dsc: string;
}


