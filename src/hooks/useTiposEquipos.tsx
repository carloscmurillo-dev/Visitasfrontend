import { useEffect, useState } from "react"
import API from '../__fake-api__/API';

import { TiposEquipo, TiposEquiposResponse } from 'src/types/APIAmiInterfaces';


export const useTiposEquipos = () => {
    
    const [ isLoading, setIsLoading ] = useState( true )
    const [ tiposEquipos, setTiposEquipos ] = useState<TiposEquipo[]>([]);
    
    useEffect(() => {
        getTiposEquipos();
    }, [])


    const getTiposEquipos = async() => {
        const resp = await API.get<TiposEquiposResponse>('amimed/getTiposEquipos');
        setTiposEquipos( resp.data.TiposEquipos );
        setIsLoading(false);
    }


    return {
        isLoading,
        tiposEquipos
    }
}
