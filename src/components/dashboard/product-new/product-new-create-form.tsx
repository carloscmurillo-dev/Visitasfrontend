import { FC, useEffect ,useRef,ChangeEvent} from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Tooltip,
  Stack,
  Grid,
  Switch,
  TextField,
  Typography,
  MenuItem,
  Select,
  MenuList,
  ClickAwayListener,
  Paper,
  Grow,
  Popper,
  ButtonGroup
} from '@mui/material';
import type { File } from '../../file-dropzone';
import { productApi } from 'src/__fake-api__/product-api';
import { Provider } from 'src/types/getProvider';
//import { authApi } from 'src/__fake-api__/auth-api';
import { Category } from 'src/types/APIcategory';
import {SubCategory} from 'src/types/APISubCategory'
import { Articulo } from 'src/types/product-new';
import {Marca} from 'src/types/APImarcas'
import {MercadoOrigen} from 'src/types/APImercadoOrigen'
import {PlazosPago} from 'src/types/APIplazosPago'
import {TipoCompra} from 'src/types/APItiposCompra'
import {TiposGravados} from 'src/types/APItiposgravados'
import {UnidadEmpaque} from 'src/types/APIunidadempaque'
import {TiposRegistro} from 'src/types/APITiposRegistro'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { wait } from 'src/utils/wait';
import { format, subHours, subMinutes, subSeconds } from 'date-fns';
import { Avatar, CardMedia, Chip, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddPhotoIcon from '@mui/icons-material/AddPhotoAlternate';
//import 'react-dropzone-uploader/dist/styles.css'
import { FileDropzone } from '../../file-dropzone';
import { fileToBase64 } from '../../../utils/file-to-base64';
import { QuillEditor } from '../../quill-editor';
//import Dropzone from 'react-dropzone-uploader'
import { useAuth } from '../../../hooks/use-auth';
import { Schema } from '@mui/icons-material';

export const ArticulosCreateForm: FC = (props) => {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [ProductList, setProductList] = useState<Articulo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<string | null>(null);

  const [ean13,setEan13]= useState<string    | null>(null);                   

  const [subcategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subcategory, setsubCategory] = useState<string | null>(null);

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [marca, setmarca] = useState<string | null>(null);
  
  const [mercadoOrigens, setMercadoOrigens] = useState<MercadoOrigen[]>([]);
  const [mercadoOrigen, setMercadoOrigen] = useState<string | null>(null);
  // const [plazosPagos, setPlazosPagos] = useState<PlazosPago[]>([]);
  // const [plazosPago, setPlazosPago] = useState<string | null>(null);

  const [tiposRegistro, setTiposRegisgro] = useState<TiposRegistro[]>([]);
  const [tipoRegistro, setTipoRegistro] = useState<string | null>(null);

  const [tipoCompras ,setTipoCompras] = useState<TipoCompra[]>([]);
  const [tipoCompra, setTipoCompra] = useState<string | null>(null);
  const [tiposGravados ,setTiposGravados] = useState<TiposGravados[]>([]);
  const [tiposGravado, setTiposGravado] = useState<string | null>(null);
  const [estatus,setEstatus] = useState('DIGITADO')
  const [UnidadEmpaques ,setUnidadEmpaques] = useState<UnidadEmpaque[]>([]);
  const [unidadEmpaque, setUnidadEmpaque] = useState<string | null>(null);

  const [categoryIdSelected, setCategoryIdSelected] = useState<number | null>(null);
  const [subCategoryIdSelected, setSubCategoryIdSelected] = useState<number | null>(null);

  const [provider, setProvider] = useState<string | null>(null);
  const [adcode, setAdcode] = useState<string | null>(null);
  
  const BlogPostCardMediaWrapper = styled('div')({
    paddingTop: 'calc(100% * 4 / 4)',
    position: 'relative'
  });

 

  const [foto1,setfoto1] = useState('/static/mock-images/covers/caja.png')
  const [foto2,setfoto2] = useState('/static/mock-images/covers/caja.png')
  const [foto3,setfoto3] = useState('/static/mock-images/covers/caja.png')
  const [foto4,setfoto4] = useState('/static/mock-images/covers/caja.png')
  const [foto5,setfoto5] = useState('/static/mock-images/covers/caja.png')

  const { user } = useAuth(); 

  //user.formActive = true ;



  const options = [
    'Guardar',
    'Guardar y Enviar a Gessa',
   // 'Procesar'
  ];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleMenuItemClick = (index: number): void => {
    setSelectedIndex(index);
   // alert('Seleccion escogida:' + selectedIndex)
    setOpen(false);
  };
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleClose = (event: Event): void => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  }
  const handleToggle = (): void => {
    setOpen((prevOpen) => !prevOpen);
  };
  //console.log('USUARIO:',user)

  const posts = [
    {
      id: '24b76cac9a128cd949747080',
     
      category: 'Foto Frente',
      cover: foto1,
      title: ''
    },
    {
      id: 'a9c19d0caf2ca91020aacd1f',
   
      category: 'Foto Lado',
      cover: foto2,
     title: ''
    },
    {
      id: '44df90cbf89963b8aa625c7d',
    
      category: 'Foto Arriba Base',
      cover: foto3,
      title: ''
    }
  ];
  

  const handleDropCover1 = async ([file]: File[]) => {
    const data = await fileToBase64(file) as string;
   console.log('longitud foto:',data.length)
   if (data.length > 400000) {
    alert('Imagen 1 excede 300k')}
    else {
   
    {setfoto1(data);} }
  };

  const handleDropCover2 = async ([file]: File[]) => {
    const data = await fileToBase64(file) as string;
   
    if (data.length > 400000) {
      alert('Imagen 2 excede 300k')}
      else {
     
      {setfoto2(data);} }
  };

  const handleDropCover3 = async ([file]: File[]) => {
    const data = await fileToBase64(file) as string;
   
    if (data.length > 400000) {
      alert('Imagen 3 excede 300k')}
      else {
     
      {setfoto3(data);} }
  };

  const handleRemove1 = (): void => {
    setfoto1('/static/mock-images/covers/caja.png');
  };
  const handleRemove2 = (): void => {
    setfoto2('/static/mock-images/covers/caja.png');
  };
  const handleRemove3 = (): void => {
    setfoto3('/static/mock-images/covers/caja.png');
  };


  useEffect(() => {
    const getArticulos = async () => {
      const articulos = await productApi.getArticulos();
      setProductList(articulos);
    }
    async function fetchCategories() {
      const data = await productApi.getCategories();
      setCategories(data);
    }
// poner aqui el segundo parametro   ojo
    async function fetchSubCategories() {
      const data = await productApi.getSubCategories(2);
      setSubCategories(data);
    }
    async function fetchMarcas() {
      const data = await productApi.getMarcas();
      setMarcas(data);
      //console.log('Marcas',data)
    }

    async function fetchUnidadEmpaques() {
      const data = await productApi.GetUnidadEmpaque();
      //console.log(data)
      setUnidadEmpaques(data);
    }

    async function fetchMercadoOrigen() {
      const data = await productApi.getMercadoOrigen();
      setMercadoOrigens(data);
    }

    // async function fetchPlazosPago() {
    //   const data = await productApi.getPlazosPago();
    //   setPlazosPagos(data);
    // }
    async function fetchTipoCompras() {
      const data = await productApi.GetTipoCompra();
      setTipoCompras(data);
    }

    async function fetchTipoRegistro() {
      const data = await productApi.GetTipoRegistros();
      setTiposRegisgro(data);
    }

    async function fetchTiposGravados() {
      const data = await productApi.getTiposGravados();
      setTiposGravados(data);
    }
  
    // AQUI PONER TODOS LOS FETCHS DE LAS REFERENCIAS
    getArticulos();
    fetchCategories();
    fetchSubCategories();
    fetchMarcas();
    fetchUnidadEmpaques();
    fetchMercadoOrigen();
    //fetchPlazosPago();
    fetchTipoCompras();
    fetchTiposGravados();
    fetchTipoRegistro();

  }, [])
  const formik = useFormik({
      initialValues: {
      ProveedorID:  user.gln ,     // CAMBIAR POR EL PROVEEDOR DE SEGURIDAD
      //ArticuloID:  1110,
      DescripcionProducto:  '' ,
      //MarcaID:  0 ,
      TamanoGessa:  '' ,
      //IdUnidadEmpaque: 0 ,
      EAN13:  '' ,
      DUN14:  '' ,
      CompraEnUnidades:  false,
      DescripcionLarga: '',
      DescripcionPublicacion: '',
      UnidadMedida:  '' ,
      SaborAroma:  '' ,
      //categoria_id:  0 ,
      //subcategoria_id:  0 ,
      SegmentoID:  0 ,
      // PlazoPagoID:  0 ,
      //tipoCompra_id:  0 ,
      CabysCodigo:  '' ,
      CostoEmpaque:  0 ,
      CostoUnitario:  0 ,
     // GravadoID:  0 ,
      GravadoOExento:  false,
      PorcImpConsumo:  0 ,
      TiempoVigencia:  0 ,
      MedProdAnchoProducto:  0 ,
      MedProdAltoProducto:  0 ,
      MedProdLargoProducto:  0 ,
      MedProdPesoNeto:  0 ,
      MedProdPesoBruto:  0 ,
      MedProdPesoEscurrido:  0 ,
      MedProdDiametro:  0 ,
      MedCajaAnchoProducto:  0 ,
      MedCajaAltoProducto:  0 ,
      MedCajaLargoProducto:  0 ,
      FotoProductoFrente:  null ,
      FotoProductoLado:  null,
      FotoProductoArribaBase:  null ,
      DescuentoConfidencialDC:  0 ,
      DescuentoIntroduccionDEI:  0 ,
      DescuentoFijoDFI:  0 ,
      DescuentoNoDevolucionDND:  0 ,
      CentroDistribucionTAE:  0 ,
      PromocionalPAE:  0 , 
      status: 'DIGITADO',
      CambioPrecio: false,
      
      submit: null
    },
    validationSchema: Yup.object({
      // aqregar aqui las validaciones
    
      DescripcionProducto: Yup.string().max(155).required(),
      CabysCodigo: Yup.string().min(13,'Codigo Cabys no debe tener menos de 13 caracteres').max(13,'Codigo Cabys no debe tener mas de 13 caracteres').matches(/^[0-9]+$/, "Solo digitos 0 a 9"),
      Ean13: Yup.number(),
      Dun14: Yup.number(),
      CostoEmpaque:  Yup.number().required('Debe especificar Monto numerico!').positive() ,
      CostoUnitario:  Yup.number().moreThan(0,'Digite mayor que cero').positive() ,
      UnidadMedida:  Yup.string().required('Unidad de Medida requerida!'),
      SaborAroma:  Yup.string().required('Sabor y Aroma requerida !'),
      TiempoVigencia: Yup.number().required('Debe especificar Monto numerico!').positive().integer('Campo debe ser entero!') ,
      MedProdAnchoProducto:  Yup.number().required('Debe especificar Monto numerico!').positive('Campo debe ser positivo mayor a cero!'),
      MedProdAltoProducto:  Yup.number().required('Debe especificar Monto numerico!').positive('Campo debe ser positivo mayor a cero!'),
      MedProdLargoProducto:  Yup.number().required('Debe especificar Monto numerico!').positive('Campo debe ser positivo mayor a cero!'),
      MedProdPesoNeto:  Yup.number().required('Debe especificar Monto numerico!').positive('Campo debe ser positivo mayor a cero!') ,
      MedProdPesoBruto:  Yup.number().required('Debe especificar Monto numerico!').positive('Campo debe ser positivo mayor a cero!') ,
      MedProdPesoEscurrido:  Yup.number().required('Debe especificar Monto numerico!').positive('Campo debe ser positivo mayor a cero!') ,
      MedProdDiametro:  Yup.number().required('Debe especificar Monto numerico!').positive('Campo debe ser positivo mayor a cero!'),
      MedCajaAnchoProducto:  Yup.number().required('Debe especificar Monto numerico!').positive('Campo debe ser positivo mayor a cero!') ,
      MedCajaAltoProducto:  Yup.number().required('Debe especificar Monto numerico!').positive('Campo debe ser positivo mayor a cero!') ,
      MedCajaLargoProducto: Yup.number().required('Debe especificar Monto numerico!').positive('Campo debe ser positivo mayor a cero!'),
      DescuentoConfidencialDC:  Yup.number().required('Debe especificar Monto numerico!') ,
      DescuentoIntroduccionDEI:  Yup.number().required('Debe especificar Monto numerico!'),
      DescuentoFijoDFI:  Yup.number().required('Debe especificar Monto numerico!'),
      DescuentoNoDevolucionDND:  Yup.number().required('Debe especificar Monto numerico!') ,
      CentroDistribucionTAE:  Yup.number().required('Debe especificar Monto numerico!'),
      PromocionalPAE:  Yup.number().required('Debe especificar Monto numerico!') , 
  
      
    }),
    onSubmit: async (values, helpers): Promise<void> => {
     
      console.log(Number(marca),Number(unidadEmpaque), Number(categoryIdSelected), Number(subCategoryIdSelected),Number(tipoRegistro),Number(tipoCompra),Number(tiposGravado))
      console.table(estatus)
      //alert('Insertando Articulo:' + values.DescripcionProducto )
      if (confirm(selectedIndex==0?  "Desea solo agregar articulo:? " : 'Desea agregar y enviar a Gessa:?' + values.DescripcionProducto) == true) 
      {
        //await Schema.Validate()
        
      //      console.log(values)
      try {
        await productApi.newArticulo(
          values.ProveedorID
          ,null
          ,values.DescripcionProducto 
          ,Number(marca)
          ,values.TamanoGessa 
          ,Number(unidadEmpaque)
          ,values.EAN13 
          ,values.DUN14 
          ,values.CompraEnUnidades 
          ,''
          ,''
          ,values.UnidadMedida 
          ,values.SaborAroma 
          ,Number(categoryIdSelected)
          ,Number(subCategoryIdSelected)
          ,values.SegmentoID 
          ,Number(tipoRegistro)
          ,Number(tipoCompra)
          ,values.CabysCodigo 
          ,values.CostoEmpaque 
          ,values.CostoUnitario 
          ,Number(tiposGravado)
          ,values.GravadoOExento 
          ,values.PorcImpConsumo 
          ,values.TiempoVigencia 
          ,values.MedProdAnchoProducto 
          ,values.MedProdAltoProducto 
          ,values.MedProdLargoProducto 
          ,values.MedProdPesoNeto 
          ,values.MedProdPesoBruto 
          ,values.MedProdPesoEscurrido 
          ,values.MedProdDiametro 
          ,values.MedCajaAnchoProducto 
          ,values.MedCajaAltoProducto 
          ,values.MedCajaLargoProducto 
          ,foto1
          ,foto2
          ,foto3
          ,foto4
          ,foto5
          ,values.DescuentoConfidencialDC 
          ,values.DescuentoIntroduccionDEI 
          ,values.DescuentoFijoDFI 
          ,values.DescuentoNoDevolucionDND 
          ,values.CentroDistribucionTAE 
          ,values.PromocionalPAE 
          ,selectedIndex==0?'DIGITADO':'ASISTENTE'
          ,false
        );
        // NOTE: Make API request
        await wait(500);
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        toast.success('Articulo creado!');
        
        router.push(`/dashboard/products-new`).catch(console.error);
      } catch (err) {
        console.error(err);
        toast.error('Error en la creacion del articulo!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  }
  }
  );
  
  const handleChangePP = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const tipoRegistroSplit = (event.target.value).split('-');
    setTipoRegistro(tipoRegistroSplit[0]);
    //alert(plazosPago)
  };
  const handleChangeTC = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    setTipoCompra(categorySplit[0]);
  };
  const handleChangeImp = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    setTiposGravado(categorySplit[0]);
    //console.log('Tipos gravado:',tiposGravado)
  };
  const handleChangeUE = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const ueSplit = (event.target.value).split('-');
    setUnidadEmpaque(ueSplit[0]);
  };
  const handleChangeMarca = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    setmarca(categorySplit[0]);
  };
  const handleCategoryChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    const data = await productApi.getSubCategories(Number(categorySplit[0]));
    setCategoryIdSelected(Number(categorySplit[0]));
    setSubCategories(data)
  };
  const handleSubcategoryChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    setSubCategoryIdSelected(Number(categorySplit[0]));
   // alert(subCategoryIdSelected)
  }

  const handleChangeEstatus = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const estatus = (event.target.value).split('-');
    setEstatus(estatus[0]);
    //console.log('Tipos gravado:',estatus)
  };

  const handleValidateEAN13 = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value= event.target.value;
    setEan13(value)
    console.log('EAN13 cambio: ',event.target.value);
  };

  const handleChangeStatus = ({ meta }: any, status: any) => {
    //console.log('Estatus fotos:',meta)
    //console.log('Estatus', status)
    if (status == 'removed')
    {
    switch(meta.previewUrl) {
    case foto1:
      setfoto1('/static/mock-images/covers/caja.png') ; 
      break;
    case foto2:
       setfoto2('/static/mock-images/covers/caja.png') ;
       break;
     case foto3:
        setfoto3('/static/mock-images/covers/caja.png');
        break;

    }
    }
    
    if (status == 'done')

    {
        if (foto1=='/static/mock-images/covers/caja.png')
        { setfoto1(meta.previewUrl)}

        else if (foto2=='/static/mock-images/covers/caja.png')
        { setfoto2(meta.previewUrl)}

        else if (foto3=='/static/mock-images/covers/caja.png')
        { setfoto3(meta.previewUrl)}
      
    }

    
  }
  
  return (
    <form
      onSubmit={formik.handleSubmit}
      {...props}
    >
      <Card>
      <CardHeader title="Crear Nuevo Articulo" />
        <Divider />
        <CardContent>

        <Grid
            container
            spacing={3}
          >
         
         <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
             
              error={Boolean(formik.touched.DescripcionProducto && formik.errors.DescripcionProducto)}
              fullWidth
              helperText={formik.touched.DescripcionProducto && formik.errors.DescripcionProducto}
              label="Descripcion del Producto"
              name="DescripcionProducto"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              required
              value={formik.values.DescripcionProducto}
              />

                </Grid>

              <Grid
                item
                md={6}
                xs={12}
              
              >
                
                <TextField
                  onChange={handleChangeMarca}
                  fullWidth
                  label="Marca"
                  required
                  select
                >
                   {/* {subCategories && subCategories.sort((a,b)=> a.subcategoria_dsc.localeCompare(b.subcategoria_dsc)).map((option) => ( */}
                                        
                  {marcas && marcas.sort((a,b)=> a.MarcaDsc.localeCompare(b.MarcaDsc)).map((option) => (
                    <MenuItem
                      key={option.MarcaID}
                      value={`${option.MarcaID}-${option.MarcaDsc}`}
                    >
                      {`${option.MarcaID}-${option.MarcaDsc}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid
              item
              md={6}
              xs={12}
            >
              
              <TextField
            
              error={Boolean(formik.touched.TamanoGessa && formik.errors.TamanoGessa)}
              fullWidth
              helperText={formik.touched.TamanoGessa && formik.errors.TamanoGessa}
              label="Tamaño"
              name="TamanoGessa"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.TamanoGessa}
              required
              />
                </Grid>
              <Grid
                item
                md={6}
                xs={12}
             
              >
                <TextField
                  onChange={handleChangeUE}
                  fullWidth
                  label="Unidad Empaque"
                  required
                  select
                >
                  {UnidadEmpaques && UnidadEmpaques.map((option) => (
                    <MenuItem
                      key={option.IdUnidadEmpaque}
                      value={`${option.IdUnidadEmpaque}-${option.DescriUnidadEmpaque}`}
                    >
                      {`${option.IdUnidadEmpaque}-${option.DescriUnidadEmpaque}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid
                item
                md={6}
                xs={12}
              
              >
              <TextField
             
              error={Boolean(formik.touched.EAN13 && formik.errors.EAN13)}
              fullWidth
              helperText={formik.touched.EAN13 && formik.errors.EAN13}
              label="EAN13"
              name="EAN13"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              //onChange={handleValidateEAN13}
              
              value={formik.values.EAN13}
              
              />

              </Grid>

              <Grid
                item
                md={6}
                xs={12}
              
              >

              <TextField
              sx={{mb: 2,mt: 3}}
              error={Boolean(formik.touched.DUN14 && formik.errors.DUN14)}
              fullWidth
              helperText={formik.touched.DUN14 && formik.errors.DUN14}
              label="DUN14"
              name="DUN14"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.DUN14}
              required
              />

              </Grid>
             
              <Grid
              item
              md={6}
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
                Compra en Unidades?
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                sx={{ mt: 1 }}
              >
                Marque aqui si compra en unidades
              </Typography>
            </div>
            <Switch
              checked={formik.values.CompraEnUnidades}
              color="primary"
              edge="start"
              name="CompraEnUnidades"
              onChange={formik.handleChange}
              value={formik.values.CompraEnUnidades}
            />
          </Box>
          </Grid>
          <Grid
              item
              md={6}
              xs={12}
            >
              
              <TextField
              sx={{mb: 2,mt: 3}}
              error={Boolean(formik.touched.UnidadMedida && formik.errors.UnidadMedida)}
              fullWidth
              helperText={formik.touched.UnidadMedida && formik.errors.UnidadMedida}
              label="Unidad de Medida"
              name="UnidadMedida"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.UnidadMedida}
              />

              </Grid>

              <Grid
              item
              md={6}
              xs={12}
            >


              <TextField
              sx={{mb: 2,mt: 3}}
              error={Boolean(formik.touched.SaborAroma && formik.errors.SaborAroma)}
              fullWidth
              helperText={formik.touched.SaborAroma && formik.errors.SaborAroma}
              label="Sabor Aroma"
              name="SaborAroma"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.SaborAroma}
              />
              </Grid>

              <Grid
                item
                md={6}
                xs={12}
             
              >
                <TextField
                  onChange={handleCategoryChange}
                  fullWidth
                  label="Categoria"
                  required
                  select
                >
                 {categories && categories.sort((a,b)=> a.categoria_dsc.localeCompare(b.categoria_dsc)).map((option) => (
                    <MenuItem
                      key={option.categoria_id}
                      value={`${option.categoria_id}-${option.categoria_dsc}`}
                    >
                      {`${option.categoria_dsc}-${option.categoria_id}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                
              >
                <TextField
                  onChange={handleSubcategoryChange}
                  fullWidth
                  label="SubCategoria"
                  required
                  select
                >
                  {subcategories && subcategories.sort((a,b)=>a.subcategoria_dsc.localeCompare(b.subcategoria_dsc)).map((option) => (
                    <MenuItem
                      key={option.subcategoria_id}
                      value={`${option.subcategoria_id}-${option.subcategoria_dsc}`}
                    >
                      {`${option.subcategoria_dsc}-${option.subcategoria_id}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
         
            
             <Grid
                item
                md={6}
                xs={12}
              
              >
                <TextField
                  onChange={handleChangePP}
                  fullWidth
                  label="Tipo de Registro"
                  required
                  select
                >
                  {tiposRegistro && tiposRegistro.map((option) => (
                    <MenuItem
                      key={option.TipoRegistro_ID}
                      value={`${option.TipoRegistro_ID}-${option.DescripcionTR}`}
                    >
                      {`${option.TipoRegistro_ID}-${option.DescripcionTR}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
             
              >
                <TextField
                  onChange={handleChangeTC}
                  fullWidth
                  label="Tipos Compra"
                  required
                  select
                >
                  {tipoCompras && tipoCompras.map((option) => (
                    <MenuItem
                      key={option.tipoCompra_id}
                      value={`${option.tipoCompra_id}-${option.tipoCompra_dsc}`}
                    >
                      {`${option.tipoCompra_id}-${option.tipoCompra_dsc}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
             
              error={Boolean(formik.touched.CabysCodigo && formik.errors.CabysCodigo)}
              fullWidth
              helperText={formik.touched.CabysCodigo && formik.errors.CabysCodigo}
              label="Código Cabys"
              name="CabysCodigo"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.CabysCodigo}
              required
              />

              </Grid> 

              <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
            
              error={Boolean(formik.touched.CostoEmpaque && formik.errors.CostoEmpaque)}
              fullWidth
              helperText={formik.touched.CostoEmpaque && formik.errors.CostoEmpaque}
              label="Costo Empaque ¢"
              name="CostoEmpaque"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.CostoEmpaque}
              
              />

              </Grid>

              <Grid
              item
              md={6}
              xs={12}
            >


              <TextField
            
              error={Boolean(formik.touched.CostoUnitario && formik.errors.CostoUnitario)}
              fullWidth
              helperText={formik.touched.CostoUnitario && formik.errors.CostoUnitario}
              label="Costo Unitario ¢"
              name="CostoUnitario"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.CostoUnitario}
              required
              />
              </Grid>
                      <Grid
                item
                md={6}
                xs={12}
               
              >
                <TextField
                  onChange={handleChangeImp}
                  fullWidth
                  label="Impuesto %"
                  required
                  select
                >
                  {tiposGravados && tiposGravados.map((option) => (
                    <MenuItem
                      key={option.GravadoID}
                      value={`${option.GravadoID}-${option.GravadoDsc}`}
                    >
                      {`${option.GravadoDsc}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
             
              error={Boolean(formik.touched.PorcImpConsumo && formik.errors.PorcImpConsumo)}
              fullWidth
              helperText={formik.touched.PorcImpConsumo && formik.errors.PorcImpConsumo}
              label="Porc. Imp. Consumo %"
              name="PorcImpConsumo"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.PorcImpConsumo}
              required
              />
           </Grid>

           <Grid
              item
              md={6}
              xs={12}
            > 
              <TextField
           
              error={Boolean(formik.touched.TiempoVigencia && formik.errors.TiempoVigencia)}
              fullWidth
              helperText={formik.touched.TiempoVigencia && formik.errors.TiempoVigencia}
              label="Tiempo Vigencia"
              name="TiempoVigencia"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.TiempoVigencia}
              />
              </Grid>
              <Grid
              item
              md={6}
              xs={12}
            > 
             <TextField
             
              error={Boolean(formik.touched.DescuentoConfidencialDC && formik.errors.DescuentoConfidencialDC)}
              fullWidth
              helperText={formik.touched.DescuentoConfidencialDC && formik.errors.DescuentoConfidencialDC}
              label="Descuento Confidencial DC %"
              name="DescuentoConfidencialDC"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.DescuentoConfidencialDC}
              />
              </Grid>

              <Grid
              item
              md={6}
              xs={12}
            > 
              <TextField
             
              error={Boolean(formik.touched.DescuentoIntroduccionDEI && formik.errors.DescuentoIntroduccionDEI)}
              fullWidth
              helperText={formik.touched.DescuentoIntroduccionDEI && formik.errors.DescuentoIntroduccionDEI}
              label="Descuento Introduccion DEI %"
              name="DescuentoIntroduccionDEI"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.DescuentoIntroduccionDEI}
              />
              </Grid>
              <Grid
              item
              md={6}
              xs={12}
            > 
              <TextField
           
              error={Boolean(formik.touched.DescuentoFijoDFI && formik.errors.DescuentoFijoDFI)}
              fullWidth
              helperText={formik.touched.DescuentoFijoDFI && formik.errors.DescuentoFijoDFI}
              label="Descuento Fijo DFI %"
              name="DescuentoFijoDFI"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.DescuentoFijoDFI}
              />

              </Grid>

              <Grid
              item
              md={6}
              xs={12}
            >
                 <TextField
             
              error={Boolean(formik.touched.DescuentoNoDevolucionDND && formik.errors.DescuentoNoDevolucionDND)}
              fullWidth
              helperText={formik.touched.DescuentoNoDevolucionDND && formik.errors.DescuentoNoDevolucionDND}
              label="Descuento No Devolucion DND %"
              name="DescuentoNoDevolucionDND"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.DescuentoNoDevolucionDND}
              />

              </Grid>

              <Grid
              item
              md={6}
              xs={12}
            > 
                 <TextField
            
              error={Boolean(formik.touched.CentroDistribucionTAE && formik.errors.CentroDistribucionTAE)}
              fullWidth
              helperText={formik.touched.CentroDistribucionTAE && formik.errors.CentroDistribucionTAE}
              label="Centro Distribucion TAE %"
              name="CentroDistribucionTAE"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.CentroDistribucionTAE}
              />

              </Grid>

              <Grid
              item
              md={6}
              xs={12}
            > 
                 <TextField
         
              error={Boolean(formik.touched.PromocionalPAE && formik.errors.PromocionalPAE)}
              fullWidth
              helperText={formik.touched.PromocionalPAE && formik.errors.PromocionalPAE}
              label="Promocional PAE %"
              name="PromocionalPAE"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.PromocionalPAE}
              />

              </Grid>

              <Grid
              item
              md={6}
              xs={12}
            >

              <TextField
           
              error={Boolean(formik.touched.MedProdAnchoProducto && formik.errors.MedProdAnchoProducto)}
              fullWidth
              helperText={formik.touched.MedProdAnchoProducto && formik.errors.MedProdAnchoProducto}
              label="Medida Ancho Producto"
              name="MedProdAnchoProducto"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.MedProdAnchoProducto}
              />

               </Grid>

               <Grid
              item
              md={6}
              xs={12}
            > 
              <TextField
             
              error={Boolean(formik.touched.MedProdAltoProducto && formik.errors.MedProdAltoProducto)}
              fullWidth
              helperText={formik.touched.MedProdAltoProducto && formik.errors.MedProdAltoProducto}
              label="Medida Alto Producto"
              name="MedProdAltoProducto"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.MedProdAltoProducto}
              />

              </Grid>

              <Grid
              item
              md={6}
              xs={12}
            > 
              <TextField
            
              error={Boolean(formik.touched.MedProdLargoProducto && formik.errors.MedProdLargoProducto)}
              fullWidth
              helperText={formik.touched.MedProdLargoProducto && formik.errors.MedProdLargoProducto}
              label="Medida Largo Producto"
              name="MedProdLargoProducto"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.MedProdLargoProducto}
              />

               </Grid>

               <Grid
              item
              md={6}
              xs={12}
            > 

              <TextField
             
              error={Boolean(formik.touched.MedProdPesoNeto && formik.errors.MedProdPesoNeto)}
              fullWidth
              helperText={formik.touched.MedProdPesoNeto && formik.errors.MedProdPesoNeto}
              label="Peso Neto"
              name="MedProdPesoNeto"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.MedProdPesoNeto}
              />

              </Grid> 

              <Grid
              item
              md={6}
              xs={12}
            > 
              <TextField
          
              error={Boolean(formik.touched.MedProdPesoBruto && formik.errors.MedProdPesoBruto)}
              fullWidth
              helperText={formik.touched.MedProdPesoBruto && formik.errors.MedProdPesoBruto}
              label="Peso Bruto"
              name="MedProdPesoBruto"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.MedProdPesoBruto}
              />

              </Grid>

              <Grid
              item
              md={6}
              xs={12}
            > 
              <TextField
             
              error={Boolean(formik.touched.MedProdPesoEscurrido && formik.errors.MedProdPesoEscurrido)}
              fullWidth
              helperText={formik.touched.MedProdPesoEscurrido && formik.errors.MedProdPesoEscurrido}
              label="Peso Escurrido"
              name="MedProdPesoEscurrido"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.MedProdPesoEscurrido}
              />
              </Grid>

              <Grid
              item
              md={6}
              xs={12}
            > 
              <TextField
            
              error={Boolean(formik.touched.MedProdDiametro && formik.errors.MedProdDiametro)}
              fullWidth
              helperText={formik.touched.MedProdDiametro && formik.errors.MedProdDiametro}
              label="Diametro"
              name="MedProdDiametro"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.MedProdDiametro}
              />
              </Grid>

              <Grid
              item
              md={6}
              xs={12}
            > 
              <TextField
           
              error={Boolean(formik.touched.MedCajaAnchoProducto && formik.errors.MedCajaAnchoProducto)}
              fullWidth
              helperText={formik.touched.MedCajaAnchoProducto && formik.errors.MedCajaAnchoProducto}
              label="Caja Ancho Producto"
              name="MedCajaAnchoProducto"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.MedCajaAnchoProducto}
              />
              </Grid>

              <Grid
              item
              md={6}
              xs={12}
            > 
              <TextField
             
              error={Boolean(formik.touched.MedCajaAltoProducto && formik.errors.MedCajaAltoProducto)}
              fullWidth
              helperText={formik.touched.MedCajaAltoProducto && formik.errors.MedCajaAltoProducto}
              label="Caja Alto Producto"
              name="MedCajaAltoProducto"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.MedCajaAltoProducto}
              />

              </Grid>

              <Grid
              item
              md={6}
              xs={12}
            > 
              <TextField
            
              error={Boolean(formik.touched.MedCajaLargoProducto && formik.errors.MedCajaLargoProducto)}
              fullWidth
              helperText={formik.touched.MedCajaLargoProducto && formik.errors.MedCajaLargoProducto}
              label="Caja Largo Producto"
              name="MedCajaLargoProducto"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.MedCajaLargoProducto}
              />

              </Grid>

        {/* <Grid
              item
              md={6}
              xs={12} > 

          <TextField
            onChange={handleChangeEstatus}
            fullWidth
            label="Estatus"
            defaultValue={'DIGITADO'}
            select
                >

       
          <MenuItem value="DIGITADO">
            DIGITADO
          </MenuItem>
          <MenuItem value="ASISTENTE" disabled={user.UserType!=6}>
            ENVIAR A GESSA
          </MenuItem>
          <MenuItem value="VALIDADO" disabled={user.UserType!=2}>
            PROCESAR
          </MenuItem>
          {}
        
        </TextField>
        </Grid> */}
               
               
               
  <Grid
      container
      spacing={3}
    >
      {posts.map((post) => (
        <Grid
          item
          key={post.id}
          md={4}
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
              
    </Grid>

    <Grid  container
      spacing={3}
      >
            <Grid
            
            md={4}
            xs={12} 
            
            >
            <Card sx={{ mt: 4 }}>
            <CardContent>
          
         
              <Button
                onClick={handleRemove1}
                sx={{ mt: 3 }}
               
              >
                Remover foto frente
              </Button>
              <Box sx={{ mt: 3 }}>
                <FileDropzone
                  accept={{
                    'image/*': []
                  }}
                  maxFiles={1}
                  onDrop={handleDropCover1}
                />
              </Box>
            </CardContent>
          </Card>
          </Grid>

          <Grid
          
          md={4}
          xs={12} >
            <Card sx={{ mt: 4 }}>
            <CardContent>
          
         
              <Button
                onClick={handleRemove2}
                sx={{ mt: 3 }}
               
              >
                Remover foto lado
              </Button>
              <Box sx={{ mt: 3 }}>
                <FileDropzone
                  accept={{
                    'image/*': []
                  }}
                  maxFiles={1}
                  onDrop={handleDropCover2}
                />
              </Box>
            </CardContent>
          </Card>
          </Grid>

          <Grid
            md={4}
            xs={12} >
            <Card sx={{ mt: 4 }}>
            <CardContent>
          
         
              <Button
                onClick={handleRemove3}
                sx={{ mt: 3 }}
               
              >
                Remover foto arriba base
              </Button>
              <Box sx={{ mt: 3 }}>
                <FileDropzone
                  accept={{
                    'image/*': []
                  }}
                  maxFiles={1}
                  onDrop={handleDropCover3}
                />
              </Box>
            </CardContent>
          </Card>
          </Grid>
    </Grid>

   
          
        </CardContent>
     

      <CardActions
      
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          mx: -1,
          mb: -1,
          mt: 3
        }}
      >
        <Button
          sx={{ m: 1 }}
          variant="outlined"
           href="/dashboard/products-new"
        >
          Cancelar
        </Button>

        <ButtonGroup
        ref={anchorRef}
        variant="contained"
        
      >
        <Button  type="submit">
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
        <Popper
        anchorEl={anchorRef.current}
        open={open}
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
                  {options.map((option, index) => (
                    <MenuItem
                      disabled={index === 3}
                      key={option}
                      onClick={() => handleMenuItemClick(index)}
                      selected={index === selectedIndex}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
        </ClickAwayListener>
        </Paper>

            
</Grow>
)}
</Popper>
        {/* <Button
          sx={{ m: 1 }}
          type="submit"
          variant="contained"
        >
          Crear Articulo
        </Button> */}
        </CardActions>
        </Card>
      
     
    </form>
  );
};
