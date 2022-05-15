import { createContext, FC, useContext } from 'react';

import { EntityId } from '@reduxjs/toolkit';

import { Driver } from '@/services/driver';

export interface Column {
  header: string;
  accessor: keyof Driver;
  flexWidth?: number;
  Cell?: FC<{ id: EntityId }>;
}

export const ColumnContext = createContext<Column[]>([]);

export const useColumns = () => useContext(ColumnContext);
