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
import {AsuntosMsg } from 'src/types/APITablasReferencia';
import UsuarioEdit from 'src/pages/dashboard/users/[UserId]/edit';
import { User } from 'src/icons/user';
import { tablasApi } from 'src/__fake-api__/TablasReferencia-api';

interface ReporteEditFormProps {
  asunto: AsuntosMsg;
}


export const AsuntoEditForm: FC<ReporteEditFormProps> = (props) => {
  
  const router = useRouter();
  const {asunto, ...other} = props;
  
  
  
  
  
  const userTypes = [{ value: "0", text: "ADMIN" }, { value: "1", text: "INTERNO" }, { value: "2", text: "EXTERNO" } ]
  //console.log('VALORES INICIALES:',reporte.REPORTE_ID)
 // console.log(usuario.Name,usuario.Username,usuario.adc,usuario.gln,usuario.UserTypeId)
 
  


  
     
      
  
  

  
  const eliminarAsunto = async (): Promise<void> => {
   //alert(usuario.UserId)
    if (confirm("Desea eliminar el asunto:? " + String(asunto.asunto_dsc) ) == true) 
    {

      try {
        await tablasApi.delAsuntos(Number(asunto.asunto_id));
        // NOTE: Make API request
        toast.success('Asunto eliminado con exito!');
        await(1000)
        router.push(`/dashboard/asuntos`).catch(console.error);
      } catch (err) {
        toast.error('Something went wrong!');
       
      }

      
    }
  
  }
  

  const formik = useFormik({
    
    initialValues: {
      asuntoId: asunto.asunto_id,
      asuntoDSC: asunto.asunto_dsc,
     // tipo: asunto.tipoAsunto,
      
      
      submit: null
    },
    validationSchema: Yup.object({
      asuntoDSC: Yup.string().max(255).required(),
      
      //tipo: Yup.string().max(5).required(),
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      //console.log(values.reporteDSC, values.link)

      if (confirm("Desea actualizar el asunto:? " + String(values.asuntoDSC) ) == true) 
      {

     
      try {

        await tablasApi.editAsuntos(Number(values.asuntoId), values.asuntoDSC,valuetipo);
        // NOTE: Make API request
        toast.success('Asunto actualizado con exito!');
        await(1000)
        router.push(`/dashboard/asuntos`).catch(console.error);
      } catch (err) {
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }}
  });


  
  const [valuetipo, setValueTipo] = useState(asunto.tipoAsunto);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueTipo((event.target as HTMLInputElement).value);
  };
 

  

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
                error={Boolean(formik.touched.asuntoDSC && formik.errors.asuntoDSC)}
                fullWidth
                helperText={formik.touched.asuntoDSC && formik.errors.asuntoDSC}
                label="Descripcion Asunto"
                name="asuntoDSC"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.asuntoDSC}
              />
              {/* <TextField
                sx={{
                  mb: 2,
                  mt: 3
                }}
                error={Boolean(formik.touched.tipo && formik.errors.tipo)}
                fullWidth
                helperText={formik.touched.tipo && formik.errors.tipo}
                label="Tipo"
                name="tipo"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.tipo}
              /> */}
       
                  <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">Tipo:</FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={valuetipo}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="C" control={<Radio />} label="CITA" />
                      <FormControlLabel value="M" control={<Radio />} label="MENSAJE" />
                    </RadioGroup>
                  </FormControl>
            
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
        onClick={()=> router.push(`/dashboard/asuntos`)}
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
          onClick={eliminarAsunto}
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
