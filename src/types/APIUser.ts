export interface GetUsers {
    msg:   string;
    users: APIUser[];
}

export interface APIUser {
    proveedor_id:  string;
    proveedor_dsc: string;
    gln:           string;
    UserId:        number;
    Username:      string;
    Name:          string;
    UserTypeDescription: string;
    UserTypeId: string;
    adc: number;
    ADCname: string;
    descuentoFijoProv : number;

}

export interface getUserByUsernameResponse
{

    ok:         boolean;
    usuario: APIUser;
    msg:        string;


}

export interface getUser
{

    ok:         boolean; 
    msg:        string;
    user: APIUser;
   


}

export interface Usuario {
    UserId: number;
    Username: string;
    gln: string;
    adc?: number;
    Name?: string;
   // passwordHash?: string;
    CategoryId?: number;
    UserType?: string;
  } 
