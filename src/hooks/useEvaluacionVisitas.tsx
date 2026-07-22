import { useEffect, useState } from "react"

import API from '../__fake-api__/API';
import { EvaluacionVisita, EvaluacionVisitaResponse } from 'src/types/APIAmiInterfaces';

//const [ isConnected, setIsConnected ] = useState( false )

export const useEvaluacionVisitas = () => {


    const [ evaluacionVisitas, setEvaluacionVisitas ] = useState<EvaluacionVisita[]>([]);

    const [ isLoading, setIsLoading ] = useState( true )

   
       useEffect(() => {
       // console.log('Calling getEvaluacionVisitas with conex:', conex);
        getEvaluacionVisitas();
    
    }, [])



    const getEvaluacionVisitas = async() => {
       

        
      
   
        const resp = await API.get<EvaluacionVisitaResponse>('amimed/getEvaluacionVisitas');
        setEvaluacionVisitas( resp.data.EvaluacionVisitas );
        setIsLoading(false);
            
       console.log('PARECE QUE SI CARGO LAS EVALUACIONES DE VISITA')
    
    

        
    }


    return {
        isLoading,
        evaluacionVisitas
    }
}
