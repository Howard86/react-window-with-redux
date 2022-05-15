import { randFullName, randStreetAddress, seed } from '@ngneat/falso';

export type FakeData = {
  name: string;
  address: string;
};

seed('FIXED_SEED');

export const generateData = (length: number): FakeData[] =>
  Array.from({ length })
    .fill(0)
    .map(() => ({
      name: randFullName(),
      address: randStreetAddress(),
    }));
