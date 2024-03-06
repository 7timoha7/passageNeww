import { createSlice } from '@reduxjs/toolkit';
import { ChatIdAdminType, GlobalError, GlobalSuccess, PageInfo, User, ValidationError } from '../../types';
import {
  changeFavorites,
  changePass,
  createChatIdAdmin,
  deleteChatIdAdmin,
  editChatIdAdmin,
  fetchOneChatIdAdmin,
  getByRole,
  getUsers,
  googleLogin,
  googlePhoneNumber,
  login,
  logout,
  reAuthorization,
  register,
  restorePassword,
  sendMail,
  verify,
} from './usersThunks';
import { RootState } from '../../app/store';

interface UsersState {
  user: User | null;
  registerLoading: boolean;
  registerError: ValidationError | null;
  loginLoading: boolean;
  logoutLoading: boolean;
  loginError: GlobalError | null;
  Success: GlobalSuccess | null;
  userLoading: boolean;
  modalCoverState: boolean;
  getUsersByRoleLoading: boolean;
  usersByRole: User[];
  usersByRolePageInfo: PageInfo | null;
  users: User[];
  chatIdAdmin: ChatIdAdminType | null;
  chatIdAdminSuccess: GlobalSuccess | null;
  chatIdAdminLoading: boolean;
  fetchFavoriteProductsOneLoading: string | false;
}

const initialState: UsersState = {
  user: null,
  registerLoading: false,
  registerError: null,
  loginLoading: false,
  logoutLoading: false,
  Success: null,
  loginError: null,
  modalCoverState: false,
  getUsersByRoleLoading: false,
  userLoading: false,
  usersByRole: [],
  usersByRolePageInfo: null,
  users: [],
  chatIdAdmin: null,
  chatIdAdminSuccess: null,
  chatIdAdminLoading: false,
  fetchFavoriteProductsOneLoading: false,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    unsetUser: (state) => {
      state.user = null;
    },
    openModalCover: (state) => {
      state.modalCoverState = true;
    },
    closeModalCover: (state) => {
      state.modalCoverState = false;
    },
    unsetCabinetUsers: (state) => {
      state.users = [];
    },
    setUserSuccessNull: (state) => {
      state.Success = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(deleteChatIdAdmin.fulfilled, (state, { payload: success }) => {
      state.chatIdAdminLoading = false;
      state.chatIdAdminSuccess = success;
    });
    builder.addCase(deleteChatIdAdmin.pending, (state) => {
      state.chatIdAdminLoading = true;
    });
    builder.addCase(deleteChatIdAdmin.rejected, (state) => {
      state.chatIdAdminLoading = false;
    });

    builder.addCase(createChatIdAdmin.fulfilled, (state, { payload: success }) => {
      state.chatIdAdminLoading = false;
      state.chatIdAdminSuccess = success;
    });
    builder.addCase(createChatIdAdmin.pending, (state) => {
      state.chatIdAdminLoading = true;
    });
    builder.addCase(createChatIdAdmin.rejected, (state) => {
      state.chatIdAdminLoading = false;
    });

    builder.addCase(editChatIdAdmin.fulfilled, (state, { payload: success }) => {
      state.chatIdAdminLoading = false;
      state.chatIdAdminSuccess = success;
    });
    builder.addCase(editChatIdAdmin.pending, (state) => {
      state.chatIdAdminLoading = true;
    });
    builder.addCase(editChatIdAdmin.rejected, (state) => {
      state.chatIdAdminLoading = false;
    });

    builder.addCase(fetchOneChatIdAdmin.pending, (state) => {
      state.chatIdAdmin = null;
      state.chatIdAdminLoading = true;
    });
    builder.addCase(fetchOneChatIdAdmin.fulfilled, (state, action) => {
      state.chatIdAdmin = action.payload;
      state.chatIdAdminLoading = false;
    });
    builder.addCase(fetchOneChatIdAdmin.rejected, (state) => {
      state.chatIdAdminLoading = false;
    });

    builder.addCase(register.pending, (state) => {
      state.registerLoading = true;
      state.registerError = null;
    });
    builder.addCase(register.fulfilled, (state, { payload: user }) => {
      state.registerLoading = false;
      state.user = user;
    });
    builder.addCase(register.rejected, (state, { payload: error }) => {
      state.registerLoading = false;
      state.registerError = error || null;
    });
    builder.addCase(login.pending, (state) => {
      state.loginLoading = true;
      state.loginError = null;
    });
    builder.addCase(login.fulfilled, (state, { payload: user }) => {
      state.loginLoading = false;
      state.user = user;
    });
    builder.addCase(login.rejected, (state, { payload: error }) => {
      state.loginLoading = false;
      state.loginError = error || null;
    });
    builder.addCase(logout.pending, (state) => {
      state.logoutLoading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.logoutLoading = false;
    });
    builder.addCase(logout.rejected, (state) => {
      state.logoutLoading = false;
    });
    builder.addCase(getByRole.pending, (state) => {
      state.usersByRole = [];
      state.getUsersByRoleLoading = true;
    });
    builder.addCase(getByRole.fulfilled, (state, { payload: { users, pageInfo } }) => {
      state.getUsersByRoleLoading = false;
      state.usersByRole = users;
      state.usersByRolePageInfo = pageInfo;
    });
    builder.addCase(getByRole.rejected, (state) => {
      state.getUsersByRoleLoading = false;
    });
    builder.addCase(getUsers.pending, (state) => {
      state.userLoading = true;
    });
    builder.addCase(getUsers.fulfilled, (state, { payload: users }) => {
      state.userLoading = false;
      state.users = users;
    });
    builder.addCase(getUsers.rejected, (state) => {
      state.userLoading = false;
    });
    builder.addCase(reAuthorization.fulfilled, (state, { payload: user }) => {
      state.user = user;
    });
    builder.addCase(sendMail.fulfilled, (state, { payload: success }) => {
      state.Success = success;
    });
    builder.addCase(verify.fulfilled, (state, { payload: success }) => {
      state.Success = success;
    });
    builder.addCase(googleLogin.pending, (state) => {
      state.loginLoading = true;
      state.loginError = null;
    });
    builder.addCase(googleLogin.fulfilled, (state, { payload: user }) => {
      state.loginLoading = false;
      state.user = user;
    });
    builder.addCase(googleLogin.rejected, (state, { payload: error }) => {
      state.loginLoading = false;
      state.loginError = error || null;
    });
    builder.addCase(restorePassword.fulfilled, (state, { payload: success }) => {
      state.Success = success;
    });
    builder.addCase(changePass.fulfilled, (state, { payload: success }) => {
      state.Success = success;
    });
    builder.addCase(googlePhoneNumber.fulfilled, (state, { payload: user }) => {
      state.user = user.user;
      state.Success = user.message;
    });
    builder.addCase(changeFavorites.fulfilled, (state, { payload: success }) => {
      state.Success = success;
      state.fetchFavoriteProductsOneLoading = false;
    });
    builder.addCase(changeFavorites.pending, (state, { meta }) => {
      if (meta.arg.addProduct) {
        state.fetchFavoriteProductsOneLoading = meta.arg.addProduct;
      } else if (meta.arg.deleteProduct) {
        state.fetchFavoriteProductsOneLoading = meta.arg.deleteProduct;
      }
    });
    builder.addCase(changeFavorites.rejected, (state) => {
      state.fetchFavoriteProductsOneLoading = false;
    });
  },
});

