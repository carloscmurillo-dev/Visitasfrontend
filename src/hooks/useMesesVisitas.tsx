import { useEffect, useState } from "react"
import API from '../__fake-api__/API';

import { MesesVisita, MesesVisitasResponse } from 'src/types/APIAmiInterfaces';


export const useMesesVisitas = () => {
    
    const [ isLoading, setIsLoading ] = useState( true )
    const [ mesesVisitas, setMesesVisitas ] = useState<MesesVisita[]>([]);
    
    useEffect(() => {
        getMesesVisitas();
    }, [])


    const getMesesVisitas = async() => {
        const resp = await API.get<MesesVisitasResponse>('amimed/getMesesVisitas');
        setMesesVisitas( resp.data.MesesVisitas );
        setIsLoading(false);
    }


    return {
        isLoading,
        mesesVisitas
    }
}
