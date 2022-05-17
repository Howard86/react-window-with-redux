import {
  createEntityAdapter,
  createSlice,
  EntityId,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { normalize, schema } from 'normalizr';

import type { RootState } from './store';

import { City, Driver } from '@/services/driver';
import { localApi } from '@/services/local';

export interface CityEntity extends City {
  driverIds: string[];
  primaryDriver: Driver;
  expanded?: boolean;
}

export interface DriverEntity extends Omit<Driver, 'city'> {
  city: string;
}

const cityEntity = new schema.Entity<City>(
  'city',
  {},
  {
    idAttribute: 'name',
    mergeStrategy: (a: CityEntity, b: CityEntity): CityEntity => ({
      ...a,
      ...b,
      primaryDriver:
        a.primaryDriver.deliveryTime < b.primaryDriver.deliveryTime
          ? a.primaryDriver
          : b.primaryDriver,
      driverIds: [...a.driverIds, ...b.driverIds],
    }),
    processStrategy: (
      value: City,
      parent: Driver,
      _key: string | null,
    ): CityEntity => ({
      ...value,
      primaryDriver: parent,
      driverIds: [parent.id],
    }),
  },
);
const driverEntity = new schema.Entity<Driver>('drivers', { city: cityEntity });

export const MAX_API_RETURN_COUNT = 30;

const driverAdapter = createEntityAdapter<DriverEntity>({
  selectId: (driver) => driver.id,
  sortComparer: (a, b) => a.deliveryTime - b.deliveryTime,
});

const cityAdapter = createEntityAdapter<CityEntity>({
  selectId: (city) => city.name,
  sortComparer: (a, b) =>
    a.primaryDriver.deliveryTime - b.primaryDriver.deliveryTime,
});

interface DriverState {
  driverEntity: EntityState<DriverEntity>;
  cityEntity: EntityState<CityEntity>;
}

export interface CityState extends City {
  id: string;
  driverIds: EntityId[];
  expanded: boolean;
}

const initialState: DriverState = {
  driverEntity: driverAdapter.getInitialState(),
  cityEntity: cityAdapter.getInitialState(),
};

export const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    toggleExpanded: (state, action: PayloadAction<string>) => {
      if (state.cityEntity.entities[action.payload]) {
        state.cityEntity.entities[action.payload]!.expanded =
          !state.cityEntity.entities[action.payload]?.expanded;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      localApi.endpoints.getDrivers.matchFulfilled,
      (state, action) => {
        const normalized = normalize<
          Driver,
          {
            city: { [key: string]: CityEntity };
            drivers: { [key: string]: DriverEntity };
          }
        >(action.payload, [driverEntity]);

        for (const newCityKey of Object.keys(normalized.entities.city)) {
          if (!state.cityEntity.entities[newCityKey]) {
            state.cityEntity = cityAdapter.addOne(
              state.cityEntity,
              normalized.entities.city[newCityKey],
            );
          } else {
            const existedCity = state.cityEntity.entities[
              newCityKey
            ] as CityEntity;
            const incomingCity = normalized.entities.city[newCityKey];

            state.cityEntity = cityAdapter.updateOne(state.cityEntity, {
              id: newCityKey,
              changes: {
                primaryDriver:
                  incomingCity.primaryDriver.deliveryTime <
                  existedCity.primaryDriver.deliveryTime
                    ? incomingCity.primaryDriver
                    : existedCity.primaryDriver,
                driverIds: existedCity.driverIds.concat(
                  incomingCity.driverIds.filter(
                    (id) => state.driverEntity.entities[id],
                  ),
                ),
              },
            });
          }

          state.driverEntity = driverAdapter.upsertMany(
            state.driverEntity,
            normalized.entities.drivers,
          );
        }
      },
    );
  },
});

export const citySelector = cityAdapter.getSelectors(
  (state: RootState) => state.driver.cityEntity,
);

export const driverSelector = driverAdapter.getSelectors(
  (state: RootState) => state.driver.driverEntity,
);

export const { toggleExpanded } = driverSlice.actions;
