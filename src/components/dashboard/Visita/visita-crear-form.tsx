import type { FC } from 'react';
import { format } from 'date-fns';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { DatePicker, DateTimePicker, DesktopDateTimePicker } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Grid,
  Switch,
  TextField,
  Typography,
  MenuItem,
  Checkbox
} from '@mui/material';
import type { Customer } from '../../../types/customer';
import { wait } from '../../../utils/wait';
import { VisitasHospital as   Proveedorsol } from 'src/types/APIAmiInterfaces';
import {PlazosPago} from 'src/types/APIplazosPago'
import {ActividadEconomica} from 'src/types/APIactividadEconomica'
import {CantonDistritoProvincia} from 'src/types/APIcantondistritoProvincia'
import { productApi } from 'src/__fake-api__/product-api';
import { date } from 'yup/lib/locale';
import { useState,useEffect } from 'react';
import { TipoCompra } from 'src/types/APItiposCompra';
import { Category } from 'src/types/APIcategory';
import { useEstadosEquipos } from 'src/hooks/useEstadosEquipos';
import { useEvaluacionVisitas } from 'src/hooks/useEvaluacionVisitas';
import { useHospitales } from 'src/hooks/useHospitales';
import { useMesesVisitas } from 'src/hooks/useMesesVisitas';
import { useTiposEquipos } from 'src/hooks/useTiposEquipos';
import { useReferencias } from 'src/hooks/useReferencias';
import { useTiposVisitas } from 'src/hooks/useTiposVisitas';
import { usePacientes } from 'src/hooks/usePacientes';
import { useAuth } from 'src/hooks/use-auth';
import { values } from 'lodash';
// import { v4 as uuidv4 } from 'uuid';

import { uuid } from 'uuidv4';
import router from 'next/router';



interface ProveedorEditFormProps {
  // proveedor: Proveedorsol;
}

