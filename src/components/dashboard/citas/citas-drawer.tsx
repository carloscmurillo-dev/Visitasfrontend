import { Fragment, useEffect, useRef, useState } from 'react';
import type { FC, MutableRefObject } from 'react';
import { productApi } from 'src/__fake-api__/product-api';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import numeral from 'numeral';
import { authApi } from 'src/__fake-api__/auth-api';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useAuth } from '../../../hooks/use-auth';
import { ArrowRight as ArrowRightIcon } from '../../../icons/arrow-right';
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  ClickAwayListener,
  Divider,
  Drawer,
  FormControl,
  Grid,
  Grow,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  MenuList,
  OutlinedInput,
  Paper,
  Popper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField, Theme,
  Typography, useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import { X as XIcon } from '../../../icons/x';
import { PropertyList } from '../../property-list';
import { PropertyListItem } from '../../property-list-item';
import { Mensajes } from '../../../types/APImensajes';
import { Scrollbar } from '../../scrollbar';
import { CitasListTable } from './citas-list-table';
import { QuillEditor } from '../../quill-editor';
import { DateTimePicker } from '@mui/lab';
import { APIUser } from 'src/types/APIUser';
import { wait } from 'src/utils/wait';
import toast from 'react-hot-toast';
import router from 'next/router';
import { ConsoleLogger } from '@aws-amplify/core';





interface MensajeDrawerProps {
  containerRef?: MutableRefObject<HTMLDivElement | null>;
  open?: boolean;
  onClose?: () => void;
  mensaje?: Mensajes;
}
interface losParticipantes {
  nombreparticipante: string;
  posicionparticipante: string;
  pacienteparticipante: string;
  emailparticipante: string;
  despachado: boolean;
  id: string;
}






const statusOptions = [
  {
    label: 'Rechazar',
    value: 'Rechazar'
  },
  {
    label: 'Mensaje Anotado',
    value: 'Mensajeanotado'
  },
  {
    label: 'Pendiente',
    value: 'Pendiente'
  },
  {
    label: 'Aceptar Cita',
    value: 'Aceptada Cita'
  }
];


interface MensajePreviewProps {
  lgUp: boolean;
  onApprove?: () => void;
  onEdit?: () => void;
  onReject?: () => void;
  mensaje: Mensajes;
}


