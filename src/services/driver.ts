import {
  randBetweenDate,
  randBoolean,
  randCity,
  randFullName,
  randStreetAddress,
  randUuid,
  seed,
} from '@ngneat/falso';
import dayjs from 'dayjs';

export type Driver = {
  id: string;
  name: string;
  city: string;
  address: string;
  deliveryTime: number;
  status: boolean;
};

seed('FIXED_SEED');

export const generateDrivers = (length: number): Driver[] => {
  const today = dayjs();

  return Array.from({ length })
    .fill(0)
    .map(() => ({
      id: randUuid().slice(0, 6),
      name: randFullName(),
      city: randCity(),
      address: randStreetAddress(),
      deliveryTime: randBetweenDate({
        from: today.startOf('day').toDate(),
        to: today.endOf('day').toDate(),
      }).valueOf(),
      status: randBoolean(),
    }));
};
