import { FC, Fragment } from 'react';
import { useState , useEffect} from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Chip, InputAdornment, TextField, ListItemText,Typography,Checkbox ,SelectChangeEvent,FormControl,OutlinedInput,InputLabel,Select, TableHead, Table, TableRow, TableCell, TableBody, Card, CardMedia, Link, CardContent, styled} from '@mui/material';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { ArrowRight as ArrowRightIcon } from '../../../icons/arrow-right';
import { authApi } from 'src/__fake-api__/auth-api';
import { APIUser } from 'src/types/APIUser';
import {Grid,MenuItem} from '@mui/material';
import { Asunto } from 'src/types/APIasuntos';
import { productApi } from 'src/__fake-api__/product-api';
import { Users } from 'src/icons/users';
import { Scrollbar } from 'src/components/scrollbar';
import { Trash as TrashIcon } from '../../../icons/trash';

import { DateTimePicker } from '@mui/lab';
import { FileDropzone } from 'src/components/file-dropzone';
import { fileToBase64 ,base64toBlob} from '../../../utils/file-to-base64';
import { Paciente } from 'src/types/APIAmiInterfaces';

// Import the main component
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';

import { Icon } from '@react-pdf-viewer/core';
import { useAuth } from 'src/hooks/use-auth';
import { Articulo } from 'src/types/product-new';



interface JobDetailsStepProps {
  onNext?: () => void;
  onBack?: () => void;
  handleDetails : any;
  Tipo : any;
}

