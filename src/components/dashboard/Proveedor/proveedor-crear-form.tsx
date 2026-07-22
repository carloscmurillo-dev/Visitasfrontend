import type { FC } from 'react';
import { format } from 'date-fns';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik, yupToFormErrors } from 'formik';
import { DatePicker } from '@mui/lab';
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
import type { Customer } from '../../../types/customer';
import { wait } from '../../../utils/wait';
import { Proveedorsol } from 'src/types/APIproveedores';
import {PlazosPago} from 'src/types/APIplazosPago'
import {ActividadEconomica} from 'src/types/APIactividadEconomica'
import {CantonDistritoProvincia} from 'src/types/APIcantondistritoProvincia'
import { productApi } from 'src/__fake-api__/product-api';
import { date } from 'yup/lib/locale';
import { useState,useEffect } from 'react';
import { TipoCompra } from 'src/types/APItiposCompra';
import { useRouter } from 'next/router';
import { Category } from 'src/types/APIcategory';


interface ProveedorCrearFormProps {
  //proveedor: Proveedorsol;
}

export const ProveedorCrearForm: FC<ProveedorCrearFormProps> = (props) => {
  const {  ...other } = props;
  const router = useRouter();
  
  const [plazosPagos, setPlazosPagos] = useState<PlazosPago[]>([]);
  const [plazosPago, setPlazosPago] = useState<string | null>(null);

  const [actividadEconomicas, setActividadEconomicas] = useState<ActividadEconomica[]>([]);
  const [actividadEconomica, setActividadEconomica] = useState<string | null>(null);

  const [cantonDistritoProvincias, setcantonDistritoProvincias] = useState<CantonDistritoProvincia[]>([]);
  const [cantonDistritoProvincia, setcantonDistritoProvincia] = useState<string | null>(null);
 
  const [tipoCompras ,setTipoCompras] = useState<TipoCompra[]>([]);
  const [tipoCompra, setTipoCompra] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [categoryIdSelected, setCategoryIdSelected] = useState<number | null>(null);
  
  useEffect(() => {
  
   

    async function fetchTipoCompras() {
      const data = await productApi.GetTipoCompra();
      setTipoCompras(data);
    }

    async function fetchPlazosPago() {
      const data = await productApi.getPlazosPago();
      setPlazosPagos(data);
    }

    async function fetchActividadEconomica() {
      const data = await productApi.getActividadEconomica();
      setActividadEconomicas(data);
    }

    async function fetchCantonDistritoProvincia() {
      //alert('Obtener cantones')
      const data = await productApi.getCantonDistritoProvincia();
      setcantonDistritoProvincias(data);
      console.log(setcantonDistritoProvincias)
    }

    async function fetchCategories() {
      const data = await productApi.getCategories();
      setCategories(data);
    }
    
    // AQUI PONER TODOS LOS FETCHS DE LAS REFERENCIAS
   
    fetchPlazosPago();
    fetchActividadEconomica();
    fetchCantonDistritoProvincia();
    fetchTipoCompras();
    fetchCategories()

  }, [])


///////////////////////////////////




  const formik = useFormik({
    initialValues: {

      //fechaSolicitud: proveedor.fechaSolicitud || new Date(),
      
      proveedor_id:  0,
      proveedor_dsc:  '',
      gln:  '',
      CedJuridica:  '',
      RazonSocial:  '',
      RepreLegal:  '',
      GerenteGeneral:  '',
      GerenteVentas:  '',
      AgenteVentas: '', 
      ContactoFinanc: '',
      Direccion: '',
      Barrio: '',
      Tel1 :  '',
      Tel2 :  '',
      NombreContactoFactElec :  '',
      TelContactoFactElec :  '',
      EmailContactoFactElec :  '',
      EmailReciboContactoFactElec : '',
      CantidadLinesXFactura :  0,
      AceptaDevoluc:  false,
      OrdenCompra:  false,
      DescuentoFijo :  false,
      PorDescuentoFijo:  0,
      DescuentoConfidencial:  false,
      PorDescuentoConfidencial:  0,
      DescuentoIntroduccion:  false,
      PorDescuentoIntroduccion:  0,
      PartDinamicasComerciales:  false,
      PartEspaciosPromocionales: false,
      PartDisplays: false,
      FrecuenciaVisitaTiendas:  0,
      AportaCodigoCABYS:  false,
      CodigoCABYS : '',
      DocEntregaFacElect :  false,
      DocEntregaGuiaDespacho : false,
      CantidadLineasXFactura :  0,
      PorDescuentofijo : 0,
      PorcDescuentoConfidencial :  0,
      PorcDescuentoIntroduccion : 0,
      TipoEntrega :  1,
      canton_id :  1,
      ActividadEconomicaID :   1 ,
      PlazoPagoID :  1,


      submit: null
    },
    validationSchema: Yup.object({
      proveedor_dsc: Yup.string().max(255),
      gln: Yup.string().max(255),
      CedJuridica: Yup.string().max(255),
      EmailContactoFactElec: Yup
        .string()
        .email('Debe se un email valido')
        .max(255)
        .required('Email requerido'),
      EmailReciboContactoFactElec: Yup
        .string()
        .email('Debe ser un email valido')
        .max(255)
        .required('Email requerido'),
      AceptaDevoluc: Yup.bool(),
      OrdenCompra: Yup.bool(),
      RazonSocial: Yup
        .string()
        .max(255)
        .required('Name is required'),
      RepreLegal: Yup.string().max(50),
      GerenteGeneral: Yup.string().max(50),
      CantidadLinesXFactura: Yup.number().lessThan(51,'Debe ingresar menos de 50 lineas'),
      CodigoCABYS: Yup.string().min(13,'Codigo Cabys no debe tener menos de 13 caracteres').max(13,'Codigo Cabys no debe tener mas de 13 caracteres').matches(/^[0-9]+$/, "Solo digitos 0 a 9"),
      
      

      
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      console.log(categoryIdSelected,values)
      if (confirm("Desea agregar articulo:? " + values.proveedor_dsc) == true) 
      {
      
      try {
        // NOTE: Make API request
      
    
        await productApi.createProveedorsol(
          null,
          values.proveedor_dsc,
          Number(categoryIdSelected),
          values.CedJuridica,
          values.RazonSocial  ,
          values.RepreLegal  ,
          values.GerenteGeneral  ,
          values.GerenteVentas  ,
          values.AgenteVentas  ,
          values.ContactoFinanc  ,
          values.Direccion  ,
          Number(cantonDistritoProvincia),
          values.Barrio  ,
          values.Tel1  ,
          values.Tel2  ,
          values.NombreContactoFactElec  ,
          values.TelContactoFactElec  ,
          values.EmailContactoFactElec  ,
          values.EmailReciboContactoFactElec  ,
          values.CantidadLineasXFactura  ,
          Number(tipoCompra),
          values.AceptaDevoluc  ,
          values.OrdenCompra  ,
          values.DescuentoFijo  ,
          values.PorDescuentofijo  ,
          values.DescuentoConfidencial  ,
          values.PorcDescuentoConfidencial  ,
          values.DescuentoIntroduccion  ,
          values.PorcDescuentoIntroduccion  ,
          values.PartDinamicasComerciales  ,
          values.PartEspaciosPromocionales  ,
          values.PartDisplays  ,
          values.FrecuenciaVisitaTiendas  ,
          values.AportaCodigoCABYS  ,
          values.CodigoCABYS ,
          Number(actividadEconomica),
          Number(plazosPago) ,
          values.DocEntregaFacElect  ,
          values.DocEntregaGuiaDespacho  
       



        );
        await wait(500);
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        toast.success('Proveedor agregado!');
        // poner aqui la ruta del login
      
        router.push(`/`).catch(console.error);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
    }
  });
  const handleChangeCDP = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    setcantonDistritoProvincia(categorySplit[0]);
    //alert(Number(cantonDistritoProvincia))
  };
  
  const handleCategoryChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    //const data = await productApi.getSubCategories(Number(categorySplit[0]));
    setCategoryIdSelected(Number(categorySplit[0]));
    
  };

  const handleChangeTC = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    setTipoCompra(categorySplit[0]);
    //alert(tipoCompra)
  };

  const handleChangeAE = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    setActividadEconomica(categorySplit[0]);
    //alert(actividadEconomica)
  };

  const handleChangePP = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    setPlazosPago(categorySplit[0]);
    //alert(plazosPago)
  };



  return (
    <form
      onSubmit={formik.handleSubmit}
      {...other}
    >
      <Card>
        <CardHeader title="Incluir Nuevo Proveedor" />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
             
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.proveedor_dsc && formik.errors.proveedor_dsc)}
                fullWidth
                helperText={formik.touched.proveedor_dsc && formik.errors.proveedor_dsc}
                label="Descripcion Proveedor"
                name="proveedor_dsc"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.proveedor_dsc}
              />
            </Grid>
        
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.CedJuridica && formik.errors.CedJuridica)}
                fullWidth
                helperText={formik.touched.CedJuridica && formik.errors.CedJuridica}
                label="Cedula Juridica"
                name="CedJuridica"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.CedJuridica}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.RazonSocial && formik.errors.RazonSocial)}
                fullWidth
                helperText={formik.touched.RazonSocial && formik.errors.RazonSocial}
                label="Razon Social"
                name="RazonSocial"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.RazonSocial}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.RepreLegal && formik.errors.RepreLegal)}
                fullWidth
                helperText={formik.touched.RepreLegal && formik.errors.RepreLegal}
                label="Representante Legal"
                name="RepreLegal"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.RepreLegal}
              />
            </Grid>
            
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.GerenteGeneral && formik.errors.GerenteGeneral)}
                fullWidth
                helperText={formik.touched.GerenteGeneral && formik.errors.GerenteGeneral}
                label="Gerente General"
                name="GerenteGeneral"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.GerenteGeneral}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.GerenteVentas && formik.errors.GerenteVentas)}
                fullWidth
                helperText={formik.touched.GerenteVentas && formik.errors.GerenteVentas}
                label="Gerente Ventas"
                name="GerenteVentas"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.GerenteVentas}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.AgenteVentas && formik.errors.AgenteVentas)}
                fullWidth
                helperText={formik.touched.AgenteVentas && formik.errors.AgenteVentas}
                label="Agente Ventas"
                name="AgenteVentas"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.AgenteVentas}
              />
            </Grid>

            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.ContactoFinanc && formik.errors.ContactoFinanc)}
                fullWidth
                helperText={formik.touched.ContactoFinanc && formik.errors.ContactoFinanc}
                label="Contacto Financiero"
                name="ContactoFinanc"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.ContactoFinanc}
              />
            </Grid>

            <Grid
                item
                md={6}
                xs={12}
                
              >
                <TextField
                  onChange={handleChangeCDP}
                  fullWidth
                  label="Canton Distrito Provincia"
                  select
                >
                  {cantonDistritoProvincias && cantonDistritoProvincias.map((option) => (
                    <MenuItem
                      key={option.CantonID}
                      value={`${option.CantonID}-${option.Canton}`}
                      
                    >
                      {`${option.Distrito}-${option.Canton}-${option.Provincia}`}
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
                error={Boolean(formik.touched.Barrio && formik.errors.Barrio)}
                fullWidth
                helperText={formik.touched.Barrio && formik.errors.Barrio}
                label="Barrio"
                name="Barrio"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.Barrio}
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.Direccion && formik.errors.Direccion)}
                fullWidth
                helperText={formik.touched.Direccion && formik.errors.Direccion}
                label="Direccion"
                name="Direccion"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.Direccion}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.Tel1 && formik.errors.Tel1)}
                fullWidth
                helperText={formik.touched.Tel1 && formik.errors.Tel1}
                label="Telefono 1"
                name="Tel1"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.Tel1}
              />
            </Grid>

            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.Tel2 && formik.errors.Tel2)}
                fullWidth
                helperText={formik.touched.Tel2 && formik.errors.Tel2}
                label="Telefono 2"
                name="Tel2"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.Tel2}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.NombreContactoFactElec && formik.errors.NombreContactoFactElec)}
                fullWidth
                helperText={formik.touched.NombreContactoFactElec && formik.errors.NombreContactoFactElec}
                label="Nombre Contacto Factura Electronica"
                name="NombreContactoFactElec"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.NombreContactoFactElec}
              />
            </Grid>

            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.TelContactoFactElec && formik.errors.TelContactoFactElec)}
                fullWidth
                helperText={formik.touched.TelContactoFactElec && formik.errors.TelContactoFactElec}
                label="Telefono Contacto Fact. Elec."
                name="TelContactoFactElec"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.TelContactoFactElec}
              />
            </Grid>

            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.EmailContactoFactElec && formik.errors.EmailContactoFactElec)}
                fullWidth
                helperText={formik.touched.EmailContactoFactElec && formik.errors.EmailContactoFactElec}
                label="Email Contacto Fact. Elec."
                name="EmailContactoFactElec"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.EmailContactoFactElec}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.EmailReciboContactoFactElec && formik.errors.EmailReciboContactoFactElec)}
                fullWidth
                helperText={formik.touched.EmailReciboContactoFactElec && formik.errors.EmailReciboContactoFactElec}
                label="Email Recibo Contacto Fact. Elec."
                name="EmailReciboContactoFactElec"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.EmailReciboContactoFactElec}
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
                error={Boolean(formik.touched.CantidadLinesXFactura && formik.errors.CantidadLinesXFactura)}
                fullWidth
                helperText={formik.touched.CantidadLinesXFactura && formik.errors.CantidadLinesXFactura}
                label="Cantidad Lineas X Factura"
                name="CantidadLinesXFactura"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.CantidadLinesXFactura}
              />
            </Grid>

            <Grid
                item
                md={6}
                xs={12}
                
              >
                <TextField
                  onChange={handleChangeTC}
                  fullWidth
                  label="Tipo Entrega"
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
                  onChange={handleChangeAE}
                  fullWidth
                  label="Codigo Actividad Economica"
                  select
                >
                  {actividadEconomicas && actividadEconomicas.map((option) => (
                    <MenuItem
                      key={option.ActividadEconomicaID}
                      value={`${option.ActividadEconomicaID}-${option.ActividadEconomicaID}`}
                      
                    >
                      {`${option.ActividadEconomicaID}-${option.ActividadEconomicaID}`}
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
                  label="Plazo de Pago"
                  select
                >
                  {plazosPagos && plazosPagos.map((option) => (
                    <MenuItem
                      key={option.PlazoPagoID}
                      value={`${option.PlazoPagoID}-${option.PlazoPagoDsc}`}
                      
                    >
                      {`${option.PlazoPagoID}-${option.PlazoPagoDsc}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
             
          </Grid>

          <Divider sx={{ my: 3 }} />
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
                Acepta Devoluciones
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                sx={{ mt: 1 }}
              >
                Marque aqui si acepta devoluciones
              </Typography>
            </div>
            <Switch
              checked={formik.values.AceptaDevoluc}
              color="primary"
              edge="start"
              name="AceptaDevoluc"
              onChange={formik.handleChange}
              value={formik.values.AceptaDevoluc}
            />
          </Box>
          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <Typography
                gutterBottom
                variant="subtitle1"
              >
                Ordenes de Compra
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                sx={{ mt: 1 }}
              >
                Marque aqui si utiliza ordenes de compra
              </Typography>
            </div>
            <Switch
              checked={formik.values.OrdenCompra}
              color="primary"
              edge="start"
              name="OrdenCompra"
              onChange={formik.handleChange}
              value={formik.values.OrdenCompra}
            />
          </Box>

         
          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <Typography
                gutterBottom
                variant="subtitle1"
              >
               Descuento Fijo       
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                sx={{ mt: 1 }}
              >
                Marque aqui si utiliza descuento fijo    
              </Typography>
            </div>
            <Switch
              checked={formik.values.DescuentoFijo}
              color="primary"
              edge="start"
              name="DescuentoFijo"
              onChange={formik.handleChange}
              value={formik.values.DescuentoFijo}
              

            />

            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.PorDescuentoFijo && formik.errors.PorDescuentoFijo)}
                fullWidth
                helperText={formik.touched.PorDescuentoFijo && formik.errors.PorDescuentoFijo}
                label="% Descuento Fijo"
                name="PorDescuentoFijo"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.PorDescuentoFijo}
              />
            </Grid>
          </Box>
       
          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <Typography
                gutterBottom
                variant="subtitle1"
              >
                Descuento Confidencial
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                sx={{ mt: 1 }}
              >
                Marque aqui si utiliza descuento confidencial
              </Typography>
            </div>
            <Switch
              checked={formik.values.DescuentoConfidencial}
              color="primary"
              edge="start"
              name="DescuentoConfidencial"
              onChange={formik.handleChange}
              value={formik.values.DescuentoConfidencial}
            />

            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.PorDescuentoConfidencial && formik.errors.PorDescuentoConfidencial)}
                fullWidth
                helperText={formik.touched.PorDescuentoConfidencial && formik.errors.PorDescuentoConfidencial}
                label="% Descuento Confidencial"
                name="PorDescuentoConfidencial"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.PorDescuentoConfidencial}
              />
            </Grid>
          </Box>
        
          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <Typography
                gutterBottom
                variant="subtitle1"
              >
                Descuento Introduccion
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                sx={{ mt: 1 }}
              >
                Marque aqui si utiliza descuento introduccion
              </Typography>
            </div>
            <Switch
              checked={formik.values.DescuentoIntroduccion}
              color="primary"
              edge="start"
              name="DescuentoIntroduccion"
              onChange={formik.handleChange}
              value={formik.values.DescuentoIntroduccion}
            />
             <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.PorDescuentoIntroduccion && formik.errors.PorDescuentoIntroduccion)}
                fullWidth
                helperText={formik.touched.PorDescuentoIntroduccion && formik.errors.PorDescuentoIntroduccion}
                label="% Descuento Introduccion"
                name="PorDescuentoIntroduccion"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.PorDescuentoIntroduccion}
              />
            </Grid>
          </Box>
      
          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <Typography
                gutterBottom
                variant="subtitle1"
              >
                Participación de Dinámicas Comerciales 
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                sx={{ mt: 1 }}
              >
                Marque aqui si utiliza dinamicas comerciales
              </Typography>
            </div>
            <Switch
              checked={formik.values.PartDinamicasComerciales}
              color="primary"
              edge="start"
              name="PartDinamicasComerciales"
              onChange={formik.handleChange}
              value={formik.values.PartDinamicasComerciales}
            />
          </Box>
        
          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <Typography
                gutterBottom
                variant="subtitle1"
              >
                Participación Espacios Promocionales
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                sx={{ mt: 1 }}
              >
                Marque aqui si utiliza espacios promocionales
              </Typography>
            </div>
            <Switch
              checked={formik.values.PartEspaciosPromocionales}
              color="primary"
              edge="start"
              name="PartEspaciosPromocionales"
              onChange={formik.handleChange}
              value={formik.values.PartEspaciosPromocionales}
            />
          </Box>
         
          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <Typography
                gutterBottom
                variant="subtitle1"
              >
                Participación de Displays
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                sx={{ mt: 1 }}
              >
                Marque aqui si participa en displays
              </Typography>
            </div>
            <Switch
              checked={formik.values.PartDisplays}
              color="primary"
              edge="start"
              name="PartDisplays"
              onChange={formik.handleChange}
              value={formik.values.PartDisplays}
            />
          <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.FrecuenciaVisitaTiendas && formik.errors.FrecuenciaVisitaTiendas)}
                fullWidth
                helperText={formik.touched.FrecuenciaVisitaTiendas && formik.errors.FrecuenciaVisitaTiendas}
                label="Frecuencia Visita Tiendas"
                name="FrecuenciaVisitaTiendas"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.PorDescuentoIntroduccion}
              />
            </Grid>
          </Box>
          
          <Divider sx={{ my: 3 }} />
      
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <Typography
                gutterBottom
                variant="subtitle1"
              >
                Factura Electronica
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                sx={{ mt: 1 }}
              >
                Marque aqui si utiliza factura electronica
              </Typography>
            </div>
            <Switch
              checked={formik.values.DocEntregaFacElect}
              color="primary"
              edge="start"
              name="DocEntregaFacElect"
              onChange={formik.handleChange}
              value={formik.values.DocEntregaFacElect}
            />
          </Box>
         
          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <Typography
                gutterBottom
                variant="subtitle1"
              >
                Guia de Despacho
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                sx={{ mt: 1 }}
              >
                Marque aqui si utiliza guia de despacho
              </Typography>
            </div>
            <Switch
              checked={formik.values.DocEntregaGuiaDespacho}
              color="primary"
              edge="start"
              name="DocEntregaGuiaDespacho"
              onChange={formik.handleChange}
              value={formik.values.DocEntregaGuiaDespacho}
            />
          </Box>

          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <Typography
                gutterBottom
                variant="subtitle1"
              >
               Utiliza Codigo CABYS    
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                sx={{ mt: 1 }}
              >
                Marque aqui si utiliza codificacion CABYS 
              </Typography>
            </div>
            <Switch
              checked={formik.values.AportaCodigoCABYS}
              color="primary"
              edge="start"
              name="AportaCodigoCABYS"
              onChange={formik.handleChange}
              value={formik.values.AportaCodigoCABYS}
              

            />

            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.CodigoCABYS && formik.errors.CodigoCABYS)}
                fullWidth
                helperText={formik.touched.CodigoCABYS && formik.errors.CodigoCABYS}
                label="Especifique codigo CABYS"
                name="CodigoCABYS"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.CodigoCABYS}
              />
            </Grid>
          </Box>
         
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
             Incluir Proveedor
          </Button>
          <NextLink
            href="/"
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
            color="error"
            disabled={formik.isSubmitting}
          >
            Delete user
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

ProveedorCrearForm.propTypes = {
  // @ts-ignore
  proveedor: PropTypes.object.isRequired
};
