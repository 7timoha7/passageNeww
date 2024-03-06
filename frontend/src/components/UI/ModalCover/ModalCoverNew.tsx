import React from 'react';
import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';
import { styleModalCoverNew } from '../../../styles';

interface Props extends React.PropsWithChildren {
  state: boolean;
}

const ModalCoverNew: React.FC<Props> = ({ state, children }) => {
  // const dispatch = useAppDispatch();
  //
  // const handleCloseModal = () => {
  //   dispatch(closeModalCover());
  // };

  return (
    <Modal
      open={state}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      // onClick={handleCloseModal}
    >
      <Box sx={styleModalCoverNew}>{children}</Box>
    </Modal>
  );
};

export default ModalCoverNew;