export const JobDetailsStep: FC<JobDetailsStepProps> = (props) => {
  const { onBack, onNext, handleDetails, Tipo,...other } = props;
  const [tag, setTag] = useState<string>('');
  const [titulo, setTitulo] = useState('')
  const [tagArray, setTagArray] = useState<string[]>([]);

  const [url, seturl] = useState('')
 
 
  console.log('Tipo:',Tipo)

  
  
  
  const [startDate, setStartDate] = useState<Date | null>()
 
  const [endDate, setEndDate] = useState<Date | null>()

  const [pacientes, setPacientes] = useState<Paciente[]>([]);


const [nombreparticipante,setNombreparticipante]= useState('')
const [posicionparticipante,setPosicionparticipante]= useState('')
const [pacienteparticipante,setPacienteparticipante]= useState('')
const [emailparticipante,setEmailparticipante]= useState('')
const [fecha,setFecha] =  useState('')

 interface losParticipantes {
  nombreparticipante: string;
  posicionparticipante: string;
  pacienteparticipante: string;
  emailparticipante: string;
  id: string;
}
const [Foto,setFoto] = useState('')
const [fotoOpdf, setfotoOpdf] = useState('')
  
const posts = [
  {
    id: '24b76cac9a128cd949747080',
   
    category: 'Foto a incluir',
    cover: Foto,
    title: ''
  }
];

const handleDropCover1 = async ([file]: File[]) => {
  
  console.log('ANTE FORMATO:',file)
  const data = await fileToBase64(file) as string;

  // alert(data.substring(0,25))
  console.log('DATA',data)

  if (data.length > 12800000) {
    alert('Imagen excede limite permitido')
  
    return}
   
 console.log('FORMATO:',data.substring(0,25))
  
  if(data.substring(0,25)== 'data:application/pdf;base')
  //if(data.substring(0,25)==   'data:application/vnd.open')

   
  {
    //alert('siiiiii')
  const blob = base64toBlob(data);
   const url = URL.createObjectURL(blob);

 // console.log('BLOB',blob)
  
  setFoto(data)
  seturl( URL.createObjectURL(blob))

 // console.log('URL**************************::::',url)
  setfotoOpdf('pdf')

}
else
{
  setfotoOpdf('foto')
  seturl('')
  setFoto(data)
}




  //console.log(Foto)
};

const onNextI = (): void => {
  //alert('voy saliendo')
  console.log('Saliendo===>>>>',titulo,asuntoSelect,asuntoSelectS,participantes,fecha,Foto)
  handleDetails(titulo,asuntoSelect,asuntoSelectS,participantes,fecha,Foto,fotoOpdf)
  onNext?.()
};


const handleRemove1 = (): void => {
  setFoto('/static/mock-images/covers/caja.png');
};



const [participantes, setParticipantes] = useState<losParticipantes[]>([]);


const handleTitulo = async (event: React.ChangeEvent<HTMLInputElement>) => {
  setTitulo(event.target.value);
};

const handleNombreparticipante = async (event: React.ChangeEvent<HTMLInputElement>) => {
  setNombreparticipante(event.target.value);
  //console.log('NOMBRE:',nombreparticipante)
};

const handlePosicionparticipante = async (event: React.ChangeEvent<HTMLInputElement>) => {
  setPosicionparticipante(event.target.value);
};

const handlePacienteparticipante = async (event: React.ChangeEvent<HTMLInputElement>) => {
  setPacienteparticipante(event.target.value);
};

const handleEmailparticipante = async (event: React.ChangeEvent<HTMLInputElement>) => {
  setEmailparticipante(event.target.value);
};

const handleAgregarParticipantes=()=>{

  let despachado = false

  const objParticipantes = {nombreparticipante,posicionparticipante,pacienteparticipante,emailparticipante,despachado,id:generarId()}

  if ([nombreparticipante,posicionparticipante].includes(''))
  {alert('Debe ingresar datos en Cantidad y en Insumo!')}
  else
  {

  setParticipantes([...participantes,objParticipantes])

  console.log('Participantes string',participantes.toString(),'json:',JSON.stringify(objParticipantes))
  //handleTagAdd(JSON.stringify(objParticipantes))


  setNombreparticipante('')
  setPosicionparticipante('')
  setEmailparticipante('')
  setPacienteparticipante('')

  

}

}



  const handleStartDateChange = (newValue: Date | null): void => {
    setStartDate(newValue);
    console.log('NEWVALUE-------------->',newValue)
    console.log('fecha de cita:',startDate?.toLocaleString())
    //setFecha(startDate!.toLocaleString().replace(',',''))
    setStartDate(newValue);
    setFecha(newValue!.toISOString())
    console.log('Fecha cita Ingreso nuevo:',fecha)
  };

  const handleEndDateChange = (newValue: Date | null): void => {
    setEndDate(newValue);
  };

  const handleTagAdd = (newTag: string): void => {
    tagArray.push(newTag);
    setTagArray(tagArray);
  };




  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) =>
        defaultTabs.concat({
            content: <div style={{ textAlign: 'center', width: '100%' }}>Notes are listed here</div>,
            icon: (
                <Icon size={16}>
                    <path d="M23.5,17a1,1,0,0,1-1,1h-11l-4,4V18h-6a1,1,0,0,1-1-1V3a1,1,0,0,1,1-1h21a1,1,0,0,1,1,1Z" />
                    <path d="M5.5 12L18.5 12" />
                    <path d="M5.5 7L18.5 7" />
                </Icon>
            ),
            title: 'Notes',
        }),
});





  // SE UTILIZA PARA CARGAR MULTIPLE USUARIOS GESSA <=
 

  const handleAsuntoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    setasuntoSelect(Number(categorySplit[0]));
    setasuntoSelectS(categorySplit[1])

    if (Foto =='/static/mock-images/covers/caja.png')
      {        }

    //handleDetails(titulo,categorySplit[0],categorySplit[1],participantes,fecha,Foto)
   
    };

  const [asuntos, setAsuntos] = useState<Asunto[]>([]);
  const [asuntoSelect, setasuntoSelect] = useState<number | null>(null);
  const [asuntoSelectS,setasuntoSelectS] = useState<string | null>(null);
  const [userList, setUserList] = useState<APIUser[]>([]);
  const [ProductList, setProductList] = useState<Articulo[]>([]);

  const userPosi = [{ value: "Ejecutivo de cuenta", text: "Ejecutivo de cuenta" }, { value: " Gerente Logística", text: " Gerente Logística" }, { value: "Catman", text: "Catman" }, { value: "Representante finanzas", text: "Representante finanzas" }, { value: "Representante Logística", text: "Representante Logística" }]
  
  const generarId = () => {
    const random = Math.random().toString(36).substring(2);
    const fechaa = Date.now().toString(36)

    return random + fechaa}

  const eliminarParticipante = (id:string) => {

//console.log('ID de arreglo',id)

  const participantesActualizados = participantes.filter( participa => participa.id !== id);
  setParticipantes(participantesActualizados)



  }  

  const editarParticipante = (id:string) => {

    //console.log('ID de arreglo',id)
    
    const resultado = participantes.find((item) => item.id === id);
    // alert(resultado?.nombreparticipante)

    setNombreparticipante(resultado!.nombreparticipante)
    setPosicionparticipante(resultado!.posicionparticipante)
    setEmailparticipante(resultado!.emailparticipante)
    setPacienteparticipante(resultado!.pacienteparticipante)
    
    
    // alert(nombreparticipante)

    const participantesActualizados = participantes.filter( participa => participa.id !== id);
    setParticipantes(participantesActualizados)
  
    
      }  


  function b64DecodeUnicode(str: any) {
    //console.log('str en b64 decode:',str)
    if (str) {
    return Buffer.from(str, "base64").toString("utf8")}
    else return ''};

    const BlogPostCardMediaWrapper = styled('div')({
      paddingTop: 'calc(100% * 4 / 4)',
      position: 'relative'
    });
    const { user } = useAuth(); 

  useEffect(() => {
    const getUsers = async () => {
      const users = await authApi.getUsers();
      setUserList(users);
      setStartDate(new Date())
      //console.log('Usuarios:',userList,listausuarios)    
    }

    async function fetchAsuntos() {
      const data = await productApi.getAsuntos();
      //console.log('Datos de api asuntos...',data)
      setAsuntos(data);
      //console.log('ASUNTOS -----------------------------------:',data)
      let asuntosfilter = asuntos.filter(asuntos=> asuntos.tipoAsunto==Tipo.charAt(0))
      // console.log('asuntos sin filtro',data)
      // console.log('Asuntos Filtrados data:',asuntosfilter)
      // console.log('tipo filter', Tipo.charAt(0))

      setAsuntos(data.filter(data=> data.tipoAsunto==Tipo.charAt(0)))

      const pacientesXtera = await productApi.getPacientesXTerapeuta(user.gln)
      setPacientes(pacientesXtera)
      console.log('PACIENTES', pacientes)

      
        const articulos = await productApi.getArticulos();
        setProductList(articulos);
      
  
    }
  
    fetchAsuntos();
    getUsers();

  
  }, [])

  useEffect(() => {
   
    let fechan = new Date 
    setStartDate(fechan)
    setFecha(fechan.toISOString()) 
  
  }, []);
  
  return (
    <div {...other}>
      <Typography variant="h6">
        Paciente e Insumos
      </Typography>
      <Box sx={{ mt: 3 }}>
        <TextField
          onChange={handleTitulo}
          fullWidth
          label="Titulo de la actividad, insumos o bitacoras"
          name="jobTitle"
          placeholder="ej Solicitud insumos del mes de..."
         
        />
          <Grid
                item
                md={12}
                xs={12}
                sx={{ mt: 5 }}
             
              >
                <TextField
                  onChange={handleAsuntoChange}
                  fullWidth
                  label="Prioridad"
                  select
                >
                
                 {asuntos && asuntos.sort((a,b)=> a.asunto_dsc.localeCompare(b.asunto_dsc)).map((option) => (
                    <MenuItem
                      key={option.asunto_id}
                      value={`${option.asunto_id}-${option.asunto_dsc}`}
                    >
                      {`${option.asunto_dsc}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

            
            
   


{Tipo == 'CITA' && <Fragment>
        <Grid
                item
                md={12}
                xs={12}
                sx={{ mt: 5 }}
             
              >                               

      <Typography variant="h6">
        Insumos a Solicitar
      </Typography>          

      </Grid>


      <Grid
                item
                md={12}
                xs={12}
                sx={{ mt: 5 }}
             
              >                      
           
           <TextField
          onChange={handleNombreparticipante}
          fullWidth
          label="Cantidad:"
          name="jobTitle"
          placeholder="Campo Numerico"
          value={nombreparticipante}
         
        />

        </Grid>

        <Grid
                item
                md={12}
                xs={12}
                sx={{ mt: 5 }}
             
              >                      
           
           <TextField
          onChange={handlePosicionparticipante}
          fullWidth
          label="Insumo"
          name="jobTitle"
          value={posicionparticipante}
          placeholder="Seleccione Insumo"
          select
          >
            {ProductList.map((option) => (
              <MenuItem
                key={option.ArticuloID}
                value={`${option.DescripcionProducto}`}
              >
                {`${option.DescripcionProducto}`}
              </MenuItem>
            ))}
             </TextField>

        </Grid>

        <Grid
                item
                md={12}
                xs={12}
                sx={{ mt: 5 }}
             
              >
                <TextField
                  onChange={handlePacienteparticipante}
                  fullWidth
                  label="Paciente:"
                  select
                >
                
                 {pacientes && pacientes.sort((a,b)=> a.NombrePaciente.localeCompare(b.NombrePaciente)).map((option) => (
                    <MenuItem
                      key={option.idPaciente}
                      value={`${option.NombrePaciente}-${option.Hospital}`}
                    >
                      {`${option.NombrePaciente}-${option.Hospital}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>


        <Grid
                item
                md={12}
                xs={12}
                sx={{ mt: 5 }}
             
              >                      
           
           <TextField
          onChange={handleEmailparticipante}
          fullWidth
          required
          label="Comentario:"
          name="jobTitle"
          placeholder="Alguna observacion importante!"
          type="email"
          value={emailparticipante}
        />

        </Grid>

        <Box sx={{ mt: 3 }}>
        <Button
          //disabled={!asuntoSelect}
          endIcon={(<ArrowRightIcon fontSize="small" />)}
          onClick={handleAgregarParticipantes}
          variant="contained"
        >
          Agregar Insumo
        </Button>
        
     
      </Box>

      <Grid
        item
        md={12}
        xs={12}
        >
      <Scrollbar>
        <Table sx={{ minWidth: 400 }}>
          <TableHead>
            <TableRow>
            <TableCell>
                Cant.
              </TableCell>
              <TableCell>
                Descripcion Insumo
              </TableCell>
              <TableCell>
                Paciente Hospital
              </TableCell>
              <TableCell>
                Nota
              </TableCell>
              <TableCell>
              {'Borrar    Editar'}
              </TableCell>
           
            </TableRow>
          </TableHead>
          <TableBody>
            {(participantes).map((item) => (
              
              <TableRow    key={item.id}>
              
                <TableCell>
                  {item.nombreparticipante}
                </TableCell>
                <TableCell>
                  {item.posicionparticipante}
                </TableCell>
                <TableCell>
                  {item.pacienteparticipante}
                </TableCell>
                <TableCell>
                  {item.emailparticipante}
                </TableCell>
               
                <Button
                  onClick={() => eliminarParticipante(item.id)}
                  endIcon={(<TrashIcon fontSize="small" />)} >
                </Button>
                <Button
                  onClick={() => editarParticipante(item.id)}
                  endIcon={(<ArrowRightIcon fontSize="small" />)} >
                </Button>
              
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>

    </Grid>


       {/* <Grid
        item
        md={12}
        xs={12}
        sx={{ mt: 5 }}
        >
            



        <TextField
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  sx={{ ml: 2 }}
                  onClick={(): void => {
                    if (!tag) {
                      return;
                    }

                    handleTagAdd(tag);
                    setTag('');
                  }}
                >
                  clic para agregar
                </Button>
              </InputAdornment>
            )
          }}
          label="Miembros adicionales..."
          name="tags"
          onChange={(event): void => setTag(event.target.value)}
          sx={{ mt: 8 }}
          value={tag}
        />

      </Grid>   */}
        <Box sx={{ ml: -1 }}>
          {tagArray.map((_tag, i) => (
            <Chip
              onDelete={(): void => {
                const newTags = tagArray.filter((t) => t !== _tag);
                setTagArray(newTags);
              }}
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              label={_tag}
              sx={{
                mt: 1,
                ml: 1
              }}
              variant="outlined"
            />
          ))}
        </Box>

        </Fragment> }

       {Tipo == 'CITA' && <Fragment>

        <Typography
          sx={{ mt: 3 }}
          variant="subtitle1"
        >
          Se requiere para el dia:
        </Typography>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            mt: 3
          }}
        >
           <Box sx={{ ml: 1 }}>
          <DateTimePicker
            label=""
            inputFormat="dd/MM/yyyy hh:mm a"
            value={startDate}
            onChange={handleStartDateChange}
            renderInput={(inputProps) => <TextField {...inputProps} />}
          />
          </Box>
         
        </Box>
      
      </Fragment>}

      </Box>

      {/* inicio de foto */}

      {Tipo == 'MENSAJE'  && <Fragment>

    


                          <Grid   container
                            spacing={5}
                            sx={{ mt: 5 }}>

                          {fotoOpdf == 'foto'  && <Fragment>

                            {posts.map((post) => (
                              <Grid
                                item
                                key={post.id}
                                md={12}
                                xs={12}
                                
                              >
                                
                                <Card
                                  sx={{
                                    height: '100%',
                                    p: 2
                                  }}
                                >
                                  <BlogPostCardMediaWrapper>
                                    <CardMedia
                                      image={post.cover}
                                      sx={{
                                        height: '100%',
                                        position: 'absolute',
                                        top: 80,
                                        width: '100%'
                                      }}
                                    />
                                  </BlogPostCardMediaWrapper>
                                  <Box sx={{ mt: 2 }}>
                                   
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        my: 2
                                      }}
                                    >
                                  
                                    
                                    </Box>
                                    <Link variant="h1">
                                      {post.title}
                                    </Link>
                                     <Button
                                      onClick={handleRemove1}
                                      sx={{ mt: 5 }}
                                    
                                    >

                                      Remover foto adjunta
                                    </Button>
                                  </Box>
                                </Card>

                              

                              </Grid>
                            ))}
                              </Fragment> }
                          
                      
                        
                                  <Grid
                                  item
                                  md={12}
                                  xs={12} 
                                  sx={{ mt: -4 }}
                                  >
                                  <Card sx={{ mt: 4 }}>
                                  <CardContent>
                                
                              
                               
                                    <Box sx={{ mt: 3 }}>
                                      <FileDropzone
                                        accept={{
                                          'image/*,.pdf"': []
                                        }}
                                        maxFiles={1}
                                        onDrop={handleDropCover1}
                                        
                                      />
                                    </Box>
                                  </CardContent>
                                </Card>
                                </Grid>

                          </Grid>

                          {(fotoOpdf=='pdf') &&   
                              <>

                          <div
                            style={{
                                border: '1px solid rgba(0, 0, 0, 0.3)',
                                height: '750px',
                            }}
                        >
                           <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js"/>
                            <Viewer fileUrl={url} plugins={[defaultLayoutPluginInstance]}/>
                        </div>
                        </>
                        }

                          </Fragment>}

                                                    {/* fin fotos */}


      <Box sx={{ mt: 3 }}>
        <Button
          disabled={!asuntoSelect}
          endIcon={(<ArrowRightIcon fontSize="small" />)}
          onClick={onNextI}
          variant="contained"
        >
          Continuar
        </Button>
        <Button
          onClick={onBack}
          sx={{ ml: 2 }}
        >
          Regresar
        </Button>
      </Box>
    </div>
  );
};

JobDetailsStep.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  handleDetails: PropTypes.func,
};