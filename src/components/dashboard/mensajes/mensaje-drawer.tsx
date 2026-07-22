import { useCallback, useEffect, useState } from 'react';
import type { FC, MutableRefObject } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import numeral from 'numeral';
import {
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Link,
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
import { MensajesListTable } from './mensaje-list-table';
import { QuillEditor } from '../../quill-editor';
import { productApi } from 'src/__fake-api__/product-api';
import { useAuth } from '../../../hooks/use-auth';
import toast from 'react-hot-toast';
import router from 'next/router';
import { wait } from 'src/utils/wait';


import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';

import { Icon } from '@react-pdf-viewer/core';




interface MensajeDrawerProps {
  containerRef?: MutableRefObject<HTMLDivElement | null>;
  open?: boolean;
  onClose?: () => void;
  mensaje?: Mensajes;
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


  function b64DecodeUnicode(str: any) {
    //console.log('str en b64 decode:',str)
    console.log('str b64',str)
    if (str) {
    return Buffer.from(str, "base64").toString("utf8")}
    else return ''

    
}
  const [foto1,setfoto1] = useState('')
  const posts = [
    {
      id: '24b76cac9a128cd949747080',
     
      category: 'Foto Mensaje',
      cover: foto1,
      title: ''
    }
  ];
  const BlogPostCardMediaWrapper = styled('div')({
    paddingTop: 'calc(100% * 4 / 4)',
    position: 'relative'
  });

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

const [url, seturl] = useState('')
const [tipImage, setTipImage] = useState('')

//<ProductResponse>('gsone/getItems');


const getFoto = async () => {
  try {
    

   const id= toast.loading('Cargando Foto...')
 
   const data = await productApi.getFotoMensaje(mensaje.mensaje_id);
   toast.dismiss(id)

   if (data.length === 0) {
     toast.error('No existe PDF!')
   }
   else {
      console.log('la fotico',data.foto[0].foto)
   
       toast.success('Foto Cargada!')
       setfoto1(b64DecodeUnicode(data.foto[0].foto))

       console.log('convertida la foto',foto1)
    
   }
 } catch (err) {
   console.error(err);
 }
};

/* useEffect(() => {


getFoto()

}, []) */



  useEffect(() => {

    getFoto()  
 

   console.log('PDF PDF ...',foto1)

    // alert(foto1.substring(0,27))

    // seturl( URL.createObjectURL(mensaje.Foto))

    

    if(mensaje.participantes == 'pdf') setTipImage('pdf' )
    else setTipImage('foto' )

  }, [mensaje.mensaje_id]); // 👈️ empty dependencies array

  return (
    <>

<Box 
    sx={{ width:800 }}
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
            Responder Mensaje
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
        Detalle Mensaje
      </Typography>
      <PropertyList>
        <PropertyListItem
          align={align}
          disableGutters
          label="ID"
          value={String(mensaje.mensaje_id)}
        />
      
        <PropertyListItem
          align={align}
          disableGutters
          label="Envia:"
          value={mensaje.UsuarioSend}
        />
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
          <Typography>
                            
         <div dangerouslySetInnerHTML={{__html: mensaje.msgMensaje}}></div>
                              
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
       
        <PropertyListItem
          align={align}
          disableGutters
          
          label="Enviado a:"
          value={mensaje.UsuarioRecep}
        />
        
        <PropertyListItem
          align={align}
          disableGutters
          label="Respuesta:"
          
        >
       
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {/* {order.customer.address1} */}
          </Typography>
          <Typography>
                            
         <div dangerouslySetInnerHTML={{__html: mensaje.msgMensajeRespuesta}}></div>
                              
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
    
        <PropertyListItem
          align={align}
          disableGutters
          label="Status"
          value={mensaje.status}
        />
      </PropertyList>
      <Divider sx={{ my: 3 }} />

       {(tipImage=='foto') &&   
      
      <Grid
      container
      spacing={3}
    >
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
                  top: 0,
                  width: '100%'
                }}
              />
            </BlogPostCardMediaWrapper>
            <Box sx={{ mt: 2 }}>
              <div>
                <Chip
                  label={post.category}
                  variant="outlined"
                />
              </div>
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
           
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
    }
    {(tipImage=='pdf' &&   foto1.length > 0) &&   
                              <>

                          <div
    style={{
        border: '1px solid rgba(0, 0, 0, 0.3)',
        height: '750px',
    }}
>
<Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js"/>
    <Viewer fileUrl={foto1} plugins={[defaultLayoutPluginInstance]}/>
</div>
</>}
            
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
  const [msgRespuesta, setMsgRespuesta] = useState<string>('');
  //setMsgRespuesta(mensaje.msgMensajeRespuesta)
  
  useEffect(() => {
    
  
    setMsgRespuesta(mensaje.msgMensajeRespuesta)
    
  
  
  }, [])


  const handleMensajeRespuesta = (value: string): void => {
    console.log(value)
    setMsgRespuesta(value)
    console.log('respuesta ',msgRespuesta)
  };
  
  const ActualizoCita = async (): Promise<void> => {
    // console.log('Fecha:',fecha)
    
    if (confirm("Desea actualizar mensaje:? " + 'titulo') == true) 
    {
        
    try {
      
       await productApi.updateMensaje(
        mensaje.mensaje_id,
        mensaje.UsuarioSend,
        mensaje.UsuarioRecep,
        msgRespuesta , // . mensaje.msgMensajeRespuesta,
        mensaje.msgEliminado,        // true si no se acepta la cita
        '' , //mensaje.participantes,
        'RECIBIDO', // poner aque segun el tipo de transaccion
        '',''
        );
      await wait(500);
     
      toast.success('Mensaje actualizado!');
      
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
          Acciones Mensaje
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
          <Button
            color="primary"
            onClick={ActualizoCita}
            size="small"
            variant="contained"
          >
            Salvar cambios
          </Button>
          <Button
            onClick={onCancel}
            size="small"
            variant="outlined"
          >
            Regresar
          </Button>
        </Box>
      </Box>
      <Typography
        sx={{ my: 3 }}
        variant="h4"
      >
        Edicion del Mensaje
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
     
       {/* <TextField
       disabled
        fullWidth
        label="Mensaje Original"
        margin="normal"
        name="address"
        value={mensaje.msgMensaje}
      /> */}
        <Typography>
          Mensaje Original:
                            
                            <div dangerouslySetInnerHTML={{__html: mensaje.msgMensaje}}></div>
                                                 
                           </Typography>
        <Typography
        sx={{ my: 3 }}
        variant="h6"
      >
        Respuesta al mensaje
      </Typography>
     
    

       <QuillEditor
        //onChange={handleChange}
        onChange={handleMensajeRespuesta}
        placeholder="Respuesta y/o acuerdo"
        sx={{
          height: 400,
          mt: 3
        }}
        value={msgRespuesta}
      />

       
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

export const MensajeDrawer: FC<MensajeDrawerProps> = (props) => {
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
                  onSave={handleCancel}
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

MensajeDrawer.propTypes = {
  containerRef: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  // @ts-ignore
  order: PropTypes.object
};


