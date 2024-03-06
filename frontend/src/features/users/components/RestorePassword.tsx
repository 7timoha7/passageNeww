import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch } from '../../../app/hooks';
import { restorePassword } from '../usersThunks';

const RestorePassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
    if (email === '' || !validateEmail(email)) {
      return;
    }
    await handleClose();
    await dispatch(restorePassword(email));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div>
      <Button size="small" variant="text" color={'warning'} onClick={handleClickOpen}>
        {'Востановить пароль'}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{'Востановить пароль'}</DialogTitle>
        <DialogContent>
          <DialogContentText>{'Введите свой емейл. На ваш емайл адрес будет выслан новый пароль.'}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={'Email'}
            type="email"
            fullWidth
            variant="standard"
            onChange={handleEmail}
            required
            error={email !== '' && !validateEmail(email)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{'Отмена'}</Button>
          <Button onClick={handleSubmit} disabled={email === '' || !validateEmail(email)}>
            {'Отправить'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RestorePassword;
