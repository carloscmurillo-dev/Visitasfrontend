import { useEffect, useState } from "react"
import API from '../__fake-api__/API';

import { Paciente,PacientesResponse } from 'src/types/APIAmiInterfaces';


export const usePacientes = (IdTera?:string) => {
    
    
    const [ isLoading, setIsLoading ] = useState( true )
    const [ pacientes, setPacientes ] = useState<Paciente[]>([]);
    
    useEffect(() => {
        getPacientesXTerapeuta(IdTera);
    }, [])


    // const getPacientesXTerapeuta = async(Id? : string) => {
    //     const resp = await API.get<PacienteResponse>('/getPacientesXTerapeuta');
    //     setPacientes( resp.data.paciente );
    //     setIsLoading(false);
    // }

    const getPacientesXTerapeuta = async(IdTera?: string) => {
        console.log('Tera en Usexxxxxxxxxxxxxxxxxxxxxxxxxxxx:',IdTera)
        
        const resp = await API.get<PacientesResponse>(`amimed/getPacientesXTerapeuta?terapeutaId=${IdTera}`);
        console.log('datos pacientes++++++++++++++++++++++++++++++++++++++', `/getPacientesXTerapeuta?terapeutaId=${IdTera}` )
       // console.log(resp.data.paciente)
        setPacientes( resp.data.pacientes );
        // console.log('PACIENTE CERO:',resp.data.pacientes)
        setIsLoading(false);
    }


    return {
        isLoading,
        pacientes
    }
}
