import { Fragment, SetStateAction, useMemo, useState } from 'react';
import type { FC } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import type { StepIconProps } from '@mui/material';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { JobCategoryStep } from '../../../components/dashboard/citasmensajesnew/msg-category-step';
import { JobDetailsStep } from '../../../components/dashboard/citasmensajesnew/msg-details-step';
import { JobDescriptionStep } from '../../../components/dashboard/citasmensajesnew/msg-description-step';
import { Check as CheckIcon } from '../../../icons/check';
import NextLink from 'next/link';
import { Plus as PlusIcon } from '../../../icons/plus';
import { useAuth } from '../../../hooks/use-auth';
import { User } from 'src/icons/user';
import { productApi } from 'src/__fake-api__/product-api';
import { wait } from 'src/utils/wait';
import toast from 'react-hot-toast';
import router from 'next/router';
import { string } from 'prop-types';
import { date } from 'yup';
import { Scrollbar } from 'src/components/scrollbar';

const StepIcon: FC<StepIconProps> = (props) => {
  const { active, completed, icon } = props;

  const highlight = active || completed;

  return (
    <Avatar
      sx={{
        height: 40,
        width: 40,
        ...(highlight && {
          backgroundColor: 'success.main',
          color: 'success.contrastText'
        })
      }}
      variant="rounded"
    >
      {
        completed
          ? <CheckIcon fontSize="small" />
          : icon
      }
    </Avatar>
  );
};

