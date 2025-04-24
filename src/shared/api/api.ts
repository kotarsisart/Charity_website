import { logout } from '@/admin/login/lib/authSlice';
import { AppDispatch, RootState } from '@/app/appStore';
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  createApi,
} from '@reduxjs/toolkit/query/react';

// Створення базового запиту
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://opportunities-for-everyone-backend.onrender.com',
  prepareHeaders: (headers, { getState, endpoint }) => {
    // Перелік endpoint, які не вимагають авторизації
    const skipAuthEndpoints = [
      'getNews',
      'getNewsItem',
      'getProjects',
      'getProjectsActive',
      'becameVolunteer',
      'createProject',
      'becamePartner',
      'register',
      'getPartners',
      'getPartner',
      'donate',
      'getUsers',
      'getFoundings',
      'getReports',
    ];

    // Перевіряємо, чи поточний endpoint вимагає авторизації
    if (!skipAuthEndpoints.includes(endpoint)) {
      const token =
        (getState() as RootState).auth.token || localStorage.getItem('token');

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  },
});

// Створення базового запиту з логікою перехоплення
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Обробка помилки 401
  if (result.error) {
    if (result.error.status === 401) {
      const dispatch = api.dispatch as AppDispatch;
      dispatch(logout());
    }

    // Обробка HTML-відповіді (якщо сервер повертає HTML замість JSON)
    if (
      result.error.status === 200 &&
      typeof result.error.data === 'string' &&
      result.error.data.startsWith('<form')
    ) {
      return {
        data: result.error.data,
      };
    }
  }

  return result;
};

// Створення API
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string }, { email: string; password: string }>({
      query: (userData) => ({
        url: "/auth/login",
        method: "POST",
        body: userData,
      }),
    }),
    register: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/auth/registration",
        method: "POST",
        body: formData,
      }),
    }),
    donate: builder.mutation<any, any>({
      query: (data) => ({
        url: "/public/donations",
        method: "POST",
        body: data,
        responseHandler: "text",
      }),
    }),
    donateProject: builder.mutation<any, { id: string; data: any }>({
      query: ({data, id}) => ({
        url: `/public/projects/${id}/donate`,
        method: "POST",
        body: data,
        responseHandler: "text",
      }),
    }),
    getNotify: builder.query({
      query: () => ({
        url: `admin/telegram/notifyMe`,
        // Example: we have a backend API always returns a 200,
        // but sets an `isError` property when there is an error.
        // validateStatus: (response, result) =>
        //   response.status === 200 && !result.isError,
        responseHandler: "text",
      }),
    }),
  })
})


export const { useLoginMutation, useRegisterMutation, useDonateMutation, useGetNotifyQuery, useLazyGetNotifyQuery, useDonateProjectMutation } =
  api
