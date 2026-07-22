import type { FC } from 'react';
import { format } from 'date-fns';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { DatePicker, DateTimePicker } from '@mui/lab';
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
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  FormHelperText,
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
import { useTiposVisitas } from 'src/hooks/useTiposVisitas';
import { usePacientes } from 'src/hooks/usePacientes';
import { useAuth } from 'src/hooks/use-auth';
import { values } from 'lodash';
import { Trash as TrashIcon } from '../../../icons/trash';
import router from 'next/router';
import { useReferencias } from 'src/hooks/useReferencias';

interface ProveedorEditFormProps {
  proveedor: Proveedorsol;
}

export const ProveedorEditForm: FC<ProveedorEditFormProps> = (props) => {
  const { proveedor, ...other } = props;
  console.log('Proveedor ya en el formulario',proveedor)
  
  const [plazosPagos, setPlazosPagos] = useState<PlazosPago[]>([]);
 

  const [actividadEconomicas, setActividadEconomicas] = useState<ActividadEconomica[]>([]);
 

  const [cantonDistritoProvincias, setcantonDistritoProvincias] = useState<CantonDistritoProvincia[]>([]);
  
 
  const [tipoCompras ,setTipoCompras] = useState<TipoCompra[]>([]);

  const [startDate, setStartDate] = useState<Date | null>()
  const [fecha,setFecha] =  useState('')
  

  const [categories, setCategories] = useState<Category[]>([]);

  const [hospitalSelected, setselectHospital] = useState<string | null>(null);

  const [pacienteSelected, setpacienteSelected] = useState<string | null>(null);

  const [mesVisitaSelected, setvisitasSelected] = useState<string | null>(null);

  const [tipoVisistaSelected, settipoVisitaSelected] = useState<string | null>(null);

  const [tipoEquipoSelected, settipoEquipoSelected] = useState<string | null>(null);

  const [estadoEquipoSelected, setestadoEquipoSelected] = useState<string | null>(null);

  const [evaluacionVisitaSelected, setevaluacionVisitaSelected] = useState<string | null>(null);

  //const [cambioEquipoSelected, setCambioEquipo] = useState(false);

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

  const { pacientes } = usePacientes(user.gln);

  const { referencias1 } = useReferencias(1);
    const { referencias2 } = useReferencias(2);
    const { referencias3 } = useReferencias(3);
    const { referencias4 } = useReferencias(4);
    const { referencias5 } = useReferencias(5);
    const { referencias6 } = useReferencias(6);
    const { referencias7 } = useReferencias(7);

    console.log('REFERENCIAS 1 ep',referencias1)
  

  const handleStartDateChange = (newValue: Date | null): void => {
    setStartDate(newValue);
    console.log('NEWVALUE-------------->',newValue)
    console.log('fecha de cita:',startDate?.toLocaleString())
    //setFecha(startDate!.toLocaleString().replace(',',''))
    setStartDate(newValue);
    setFecha(newValue!.toISOString())
    console.log('Fecha cita Ingreso nuevo:',fecha)
  
  };

 

///////////////////////////////////


  if (!proveedor) {

    //const [proveedor,setProveedor] = useState<Proveedorsol[]>([]);
   console.log('datos nulos')
   
   
  }
 

  useEffect(() => {
  
   
//alert('-' +proveedor.EstadoPaciente+ '-')

    setselectHospital(proveedor.IdHospital)
    setpacienteSelected(proveedor.idPaciente)
    settipoEquipoSelected(proveedor.IdTipoEquipo)
    settipoVisitaSelected(proveedor.IdTipoVisita)
    setestadoEquipoSelected(proveedor.IdEstadoEquipo)
    setevaluacionVisitaSelected(proveedor.IdEvaluacionVisita)
    setvisitasSelected(proveedor.IdMesVisita)

    setvaloresEstadosSelected(proveedor.EstadoPaciente ? proveedor.EstadoPaciente.trimEnd() : null)
    setvaloresAdherentesSelected(proveedor.AdherenciaUsoTratamiento ? proveedor.AdherenciaUsoTratamiento.trimEnd() : null)
    setvaloresCambiosSelected(proveedor.CambEquiInsuTrata ? proveedor.CambEquiInsuTrata.trimEnd() : null)
    setvaloresSituacionesSelected(proveedor.SituaEspecYCoordi ? proveedor.SituaEspecYCoordi.trimEnd() : null)
    setvaloresTratamientoSelected(proveedor.CondTrataYParam ? proveedor.CondTrataYParam!.trimEnd() : null)

    setEstadoPaciente(proveedor.EstadoPaciente ? true: false )
    setAdherente(proveedor.AdherenciaUsoTratamiento ? true: false  )
    setCambiosEquipo(proveedor.CambEquiInsuTrata ? true: false )
    setTratamiento(proveedor.CondTrataYParam ? true: false)
    setCondiciones(proveedor.SituaEspecYCoordi ? true: false )

 
    // falta el resto de seteos logicos setAd(proveedor.EstadoPaciente ? true: false )


    console.log('RECEPCION DE VALORES--------|||||', proveedor)

    

   // setEstadoPaciente(proveedor.pac)

    setCambioEquipo(proveedor.CambioEquipo || false)
    
    
   
   
 

  }, [])



///////////////////////////////////

const eliminarVisita = async (): Promise<void> => {
  //alert(usuario.UserId)
   if (confirm("Desea eliminar esta Visita:? " + String('') ) == true) 
   {

     try {
       await productApi.deleteVisita(proveedor.Id);
       // NOTE: Make API  request
       toast.success('Visita eliminado con exito!');
       await(1000)
       router.push(`/dashboard/Visitas`).catch(console.error);
     } catch (err) {
       toast.error('Something went wrong!');
      
     }

     
   }
 
 }


  const formik = useFormik({
    initialValues: {

      //fechaSolicitud: proveedor.fechaSolicitud || new Date(),
      
      

      Id:  proveedor.Id || '',
 //     IdHospital:  proveedor.IdHospital || '',
      idPaciente:  proveedor.idPaciente || '',
      IdTerapeuta:  proveedor.IdTerapeuta || '',
      IdMesVisita:  proveedor.IdMesVisita || '',
      FechaVisita:  proveedor.FechaVisita || '',
      IdTipoVisita:  proveedor.IdTipoVisita || '',
      IdTipoEquipo:  proveedor.IdTipoEquipo || '',
      FrecuenciaCardiaca:  proveedor.FrecuenciaCardiaca || '',
      PresionArterialSistolica:  proveedor.PresionArterialSistolica || '',
      PresionArterialDiastolica:  proveedor.PresionArterialDiastolica || '',
      SaturacionOxigeno:  proveedor.SaturacionOxigeno || '',
      HoraUsoPromDia:  proveedor.HoraUsoPromDia || '',
      HorasTotalMensuales:  proveedor.HorasTotalMensuales || '',
      DiasUsoSobreTotal:  proveedor.DiasUsoSobreTotal || '',
      FugaLmin:  proveedor.FugaLmin || '',
      IndiceApnea:  proveedor.IndiceApnea || '',
      PresionUtilizadaEpap:  proveedor.PresionUtilizadaEpap || '',
      PresionUtilizadaIPAP:  proveedor.PresionUtilizadaCPAP || '',
      PresionUtilizadaCPAP:  proveedor.PresionUtilizadaCPAP || '',
      CambioEquipo:  proveedor.CambioEquipo || false,
      NumSerieEquipoyDN:  proveedor.NumSerieEquipoyDN || '',
      IdEstadoEquipo:  proveedor.IdEstadoEquipo || '',
      IdEvaluacionVisita:  proveedor.IdEvaluacionVisita || '',
      ObservacionesClinicas:  proveedor.ObservacionesClinicas || '',
      ComentariosAdministrativos:  proveedor.ComentariosAdministrativos || '',


      submit: null
    },
    validationSchema: Yup.object({
   
    }),
    onSubmit: async (values, helpers): Promise<void> => {

      if(!hospitalSelected) {alert('Debe especificar el hospital!') }
      if(!pacienteSelected) {alert('Debe especificar el paciente!') }
      if(!mesVisitaSelected) {alert('Debe especificar el mes de visita!') }  
     
      if (hospitalSelected&&pacienteSelected&&mesVisitaSelected) {

      if (confirm("Desea modificar visita:? " ) == true) 
      {
    


      try {
        // NOTE: Make API request
      
    console.log(values)
        await productApi.updateVisita(
          values.Id ,
          hospitalSelected?? ' ' ,
          pacienteSelected?? ' ' ,
          user.gln,
          mesVisitaSelected?? ' ' ,
          fecha! ,
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
        toast.success('Proveedor agregado!');
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    } 
  }  
  }})  ;

  const handleChangeHOSPITAL = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    setselectHospital(categorySplit[0]);

    
    // alert(hospitalSelected)
  };




  const handleChangePACIENTE2 = async (event: SelectChangeEvent) => {
  const {
      target: { value },
    } = event;
  
  
    setpacienteSelected(value);
   
  };

  const handleChangePACIENTE = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    setvisitasSelected(categorySplit[0]);
   
  };

  const handleChangeMesVisita = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    setpacienteSelected(categorySplit[0]);
   
  };

  const handleChangeTipoVisita = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    settipoVisitaSelected(categorySplit[0]);
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

  const handleChangeEvaluacionVisista = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    setevaluacionVisitaSelected(categorySplit[0]);
    //alert(plazosPago)
  };


  const handleChangeCambioEquipo = async (event: React.ChangeEvent<HTMLInputElement>) => {
   
    setCambioEquipo(event.target.checked);
    //alert(plazosPago)
  };

  const handleChangeEstadoPaciente = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setEstadoPaciente(event.target.checked);
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
  const handleChangeValoresPaciente = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value);
    setvaloresEstadosSelected(categorySplit);
    //alert(actividadEconomica)
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
    setFecha(proveedor.FechaVisita) 
  
  }, []);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 100,
      },
    },
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      
    >
      <Card>
        <CardHeader title="Editar Visita" />
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
                  <FormHelperText>Seleccione Hospital</FormHelperText>
                <TextField
                    disabled
                    onChange={handleChangeHOSPITAL}
                    value={hospitalSelected}
                  fullWidth
                  // label="Hospital"
              
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
                  <FormHelperText>Seleccione Paciente</FormHelperText>
              <FormControl fullWidth>
                                      {/* <InputLabel id="demo-simple-select-label">Paciente</InputLabel> */}
                                  
                                      <Select
                                     
                                     disabled


                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        value={pacienteSelected!}
                                        onChange={handleChangePACIENTE2}
                                        // input={<OutlinedInput label="Pacientes" />}
                                        MenuProps={MenuProps}
                                     
                                      >
                                        {pacientes && pacientes.sort((a,b)=> a.NombrePaciente.localeCompare(b.NombrePaciente)).map((name) => (
                                          <MenuItem key={name.idPaciente} value={name.idPaciente}>
                                            {name.NombrePaciente}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                   
                                    </FormControl>



              </Grid>

   
              <Grid
                item
                md={12}
                xs={12}
                
              >
                 <FormHelperText>Seleccione Mes de Visista</FormHelperText>
                <TextField
                  onChange={handleChangeMesVisita}
                  value={mesVisitaSelected}
                  fullWidth
                  // label="Mes de Visita"
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
    {/*   <Typography
          sx={{ mt: 3 }}
          variant="subtitle1"
        >
          Anote la fecha y hora de la visita:
        </Typography> */}
          <FormHelperText>Seleccione Fecha de Visita</FormHelperText>
      
           <Box sx={{ ml: 1 }}>
          <DatePicker
            label=""
            inputFormat="dd/MM/yyyy hh:mm a"
            value={fecha}
            onChange={handleStartDateChange}
            renderInput={(inputProps) => <TextField {...inputProps} />}
          />
          </Box>
         
     

  

        </Grid>


        <Grid
                item
                md={12}
                xs={12}
                
              >
                   <FormHelperText>Seleccione Tipo de Visita</FormHelperText>
                <TextField
                  onChange={handleChangeTipoVisita}
                  value={tipoVisistaSelected}
                  fullWidth
                  // label="Tipo de Visita"
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
                   <FormHelperText>Seleccione Tipo de Equipo</FormHelperText>
                <TextField
                  onChange={handleChangeTipoEquipo}
                  value={tipoEquipoSelected}
                  fullWidth
                  // label="Tipo de Equipo"
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
                   <FormHelperText>Seleccione Estado Equipo</FormHelperText>
                <TextField
                  onChange={handleChangeEstadoEquipo}
                  value={estadoEquipoSelected}
                  fullWidth
                  // label="Estado Equipo"
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
                label="PresionArterialSistolica"
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
                label="PresionArterialDiastolica"
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
                label="SaturacionOxigeno"
                name="SaturacionOxigeno"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.SaturacionOxigeno}
              />
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
                label="HoraUsoPromDia"
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
                label="HorasTotalMensuales"
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
                label="DiasUsoSobreTotal"
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
                label="FugaLmin"
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
                label="IndiceApnea"
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
                label="PresionUtilizadaEpap"
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
                label="PresionUtilizadaIPAP"
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
                label="PresionUtilizadaCPAP"
                name="PresionUtilizadaCPAP"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.PresionUtilizadaCPAP}
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
                label="NumSerieEquipoyDN"
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
    value={valoresEstadoSelected}
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
    value={valoresAdherentesSelected}
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
    value={valoresCambiosSelected}
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
    value={valoresTratamientoSelected}
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
    value={valoresSituacionesSelected}
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
                   <FormHelperText>Seleccione Evaluacion de Visita</FormHelperText>
                <TextField
                  onChange={handleChangeEvaluacionVisista}
                  value={evaluacionVisitaSelected}
                  fullWidth
                  // label="Evaluacion Visita"
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
             Modificar Visita
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

          <Button
          sx={{ m: 1 }}
          onClick={eliminarVisita}
          variant="contained"
          //disabled
          color="error" 
          startIcon={<TrashIcon />}
        >
          Eliminar...
        </Button>
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


ProveedorEditForm.propTypes = {
  // @ts-ignore
  proveedor: PropTypes.object.isRequired
};


