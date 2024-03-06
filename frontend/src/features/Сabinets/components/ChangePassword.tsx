import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, IconButton } from '@mui/material';
import { useAppDispatch } from '../../../app/hooks';
import { changePass, logout } from '../../users/usersThunks';
import { enqueueSnackbar } from 'notistack';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ChangePassword = () => {
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState({
    password1: '',
    password2: '',
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmOpen = () => {
    if (password.password1 === password.password2) {
      setConfirmOpen(true);
    } else {
      enqueueSnackbar('Пароли не совпадают', { variant: 'error' });
    }
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleSubscribe = async () => {
    await dispatch(changePass(password.password1));
    await dispatch(logout());
    await handleClose();
    await handleConfirmClose();
  };

  return (
    <Box>
      <Button variant="outlined" onClick={handleClickOpen}>
        {'Изменить пароль'}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{'Изменить пароль'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="password1"
            label={'Новый пароль'}
            type={showPassword ? 'text' : 'password'}
            name="password1"
            fullWidth
            variant="standard"
            value={password.password1}
            onChange={handlePasswordChange}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <TextField
            margin="dense"
            id="password2"
            name="password2"
            label={'Повторите пароль'}
            type={showPassword ? 'text' : 'password'}
            fullWidth
            variant="standard"
            value={password.password2}
            onChange={handlePasswordChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{'Назад'}</Button>
          <Button
            disabled={password.password1.length < 3 || password.password2.length < 3}
            onClick={handleConfirmOpen}
            color="success"
          >
            {'Изменить пароль'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>{'Вы уверены?'}</DialogTitle>
        <DialogActions>
          <Button onClick={handleConfirmClose}>{'Назад'}</Button>
          <Button onClick={handleSubscribe} color="success">
            {'Изменить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChangePassword;