const MensajesPreview: FC<MensajePreviewProps> = (props) => {
  const { lgUp, onApprove, onEdit, onReject, mensaje } = props;
  const align = lgUp ? 'horizontal' : 'vertical';

  
 

  

function DateToStr(tfec:string)
{

return tfec.substr(8,2)+'-'+tfec.substr(5,2)+'-'+tfec.substr(0,4) + ' Hora: ' + tfec.substr(11,5)

}

              


  function setValue(newValue: string | null) {
    throw new Error('Function not implemented.');
  }

  return (
    <>
    <Box 
    sx={{ width:600 }}
    >
      <Box  
        sx={{
          
          alignItems: 'center',
          backgroundColor: (theme) => theme.palette.mode === 'dark'
            ? 'neutral.800'
            : 'neutral.100',
          borderRadius: 1,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          px: 3,
          py: 2.5
        }}
      >
        <Typography
          color="textSecondary"
          sx={{ mr: 2 }}
          variant="overline"
        >
          Acciones:
        </Typography>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            m: -1,
            '& > button': {
              m: 1
            }
          }}
        >
       
         
          <Button
            onClick={onEdit}
            size="small"
            startIcon={(<EditIcon fontSize="small" />)}
          >
            Editar...
          </Button>

          <Button
            onClick={onReject}
            size="small"
            variant="outlined"
          >
            cerrar
          </Button>
        </Box>
      </Box>
      <Typography
        sx={{ my: 3 }}
        variant="h6"
      >
        Detalle Solicitud Insumos
      </Typography>
      <PropertyList>
        <PropertyListItem
          align={align}
          disableGutters
          label="ID"
          value={String(mensaje.mensaje_id)}
        />
         {/* <PropertyListItem
          align={align}
          disableGutters
          label="Fecha Propuesta"     
          //value={DateToStr(mensaje.fechaCita.replaceAll('Z',''))}
            //value={mensaje.msgDateCita.toString()}
          //value={format(mensaje.msgDate, 'dd/MM/yyyy HH:mm')}
        /> */}
         <DateTimePicker
          
          label="Fecha Propuesta:"
          inputFormat="dd/MM/yyyy hh:mm "
          //value={startDate?.toString().replaceAll('Z','')}
          readOnly
          value={mensaje.fechaCita}
          onChange={(newValue) => {
            setValue(newValue);}}
          renderInput={(inputProps) => <TextField {...inputProps} />}
        />

        
        <PropertyListItem
          align={align}
          disableGutters
          label="Envia"
          value={mensaje.UsuarioSend}
        />
          
          <Divider sx={{ my: 3 }} />
      <Typography
        sx={{ my: 3 }}
        variant="h6"
      >
        Insumos solicitados:
      </Typography>

    {/*   <PropertyListItem
          align={align}
          disableGutters
          label="Convocados Internos"
          value={mensaje.participantesCia ? mensaje.participantesCia.replaceAll('"','').replaceAll(',','\n'): 'No definidos'}
        /> */}
      {/* <PropertyListItem
          align={align}
          disableGutters
          label=""
          value={mensaje.participantes}
          // value={`${order.currency}${order.totalAmount}`}
        /> */}

      <Grid
        item
        md={12}
        xs={12}
        >
      <Scrollbar>
      {mensaje.participantes.length !=0 && <Fragment>
        <Table sx={{ minWidth: 400 }}>
          <TableHead>
            <TableRow>
            <TableCell>
                Qty
              </TableCell>
              <TableCell>
                Insumo
              </TableCell>
              <TableCell>
                Paciente
              </TableCell>
              <TableCell>
                notas
              </TableCell>
            </TableRow>
          </TableHead>

         

          <TableBody>
            
            {((mensaje.participantes.replaceAll('},','};').split(';')).map((item) =>(JSON.parse(item)))).map((item) => (
              
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
    
              
              </TableRow>
            ))}
          </TableBody>    
        </Table>
        </Fragment>}
      </Scrollbar>

    </Grid>

     
          
            <PropertyListItem
          align={align}
          disableGutters
          label="Mensaje:"
          
        >
       
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {/* {order.customer.address1} */}
          </Typography>

          
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {/* {order.customer.address1} */}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {/* {order.customer.city} */}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {/* {order.customer.country} */}
          </Typography>
        </PropertyListItem>

        <Box
        sx={{
          alignItems: 'center',
          backgroundColor: (theme) => theme.palette.mode === 'dark'
            ? 'neutral.800'
            : 'neutral.100',
          borderRadius: 1,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          px: 3,
          py: 2.5
        }}
      >


        <Typography>
                            
                            <div dangerouslySetInnerHTML={{__html: mensaje.msgMensaje}}></div>
                                                 
                           </Typography>

        
      </Box>
       
        <PropertyListItem
          align={align}
          disableGutters
          label="Enviado a:"
          value={mensaje.UsuarioRecep}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label="Tipo Mensaje"
          value={mensaje.tipoMensaje}
          // value={`${order.currency}${order.totalAmount}`}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label="Status"
          value={mensaje.status}
        />
      </PropertyList>
 

    </Box>

    </>
  );
};

interface MensajeFormProps {
  onCancel?: () => void;
  onSave?: () => void;
  mensaje: Mensajes;
}

