import { createContext, FC, MutableRefObject, useContext } from 'react';

import { EntityId } from '@reduxjs/toolkit';
import { VariableSizeList } from 'react-window';

import { CityEntity, DriverEntity } from '@/redux/driver';

// Reference: https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object/58436959#58436959
type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

// type Paths<T, D extends number = 10> = [D] extends [never]
//   ? never
//   : T extends object
//   ? {
//       [K in keyof T]-?: K extends string | number
//         ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
//         : never;
//     }[keyof T]
//   : '';

type Leaves<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]
  : '';

type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[],
];

export interface ReactWindowTable {
  ref: MutableRefObject<VariableSizeList | null>;
  columns: Column[];
}

export interface Column {
  header: string;
  cityAccessor: Leaves<CityEntity>;
  driverAccessor: Leaves<DriverEntity>;
  flexWidth?: number;
  Cell?: FC<CellProps>;
}

export interface CellProps {
  id: EntityId;
}

export const TableContext = createContext<ReactWindowTable>(
  {} as ReactWindowTable,
);

export const useTables = () => useContext(TableContext);
