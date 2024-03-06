import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ChatIdAdminType,
  GlobalError,
  GlobalSuccess,
  LoginMutation,
  PageInfo,
  RegisterMutation,
  RegisterResponse,
  User,
  ValidationError,
} from '../../types';
import { isAxiosError } from 'axios';
import { unsetUser } from './usersSlice';
import axiosApi from '../../axiosApi';

export const register = createAsyncThunk<User, RegisterMutation, { rejectValue: ValidationError }>(
  'users/register',
  async (registerMutation, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post<RegisterResponse>('/users', registerMutation);
      return response.data.user;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);

export const login = createAsyncThunk<User, LoginMutation, { rejectValue: GlobalError }>(
  'users/login',
  async (loginMutation, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post<RegisterResponse>('/users/sessions', loginMutation);
      return response.data.user;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);

export const logout = createAsyncThunk('users/logout', async (_, { dispatch }) => {
  await axiosApi.delete('/users/sessions');
  dispatch(unsetUser());
});

export const getByRole = createAsyncThunk<
  {
    users: User[];
    pageInfo: PageInfo;
  },
  { role: string; page: number }
>('users/getByRole', async ({ role, page }) => {
  try {
    const responseAdmins = await axiosApi.get<{
      users: User[];
      pageInfo: PageInfo;
    }>(`/users/getByRole?roleUsers=${role}&page=${page}`);
    return responseAdmins.data;
  } catch {
    throw new Error();
  }
});

export const getUsers = createAsyncThunk<User[], string>('users/getMatched', async (match) => {
  try {
    const responseUsers = await axiosApi.get<User[]>('/users/getMatched?' + match);
    return responseUsers.data;
  } catch {
    throw new Error();
  }
});

interface roleProps {
  id: string;
  role: string;
}

export const changeRole = createAsyncThunk<void, roleProps>('users/roleChange', async ({ role, id }) => {
  try {
    await axiosApi.patch('/users/role/' + id, { role });
  } catch {
    throw new Error();
  }
});

export const reAuthorization = createAsyncThunk<User>('users/reAuthorization', async () => {
  try {
    const response = await axiosApi.post<RegisterResponse>('/users/session/token');
    return response.data.user;
  } catch {
    throw new Error();
  }
});

export const googleLogin = createAsyncThunk<User, string, { rejectValue: GlobalError }>(
  'users/googleLogin',
  async (credential, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post<RegisterResponse>('/users/google', { credential });
      return response.data.user;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);

interface googleUpdateNumber {
  message: GlobalSuccess;
  user: User;
}

export const googlePhoneNumber = createAsyncThunk<googleUpdateNumber, string>(
  'users/googlePhoneNumber',
  async (phone) => {
    try {
      const response = await axiosApi.patch('/users/googleNumber', { newPhone: phone });

      return response.data;
    } catch {
      throw new Error();
    }
  },
);

export const sendMail = createAsyncThunk<GlobalSuccess>('users/getVerify', async () => {
  try {
    const response = await axiosApi.post('/users/getVerify');
    return response.data;
  } catch {
    throw new Error();
  }
});

export const verify = createAsyncThunk<GlobalSuccess, string>('users/verify', async (token) => {
  try {
    const response = await axiosApi.get('/users/verify/' + token);
    return response.data;
  } catch {
    throw new Error();
  }
});

export const changePass = createAsyncThunk<GlobalSuccess, string>('users/changePassword', async (pass) => {
  try {
    const response = await axiosApi.patch('/users/password', { newPassword: pass });
    return response.data;
  } catch {
    throw new Error();
  }
});

export const restorePassword = createAsyncThunk<GlobalSuccess, string>('users/restorePassword', async (email) => {
  try {
    const response = await axiosApi.post('/users/restorePassword', { email: email });
    return response.data;
  } catch {
    throw new Error();
  }
});

interface changeProps {
  addProduct?: string;
  deleteProduct?: string;
}

export const changeFavorites = createAsyncThunk<GlobalSuccess, changeProps>('users/changeFavorites', async (data) => {
  try {
    const payload = data.addProduct ? { addProduct: data.addProduct } : { deleteProduct: data.deleteProduct };
    const response = await axiosApi.patch('/users/toggleAddProductToFavorites', payload);
    return response.data;
  } catch {
    throw new Error();
  }
});

export const createChatIdAdmin = createAsyncThunk<GlobalSuccess, string>('users/createChatIdAdmin', async (chat_id) => {
  try {
    const response = await axiosApi.post('/chatIdAdmins', { chat_id });
    return response.data;
  } catch {
    throw new Error();
  }
});

export const fetchOneChatIdAdmin = createAsyncThunk<ChatIdAdminType>('users/fetchOneChatIdAdmin', async () => {
  try {
    const response = await axiosApi.get<ChatIdAdminType>('/chatIdAdmins');
    return response.data;
  } catch {
    throw new Error();
  }
});

export const editChatIdAdmin = createAsyncThunk<GlobalSuccess, string>('users/editChatIdAdmin', async (chat_id) => {
  try {
    const response = await axiosApi.patch('/chatIdAdmins', { chat_id });
    return response.data;
  } catch {
    throw new Error();
  }
});

export const deleteChatIdAdmin = createAsyncThunk<GlobalSuccess>('users/deleteChatIdAdmin', async () => {
  try {
    const response = await axiosApi.delete('/chatIdAdmins');
    return response.data;
  } catch {
    throw new Error();
  }
});
