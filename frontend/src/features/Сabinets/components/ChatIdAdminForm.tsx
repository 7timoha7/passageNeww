import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectChatIdAdmin, selectChatIdAdminLoading } from '../../users/usersSlice';
import { User } from '../../../types';
import { createChatIdAdmin, deleteChatIdAdmin, fetchOneChatIdAdmin } from '../../users/usersThunks';
import CurveText from '../../../components/UI/CurveText/CurveText';
import { LoadingButton } from '@mui/lab';

interface Props {
  user: User;
}

const ChatIdAdminForm: React.FC<Props> = ({ user }) => {
  const [chatId, setChatId] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const getChatId = useAppSelector(selectChatIdAdmin);
  const loading = useAppSelector(selectChatIdAdminLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      dispatch(fetchOneChatIdAdmin());
    }
  }, [dispatch, user]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChatId(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (chatId.trim() === '') {
      return;
    }

    await dispatch(createChatIdAdmin(chatId));
    await dispatch(fetchOneChatIdAdmin());
    setChatId('');
  };

  const toggleInstructions = () => {
    setShowInstructions((prev) => !prev);
  };

  const deleteIdAdmin = async () => {
    await dispatch(deleteChatIdAdmin());
    await dispatch(fetchOneChatIdAdmin());
  };

  return (
    <Box
      component={'form'}
      sx={{ borderBottom: '1.5px solid gray', borderTop: '1.5px solid gray', mb: 2 }}
      onSubmit={handleSubmit}
    >
      <Box>
        {!getChatId ? (
          <>
            <TextField
              label="ID чата"
              variant="outlined"
              fullWidth
              value={chatId}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <Typography variant="caption" display="block" gutterBottom>
              Вы можете ввести свой ID в Telegram, для того чтоб получать уведомления о заказах.
            </Typography>
            <Box sx={{ mb: 2 }}>
              <LoadingButton
                loading={loading}
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: 16 }}
              >
                Отправить
              </LoadingButton>

              <Button variant="text" color="primary" onClick={toggleInstructions} style={{ marginTop: 16 }}>
                {showInstructions ? 'Скрыть инструкцию' : 'Показать инструкцию'}
              </Button>
            </Box>

            {showInstructions && (
              <div>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: 16 }}>
                  Инструкция:
                </Typography>
                <ol>
                  <li>
                    Перейдите к боту{' '}
                    <a href="https://t.me/passage_bishkek_bot" target="_blank" rel="noopener noreferrer">
                      @passage_bishkek_bot
                    </a>
                    .
                  </li>
                  <li>Нажмите &ldquo;Start&rdquo; внизу экрана, чтобы начать взаимодействие с ботом.</li>
                  <li>
                    Откройте Telegram и найдите бота{' '}
                    <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer">
                      Userinfobot
                    </a>
                    .
                  </li>
                  <li>Нажмите &ldquo;Start&rdquo; внизу экрана, чтобы начать взаимодействие с ботом.</li>
                  <li>Ваш ID чата будет отображен в чате. Скопируйте его.</li>
                  <li>
                    Вернитесь на этот сайт, введите скопированный ID в поле выше и нажмите &ldquo;Отправить&rdquo;.
                  </li>
                  <li>После этого, уведомления о заказах будут приходить вам через этот бот.</li>
                </ol>
              </div>
            )}
          </>
        ) : (
          <>
            {user.role === 'admin' && (
              <>
                <Grid container alignItems={'center'} justifyContent={'space-between'}>
                  <Grid item>
                    <CurveText name="Id в Telegram" data={getChatId.chat_id} />
                  </Grid>
                  <Grid item>
                    <LoadingButton size={'small'} color={'error'} loading={loading} onClick={() => deleteIdAdmin()}>
                      Удалить
                    </LoadingButton>
                  </Grid>
                </Grid>
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default ChatIdAdminForm;
