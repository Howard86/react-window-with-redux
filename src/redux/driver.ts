import {
  createEntityAdapter,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';

import type { RootState } from './store';

import { Driver, generateDrivers } from '@/services/driver';
import { localApi } from '@/services/local';

export const MAX_API_RETURN_COUNT = 30;

const driverAdapter = createEntityAdapter<Driver>({
  selectId: (driver) => driver.id,
  sortComparer: (a, b) => a.deliveryTime - b.deliveryTime,
});

const driverSelector = driverAdapter.getSelectors();

interface DriverState {
  entity: EntityState<Driver>;
}

const initialState: DriverState = {
  entity: driverAdapter.addMany(
    driverAdapter.getInitialState(),
    generateDrivers(MAX_API_RETURN_COUNT),
  ),
};

export const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      localApi.endpoints.getDrivers.matchFulfilled,
      (state, action) => {
        state.entity = driverAdapter.addMany(state.entity, action.payload);
      },
    );
  },
});

export const selectDrivers = (state: RootState) =>
  driverSelector.selectAll(state.driver.entity);

export const selectDriverIds = (state: RootState) =>
  driverSelector.selectIds(state.driver.entity);

export const selectDriverEntities = (state: RootState) =>
  driverSelector.selectEntities(state.driver.entity);
