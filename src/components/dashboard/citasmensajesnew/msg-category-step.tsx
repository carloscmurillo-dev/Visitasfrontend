import type { FC } from 'react';
import { useState , useEffect} from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Card, Radio, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ArrowRight as ArrowRightIcon } from '../../../icons/arrow-right';
import {Grid,TextField,MenuItem} from '@mui/material';
import { Category } from 'src/types/APIcategory';
//import { Paciente } from 'src/types/appAmiInterfaces';
import { SubCategory } from 'src/types/APISubCategory';
import { productApi } from 'src/__fake-api__/product-api';
import { useAuth } from '../../../hooks/use-auth';

interface JobCategoryStepProps {
  onNext?: () => void;
  onBack?: () => void;
  handleCategoria: any
}

const typeOptions = [
  {
    description: 'Utilizamos esta opcion para solicitar insumos para pacientes',
    title: 'Solicitud de Insumos',
    value: 'CITA'
  },
  {
    description: 'Aqui subimos PDF de bitacoras, colocaciones etc.',
    title: 'Subir PDFs',
    value: 'MENSAJE'
  },
  
];



  

  

export const JobCategoryStep: FC<JobCategoryStepProps> = (props) => {
  const { onBack, onNext,handleCategoria ,...other } = props;
  const [type, setType] = useState<string>(typeOptions[1].value);


  const handleCategoryChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-')
    setCategoryIdSelected(Number(categorySplit[0]));

    handleCategoria(categorySplit[0],event.target.value,type);

    const dataSubcate = await productApi.getSubCategories(Number(categorySplit[0]) ?? 0);
    setSubCategories(dataSubcate)
    // setCategoryIdSelected(catego ?? 0)



  };

  const handleSubCategoryChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
   


  };

const [categories, setCategories] = useState<Category[]>([]);

const [categoryIdSelected, setCategoryIdSelected] = useState<number | null>(null);
const [subCategories, setSubCategories] = useState<SubCategory[]>();
const { user } = useAuth(); 

useEffect(() => {
    
  async function fetchCategories() {
    const data = await productApi.getCateXProveedor(user.gln);
    console.log('x prove',data)
    //const data = await productApi.getCategories();
    
    console.log('Los datos:',data)
    setCategories(data);

   
   
  }

  fetchCategories();
  

}, [])

  const handleChange = (newType: string): void => {
    setType(newType);
    

  };
  
  return (
    <div {...other}>
      <Typography variant="h6">
        Necesito realizar...
      </Typography>
      <Box sx={{ mt: 3 }}>
        {typeOptions.map((typeOption) => (
          <Box
            key={typeOption.value}
            sx={{ mb: 2 }}
          >
            <Card
              key={typeOption.value}
              sx={{
                alignItems: 'center',
                cursor: 'pointer',
                display: 'flex',
                p: 2,
                ...(type === typeOption.value && {
                  borderColor: 'primary.main',
                  borderWidth: 2,
                  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  m: '-1px'
                })
              }}
              onClick={(): void => handleChange(typeOption.value)}
              variant="outlined"
            >
              <Radio
                checked={type === typeOption.value}
                color="primary"
              />
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle1">
                  {typeOption.title}
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body2"
                >
                  {typeOption.description}
                </Typography>
              </Box>
            </Card>
          </Box>
        ))}
      </Box>
      <Typography variant="h6"  sx={{ mt: 5 }}>
        Seleccione Categoria...
      </Typography>
      <Grid
                item
                md={12}
                xs={12}
                sx={{ mt: 5 }}
             
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
                      {`${option.categoria_dsc}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid
                                    item
                                    md={12}
                                    xs={12}
                                    sx={{ mt: 5 }}
                                  >
                                      <TextField
                                   
                                      onChange={handleSubCategoryChange}
                                       fullWidth
                                        label="Sub Categoria"
                                        select
                                         >
                              
                                      
                                      
                                        {subCategories && subCategories.sort((a,b)=> a.subcategoria_dsc.localeCompare(b.subcategoria_dsc)).map((name) => (
                                          <MenuItem 
                                            key={name.subcategoria_id} 
                                            value={`${name.subcategoria_id}-${name.subcategoria_dsc}`}
                                            > 
                                            {`${name.subcategoria_dsc}`}
                                          </MenuItem>
                                        ))}
                                         </TextField>
                                 
                                  </Grid>








              <Typography variant="h6"  sx={{ mt: 5 }}>
              
      </Typography>
      <Button
        sx={{ mt: 3 }}
        endIcon={(<ArrowRightIcon fontSize="small" />)}
        onClick={onNext}
        variant="contained"
        disabled={!categoryIdSelected}
      >
        Continuar
      </Button>
    </div>
  );
};

JobCategoryStep.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  handleCategoria: PropTypes.func,
};