const MensajeForm: FC<MensajeFormProps> = (props) => {
  const { onCancel, onSave, mensaje } = props;

  const [sfechaCita,setsFechaCita] =  useState<Date | null>()

const [startDate, setStartDate] = useState<Date | null>(
  
  
);



const [userList, setUserList] = useState<APIUser[]>([]);
const [partiProveeMail,setPartiProvee] = useState<string>('');

const [participantes, setParticipantes] = useState<losParticipantes[]>([]);

useEffect(() => {

  

  setParticipantes((mensaje.participantes.replaceAll('},','};').split(';')).map((item) =>(JSON.parse(item))))


}, [])

useEffect(() => {
  const getUsers = async () => {
    const users = await authApi.getUsers();
    setUserList(users);
    //console.log('Usuarios:',userList,listausuarios)    
  }

  setMsgRespuesta(mensaje.msgMensajeRespuesta)
  setStartDate(mensaje.msgDateCita)

  setsFechaCita(new Date(mensaje.fechaCita))

  console.log('cita bd',mensaje.msgDateCita)
  console.log('***',new Date(mensaje.fechaCita))
  console.log('star date',startDate )

  //console.log('Participantes Cia desde bd:',mensaje.participantesCia)
  

 
  getUsers();

  if(mensaje.participantesCia) {
  setdestinatariosSelected(mensaje.participantesCia.split(',').map((item)=>(JSON.parse(item))))
}

  
if (mensaje.participantes.length != 0)
{
const PartiProvee = mensaje.participantes.replaceAll('},','};').split(';').map((item) =>(JSON.parse(item)))


const PartiProveeEmail = PartiProvee.map((item) => (item.emailparticipante)).toString()

setPartiProvee(PartiProveeEmail)

}



}, [])

const listausuarios = userList.filter(q => q.Username.includes('gessacr.com')).map(q => `${q.Username}`)  // SE USA EN SELECCION MULTIPLE USUARIOS
  




const handleStartDateChange = (newValue: Date | null): void => {
  setsFechaCita(newValue)
  console.log('NEWVALUE-------------->',newValue)
  console.log('fecha de cita:',sfechaCita?.toLocaleString())
 
  const strFeca = newValue?.toISOString()
  console.log('Fecha to ISOSTRING:',strFeca)
  
 
  //setFecha(strFeca)
};

const [openM, setOpen] = useState(false);

const options = [
  'No proceder con Cita',
  'Aceptar Cita',
  'Cerrar y Acordar',
  'Cancelar Cita'
];
const [selectedIndex, setSelectedIndex] = useState(0);

const handleMenuItemClick = (index: number): void => {
  setSelectedIndex(index);
 
  setOpen(false);
};

const anchorRef = useRef<HTMLDivElement>(null);

const [destinatariosSelected, setdestinatariosSelected] = useState<string[]>([]);
const [destinatariosCia,setdestinatariosCia] = useState('');

const [nombreparticipante,setNombreparticipante]= useState('')
const [posicionparticipante,setPosicionparticipante]= useState('')
const [emailparticipante,setEmailparticipante]= useState('')

const handleUsuariosChange = (event: SelectChangeEvent<typeof destinatariosSelected>) => {
  const {
    target: { value },
  } = event;
  setdestinatariosSelected(
    // On autofill we get a stringified value.
    typeof value === 'string' ? value.split(';') : value,
  );
  // console.log('Destinatarios',destinatariosSelected)
  // console.log('Destinatarios convertidos:',destinatariosSelected.map((item) => (JSON.stringify(item))).toString())
  //setdestinatariosCia(destinatariosSelected.map((item) => (JSON.stringify(item))).toString())
};

const handleClose = (event: Event): void => {
  if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
    return;
  }
  setOpen(false);
}
const handleToggle = (): void => {
  //console.log('handletoggle')
  setOpen((prevOpen) => !prevOpen);
};

const [msgRespuesta, setMsgRespuesta] = useState<string>('');

const handleMensajeRespuesta = (value: string): void => {
  //console.log(value)
  setMsgRespuesta(value)
  //console.log('respuesta ',msgRespuesta)
};

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
const { user } = useAuth(); 
//console.log('USUARIO:',user)
//const [accion,setAccion]= useState('')

const RechazarCita = async (): Promise<void> => {

ActualizoCita('RECHAZADA');


}

const generarId = () => {
  const random = Math.random().toString(36).substring(2);
  const fechaa = Date.now().toString(36)

  return random + fechaa}

const AceptarCita = async (): Promise<void> => {
  //setAccion('ACEPTADA');
  ActualizoCita('ACEPTADA');
  
  
  }

  const AcordarCita = async (): Promise<void> => {
    //setAccion('ACEPTADA');
    ActualizoCita('ACORDADA');
    
    
    }


    const editarParticipante = (id:string) => 
    {

      console.log('ID de arreglo',participantes)

     

      
    
          const ActParticipantes = participantes.map(function(item){
            if(item.id == id)
              return  {nombreparticipante:item.nombreparticipante , posicionparticipante: item.posicionparticipante , pacienteparticipante: item.pacienteparticipante, emailparticipante:item.emailparticipante , despachado: !item.despachado , id: item.id }
              else
            
            return {nombreparticipante:item.nombreparticipante , posicionparticipante: item.posicionparticipante , pacienteparticipante: item.pacienteparticipante,emailparticipante:item.emailparticipante , despachado: item.despachado , id: item.id }
          });

          console.log('Nuevo arreglo',ActParticipantes)
      
        setParticipantes(ActParticipantes)    
    }
    
      
        

    
   
    
    
    

