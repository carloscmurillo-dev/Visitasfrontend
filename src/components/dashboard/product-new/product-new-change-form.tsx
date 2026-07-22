import { FC, useEffect,useCallback } from 'react';
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
  Stack,
  Grid,
  Switch,
  TextField,
  Typography,
  MenuItem
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
import { wait } from 'src/utils/wait';
import { useMounted } from '../../../hooks/use-mounted';
import { FileDropzone } from '../../file-dropzone';
import { fileToBase64 } from '../../../utils/file-to-base64';
import { QuillEditor } from '../../quill-editor';
//import Dropzone from 'react-dropzone-uploader'
import { styled } from '@mui/material/styles';
import { Avatar, CardMedia, Chip, Link } from '@mui/material';
import { useAuth } from '../../../hooks/use-auth';

interface ArticuloProps {
  xarticulo: Articulo;
 
}



export const ArticulosChangeForm: FC<ArticuloProps> = (props) => {
  const { xarticulo, ...other } = props ;
  console.log('Articulo ya en el formulario:',xarticulo)
  //console.log('La descripcion en el form:',articulo.DescripcionProducto)
  const isMounted = useMounted();
  console.log('datillos:',xarticulo)
  const router = useRouter();
  
  const [providers, setProviders] = useState<Provider[]>([]);
  const [ProductList, setProductList] = useState<Articulo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<string | null>(null);

  const [subcategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subcategory, setsubCategory] = useState<string | null>(null);

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [marca, setmarca] = useState<string | null>(null);
  
  const [mercadoOrigens, setMercadoOrigens] = useState<MercadoOrigen[]>([]);
  const [mercadoOrigen, setMercadoOrigen] = useState<string | null>(null);
  const [plazosPagos, setPlazosPagos] = useState<PlazosPago[]>([]);
  const [plazosPago, setPlazosPago] = useState<string | null>(null);
  const [tipoCompras ,setTipoCompras] = useState<TipoCompra[]>([]);
  const [tipoCompra, setTipoCompra] = useState<string | null>(null);
  const [tiposGravados ,setTiposGravados] = useState<TiposGravados[]>([]);
  const [tiposGravado, setTiposGravado] = useState<string | null>(null);
  const [UnidadEmpaques ,setUnidadEmpaques] = useState<UnidadEmpaque[]>([]);
  const [unidadEmpaque, setUnidadEmpaque] = useState<string | null>(null);


  const [estatus, setEstatus] = useState('')
  const [categoryIdSelected, setCategoryIdSelected] = useState<number | null>(null);
  const [subCategoryIdSelected, setSubCategoryIdSelected] = useState<number | null>(null);
  const [articulo ,setarticulo] =  useState<Articulo | null>(null);

  const { user } = useAuth();

 

  

  console.log('USUARIO:',user.UserType)


  
  
  
  

  useEffect(() => {
    
    async function fetchCategories() {
      const data = await productApi.getCategories();
      setCategories(data);
    }

    async function fetchSubCategories() {
      const data = await productApi.getSubCategories(2);
      setSubCategories(data);
    }
    async function fetchMarcas() {
      const data = await productApi.getMarcas();
      setMarcas(data);
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

    async function fetchPlazosPago() {
      const data = await productApi.getPlazosPago();
      setPlazosPagos(data);
    }
    async function fetchTipoCompras() {
      const data = await productApi.GetTipoCompra();
      setTipoCompras(data);
    }

    async function fetchTiposGravados() {
      const data = await productApi.getTiposGravados();
      setTiposGravados(data);
    }
    
    // AQUI PONER TODOS LOS FETCHS DE LAS REFERENCIAS
    //getArticulos();
    fetchCategories();
    fetchSubCategories();
    fetchMarcas();
    fetchUnidadEmpaques();
    fetchMercadoOrigen();
    fetchPlazosPago();
    fetchTipoCompras();
    fetchTiposGravados();

  }, [])



   
  const formik = useFormik({
      initialValues: {
      loadArticulo: '',  
      ProveedorID: xarticulo.ProveedorID ,
      ArticuloID:  xarticulo.ArticuloID ,
      DescripcionProducto:  xarticulo.DescripcionProducto,
      MarcaID:  xarticulo.MarcaID ,
      TamanoGessa:  xarticulo.TamanoGessa ,
      IdUnidadEmpaque: xarticulo.IdUnidadEmpaque ,
      EAN13: xarticulo.EAN13 ,
      DUN14:  xarticulo.DUN14 ,
      CompraEnUnidades: xarticulo.CompraEnUnidades,
      DescripcionLarga: xarticulo.DescripcionLarga,
      DescripcionPublicacion: xarticulo.DescripcionPublicacion,
      UnidadMedida:  xarticulo.UnidadMedida ,
      SaborAroma:  xarticulo.SaborAroma ,
      categoria_id:  xarticulo.categoria_id,
      subcategoria_id:  xarticulo.subcategoria_id ,
      SegmentoID:  xarticulo.SegmentoID ,
      PlazoPagoID:  xarticulo.PlazoPagoID ,
      tipoCompra_id:  xarticulo.tipoCompra_id,
      CabysCodigo:  xarticulo.CabysCodigo ,
      CostoEmpaque:  xarticulo.CostoEmpaque ,
      CostoUnitario:  xarticulo.CostoUnitario ,
      GravadoID:  xarticulo.GravadoID ,
      GravadoOExento: xarticulo.GravadoOExento,
      PorcImpConsumo:  xarticulo.PorcImpConsumo,
      TiempoVigencia:  xarticulo.TiempoVigencia,
      MedProdAnchoProducto:  xarticulo.MedProdAnchoProducto ,
      MedProdAltoProducto:  xarticulo.MedProdAltoProducto ,
      MedProdLargoProducto:  xarticulo.MedProdLargoProducto ,
      MedProdPesoNeto:  xarticulo.MedProdPesoNeto ,
      MedProdPesoBruto:  xarticulo.MedProdPesoBruto ,
      MedProdPesoEscurrido:  xarticulo.MedProdPesoEscurrido ,
      MedProdDiametro:  xarticulo.MedProdDiametro ,
      MedCajaAnchoProducto:  xarticulo.MedCajaAnchoProducto ,
      MedCajaAltoProducto:  xarticulo.MedCajaAltoProducto ,
      MedCajaLargoProducto:  xarticulo.MedCajaLargoProducto ,
      FotoProductoFrente:  null ,
      FotoProductoLado:  null,
      FotoProductoArribaBase:  null ,
      FotoProducto4: null,
      FotoProducto5: null,
      DescuentoConfidencialDC:  xarticulo.DescuentoConfidencialDC ,
      DescuentoIntroduccionDEI:  xarticulo.DescuentoIntroduccionDEI ,
      DescuentoFijoDFI:  xarticulo.DescuentoFijoDFI ,
      DescuentoNoDevolucionDND:  xarticulo.DescuentoNoDevolucionDND ,
      CentroDistribucionTAE:  xarticulo.CentroDistribucionTAE ,
      PromocionalPAE:  xarticulo.PromocionalPAE , 
      status: xarticulo.status,
      submit: null
    },
    validationSchema: Yup.object({
      // aqregar aqui las validaciones
      DescripcionProducto: Yup.string().max(255).required(),
      
    }),
    onSubmit: async (values, helpers): Promise<void> => {
     
      // console.log(Number(unidadEmpaque), Number(categoryIdSelected), Number(subCategoryIdSelected),Number(plazosPago),Number(tipoCompra),Number(tiposGravado))
      // alert('Insertando Articulo:' + values.DescripcionProducto )

      if (confirm("Desea cambiar precio al articulo:? " + values.DescripcionProducto) == true) 
      {
        
        
      //      console.log(values)
      try {
        await productApi.newArticulo(
          values.ProveedorID
          ,null
          ,values.DescripcionProducto 
          ,values.MarcaID
          ,values.TamanoGessa 
          ,Number(values.IdUnidadEmpaque)
          ,values.EAN13 
          ,values.DUN14 
          ,values.CompraEnUnidades 
          ,values.DescripcionLarga
          ,values.DescripcionPublicacion
          ,values.UnidadMedida 
          ,values.SaborAroma 
          ,Number(values.categoria_id)
          ,Number(values.subcategoria_id)
          ,values.SegmentoID 
          ,Number(values.PlazoPagoID)
          ,Number(values.tipoCompra_id)
          ,values.CabysCodigo 
          ,values.CostoEmpaque 
          ,values.CostoUnitario 
          ,Number(values.GravadoID)
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
          ,values.FotoProductoFrente 
          ,values.FotoProductoLado 
          ,values.FotoProducto4       
          ,values.FotoProducto5
          ,values.FotoProductoArribaBase 
          ,values.DescuentoConfidencialDC 
          ,values.DescuentoIntroduccionDEI 
          ,values.DescuentoFijoDFI 
          ,values.DescuentoNoDevolucionDND 
          ,values.CentroDistribucionTAE 
          ,values.PromocionalPAE 
          ,'ASISTENTE'
          ,true
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
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    setCategory(categorySplit[0]);
    //alert(category)
  };

  const BlogPostCardMediaWrapper = styled('div')({
    paddingTop: 'calc(100% * 4 / 4)',
    position: 'relative'
  });

  const handleChangePP = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    setPlazosPago(categorySplit[0]);
    //alert(plazosPago)
  };
  const handleChangeTC = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    setTipoCompra(categorySplit[0]);
  };
  const handleChangeImp = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    setTiposGravado(categorySplit[0]);
    console.log('Tipos gravado:',tiposGravado)
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
    console.log('Estatus:',estatus)
  };


  
    


  
  
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
              disabled={user.UserType!=6}
              value={formik.values.DescripcionProducto}
              />

                </Grid>

          
              <Grid
                item
                md={6}
                xs={12}
              
              >
              <TextField
              disabled={user.UserType!=6}
              error={Boolean(formik.touched.EAN13 && formik.errors.EAN13)}
              fullWidth
              helperText={formik.touched.EAN13 && formik.errors.EAN13}
              label="EAN13"
              name="EAN13"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.EAN13}
              />

              </Grid>

              <Grid
                item
                md={6}
                xs={12}
              
              >

              <TextField
               disabled={user.UserType!=6}
              sx={{mb: 2,mt: 3}}
              error={Boolean(formik.touched.DUN14 && formik.errors.DUN14)}
              fullWidth
              helperText={formik.touched.DUN14 && formik.errors.DUN14}
              label="DUN14"
              name="DUN14"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.DUN14}
              />

              </Grid>
             
          
              <Grid
              item
              md={6}
              xs={12}
            >


              <TextField
               //disabled={user.UserType!=2}
              error={Boolean(formik.touched.CostoUnitario && formik.errors.CostoUnitario)}
              fullWidth
              helperText={formik.touched.CostoUnitario && formik.errors.CostoUnitario}
              label="Nuevo Costo Unitario"
              name="CostoUnitario"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.CostoUnitario}
              />
              </Grid>
         
              <Grid
              item
              md={6}
              xs={12}
            > 
             <TextField
              disabled={user.UserType!=6}
              error={Boolean(formik.touched.DescuentoConfidencialDC && formik.errors.DescuentoConfidencialDC)}
              fullWidth
              helperText={formik.touched.DescuentoConfidencialDC && formik.errors.DescuentoConfidencialDC}
              label="Descuento Confidencial DC"
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
              disabled={user.UserType!=6}
              error={Boolean(formik.touched.DescuentoIntroduccionDEI && formik.errors.DescuentoIntroduccionDEI)}
              fullWidth
              helperText={formik.touched.DescuentoIntroduccionDEI && formik.errors.DescuentoIntroduccionDEI}
              label="Descuento Introduccion DEI"
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
            disabled={user.UserType!=6}
              error={Boolean(formik.touched.DescuentoFijoDFI && formik.errors.DescuentoFijoDFI)}
              fullWidth
              helperText={formik.touched.DescuentoFijoDFI && formik.errors.DescuentoFijoDFI}
              label="Descuento Fijo DFI"
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
              disabled={user.UserType!=6}
              error={Boolean(formik.touched.DescuentoNoDevolucionDND && formik.errors.DescuentoNoDevolucionDND)}
              fullWidth
              helperText={formik.touched.DescuentoNoDevolucionDND && formik.errors.DescuentoNoDevolucionDND}
              label="Descuento No Devolucion DND"
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
             disabled={user.UserType!=6}
              error={Boolean(formik.touched.CentroDistribucionTAE && formik.errors.CentroDistribucionTAE)}
              fullWidth
              helperText={formik.touched.CentroDistribucionTAE && formik.errors.CentroDistribucionTAE}
              label="Centro Distribucion TAE"
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
          disabled={user.UserType!=6}
              error={Boolean(formik.touched.PromocionalPAE && formik.errors.PromocionalPAE)}
              fullWidth
              helperText={formik.touched.PromocionalPAE && formik.errors.PromocionalPAE}
              label="Promocional PAE"
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
              disabled={user.UserType!=2}
              error={Boolean(formik.touched.DescripcionLarga && formik.errors.DescripcionLarga)}
              fullWidth
              helperText={formik.touched.DescripcionLarga && formik.errors.DescripcionLarga}
              label="Descripcion Larga"
              name="DescripcionLarga"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.DescripcionLarga}
              />
              </Grid>

              <Grid
              item
              md={6}
              xs={12}
              > 
              <TextField
              disabled={user.UserType!=2}
              error={Boolean(formik.touched.DescripcionPublicacion && formik.errors.DescripcionPublicacion)}
              fullWidth
              helperText={formik.touched.DescripcionPublicacion && formik.errors.DescripcionPublicacion}
              label="Descripcion Publicacion"
              name="DescripcionPublicacion"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.DescripcionPublicacion}
              />
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
        <Button
          sx={{ m: 1 }}
          type="submit"
          variant="contained"
          disabled={user.UserType!=6}
        >
          Guardar Precio
        </Button>
        </CardActions>
        </Card>
      
     
    </form>
  );
};
