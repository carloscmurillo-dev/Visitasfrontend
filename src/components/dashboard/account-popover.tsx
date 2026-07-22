import type { FC } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../hooks/use-auth';
import { Cog as CogIcon } from '../../icons/cog';
import { UserCircle as UserCircleIcon } from '../../icons/user-circle';
import { SwitchHorizontalOutlined as SwitchHorizontalOutlinedIcon } from '../../icons/switch-horizontal-outlined';

interface AccountPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open?: boolean;
}

export const AccountPopover: FC<AccountPopoverProps> = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const router = useRouter();
  const { logout } = useAuth();
  // To get the user from the authContext, you can use
  const { user } = useAuth();

  console.log('AUTORIZACION: ',user)

  const handleLogout = async (): Promise<void> => {
  
    // if (user.formActive) 
    //  {
    //   alert('Cierre primero la ventana')
    //   onClose?.();
    // }
  
  
    // else {
    if (confirm('Desea salir de Visitas Amimed Salud?')== true ) {

      console.log(user.UserType)
      
    try {
      // router.push('/').catch(); 
      // onClose?.();

      
      window.location.reload();
      router.push('/dashboard')
      await logout();
      
    
      router.push('/authentication/login').catch(console.error);
    } catch (err) {
      
      console.error(err);
      toast.error('Unable to logout.');
    }
  //}
  onClose?.();
   }
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'bottom'
      }}
      keepMounted
      onClose={onClose}
      open={!!open}
      PaperProps={{ sx: { width: 300 } }}
      transitionDuration={0}
      {...other}
    >
      <Box
        sx={{
          alignItems: 'center',
          p: 2,
          display: 'flex'
        }}
      >
        <Avatar
          src={user?.avatar ?? ""}  
          sx={{
            height: 40,
            width: 40
          }}
        >
          <UserCircleIcon fontSize="small" />
        </Avatar>
        <Box
          sx={{
            ml: 1
          }}
        >
          <Typography variant="body1">
            {user?.email ?? ""}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {user?.name ?? ""}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
             {/* {user.id} */}
            Version 2.5.0
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
           { user.gln!=0 ? 'Terapeuta ID:' + user.gln : 'Usuario Administrativo' }
         
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ my: 1 }}>


        <MenuItem onClick={handleLogout}> 
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={(
              <Typography variant="body1">
                Cerrar la sesión
              </Typography>
            )}
          />
        </MenuItem>
      </Box>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};