const ActualizoCita = async (Accion:string): Promise<void> => {
  setdestinatariosCia(destinatariosSelected.map((item) => (JSON.stringify(item))).toString())
  
  const DestinaCia = destinatariosSelected.map((item) => (JSON.stringify(item))).toString()
 

  // const totalDestinos = partiProveeMail + ',' + DestinaCia.replaceAll('"','')
  const totalDestinos = ''
 
console.log('VALORES A ACTUALIZAR')

console.log('ID, SEND, RECEP, RESPUESTA,ELIMINADO,DESTINATARIOS,ACCION,TOTAL DESTINOS,FECHA')
console.log( mensaje.mensaje_id,
  mensaje.UsuarioSend,
  mensaje.UsuarioRecep,
  msgRespuesta , 
  mensaje.msgEliminado,        // true si no se acepta la cita

  DestinaCia , //mensaje.participantes,
  Accion, // poner aque segun el tipo de transaccion
  totalDestinos)
  console.log('fecha', sfechaCita ?  sfechaCita?.toISOString():'')
  
 
  
  if (confirm("Desea actualizar Solicitud Insumos:? " ) == true) 
  {
    
      
  try {
    
     await productApi.updateMensaje(
      mensaje.mensaje_id,
      mensaje.UsuarioSend,
      mensaje.UsuarioRecep,
      msgRespuesta , // . mensaje.msgMensajeRespuesta,
      mensaje.msgEliminado,        // true si no se acepta la cita
      participantes.map((item) =>(JSON.stringify(item))).toString(),
      DestinaCia , //mensaje.participantes,
      Accion, // poner aque segun el tipo de transaccion
      totalDestinos,
      sfechaCita?.toISOString(),
      //startDate?.toLocaleString().replace(',','') ,
      //startDate?.toLocaleString().replace(',','') ,

      );
    await wait(500);
   
    toast.success('Cita Actualizada!');
    
    router.push(`/dashboard/`).catch(console.error);
  } catch (err) {
    console.error(err);
    toast.error('Error en la creacion del mensaje!');
   
  }
}




};


  return (
    <>
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: (theme) => theme.palette.mode === 'dark'
            ? 'neutral.800'
            : 'neutral.100',
          borderRadius: 1,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          px: 3,
          py: 2.5
        }}
      >
        <Typography
          variant="overline"
          sx={{ mr: 2 }}
          color="textSecondary"
        >
          Acciones Cita:
        </Typography>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            m: -1,
            '& > button': {
              m: 1
            }
          }}
        >
          { user && 
          <>
          <Button
           disabled={user.UserType != 2}
            color="error"
            onClick={RechazarCita}
            size="small"
            variant="contained"
          >
            Rechazar
          </Button>
          <Button
           disabled={user.UserType != 2}
            color="primary"
            onClick={AceptarCita}
            size="small"
            variant="contained"
          >
            Aceptar Sol. Insumo
          </Button>
          <Button
            disabled={user.UserType != 1}
            color="primary"
            onClick={AcordarCita}
            size="small"
            variant="contained"
          >
            Acordar
          </Button>
          </>
          }
{/* <Fragment>
<ButtonGroup
        ref={anchorRef}
        variant="contained"
        
      >
        <Button  
          type="submit"
          onClick={ActualizoCita} >
          {options[selectedIndex]}
        </Button>
        <Button
          onClick={handleToggle}
          size="small"
          sx={{ backgroundColor: 'primary.dark' }}
         
        >
          <ArrowDropDownIcon fontSize="small" />
        </Button>
      </ButtonGroup>
      {console.log('OPEN',openM)}
        <Popper
        anchorEl={anchorRef.current}
        
        open={openM}
        transition
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom'
                  ? 'center top'
                  : 'center bottom'
            }}
          >
            <Paper>

        <ClickAwayListener onClickAway={handleClose}>

            <MenuList id="split-button-menu">
            {console.log('Opciones:',options)}
                  {options.map((option, index) => (
                    <MenuItem
                      //disabled={index === 3}
                      key={option}
                      onClick={() => handleMenuItemClick(index)}
                      selected={index === selectedIndex}
                    >
                      {option}
                      {console .log('OPT',option)}
                    </MenuItem>
                  ))}
                </MenuList>
        </ClickAwayListener>
        </Paper>

            
</Grow>
)}
</Popper>

</Fragment> */}
          <Button
            onClick={onCancel}
            size="small"
            variant="outlined"
          >
            Regresar...
          </Button>
        </Box>
      </Box>
      <Typography
        sx={{ my: 2 }}
        variant="h5"
      >
        Editar Solicitud Insumos
      </Typography>

      
      <TextField
        disabled
        fullWidth
        label="ID"
        margin="normal"
        name="id"
        value={mensaje.mensaje_id}
      />
      <TextField
        disabled
        fullWidth
        label="Envia"
        margin="normal"
        name="number"
        value={mensaje.UsuarioSend}
      />
      <TextField
        disabled
        fullWidth
        label="Destinatario"
        margin="normal"
        name="customer_name"
        value={mensaje.UsuarioRecep}
      />
     
     <Divider sx={{ my: 3 }} />
      <Typography
        sx={{ my: 3 }}
        variant="h6"
      >
        Insumos solicitados a gestionar!:
      </Typography>

     {/*  <PropertyListItem
       
          disableGutters
          label="Convocados Internos"
          value={mensaje.participantesCia ? mensaje.participantesCia.replaceAll('"','').replaceAll(',','\n'): 'No definidos'}
        /> */}
      {/* <PropertyListItem
          align={align}
          disableGutters
          label=""
          value={mensaje.participantes}
          // value={`${order.currency}${order.totalAmount}`}
        /> */}

      <Grid
        item
        md={12}
        xs={12}
        >
      <Scrollbar>
      {mensaje.participantes.length !=0 && <Fragment>
        <Table sx={{ minWidth: 400 }}>
          <TableHead>
            <TableRow>
            <TableCell>
                Qty
              </TableCell>
              <TableCell>
                Insumo
              </TableCell>
              <TableCell>
                Paciente/Hospital
              </TableCell>
              <TableCell>
                notas
              </TableCell>
              <TableCell>
                Despach.
              </TableCell>
              <TableCell>
                Asignar
              </TableCell>
            </TableRow>
          </TableHead>

         

          <TableBody>
          { console.log(participantes)}
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
                <TableCell>
                  {item.despachado? 'Si':'No'}
                </TableCell>
                <Button
                  onClick={() => editarParticipante(item.id)}
                  endIcon={(<ArrowRightIcon fontSize="small" />)} >
                </Button>
    
              
              </TableRow>
            ))}
          </TableBody>    
        </Table>
        </Fragment>}
      </Scrollbar>

    </Grid>


    <Typography
        sx={{ my: 3 }}
        variant="h6"
      >
        Observaciones...
      </Typography>


