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
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import type { File } from '../../file-dropzone';
import { FileDropzone } from '../../file-dropzone';
import { QuillEditor } from '../../quill-editor';
import { productApi } from 'src/__fake-api__/product-api';

const categoryOptions = [
  {
    label: 'Healthcare',
    value: 'healthcare'
  },
  {
    label: 'Makeup',
    value: 'makeup'
  },
  {
    label: 'Dress',
    value: 'dress'
  },
  {
    label: 'Skincare',
    value: 'skincare'
  },
  {
    label: 'Jewelry',
    value: 'jewelry'
  },
  {
    label: 'Blouse',
    value: 'blouse'
  }
];
interface SubCategoryProps {
  categoryId: number;
}

export const SubCategoryCreateForm: FC<SubCategoryProps> = (props) => {
  const { categoryId } = props;
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
        // NOTE: Make AP I request
        await productApi.addSubCategory(values.name, categoryId);
        toast.success('Subcategoria creada!');
        router.push(`/dashboard/subcategories/${categoryId}`).catch(console.error);
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
                label="Nombre subcategoria"
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
