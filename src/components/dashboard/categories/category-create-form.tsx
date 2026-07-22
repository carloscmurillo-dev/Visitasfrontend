import type { FC } from 'react';
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
  FormHelperText,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import type { File } from '../../file-dropzone';
import { productApi } from 'src/__fake-api__/product-api';

export const CategoryCreateForm: FC = (props) => {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const formik = useFormik({
    initialValues: {
      name: '',
      submit: null
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required(),
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await productApi.addCategory(values.name);
        // NOTE: Make API request
        toast.success('Subcategoria creada!');
        router.push(`/dashboard/categories`).catch(console.error);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const handleDrop = (newFiles: File[]): void => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemove = (file: File): void => {
    setFiles((prevFiles) => prevFiles.filter((_file) => _file.path !== file.path));
  };

  const handleRemoveAll = (): void => {
    setFiles([]);
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
                error={Boolean(formik.touched.name && formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                label="Nombre categoria"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
              />


              {Boolean(formik.touched.name && formik.errors.name) && (
                <Box sx={{ mt: 2 }}>
                  <FormHelperText error>
                    {formik.errors.name}
                  </FormHelperText>
                </Box>
              )}
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
          color="error"
          sx={{
            m: 1,
            mr: 'auto'
          }}
        >
          Borrar
        </Button>
        <Button
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