<Box

        sx={{
          alignItems: 'center',
          backgroundColor: (theme) => theme.palette.mode === 'dark'
            ? 'neutral.800'
            : 'neutral.100',
          borderRadius: 1,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          px: 3,
          py: 2.5,

          
          
        }}

        
      >




        <Typography>
                            
        <div dangerouslySetInnerHTML={{__html: mensaje.msgMensaje}}></div>
                                                 
        </Typography>

        
      </Box>

        <Typography
        sx={{ my: 3 }}
        variant="h6"
      >
        Fecha definitiva cita y acuerdos
      </Typography>
   
   { user && 
      <DateTimePicker
            disabled={user.UserType != 2}
            label=""
            inputFormat="dd/MM/yyyy hh:mm a"
            value={sfechaCita}
            onChange={handleStartDateChange}
            renderInput={(inputProps) => <TextField {...inputProps} />}
          />

}
     
     

                                   {/*     <Grid                     // LOGICA PARA INGRESAR VARIOS USUARIOS GESSA <-
                                      item
                                      md={12}
                                      xs={12}
                                      sx={{ mt: 5 }}>
                                     
                                      <FormControl variant="standard" 
                                      sx={{ minWidth: 550, maxWidth: 550 }}>

                                        <InputLabel id="demo-multiple-checkbox-label">Convocar aqui funcionarios internos...</InputLabel>
                                        <Select
                                          labelId="demo-multiple-checkbox-label"
                                          id="demo-multiple-checkbox"
                                          multiple
                                          value={destinatariosSelected}
                                          onChange={handleUsuariosChange}
                                          label="Agregue aqui los participantes Gessa" 
                                          input={<OutlinedInput/>}
                                          renderValue={(selected) => selected.join(', ')}
                                          MenuProps={MenuProps}
                                        >
                                          {listausuarios.map((name) => (
                                            <MenuItem key={name} value={name}>
                                              <Checkbox checked={destinatariosSelected.indexOf(name) > -1} />
                                              <ListItemText primary={name} />
                                            </MenuItem>
                                          ))}
                                        </Select>
                                        </FormControl>
                                    </Grid>                     */}                           


      
                                    {user.UserType == '1' &&        <Fragment>
       <QuillEditor
        
        
        placeholder="Respuesta y/o acuerdo"
        sx={{
          height: 400,
          mt: 3
        }}
        value={msgRespuesta}   //{mensaje.msgMensajeRespuesta}
        onChange={handleMensajeRespuesta}
      />
      </Fragment> }
        {/* <TextField
       
        fullWidth
        label="Respuesta"
        margin="normal"
        name="address"
        value={mensaje.msgMensajeRespuesta}
      /> */}
            {/*
      <TextField
        fullWidth
        label="Country"
        margin="normal"
        name="country"
        // value={order.customer.country}
      />
      <TextField
        fullWidth
        label="State/Region"
        margin="normal"
        name="state_region"
        // value={order.customer.city}
      />
      <TextField
        fullWidth
        label="Total Amount"
        margin="normal"
        name="amount"
        // value={order.totalAmount}
      /> */}
      {/* <TextField
        fullWidth
        label="Status"
        margin="normal"
        name="status"
        select
        SelectProps={{ native: true }}
        value={mensaje.status}
      >
        {statusOptions.map((statusOption) => (
          <option
            key={statusOption.value}
            value={statusOption.value}
          >
            {statusOption.label}
          </option>
        ))}
      </TextField> */}
      {/* <Button
        color="error"
        sx={{ mt: 3 }}
      >
        Rechazar solicitud
      </Button> */}
    </>
  );
};

