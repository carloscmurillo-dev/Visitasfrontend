import { useEffect, useState } from "react"
import API from '../__fake-api__/API';

import { EstadosEquipo, EstadosEquipoResponse, TiposVisitaResponse, Tiposvisita } from 'src/types/APIAmiInterfaces';


export const useEstadosEquipos = () => {
    
    const [ isLoading, setIsLoading ] = useState( true )
    const [ estadosEquipos, setEstadosEquipos ] = useState<EstadosEquipo[]>([]);
    
    useEffect(() => {
        getEstadosEquipos();
    }, [])


    const getEstadosEquipos = async() => {
        const resp = await API.get<EstadosEquipoResponse>('amimed/getEstadosEquipos');
        setEstadosEquipos( resp.data.EstadosEquipos);
        setIsLoading(false);
    }


    return {
        isLoading,
        estadosEquipos
    }
}
