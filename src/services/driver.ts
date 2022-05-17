import {
  randBetweenDate,
  randBoolean,
  randCity,
  randFullName,
  randNumber,
  randStreetAddress,
  randUuid,
  seed,
} from '@ngneat/falso';
import dayjs from 'dayjs';

export type Driver = {
  id: string;
  name: string;
  city: City;
  address: string;
  deliveryTime: number;
  status: boolean;
};

export type City = {
  name: string;
  price: number;
  pickUpLocations: string[];
};

seed('FIXED_SEED_RANDOM_CODE');

export const generateDrivers = (length: number): Driver[] => {
  const today = dayjs();

  return Array.from({ length })
    .fill(0)
    .map(() => ({
      id: randUuid().slice(0, 6),
      name: randFullName(),
      city: {
        name: randCity(),
        price: randNumber({ min: 0, max: 100 }),
        pickUpLocations: randStreetAddress({
          length: randNumber({ min: 1, max: 5 }),
        }),
      },
      address: randStreetAddress(),
      deliveryTime: randBetweenDate({
        from: today.startOf('day').toDate(),
        to: today.endOf('day').toDate(),
      }).valueOf(),
      status: randBoolean(),
    }));
};