export const usersReducer = usersSlice.reducer;

export const { unsetUser, openModalCover, closeModalCover, unsetCabinetUsers, setUserSuccessNull } = usersSlice.actions;

export const selectUser = (state: RootState) => state.users.user;
export const selectRegisterLoading = (state: RootState) => state.users.registerLoading;
export const selectRegisterError = (state: RootState) => state.users.registerError;
export const selectLoginLoading = (state: RootState) => state.users.loginLoading;
export const selectLoginError = (state: RootState) => state.users.loginError;
export const selectLogoutLoading = (state: RootState) => state.users.logoutLoading;
export const selectModalCoverState = (state: RootState) => state.users.modalCoverState;
export const selectGetUsersByRoleLoading = (state: RootState) => state.users.getUsersByRoleLoading;
export const selectUsersByRole = (state: RootState) => state.users.usersByRole;
export const selectUsersByRolePageInfo = (state: RootState) => state.users.usersByRolePageInfo;
export const selectUsers = (state: RootState) => state.users.users;
export const selectUsersLoading = (state: RootState) => state.users.userLoading;
export const selectUserSuccess = (state: RootState) => state.users.Success;
export const selectChatIdAdmin = (state: RootState) => state.users.chatIdAdmin;
export const selectChatIdAdminLoading = (state: RootState) => state.users.chatIdAdminLoading;
export const selectChatIdAdminSuccess = (state: RootState) => state.users.chatIdAdminSuccess;
export const selectFetchFavoriteProductsOneLoading = (state: RootState) => state.users.fetchFavoriteProductsOneLoading;