export const ProveedorCrearForm: FC<ProveedorEditFormProps> = (props) => {
  // const { proveedor, ...other } = props;
  //alert( uuid())
  
  const [plazosPagos, setPlazosPagos] = useState<PlazosPago[]>([]);
 

  const [actividadEconomicas, setActividadEconomicas] = useState<ActividadEconomica[]>([]);
 

  const [cantonDistritoProvincias, setcantonDistritoProvincias] = useState<CantonDistritoProvincia[]>([]);
  
 
  const [tipoCompras ,setTipoCompras] = useState<TipoCompra[]>([]);

  const [startDate, setStartDate] = useState<Date | null>()
  const [fecha,setFecha] =  useState(startDate?.toISOString())
  

 

  const [hospitalSelected, setselectHospital] = useState<string | null>(null);

  const [pacienteSelected, setpacienteSelected] = useState<string | null>(null);

  const [mesVisitaSelected, setvisitasSelected] = useState<string | null>(null);

  const [tipoVisistaSelected, settipoVisitaSelected] = useState<string | null>(null);

  const [tipoEquipoSelected, settipoEquipoSelected] = useState<string | null>(null);

  const [estadoEquipoSelected, setestadoEquipoSelected] = useState<string | null>(null);

  const [evaluacionVisitaSelected, setevaluacionVisitaSelected] = useState<string | null>(null);

  const [valoresEstadoSelected, setvaloresEstadosSelected] = useState<string | null>(null);
  const [valoresAdherentesSelected, setvaloresAdherentesSelected] = useState<string | null>(null);
  const [valoresCambiosSelected, setvaloresCambiosSelected] = useState<string | null>(null);
  const [valoresTratamientoSelected, setvaloresTratamientoSelected] = useState<string | null>(null);
  const [valoresSituacionesSelected, setvaloresSituacionesSelected] = useState<string | null>(null);

  const [cambioEquipoSelected, setCambioEquipo] = useState(false);
  const [estadopacienteSelected, setEstadoPaciente] = useState(false);
  const [adherenteSelected, setAdherente] = useState(false);
  const [cambiosEquipoSelected, setCambiosEquipo] = useState(false);
  const [tratamientoSelected, setTratamiento] = useState(false);
  const [condicionesSelected, setCondiciones] = useState(false);
  



  

  const { user } = useAuth();

  
  const { evaluacionVisitas } = useEvaluacionVisitas();
  const { estadosEquipos } = useEstadosEquipos();
  const { hospitales } = useHospitales();
  const { mesesVisitas } = useMesesVisitas();
  const { tiposEquipos } = useTiposEquipos();
  const { tiposVisitas } = useTiposVisitas();

  const { referencias1 } = useReferencias(1);
  const { referencias2 } = useReferencias(2);
  const { referencias3 } = useReferencias(3);
  const { referencias4 } = useReferencias(4);
  const { referencias5 } = useReferencias(5);
  const { referencias6 } = useReferencias(6);
  const { referencias7 } = useReferencias(7);

  

  const { pacientes } = usePacientes(user.gln);

  const handleStartDateChange = (newValue: Date | null): void => {
    setStartDate(newValue);
   // alert(newValue)
    console.log('NEWVALUE-------------->',newValue)
    console.log('fecha de cita:',startDate?.toLocaleString())
    //setFecha(startDate!.toLocaleString().replace(',',''))
    setStartDate(newValue);
    setFecha(newValue!.toISOString())
    console.log('Fecha cita Ingreso nuevo:',fecha)
  
  };

 

///////////////////////////////////




  const formik = useFormik({
    initialValues: {

    
      Id:  '',
      IdHospital:  '',
      idPaciente:  '',
      IdTerapeuta:   '',
      IdMesVisita:   '',
      FechaVisita: '',
      IdTipoVisita:   '',
      IdTipoEquipo:  '',
      FrecuenciaCardiaca:   '',
      PresionArterialSistolica:  '',
      PresionArterialDiastolica:   '',
      SaturacionOxigeno:   '',
      HoraUsoPromDia:  '',
      HorasTotalMensuales:   '',
      DiasUsoSobreTotal:  '',
      FugaLmin:   '',
      IndiceApnea:  '',
      PresionUtilizadaEpap:   '',
      PresionUtilizadaIPAP:  '',
      PresionUtilizadaCPAP:   '',
      CambioEquipo:  false,
      NumSerieEquipoyDN:  '',
      IdEstadoEquipo:   '',
      IdEvaluacionVisita:  '',
      ObservacionesClinicas:   '',
      ComentariosAdministrativos:   '',


      submit: null
    },
    validationSchema: Yup.object({

    
      // hospitalSelected: Yup.string().required(),
      // pacienteSelected: Yup.string().required(),
     
      // mesVisitaSelected: Yup.string().required(),
      
      
    }),
    onSubmit: async (values, helpers): Promise<void> => {

      console.log('ESTADO',valoresEstadoSelected)
      console.log('ADHERENTES',valoresAdherentesSelected)
        console.log('CAMBIOOS',valoresCambiosSelected)
          console.log('TRATAMIENTOS',valoresTratamientoSelected)
            console.log('SITUACIONES',valoresSituacionesSelected)
              console.log('EVALUACION',evaluacionVisitaSelected)
                console.log('TIPO VISITA',tipoVisistaSelected  )
console.log(hospitalSelected ,
  pacienteSelected ,
  user.gln ,
  mesVisitaSelected ,
  fecha ,
  tipoVisistaSelected,
  tipoEquipoSelected ,
  values.FrecuenciaCardiaca ,
  values.PresionArterialSistolica ,
  values.PresionArterialDiastolica ,
  values.SaturacionOxigeno ,
  values.HoraUsoPromDia ,
  values.HorasTotalMensuales ,
  values.DiasUsoSobreTotal ,
  values.FugaLmin ,
  values.IndiceApnea ,
  values.PresionUtilizadaEpap ,
  values.PresionUtilizadaIPAP ,
  values.PresionUtilizadaCPAP ,
  cambioEquipoSelected,
  values.NumSerieEquipoyDN ,
  estadoEquipoSelected?? ' ' ,
  evaluacionVisitaSelected?? ' ',
  values.ObservacionesClinicas ,
  values.ComentariosAdministrativos,

  valoresEstadoSelected,
  valoresAdherentesSelected, 
  valoresCambiosSelected, 
  valoresTratamientoSelected, 
  valoresSituacionesSelected
)




      if(!hospitalSelected) {alert('Debe especificar el hospital!') }
      if(!pacienteSelected) {alert('Debe especificar el paciente!') }
      if(!mesVisitaSelected) {alert('Debe especificar el mes de visita!') }  
     
      if (hospitalSelected&&pacienteSelected&&mesVisitaSelected) {
      if (confirm("Desea agregar visita:? " + values.IdHospital) == true) 
      {
      try {
        // NOTE: Make API request
      
  
        await productApi.addVisita(
          
       
          uuid(),
          hospitalSelected?? ' ' ,
          pacienteSelected?? ' ' ,
          user.gln ,
          mesVisitaSelected?? ' ' ,
          fecha ,
          tipoVisistaSelected?? ' ',
          tipoEquipoSelected?? ' ' ,
          values.FrecuenciaCardiaca ,
          values.PresionArterialSistolica ,
          values.PresionArterialDiastolica ,
          values.SaturacionOxigeno ,
          values.HoraUsoPromDia ,
          values.HorasTotalMensuales ,
          values.DiasUsoSobreTotal ,
          values.FugaLmin ,
          values.IndiceApnea ,
          values.PresionUtilizadaEpap ,
          values.PresionUtilizadaIPAP ,
          values.PresionUtilizadaCPAP ,
          cambioEquipoSelected,
          values.NumSerieEquipoyDN ,
          estadoEquipoSelected?? ' ' ,
          evaluacionVisitaSelected?? ' ',
          values.ObservacionesClinicas ,
          values.ComentariosAdministrativos,
          valoresEstadoSelected?? ' ',
          valoresAdherentesSelected?? ' ', 
          valoresCambiosSelected?? ' ', 
          valoresTratamientoSelected?? ' ', 
          valoresSituacionesSelected?? ' '


        )
        await wait(500);
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        toast.success('Visita agregada!');
        router.push(`/dashboard/Visitas`).catch(console.error);
      } catch (err) {
        console.error(err);
        toast.error('Error a la hora de grabar visita, revise!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
        console.log('ERROR ERROR',err)
      }
    }
  }
  }
  });
  const handleChangeHOSPITAL = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    setselectHospital(categorySplit[0]);

    
    // alert(hospitalSelected)
  };

  const handleChangePACIENTE = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setpacienteSelected((event.target.value).substring(0,9))  
    setselectHospital((event.target.value).substring(11))
    //alert(pacienteSelected)
    //alert(hospitalSelected)
   
    
  };

  const handleChangeMesVisita = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    setvisitasSelected(categorySplit[0]);
    // alert(event.target.value)
  };

  const handleChangeTipoVisita = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value);
    //alert(categorySplit)
    settipoVisitaSelected(categorySplit);
    //alert(actividadEconomica)
  };

  const handleChangeValoresAdherentes = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value);
    setvaloresAdherentesSelected(categorySplit);
    //alert(actividadEconomica)
  };

  const handleChangeValoresCambiosEqui = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value);
    setvaloresCambiosSelected(categorySplit);
    //alert(actividadEconomica)
  };

  const handleChangeValoresPaciente = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value);
    setvaloresEstadosSelected(categorySplit);
    //alert(actividadEconomica)
  };

  const handleChangeValoresTratamiento = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value);
    setvaloresTratamientoSelected(categorySplit);
    //alert(actividadEconomica)
  };

  const handleChangeValoresSituacionesEspe = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value);
    setvaloresSituacionesSelected(categorySplit);
    //alert(actividadEconomica)
  };

  const handleChangeTipoEquipo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    settipoEquipoSelected(categorySplit[0]);
    //alert(plazosPago)
  };

  const handleChangeEstadoEquipo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    setestadoEquipoSelected(categorySplit[0]);
    //alert(plazosPago)
  };

  
  const handleChangeEvaluacionVisita = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value);
    setevaluacionVisitaSelected(categorySplit);
    
  };

  const handleChangeCambioEquipo = async (event: React.ChangeEvent<HTMLInputElement>) => {
   setCambioEquipo(event.target.checked);
  };


  const handleChangeEstadoPaciente = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setEstadoPaciente(event.target.checked);
  };

  const handleChangeAdherente = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdherente(event.target.checked);
  };

  const handleChangeTratamiento = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setTratamiento(event.target.checked);
  };

  const handleChangeCambiosEquipo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setCambiosEquipo(event.target.checked);
  };

  const handleChangeCondiciones = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setCondiciones(event.target.checked);
  };

  useEffect(() => {
   
    let fechan = new Date 
    setStartDate(fechan)
    setFecha(fechan.toISOString()) 
  
  }, []);
 

  return (
    <form
      onSubmit={formik.handleSubmit}
      
    >
      <Card>
        <CardHeader title="Agregar Visita" />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
       {/*       
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.Id && formik.errors.Id)}
                fullWidth
                helperText={formik.touched.Id && formik.errors.Id}
                label="ID visita"
                name="Id"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.Id}
              />
            </Grid>
        
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.IdTerapeuta && formik.errors.IdTerapeuta)}
                fullWidth
                helperText={formik.touched.IdTerapeuta && formik.errors.IdTerapeuta}
                label="Id Terapeuta"
                name="IdTerapeuta"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.IdTerapeuta}
              />
            </Grid> */}
     


              <Grid
                item
                md={12}
                xs={12}
                
              >
                <TextField
                  onChange={handleChangePACIENTE}
                  fullWidth
                  label="Paciente"
               
                  select
                >
                  {pacientes && pacientes.map((option) => (
                    <MenuItem
                      key={option.idPaciente}
                      value={`${option.idPaciente}-${option.Hospital}`}
                      
                    >
                      {`${option.idPaciente} - ${option.NombrePaciente}-${option.Hospital}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

                     <Grid
                item
                md={12}
                xs={12}
                
              >
                <TextField
                    onChange={handleChangeHOSPITAL}
                  disabled  
                  fullWidth
                  label="Hospital"
                  value={hospitalSelected ?? ''}
                  select
                >
                  {hospitales && hospitales.map((option) => (
                    <MenuItem
                      key={option.IdHospital}
                      value={`${option.IdHospital}`}
                      
                    >
                      {`${option.DscHospital}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid
                item
                md={12}
                xs={12}
                
              >
                <TextField
                  onChange={handleChangeMesVisita}
                  fullWidth
                  label="Mes de Visita"
                  // value={formik.values.IdMesVisita?.toString() ?? ""}
                  select
                >
                  {mesesVisitas && mesesVisitas.map((option) => (
                    <MenuItem
                      key={option.IdMesVisita}
                      value={`${option.IdMesVisita}`}
                      
                    >
                      {`${option.DscMesVisita}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid
                item
                md={12}
                xs={12}
                
              >
      <Typography
          sx={{ mt: 3 }}
          variant="subtitle1"
        >
          Seleccione la fecha de visita :
        </Typography>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            mt: 3
          }}
        >
           <Box sx={{ ml: 1 }}>
          <DatePicker 
            label=""
            inputFormat="dd/MM/yyyy hh:mm a"
            value={startDate}
            onChange={handleStartDateChange}
            renderInput={(inputProps) => <TextField {...inputProps} />}
          />
          </Box>
         
        </Box>

  

        </Grid>

        <Grid
                item
                md={12}
                xs={12}
                
              >
                <TextField
                  onChange={handleChangeTipoVisita}
                  fullWidth
                  label="Tipo de Visita"
                  // value={formik.values.IdTipoVisita?.toString() ?? ""}
                  select
                >
                  {referencias6 && referencias6.map((option) => (
                    <MenuItem
                      key={option.IdTipoReferencia}
                      value={`${option.IdTipoReferencia}`}
                      
                    >
                      {`${option.DsReferencica}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>              

       

              <Grid
                item
                md={12}
                xs={12}
                
              >
                <TextField
                  onChange={handleChangeTipoEquipo}
                  fullWidth
                  label="Tipo de Equipo"
                  // value={formik.values.IdTipoEquipo?.toString() ?? ""}
                  select
                >
                  {tiposEquipos && tiposEquipos.map((option) => (
                    <MenuItem
                      key={option.IdTipoEquipo}
                      value={`${option.IdTipoEquipo}`}
                      
                    >
                      {`${option.DscTipoEquipo}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid
                item
                md={12}
                xs={12}
                
              >
                <TextField
                  onChange={handleChangeEstadoEquipo}
                  fullWidth
                  label="Estado Equipo"
                  // value={formik.values.IdEstadoEquipo?.toString() ?? ""}
                  select
                >
                  {estadosEquipos && estadosEquipos.map((option) => (
                    <MenuItem
                      key={option.IdEstadoEquipo}
                      value={`${option.IdEstadoEquipo}`}
                      
                    >
                      {`${option.DscEstadoEquipo}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>


              <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.HoraUsoPromDia && formik.errors.HoraUsoPromDia)}
                fullWidth
                helperText={formik.touched.HoraUsoPromDia && formik.errors.HoraUsoPromDia}
                label="Horas Uso Promedio Dia"
                name="HoraUsoPromDia"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.HoraUsoPromDia}
              />
            </Grid>

            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.HorasTotalMensuales && formik.errors.HorasTotalMensuales)}
                fullWidth
                helperText={formik.touched.HorasTotalMensuales && formik.errors.HorasTotalMensuales}
                label="Horas Total Mensuales"
                name="HorasTotalMensuales"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.HorasTotalMensuales}
              />
            </Grid>

            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.DiasUsoSobreTotal && formik.errors.DiasUsoSobreTotal)}
                fullWidth
                helperText={formik.touched.DiasUsoSobreTotal && formik.errors.DiasUsoSobreTotal}
                label="Dias Uso Sobre Total"
                name="DiasUsoSobreTotal"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.DiasUsoSobreTotal}
              />
            </Grid>

            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.FugaLmin && formik.errors.FugaLmin)}
                fullWidth
                helperText={formik.touched.FugaLmin && formik.errors.FugaLmin}
                label="Fuga Lmin"
                name="FugaLmin"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.FugaLmin}
              />
            </Grid>

            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.IndiceApnea && formik.errors.IndiceApnea)}
                fullWidth
                helperText={formik.touched.IndiceApnea && formik.errors.IndiceApnea}
                label="Indice Apnea"
                name="IndiceApnea"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.IndiceApnea}
              />
            </Grid>


            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.PresionUtilizadaEpap && formik.errors.PresionUtilizadaEpap)}
                fullWidth
                helperText={formik.touched.PresionUtilizadaEpap && formik.errors.PresionUtilizadaEpap}
                label="Presion Utilizada Epap"
                name="PresionUtilizadaEpap"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.PresionUtilizadaEpap}
              />
            </Grid>

            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.PresionUtilizadaIPAP && formik.errors.PresionUtilizadaIPAP)}
                fullWidth
                helperText={formik.touched.PresionUtilizadaIPAP && formik.errors.PresionUtilizadaIPAP}
                label="Presion Utilizada IPAP"
                name="PresionUtilizadaIPAP"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.PresionUtilizadaIPAP}
              />
            </Grid>


            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.PresionUtilizadaCPAP && formik.errors.PresionUtilizadaCPAP)}
                fullWidth
                helperText={formik.touched.PresionUtilizadaCPAP && formik.errors.PresionUtilizadaCPAP}
                label="Presion Utilizada CPAP"
                name="PresionUtilizadaCPAP"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.PresionUtilizadaCPAP}
              />
            </Grid>



              <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.FrecuenciaCardiaca && formik.errors.FrecuenciaCardiaca)}
                fullWidth
                helperText={formik.touched.FrecuenciaCardiaca && formik.errors.FrecuenciaCardiaca}
                label="Frecuencia Cardiaca"
                name="FrecuenciaCardiaca"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.FrecuenciaCardiaca}
              />
            </Grid>


            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.PresionArterialSistolica && formik.errors.PresionArterialSistolica)}
                fullWidth
                helperText={formik.touched.PresionArterialSistolica && formik.errors.PresionArterialSistolica}
                label="Presion Arterial Sistolica"
                name="PresionArterialSistolica"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.PresionArterialSistolica}
              />
            </Grid>

            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.PresionArterialDiastolica && formik.errors.PresionArterialDiastolica)}
                fullWidth
                helperText={formik.touched.PresionArterialDiastolica && formik.errors.PresionArterialDiastolica}
                label="Presion Arterial Diastolica"
                name="PresionArterialDiastolica"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.PresionArterialDiastolica}
              />
            </Grid>

            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.SaturacionOxigeno && formik.errors.SaturacionOxigeno)}
                fullWidth
                helperText={formik.touched.SaturacionOxigeno && formik.errors.SaturacionOxigeno}
                label="Saturacion Oxigeno"
                name="SaturacionOxigeno"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.SaturacionOxigeno}
              />
            </Grid>




          <Divider sx={{ my: 3 }} />

          <Grid
              item
              md={12}
              xs={12}
            >
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
              mt: 3
            }}
          >
            <div>
              <Typography
                gutterBottom
                variant="subtitle1"
              >
                Cambio de Equipo
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                sx={{ mt: 1 }}
              >
                Marque aqui si acepta cambia equipo
              </Typography>
            </div>
            <Checkbox
              checked={cambioEquipoSelected}
              color="primary"
              edge="start"
              name="AceptaDevoluc"
              onChange={handleChangeCambioEquipo}
              // value={formik.values.CambioEquipo}
            />
          </Box>

          </Grid>
          <Divider sx={{ my: 3 }} />

           {cambioEquipoSelected && 

          <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.NumSerieEquipoyDN && formik.errors.NumSerieEquipoyDN)}
                fullWidth
                helperText={formik.touched.NumSerieEquipoyDN && formik.errors.NumSerieEquipoyDN}
                label="Numero Serie Equipo Nuevo"
                name="NumSerieEquipoyDN"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.NumSerieEquipoyDN}
              />
            </Grid>

              }

              <Divider sx={{ my: 3 }} />

              <Grid
                  item
                  md={12}
                  xs={12}
                >
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 3
                }}
              >
                <div>
                  <Typography
                    gutterBottom
                    variant="subtitle1"
                  >
                    Especificar Estado Paciente
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                    sx={{ mt: 1 }}
                  >
                    Marque aqui si quiere especificar Estado Paciente
                  </Typography>
                </div>
                <Checkbox
                  checked={estadopacienteSelected}
                  color="primary"
                  edge="start"
                  name="AceptaDevoluc"
                  onChange={handleChangeEstadoPaciente}
                  // value={formik.values.CambioEquipo}
                />
              </Box>

              </Grid>
              <Divider sx={{ my: 3 }} />

              {estadopacienteSelected && 

              <Grid
                item
                md={12}
                xs={12}
                
              >
                <TextField
                  onChange={handleChangeValoresPaciente}
                  fullWidth
                  label="1. Estado del Paciente"
                  // value={formik.values.IdTipoVisita?.toString() ?? ""}
                  select
                >
                  {referencias1 && referencias1.map((option) => (
                    <MenuItem
                      key={option.IdTipoReferencia}
                      value={`${option.IdTipoReferencia}`}
                      
                    >
                      {`${option.DsReferencica}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid> 
            }

            <Divider sx={{ my: 3 }} />

            <Grid
                item
                md={12}
                xs={12}
              >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                mt: 3
              }}
            >
              <div>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                >
                  Especificar Adherente y Uso Tratamiento
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body2"
                  sx={{ mt: 1 }}
                >
                  Marque aqui si acepta especificar Adherente y Uso Tratamiento
                </Typography>
              </div>
              <Checkbox
                checked={adherenteSelected}
                color="primary"
                edge="start"
                name="AceptaDevoluc"
                onChange={handleChangeAdherente}
                // value={formik.values.CambioEquipo}
              />
            </Box>

            </Grid>
            <Divider sx={{ my: 3 }} />

            {adherenteSelected && 

              <Grid
                item
                md={12}
                xs={12}
                
              >
                <TextField
                  onChange={handleChangeValoresAdherentes}
                  fullWidth
                  label="2. Adherencia y Uso del Tratamiento"
                  // value={formik.values.IdTipoVisita?.toString() ?? ""}
                  select
                >
                  {referencias2 && referencias2.map((option) => (
                    <MenuItem
                      key={option.IdTipoReferencia}
                      value={`${option.IdTipoReferencia}`}
                      
                    >
                      {`${option.DsReferencica}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid> 
            }


                <Divider sx={{ my: 3 }} />

                <Grid
                    item
                    md={12}
                    xs={12}
                  >
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 3
                  }}
                >
                  <div>
                    <Typography
                      gutterBottom
                      variant="subtitle1"
                    >
                      Especificar Cambios en Equipo e Insumos
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                      sx={{ mt: 1 }}
                    >
                      Marque aqui si acepta especificar Especificar Cambios en Equipo e Insumos
                    </Typography>
                  </div>
                  <Checkbox
                    checked={cambiosEquipoSelected}
                    color="primary"
                    edge="start"
                    name="AceptaDevoluc"
                    onChange={handleChangeCambiosEquipo}
                    // value={formik.values.CambioEquipo}
                  />
                </Box>

                </Grid>
                <Divider sx={{ my: 3 }} />

                {cambiosEquipoSelected && 


              <Grid
                item
                md={12}
                xs={12}
                
              >
                <TextField
                  onChange={handleChangeValoresCambiosEqui}
                  fullWidth
                  label="3. Cambios en Equipo Insumo Trat."
                  // value={formik.values.IdTipoVisita?.toString() ?? ""}
                  select
                >
                  {referencias3 && referencias3.map((option) => (
                    <MenuItem
                      key={option.IdTipoReferencia}
                      value={`${option.IdTipoReferencia}`}
                      
                    >
                      {`${option.DsReferencica}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid> 
            }
           <Divider sx={{ my: 3 }} />

              <Grid
                  item
                  md={12}
                  xs={12}
                >
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 3
                }}
              >
                <div>
                  <Typography
                    gutterBottom
                    variant="subtitle1"
                  >
                    Condiciones del Tratamiento y Parametros
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                    sx={{ mt: 1 }}
                  >
                    Marque aqui si acepta especificar condiciones del tratamiento y parametros
                  </Typography>
                </div>
                <Checkbox
                  checked={tratamientoSelected}
                  color="primary"
                  edge="start"
                  name="AceptaDevoluc"
                  onChange={handleChangeTratamiento}
                  // value={formik.values.CambioEquipo}
                />
              </Box>

              </Grid>
              <Divider sx={{ my: 3 }} />

              {tratamientoSelected && 






              <Grid
                item
                md={12}
                xs={12}
                
              >
                <TextField
                  onChange={handleChangeValoresTratamiento}
                  fullWidth
                  label="4. Condicion del Tratamiento y Param."
                  // value={formik.values.IdTipoVisita?.toString() ?? ""}
                  select
                >
                  {referencias4 && referencias4.map((option) => (
                    <MenuItem
                      key={option.IdTipoReferencia}
                      value={`${option.IdTipoReferencia}`}
                      
                    >
                      {`${option.DsReferencica}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid> 
            }

              <Divider sx={{ my: 3 }} />

              <Grid
                  item
                  md={12}
                  xs={12}
                >
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 3
                }}
              >
                <div>
                  <Typography
                    gutterBottom
                    variant="subtitle1"
                  >
                    Situaciones Especiales y Coordinacion
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                    sx={{ mt: 1 }}
                  >
                    Marque aqui si acepta especificar situaciones especiales y coordinacion 
                  </Typography>
                </div>
                <Checkbox
                  checked={condicionesSelected}
                  color="primary"
                  edge="start"
                  name="AceptaDevoluc"
                  onChange={handleChangeCondiciones}
                  // value={formik.values.CambioEquipo}
                />
              </Box>

              </Grid>
              <Divider sx={{ my: 3 }} />

              {condicionesSelected && 

              <Grid
                item
                md={12}
                xs={12}
                
              >
                <TextField
                  onChange={handleChangeValoresSituacionesEspe}
                  fullWidth
                  label="5. Situaciones Especiales y Coordinacion"
                  // value={formik.values.IdTipoVisita?.toString() ?? ""}
                  select
                >
                  {referencias5 && referencias5.map((option) => (
                    <MenuItem
                      key={option.IdTipoReferencia}
                      value={`${option.IdTipoReferencia}`}
                      
                    >
                      {`${option.DsReferencica}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid> 

              }


      
              <Grid
                item
                md={12}
                xs={12}
                
              >
                <TextField
                  onChange={handleChangeEvaluacionVisita}
                  fullWidth
                  label="6. Evaluacion Visita"
                  // value={formik.values.IdEvaluacionVisita?.toString() ?? ""}
                  select
                >
                  {referencias7 && referencias7.map((option) => (
                    <MenuItem
                      key={option.IdTipoReferencia}
                      value={`${option.IdTipoReferencia}`}
                      
                    >
                      {`${option.DsReferencica}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.ObservacionesClinicas && formik.errors.ObservacionesClinicas)}
                fullWidth
                helperText={formik.touched.ObservacionesClinicas && formik.errors.ObservacionesClinicas}
                label="ObservacionesClinicas"
                name="ObservacionesClinicas"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.ObservacionesClinicas}
              />
            </Grid>

            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.ComentariosAdministrativos && formik.errors.ComentariosAdministrativos)}
                fullWidth
                helperText={formik.touched.ComentariosAdministrativos && formik.errors.ComentariosAdministrativos}
                label="ComentariosAdministrativos"
                name="ComentariosAdministrativos"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.ComentariosAdministrativos}
              />
            </Grid>
            </Grid>
             
            <Divider sx={{ my: 3 }} />
        </CardContent>
        <CardActions
          sx={{
            flexWrap: 'wrap',
            m: -1
          }}
        >
          <Button
            disabled={formik.isSubmitting}
            type="submit"
            sx={{ m: 1 }}
            variant="contained"
          >
             Incluir Visita
          </Button>
          <NextLink
             href="/dashboard/Visitas"
             passHref
          >
            <Button
              component="a"
              disabled={formik.isSubmitting}
              sx={{
                m: 1,
                mr: 'auto'
              }}
              variant="outlined"
            >
              Cancelar
            </Button>
          </NextLink>
         {/*  <Button
            color="error"
            disabled={formik.isSubmitting}
          >
            Delete user
          </Button> */}
        </CardActions>
      </Card>
      
    </form>
  );
};




ProveedorCrearForm.propTypes = {
  // @ts-ignore
  proveedor: PropTypes.object.isRequired
};