const JobCreate: NextPage = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [complete, setComplete] = useState<boolean>(false);

  const [categoryIdSelected, setCategoryIdSelected] = useState(0);
  const [descCategoria, setDescCategoria] = useState('');
  const [Tipo, setTipo] = useState('');
  const [descrip,SetDescrip] = useState('d');
  
  interface losParticipantes {
    nombreparticipante: string;
    posicionparticipante: string;
    emailparticipante: string;
    id: string;
  }
  
  const { user } = useAuth(); 
  //console.log(user)

  const [titulo,SetTitulo]= useState('')
  const [asunto,SetAsunto] = useState<number | null>(null);
  const [dasunto,SetDasunto]=useState('')
  const [miembros,setMiembros]=useState('')
  const [fecha,setFecha] =  useState('')
  const [participantes,setParticipantes] = useState('')

 
  const [foto,setFoto] = useState<string | null>(null);
  const [partiparse,setParticipParse] = useState<losParticipantes[]>([]);
  
  function DateToStr(tfec:string)
{
  let PrnFecha : string
  let hora : number
   PrnFecha = tfec.substr(8,2)+'-'+tfec.substr(5,2)+'-'+tfec.substr(0,4) + ' Hora: ' 
   hora = Number(tfec.substr(11,2))
  hora = hora - 6

  return        PrnFecha = PrnFecha + hora.toString() + tfec.substr(13,3)



}

  const handleDetails = (Titulo:string, Asunto: number,Dasunto: string,Participantes:string[],Fecha:string,Foto:string,fotoOpdf:string) => {
    
    
    if (Tipo=='CITA') {   
      console.log('Participantes',Participantes)
      if (Participantes.length != 0)
      {
            const participantestring = Participantes.map((item) =>(JSON.stringify(item))).toString()

            const participantesParse = participantestring.replaceAll('},','};').split(';')

            const partparse = participantesParse.map((item) =>(JSON.parse(item)))
            console.log('Participantes parse:',partparse)

            setParticipantes(participantestring)

            setParticipParse(partparse)
  }
        else {

            setParticipantes('')
            setParticipParse([])

        }

}

else setParticipantes(fotoOpdf)

console.log('Foto o PDf',fotoOpdf)
    const fec = new Date().toLocaleString()

    SetTitulo(Titulo)
    SetDasunto(Dasunto)
    //setFecha(Fecha)
    SetAsunto(Asunto as number)
   
    if (Tipo=='MENSAJE') { setFecha(fec)    }
       else {  setFecha(Fecha)}
    
   
   
    setFoto(Foto)

    console.log('valores detail:===========>',Tipo,Titulo,titulo,'asunto:',Asunto,'Fecha:->>>',fecha)
    console.log('Participantes:',Participantes,'Participantes string:',participantes)
    
  }

  const handleCategoria = (categoria_id:number,DescCatego:string,Tipo:string) => {

    setCategoryIdSelected(categoria_id)
    setDescCategoria(DescCatego);
    setTipo(Tipo);
    console.log('valores:',Tipo)

  }

  const handleDescrip = (descripcion:string) => {

    SetDescrip(descripcion)
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleComplete = () => {
    setComplete(true);
  };

  const steps = [
    {
      label: 'Inicio Carga PDF o Solicitud Insumos - Categoria',
      content: (
        <JobCategoryStep
          onBack={handleBack}
          onNext={handleNext}
          handleCategoria={handleCategoria}
        />
      )
    },
    {
      label: 'Detalles de Carga PDF o Solicitud Insumos',
      content: (
        <JobDetailsStep
          onBack={handleBack}
          onNext={handleNext}
          handleDetails={handleDetails}
          Tipo={Tipo}
          
        />
      )
    },
    {
      label: 'Asunto y Descripcion',
      content: (
        <JobDescriptionStep
          onBack={handleBack}
          onNext={handleComplete}
          handleDescrip={handleDescrip}
        />
      )
    }
  ];

  const CancelarMsgCita = (): void => {
    
    if (confirm('Desea cancelar proceso cita o mensaje?') == true)
    {

      router.push(`/dashboard`)

    }
  };

  const AgregoCita = async (): Promise<void> => {
    console.log('participantes',participantes)
   
    console.log('Fecha:',fecha)
    if (confirm("Desea agregar PDF o Solicitud Insumos:? " + titulo) == true) 
    {
      
            try {
              
              await productApi.createMensaje(
              null,  // mensaje id nulo 
              0,     // id recibe mensaje
              user.email ,  // usuario sent
              '',     //: "admin@gessa.com", quien recibe
              null,    // fecha proceso
              null, //fecha, //    fecha de la cita
              asunto,   // aqui va asunto
              descrip, 
              '' ,   // respuesta 
              false,
              false,
              0,
              categoryIdSelected ,
              participantes ,
              '',
              Tipo,
              'PENDIENTE',
              foto?foto:'NULL',
              titulo,
              fecha
              );
              // NOTE: Make API request
            
              await wait(500);
            
              toast.success('Mensaje creado!');
              
              router.push(`/dashboard/`).catch(console.error);
            } catch (err) {
              console.error(err);
              toast.error('Error en la creacion del mensaje!');
            
            }
  }

    //else { return }


  };

  return (
    <>
      <Head>
        <title>
          Dashboard: PDF e Insumos | Amimed Salud
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexGrow: 1
        }}
      >
        <Grid
          container
          sx={{ flexGrow: 1 }}
        >
          <Grid
            item
            sm={2}
            xs={3}
            sx={{
              backgroundImage: 'url(/static/mock-images/jobs/Amisplashvertical.png)',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              display: {
                xs: 'none',
                md: 'block'
              }
            }}
          />
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              p: {
                xs: 4,
                sm: 6,
                md: 8
              }
            }}
          >
            <Box maxWidth="md">
              <Typography
                sx={{ mb: 3 }}
                variant="h4"
              >
                Solicitud Insumos o Subir Pdfs {user ? user.name:''} 
              </Typography>
              {
                !complete
                  ? (
                    <Stepper
                      activeStep={activeStep}
                      orientation="vertical"
                      sx={{
                        '& .MuiStepConnector-line': {
                          ml: 1,
                          borderLeftColor: 'divider',
                          borderLeftWidth: 2
                        }
                      }}
                    >
                      {steps.map((step, index) => (
                        <Step key={step.label}>
                          <StepLabel StepIconComponent={StepIcon}>
                            <Typography
                              sx={{ ml: 2 }}
                              variant="overline"
                            >
                              {step.label}
                            </Typography>
                          </StepLabel>
                          <StepContent
                            sx={{
                              ml: '20px',
                              borderLeftColor: 'divider',
                              borderLeftWidth: 2,
                              ...(activeStep === index && {
                                py: 4
                              })
                            }}
                          >
                            {step.content}
                          </StepContent>
                        </Step>
                      ))}
                    </Stepper>
                  )
                  : (
                    <div>
                      <Avatar
                        sx={{
                          backgroundColor: 'success.main',
                          color: 'success.contrastText',
                          height: 40,
                          width: 40
                        }}
                      >
                        <CheckIcon />
                      </Avatar>
                      <Typography
                        variant="h6"
                        sx={{ mt: 2 }}
                      >
                        OK Listo!
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        Aqui esta un resumen de lo requerido...
                      </Typography>
                      <Card
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                          mt: 2,
                          px: 2,
                          py: 1.5
                        }}
                        variant="outlined"
                      >
                        <div>
                          <Typography variant="subtitle1">
                            Estimado Terapeuta  {user ? user.name:''}, Estos son los datos de su {Tipo=='CITA'?' solicitud Insumos':' Carga PDF'}:
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            color="textSecondary"
                           
                          >
                            
                            Categoria:
                            {descCategoria}
                            <Typography
                              color="inherit"
                              noWrap
                              variant="subtitle2"
                            >
                             
                              
                            </Typography>
                            
                          </Typography>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                          >
                           Titulo: {titulo} {' '}
                           
                           {/* VER CITA EN ADC */}
                          
                            <Typography
                              color="inherit"
                              noWrap
                              variant="subtitle2"
                            >
                              Paciente: {dasunto} 
                              
                            </Typography>

                            <Typography
                              color="inherit"
                              noWrap
                              variant="subtitle2"
                            >
                              Fecha Solicitada: {DateToStr(fecha)} 
                              
                            </Typography>

                           
                            
                          </Typography>
                          <Typography
