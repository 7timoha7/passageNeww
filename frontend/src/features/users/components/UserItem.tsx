import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Typography } from '@mui/material';
import AccordionDetails from '@mui/material/AccordionDetails';
import { User } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser, selectUsersByRolePageInfo } from '../usersSlice';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { LoadingButton } from '@mui/lab';
import { changeRole, getByRole } from '../usersThunks';

interface Props {
  prop: User;
  role: string;
}

const UserItem: React.FC<Props> = ({ prop, role }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const gotUsersPageInfo = useAppSelector(selectUsersByRolePageInfo);

  const [state] = useState({
    id: prop._id,
    role: role,
  });

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const newPageGetByRole = async (role: string) => {
    if (gotUsersPageInfo) {
      let newPage: number;

      if ((gotUsersPageInfo.totalItems - 1) % gotUsersPageInfo.pageSize !== 0) {
        newPage = gotUsersPageInfo.currentPage;
      } else {
        newPage = Math.max(1, gotUsersPageInfo.currentPage - 1);
      }
      await dispatch(getByRole({ role, page: newPage }));
    }
  };

  const handleYes = async () => {
    if (user?.role === 'admin') {
      await dispatch(changeRole(state));
      await newPageGetByRole(role);
      await setOpen(false);
    } else {
      if (role === 'admin' || role === 'user') {
        await dispatch(
          changeRole({
            ...state,
            role: role === 'admin' ? 'user' : role === 'user' ? 'admin' : 'admin',
          }),
        );
        await newPageGetByRole(role);
        await setOpen(false);
      } else {
        await dispatch(changeRole(state));
        await newPageGetByRole(role);
        await setOpen(false);
      }
    }
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Typography textTransform="capitalize">
          {prop.firstName} {prop.lastName}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ background: 'WhiteSmoke' }}>
        <Typography textTransform="capitalize">
          {'Имя' + ': '}
          {prop.firstName}
        </Typography>
        <Typography textTransform="capitalize">
          {' '}
          {'Фамилия' + ': '} {prop.lastName}
        </Typography>
        <Typography>
          {' '}
          {'Email' + ': '} {prop.email}
        </Typography>
        <Typography>
          {' '}
          {'Номер телефона' + ': '} {prop.phoneNumber}
        </Typography>
        <Typography>
          {' '}
          {'Верификация' + ': '} {prop.isVerified ? '+' : '-'}
        </Typography>
        <Typography textTransform="capitalize">
          {' '}
          {'Роль' + ': '} {prop.role}
        </Typography>
        {user?.role === 'director' && (
          <LoadingButton color="success" onClick={handleClick}>
            {'Изменить роль'}
          </LoadingButton>
        )}
      </AccordionDetails>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <>
          <DialogContent>
            <Typography variant="body1">
              <>
                {role === 'user' &&
                  `Вы уверены, что хотите ${prop.firstName.toUpperCase()} ${prop.lastName.toUpperCase()} сделать админом?`}
                {role === 'admin' &&
                  `Вы уверены, что хотите забрать у ${prop.firstName.toUpperCase()} ${prop.lastName.toUpperCase()} возможность быть админом?`}
              </>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>отмена</Button>
            <Button onClick={handleYes}>да</Button>
          </DialogActions>
        </>
      </Dialog>
    </Accordion>
  );
};

export default UserItem;
