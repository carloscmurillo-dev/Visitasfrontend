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
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import { Trash as TrashIcon } from '../../../icons/trash';
import { Provider } from 'src/types/getProvider';
import { authApi } from 'src/__fake-api__/auth-api';
import {APIUser } from 'src/types/APIUser';
import UsuarioEdit from 'src/pages/dashboard/users/[UserId]/edit';
import { User } from 'src/icons/user';

interface UsuarioEditFormProps {
  usuario: APIUser;
}


export const UserEditForm: FC<UsuarioEditFormProps> = (props) => {
  
  const router = useRouter();
  const {usuario, ...other} = props;
  
  const [providers, setProviders] = useState<Provider[]>([]);
  const [userList, setUserList] = useState<APIUser[]>([]);
  const [selectedUserType, setselectedUserType] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [adcode, setAdcode] = useState<string | null>(null);
  const userTypes = [{ value: "0", text: "ADMIN" }, { value: "1", text: "ADC" }, { value: "2", text: "ASISTENTE" }, { value: "3", text: "PROVEEDOR" }, { value: "4", text: "GERENCIA" },  { value: "5", text: "ITEMFILE" },{ value: "6", text: "PROVEEDOR NO EWAY" }]
  console.log('VALORES INICIALES:')
  console.log(usuario.Name,usuario.Username,usuario.adc,usuario.gln,usuario.UserTypeId)
  console.log('Desc. Proveedor',usuario.proveedor_dsc)
  
  


  
     
      
  
  useEffect(() => {

    const getUsers = async () => {
      const users = await authApi.getUsers();
      setUserList(users);
    }


    async function fetchProviders() {
      const result = await authApi.getProviders();
      setProviders(result);
    }
    fetchProviders();
     getUsers();

     setProvider(usuario.gln)
     setAdcode(usuario.adc == null ? '' : usuario.adc.toString())
     setselectedUserType(usuario.UserTypeId)

  }, [])
  const eliminarUsuario = async (): Promise<void> => {
   //alert(usuario.UserId)
    if (confirm("Desea eliminar el usuario:? " + String(usuario.UserId) + ' ' + usuario.Name) == true) 
    {

      try {
        await authApi.deleteUser(usuario.UserId);
        // NOTE: Make API request
        toast.success('Usuario eliminado con exito!');
        await(1000)
        router.push(`/dashboard/users`).catch(console.error);
      } catch (err) {
        toast.error('Something went wrong!');
       
      }

      
    }
  
  }
  

  const formik = useFormik({
    
    initialValues: {
      name: usuario.Name,
      username: usuario.Username,
      password: '',
      
      submit: null
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required(),
      password: Yup.string().max(255),
      username: Yup.string().max(255).required().email(),
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      console.log(values.username, values.password,values.name, provider, adcode, selectedUserType)

      if (confirm("Desea actualizar el usuario:? " + String(usuario.UserId) + ' ' + usuario.Name) == true) 
      {

     
      try {

        await authApi.newUser(values.username, values.password,values.name, provider, adcode, selectedUserType);
        // NOTE: Make API request
        toast.success('Usuario actualizado con exito!');
        await(1000)
        router.push(`/dashboard/users`).catch(console.error);
      } catch (err) {
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }}
  });


  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const userTypeSplit = (event.target.value).split('-');
    setselectedUserType(userTypeSplit[0]);
  };
  const handleProviderChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const providerSplit = (event.target.value).split('#');
    setProvider(providerSplit[0]);
  }
  const handleADCChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const providerSplit = (event.target.value).split('-');
    setAdcode(providerSplit[0]);
  }

 

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
                label="Nombre"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              <TextField
                sx={{
                  mb: 2,
                  mt: 3
                }}
                error={Boolean(formik.touched.username && formik.errors.username)}
                fullWidth
                helperText={formik.touched.username && formik.errors.username}
                label="Usuario (Email)"
                name="username"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.username}
              />
              <TextField
                sx={{
                  mb: 2,
                  mt: 3
                }}
                error={Boolean(formik.touched.password && formik.errors.password)}
                fullWidth
                helperText={formik.touched.password && formik.errors.password}
                label="Password - Dejar en blanco si no se va a hacer cambio password!"
                name="password" type={'password'}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              
                placeholder="Dejar en blanco si no se va a hacer cambio password!"
              />
              <Grid
                item
                md={12}
                xs={12}
                sx={{
                  mb: 2,
                  mt: 3
                }}
              >
                <TextField
                  onChange={handleChange}
                  fullWidth
                  label={'Tipo:' + usuario.UserTypeDescription ?? ""}
               //   value={usuario.UserTypeId ?? ""}
                  select
                >
                  {userTypes.map((option) => (
                    <MenuItem
                      key={option.value}
                      value={`${option.value}-${option.text}`}
                    >
                      {`${option.value}-${option.text}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {(selectedUserType?.startsWith('3')  || selectedUserType?.startsWith('6')) && <Grid
                item
                md={12}
                xs={12}
              >
                <TextField
                  onChange={handleProviderChange}
                  fullWidth
                  label={'Proveedor:' + usuario.proveedor_dsc ?? ""}
                //  value={provider?.toString() ?? ""}
                  select
                >
                  
                  {providers && providers.sort((a,b)=>a.proveedor_dsc.localeCompare(b.proveedor_dsc)).map((option) => (
                    <MenuItem
                      key={option.gln}
                      value={`${option.gln}#${option.proveedor_dsc}`}
                    >
                      {`${option.proveedor_dsc}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>}

              {selectedUserType?.startsWith('2') && <Grid
                item
                md={12}
                xs={12}
                sx={{
                  mb: 2,
                  mt: 3
                }}
              >
                <TextField
                  onChange={handleADCChange}
                  fullWidth
                  label={'ADC: ' + usuario.adc + ' ' + usuario.ADCname}
                  select
                >
                  {userList && userList.sort((a,b)=> a.Username.localeCompare(b.Username)).filter(q => q.UserTypeId === "1") && userList.filter(q => q.UserTypeId === "1").map((option) => (
                    <MenuItem
                      key={option.UserId}
                      value={`${option.UserId}-${option.Username}`}
                    >
                      {`${option.UserId}-${option.Username}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>}
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
        onClick={()=> router.push(`/dashboard/users`)}
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
          onClick={eliminarUsuario}
          variant="contained"
          //disabled
          color="error" startIcon={<TrashIcon />}
        >
          Eliminar...
        </Button>
      </Box>
    </form>
  );
};
