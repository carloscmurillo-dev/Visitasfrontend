import { useEffect, useState } from "react"
import API from '../__fake-api__/API';

import { Referencia, ReferenciasResponse} from 'src/types/APIAmiInterfaces';


export const useReferencias = (id : number) => {
    
    const [ isLoading, setIsLoading ] = useState( true )
    const [ referencias1, setReferencias1 ] = useState<Referencia[]>([]);
    const [ referencias2, setReferencias2 ] = useState<Referencia[]>([]);
    const [ referencias3, setReferencias3 ] = useState<Referencia[]>([]);
    const [ referencias4, setReferencias4 ] = useState<Referencia[]>([]);
    const [ referencias5, setReferencias5 ] = useState<Referencia[]>([]);
    const [ referencias6, setReferencias6 ] = useState<Referencia[]>([]);
    const [ referencias7, setReferencias7 ] = useState<Referencia[]>([]);

    
    useEffect(() => {
        getReferencias(id);
    }, [])


    const getReferencias = async(id:number) => {
        const resp = await API.get<ReferenciasResponse>(`amimed/getReferencias?IdReferencia=${id}`);
        console.log('En Use referencias ||||||||||||||||||||||||||||',id,resp)


        if(id== 1)  setReferencias1( resp.data.Referencias );
        if(id== 2)  setReferencias2( resp.data.Referencias );
        if(id== 3)  setReferencias3( resp.data.Referencias );
        if(id== 4)  setReferencias4( resp.data.Referencias );
        if(id== 5)  setReferencias5( resp.data.Referencias );
        if(id== 6)  setReferencias6( resp.data.Referencias );
        if(id== 7)  setReferencias7( resp.data.Referencias );

       
       // setReferencias( resp.data.referencias );
        setIsLoading(false);
    }


    return {
        isLoading,
        referencias1,
        referencias2,
        referencias3,
        referencias4,
        referencias5,
        referencias6,
        referencias7,
    }
}
