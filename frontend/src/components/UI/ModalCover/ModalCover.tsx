import React from 'react';
import Modal from '@mui/material/Modal';
import { useAppDispatch } from '../../../app/hooks';
import { closeModalCover } from '../../../features/users/usersSlice';
import { Box } from '@mui/material';
import { styleModalCover } from '../../../styles';

interface Props extends React.PropsWithChildren {
  state: boolean;
}

const ModalCover: React.FC<Props> = ({ state, children }) => {
  const dispatch = useAppDispatch();

  const handleCloseModal = () => {
    dispatch(closeModalCover());
  };

  return (
    <Modal
      open={state}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      onClick={handleCloseModal}
    >
      <Box sx={styleModalCover}>{children}</Box>
    </Modal>
  );
};

export default ModalCover;