>
                               
                               <div dangerouslySetInnerHTML={{__html: descrip}}></div>
                              
                            </Typography>
                        </div>
                        {Tipo == "CITA" &&        <Fragment>
                            <Grid
                              item
                              md={12}
                              xs={12}
                              >
                            <Scrollbar>
                              <Table sx={{ minWidth: 600 }}>
                                <TableHead>
                                  <TableRow>
                                  <TableCell>
                                      Qty
                                    </TableCell>
                                    <TableCell>
                                      Insumo
                                    </TableCell>
                                    <TableCell>
                                      Nota
                                    </TableCell>
                                  
                                
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {(partiparse).map((item) => (
                                    
                                    <TableRow    key={item.id}>
                                    
                                      <TableCell>
                                        {item.nombreparticipante}
                                      </TableCell>
                                      <TableCell>
                                        {item.posicionparticipante}
                                      </TableCell>
                                      <TableCell>
                                        {item.emailparticipante}
                                      </TableCell>
                          
                                    
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Scrollbar>

                          </Grid>
                      </Fragment>}


                        <div>
                          <Typography
                            color="textSecondary"
                            sx={{ mr: 2 , flexWrap: 'wrap', m:1}}
                            variant="caption"

                           
                            
                          >
                            hace un minuto...  


                          </Typography>
                       
                          <NextLink
                         
                         
                        
                             href="/dashboard"
                              passHref
                >
                              <Button
                              
                                component="a"
                                startIcon={<PlusIcon fontSize="small" />}
                                variant="contained"
                                onClick={AgregoCita}
                              >
                                Guardar Pdf/Solicitud Insumos....
                              </Button>
                            </NextLink>
                            |        |
                            <NextLink
                             href=""
                              passHref
                >
                              <Button
                                component="a"
                                startIcon={<PlusIcon fontSize="small" />}
                                variant="contained"
                                onClick={CancelarMsgCita}
                              >
                                Cancelar 
                              </Button>
                            </NextLink>
                        </div>
                      </Card>
                    </div>
                  )
              }
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

JobCreate.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default JobCreate;
