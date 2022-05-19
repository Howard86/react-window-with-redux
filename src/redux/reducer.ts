import { combineReducers } from '@reduxjs/toolkit';

import { driverSlice } from './driver';

import { localApi } from '@/services/local';

const reducer = combineReducers({
  [localApi.reducerPath]: localApi.reducer,
  [driverSlice.name]: driverSlice.reducer,
});

export default reducer;
