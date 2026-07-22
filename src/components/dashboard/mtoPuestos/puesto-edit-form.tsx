import { ChangeEvent, FC, useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';
import { Trash as TrashIcon } from '../../../icons/trash';
import { Provider } from 'src/types/getProvider';
import { authApi } from 'src/__fake-api__/auth-api';
import {AsuntosMsg, Puestos } from 'src/types/APITablasReferencia';
import UsuarioEdit from 'src/pages/dashboard/users/[UserId]/edit';
import { User } from 'src/icons/user';
import { tablasApi } from 'src/__fake-api__/TablasReferencia-api';

interface ReporteEditFormProps {
  puesto: Puestos;
}


export const PuestoEditForm: FC<ReporteEditFormProps> = (props) => {
  
  const router = useRouter();
  const {puesto, ...other} = props;
  
  
  
  
  
  //const userTypes = [{ value: "0", text: "ADMIN" }, { value: "1", text: "INTERNO" }, { value: "2", text: "EXTERNO" } ]
  //console.log('VALORES INICIALES:',reporte.REPORTE_ID)
 // console.log(usuario.Name,usuario.Username,usuario.adc,usuario.gln,usuario.UserTypeId)
 
  


  
     
      
  
  

  
  const eliminarPuesto = async (): Promise<void> => {
   //alert(usuario.UserId)
    if (confirm("Desea eliminar el puesto:? " + String(puesto.DescripcionPuesto) ) == true) 
    {

      try {
        await tablasApi.delPuestos(Number(puesto.IdPuesto));
        // NOTE: Make API request
        toast.success('Puesto eliminado con exito!');
        await(1000)
        router.push(`/dashboard/puestos`).catch(console.error);
      } catch (err) {
        toast.error('Something went wrong!');
       
      }

      
    }
  
  }
  

  const formik = useFormik({
    
    initialValues: {
      IdPuesto: puesto.IdPuesto,
      DescripcionPuesto: puesto.DescripcionPuesto,
      
      submit: null
    },
    validationSchema: Yup.object({
      DescripcionPuesto: Yup.string().max(255).required(),
      
      //tipo: Yup.string().max(5).required(),
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      //console.log(values.reporteDSC, values.link)

      if (confirm("Desea actualizar el puesto:? " + String(values.DescripcionPuesto) ) == true) 
      {

     
      try {

        await tablasApi.editPuestos(Number(values.IdPuesto), values.DescripcionPuesto);
        // NOTE: Make API request
        toast.success('Puesto actualizado con exito!');
        await(1000)
        router.push(`/dashboard/puestos`).catch(console.error);
      } catch (err) {
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }}
  });


  
  

  

  return (
    <form
      onSubmit={formik.handleSubmit}
      {...props}
    >
      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={4}
              xs={12}
            >
              <Typography variant="h6">
                Detalle
              </Typography>
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.DescripcionPuesto && formik.errors.DescripcionPuesto)}
                fullWidth
                helperText={formik.touched.DescripcionPuesto && formik.errors.DescripcionPuesto}
                label="Descripcion Puesto"
                name="DescripcionPuesto"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.DescripcionPuesto}
              />
            
            
            </Grid>
           
          </Grid>
        </CardContent>
      </Card>
      <Box
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
        onClick={()=> router.push(`/dashboard/puestos`)}
          sx={{ m: 1 }}
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button
          sx={{ m: 1 }}
          type="submit"
          variant="contained"
        >
          Actualizar...
        </Button>
        <Button
          sx={{ m: 1 }}
          onClick={eliminarPuesto}
          variant="contained"
          //disabled
          color="error" 
          startIcon={<TrashIcon />}
        >
          Eliminar...
        </Button>
      </Box>
    </form>
  );
};
