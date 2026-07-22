import { useState } from 'react';
import { Fab, Tooltip } from '@mui/material';
import { Adjustments as AdjustmentsIcon } from '../icons/adjustments';
import { SettingsDrawer } from './settings-drawer';

export const SettingsButton = () => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <SettingsDrawer
        onClose={handleClose}
        open={open}
      />
    </>
  );
};
