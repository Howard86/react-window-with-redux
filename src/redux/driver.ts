import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityId,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';

import type { RootState } from './store';

import { Driver } from '@/services/driver';
import { localApi } from '@/services/local';

export const MAX_API_RETURN_COUNT = 30;

const driverAdapter = createEntityAdapter<Driver>({
  selectId: (driver) => driver.id,
  sortComparer: (a, b) => a.deliveryTime - b.deliveryTime,
});

const driverSelector = driverAdapter.getSelectors();

interface DriverState {
  driverState: EntityState<Driver>;
  city: {
    ids: string[];
    entities: Record<string, CityState>;
  };
}

export interface CityState {
  id: string;
  driverIds: EntityId[];
  expanded: boolean;
}

const initialState: DriverState = {
  driverState: driverAdapter.getInitialState(),
  city: {
    ids: [],
    entities: {},
  },
};

export const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    toggleExpanded: (state, action: PayloadAction<string>) => {
      state.city.entities[action.payload].expanded =
        !state.city.entities[action.payload].expanded;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      localApi.endpoints.getDrivers.matchFulfilled,
      (state, action) => {
        state.driverState = driverAdapter.addMany(
          state.driverState,
          action.payload,
        );

        for (const driver of action.payload) {
          if (state.city.entities[driver.city]) {
            state.city.entities[driver.city].driverIds.push(driver.id);
          } else {
            state.city.ids.push(driver.city);
            state.city.entities[driver.city] = {
              id: driver.city,
              driverIds: [driver.id],
              expanded: false,
            };
          }
        }
      },
    );
  },
});

export const { toggleExpanded } = driverSlice.actions;

export const selectDrivers = (state: RootState) =>
  driverSelector.selectAll(state.driver.driverState);

export const selectDriverIds = (state: RootState) =>
  driverSelector.selectIds(state.driver.driverState);

export const selectDriverEntities = (state: RootState) =>
  driverSelector.selectEntities(state.driver.driverState);

export const selectDriverCityState = (state: RootState) => state.driver.city;

export const selectDriverCities = createSelector(
  selectDriverCityState,
  (city) => city.ids.map((name) => city.entities[name]),
);
