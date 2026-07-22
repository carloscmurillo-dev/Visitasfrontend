import { useEffect, useState } from "react"
import API from '../__fake-api__/API';

import { Hospitales, HospitalesResponse, MesesVisita, MesesVisitasResponse } from 'src/types/APIAmiInterfaces';


export const useHospitales = () => {
    
    const [ isLoading, setIsLoading ] = useState( true )
    const [ hospitales, setHospitales ] = useState<Hospitales[]>([]);
    
    useEffect(() => {
        getHospitales();
    }, [])


    const getHospitales = async() => {
        const resp = await API.get<HospitalesResponse>('amimed/getHospitales');
        setHospitales( resp.data.Hospitales );
        setIsLoading(false);
    }


    return {
        isLoading,
        hospitales
    }
}
