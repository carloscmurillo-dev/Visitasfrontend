import type { FC,useEffect,useState } from 'react';
import { Avatar, Box, Button, Grid, IconButton, Link, Paper, Typography } from '@mui/material';
import { DotsHorizontal as DotsHorizontalIcon } from '../../../icons/dots-horizontal';
import { productApi } from 'src/__fake-api__/product-api';
import { useMounted } from 'src/hooks/use-mounted';
import type { Reportes, MensajeStatus } from '../../../types/APImensajes';
import { useAuth } from '../../../hooks/use-auth';
import PropTypes from 'prop-types';
import { monthsToQuarters } from 'date-fns';
import { ArrowRight as ArrowRightIcon } from '../../../icons/arrow-right';



const connections = [
  {
    id: '5e887ac47eed253091be10cb',
    avatar: '/static/mock-images/chat/media_1.png',
    commonConnections: 'https://app.powerbi.com/view?r=eyJrIjoiMTYxYTQ1ZDUtNjczMC00Mzk3LWIwODgtOGMxOTBiMjc4M2RiIiwidCI6ImY2ZWY4MjVhLTJlMzMtNDE2MS04NDAwLTdjNjQ0ODEzMjZlNCIsImMiOjR9',
    name: 'REPORTE PLATINO KIMBERLY CLARK',
    status: 'Mostrar'
  },
  
];

interface TableReportsProps {
 reports : Reportes[];
}

export const Tablereportes: FC<TableReportsProps> = (props) => {
  const {
    reports,
    ...other
  } = props;

  
  return (

  <Box
    sx={{
      backgroundColor: 'background.default',
      minHeight: '100%',
      p: 3
    }}
  >
    <Grid
      container
      spacing={3}
    >
      {reports.map((reports) => (
        <Grid
          item
          key={reports.REPORTE_DSC}
          xs={12}
        >
          <Paper variant="outlined">
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                p: 2
              }}
            >
              <Avatar
                src={'/static/mock-images/chat/reportes.jpeg'}
                sx={{
                  height: 60,
                  width: 60
                }}
              />
              <Box
                sx={{
                  flexGrow: 1,
                  mx: 2
                }}
              >
                <Link
                  color="textPrimary"
                  variant="h5"
                >
                  {reports.REPORTE_DSC}
                </Link>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  variant="body2"
                >
                  {/* {reports.LINK} */}
                  
                </Typography>
                <Button 
                    sx={{
                      backgroundColor: 'error.main',
                      mr: 3,
                      '&:hover': {
                        backgroundColor: 'error.dark'
                      }
                    }}
                  component="a"
                  rel="noopener"
                  size="medium"
                  variant="contained"
                 
                  startIcon={<ArrowRightIcon  fontSize="medium" />}

                
                
                  href={reports.LINK}
                  
                >
                  Mostrar reporte...
                </Button>
                
              </Box>
              <IconButton>
                <DotsHorizontalIcon fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Box>
);};
              

Tablereportes.propTypes = {
  reports: PropTypes.array.isRequired,
};
 