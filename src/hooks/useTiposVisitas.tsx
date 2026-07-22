import { useEffect, useState } from "react"
import API from '../__fake-api__/API';

import { TiposVisitaResponse, Tiposvisita } from 'src/types/APIAmiInterfaces';


export const useTiposVisitas = () => {
    
    const [ isLoading, setIsLoading ] = useState( true )
    const [ tiposVisitas, setTiposvisitas ] = useState<Tiposvisita[]>([]);
    
    useEffect(() => {
        getTiposVisitas();
    }, [])


    const getTiposVisitas = async() => {
        const resp = await API.get<TiposVisitaResponse>('amimed/getTiposVisitas');
        setTiposvisitas( resp.data.tiposvisitas );
        setIsLoading(false);
    }


    return {
        isLoading,
        tiposVisitas
    }
}
