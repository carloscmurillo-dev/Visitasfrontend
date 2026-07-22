import { RestoreOutlined } from '@mui/icons-material';
import { AsuntosMsg, AsuntosResponse,getAsuntoResponse,Puestos,PuestosResponse,getPuestoResponse} from 'src/types/APITablasReferencia';

import API from './API';



class ReferenciasApi {
 
  async editAsuntos (asunto_id: number,asunto_dsc?: string,tipoAsunto?: string ): Promise<boolean> {
    await API.post<AsuntosMsg>('gsone/editAsuntos', { asunto_id,asunto_dsc,tipoAsunto });
    return Promise.resolve(true);
  }

  async delAsuntos (asunto_id: number): Promise<boolean> {
    //alert(userId )
    const count = await API.delete<AsuntosMsg>('gsone/delAsuntos',{ params: { asunto_id: asunto_id } });
    return Promise.resolve(true);
  }

  async getAsuntos(): Promise<AsuntosMsg[]> {
    
    const result = await API.get<AsuntosResponse>('gsone/getAsuntos');
    console.log('REPORTES:::::::',result)
    return Promise.resolve(result.data.asunto);
  }

async GetAsunto(asunto_id: number): Promise<AsuntosMsg> {
    console.log('Parametro a la api',asunto_id)
    const result = await API.get<getAsuntoResponse>('gsone/getAsunto', { params: { asunto_id: asunto_id } });
    console.log('Resultado de la api:',result.data.asunto)
  
    return Promise.resolve(result.data.asunto);
  }


async editPuestos (IdPuesto: number,DescripcionPuesto?: string ): Promise<boolean> {
  await API.post<Puestos>('gsone/editPuestos', { IdPuesto,DescripcionPuesto });
  return Promise.resolve(true);
}

async delPuestos (IdPuesto: number): Promise<boolean> {
  //alert(userId )
  const count = await API.delete<Puestos>('gsone/delPuestos',{ params: { IdPuesto: IdPuesto } });
  return Promise.resolve(true);
}

async getPuestos(): Promise<Puestos[]> {
  
  const result = await API.get<PuestosResponse>('gsone/getPuestos');
  console.log('REPORTES:::::::',result)
  return Promise.resolve(result.data.puesto);
}

async GetPuesto(IdPuesto: number): Promise<Puestos> {
  //console.log('Parametro a la api',asunto_id)
  const result = await API.get<getPuestoResponse>('gsone/getPuesto', { params: { IdPuesto: IdPuesto } });
  console.log('Resultado de la api:',result.data.puesto)

  return Promise.resolve(result.data.puesto);
}

}

export const tablasApi = new ReferenciasApi();
