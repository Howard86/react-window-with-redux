import { createContext, FC, MutableRefObject, useContext } from 'react';

import { EntityId } from '@reduxjs/toolkit';
import { VariableSizeList } from 'react-window';

import { Driver } from '@/services/driver';

export interface ReactWindowTable {
  ref: MutableRefObject<VariableSizeList | null>;
  columns: Column[];
}

export interface Column {
  header: string;
  accessor: keyof Driver;
  flexWidth?: number;
  Cell?: FC<{ id: EntityId }>;
}

export const TableContext = createContext<ReactWindowTable>(
  {} as ReactWindowTable,
);

export const useTables = () => useContext(TableContext);