const MensajeDrawerDesktop = styled(Drawer)({
  width: 800,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    position: 'relative',
    width: 800
  }
});

const MensajeDrawerMobile = styled(Drawer)({
  flexShrink: 0,
  maxWidth: '100%',
  height: 'calc(100% - 64px)',
  width: 500,
  '& .MuiDrawer-paper': {
    height: 'calc(100% - 64px)',
    maxWidth: '100%',
    top: 64,
    width: 500
  }
});

export const CitasDrawer: FC<MensajeDrawerProps> = (props) => {
  const { containerRef, onClose, open, mensaje, ...other } = props;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // The reason for doing this, is that the persistent drawer has to be rendered, but not it's
  // content if an order is not passed.
  const content = mensaje
    ? (
      <>
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            justifyContent: 'space-between',
            px: 3,
            py: 2
          }}
        >
          <Typography
            color="inherit"
            variant="h6"
          >
            {mensaje.UsuarioSend}
          </Typography>
          <IconButton
            color="inherit"
            onClick={onClose}
          >
            <XIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box
          sx={{
            px: 3,
            py: 4
          }}
        >
          {
            !isEditing
              ? (
                <MensajesPreview
                  onApprove={onClose}
                  onEdit={handleEdit}
                  onReject={onClose}
                  mensaje={mensaje}
                  lgUp={lgUp}
                />
              )
              : (
                <MensajeForm
                  onCancel={handleCancel}
                  onSave={handleEdit}
                  mensaje={mensaje}
                />
              )
          }
        </Box>
      </>
    )
    : null;

  if (lgUp) {
    return (
      <MensajeDrawerDesktop
        anchor="right"
        open={open}
        SlideProps={{ container: containerRef?.current }}
        variant="persistent"
        {...other}
      >
        {content}
      </MensajeDrawerDesktop>
    );
  }

  return (
    <MensajeDrawerMobile
      anchor="right"
      ModalProps={{ container: containerRef?.current }}
      onClose={onClose}
      open={open}
      SlideProps={{ container: containerRef?.current }}
      variant="temporary"
      {...other}
    >
      {content}
    </MensajeDrawerMobile>
  );
};

CitasDrawer.propTypes = {
  containerRef: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  // @ts-ignore
  order: PropTypes.object
};
