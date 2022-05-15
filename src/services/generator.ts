import { randFullName, randStreetAddress, randUuid, seed } from '@ngneat/falso';

export type FakeData = {
  id: string;
  name: string;
  address: string;
};

seed('FIXED_SEED');

export const generateData = (length: number): FakeData[] =>
  Array.from({ length })
    .fill(0)
    .map(() => ({
      id: randUuid().slice(0, 6),
      name: randFullName(),
      address: randStreetAddress(),
    }));
