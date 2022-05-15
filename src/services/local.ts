import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Driver, generateDrivers } from './driver';

import sleep from '@/utils/sleep';

export const localApi = createApi({
  reducerPath: 'local',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  endpoints: (builder) => ({
    getName: builder.query<Local.HelloApi, void>({ query: () => 'hello' }),
    getDrivers: builder.query<Driver[], number>({
      queryFn: async (count) => {
        await sleep(2);
        return { data: generateDrivers(count) };
      },
    }),
  }),
});

export const { useGetNameQuery, useLazyGetDriversQuery } = localApi;
