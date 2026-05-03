import type {
  GetUserListResponseData,
  GetUserProfileResponseData,
  UpdateUserProfileRequestData,
  UpdateUserProfileResponseData,
  UpdateUserRequestData,
} from '@/types/service';

import { baseProtectedApi } from '@/store/baseApi';

export const userApi = baseProtectedApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<GetUserProfileResponseData, void>({
      query: () => ({
        url: '/account/user-profile/',
        method: 'GET',
      }),
      providesTags: ['UserProfile'],
    }),
    updateUserProfile: builder.mutation<
      UpdateUserProfileResponseData,
      UpdateUserProfileRequestData
    >({
      query: (data) => ({
        url: '/account/user-profile/',
        method: 'PATCH',
        data: data,
      }),
      invalidatesTags: ['UserProfile'],
    }),
    getUserList: builder.query<GetUserListResponseData, void>({
      query: () => ({
        url: '/account/user/',
        method: 'GET',
      }),
      providesTags: ['UserList'],
    }),
    updateUser: builder.mutation<void, UpdateUserRequestData>({
      query: (data) => ({
        url: `/account/user/${data.id}/`,
        method: 'PATCH',
        data: data,
      }),
      invalidatesTags: ['UserList'],
    }),
    resetUserPassword: builder.mutation<void, number>({
      query: (id) => ({
        url: `/account/user/${id}/reset-password/`,
        method: 'POST',
      }),
      invalidatesTags: ['UserList'],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserListQuery,
  useUpdateUserMutation,
  useResetUserPasswordMutation,
} = userApi;


//Kullanıcının kendi adını, soyadını veya profil bilgilerini görmesini (GET) ve güncellemesini (PATCH) sağlar.
//Profil kısmı olmadığı için şimdilik burada kalacak