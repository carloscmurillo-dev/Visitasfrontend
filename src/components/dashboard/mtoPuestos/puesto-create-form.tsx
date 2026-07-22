import { FC, useEffect } from 'react';
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


import {tablasApi} from 'src/__fake-api__/TablasReferencia-api'
import {Puestos} from 'src/types/APITablasReferencia'



export const PuestoCreateForm: FC = (props) => {
  const router = useRouter();
 
 
  
  

  const formik = useFormik({
    initialValues: {
      PuestoDsc: '',
     // AsuntoTipo: '',
    
      submit: null
    },
    validationSchema: Yup.object({
      PuestoDsc: Yup.string().max(255).required(),

     // AsuntoTipo: Yup.string().max(5).required(),
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await tablasApi.editPuestos(0,values.PuestoDsc);
        // NOTE: Make API request
        toast.success('Puesto creado con exito!');
        await(1000)
        router.push(`/dashboard/puestos`).catch(console.error);
      } catch (err) {
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });
  

  const [valuetipo, setValueTipo] = useState('C');

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
                error={Boolean(formik.touched.PuestoDsc && formik.errors.PuestoDsc)}
                fullWidth
                helperText={formik.touched.PuestoDsc && formik.errors.PuestoDsc}
                label="Descripcion Puesto "
                name="PuestoDsc"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.PuestoDsc}
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
          Crear
        </Button>
      </Box>
    </form>
  );
};
