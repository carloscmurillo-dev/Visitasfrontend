import type { FC } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Typography } from '@mui/material';
import { ArrowRight as ArrowRightIcon } from '../../../icons/arrow-right';
import { QuillEditor } from '../../quill-editor';

interface JobDescriptionStepProps {
  onBack?: () => void;
  onNext?: () => void;
  handleDescrip: any;
}

export const JobDescriptionStep: FC<JobDescriptionStepProps> = (props) => {
  const { onBack, onNext,handleDescrip, ...other } = props;
  const [content, setContent] = useState<string>('');

  const handleChange = (value: string): void => {
    setContent(value);
    handleDescrip(value)
  };

  return (
    <div {...other}>
      <Typography variant="h6">
        Especifique mensaje...
      </Typography>
      <QuillEditor
        onChange={handleChange}
        placeholder="Escriba aqui..."
        sx={{
          height: 400,
          mt: 3
        }}
        value={content}
      />
      <Box sx={{ mt: 2 }}>
        <Button
          endIcon={(<ArrowRightIcon fontSize="small" />)}
          onClick={onNext}
          variant="contained"
        >
          Finalizar Cita/Mensaje
        </Button>
        <Button
          onClick={onBack}
          sx={{ ml: 2 }}
        >
          Regresar
        </Button>
      </Box>
    </div>
  );
};

JobDescriptionStep.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  handleDescrip: PropTypes.func,
};
