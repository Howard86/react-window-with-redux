import { createContext, FC, useContext } from 'react';

import { Driver } from '@/services/driver';

export interface Column {
  header: string;
  accessor: keyof Driver;
  flexWidth?: number;
  Cell?: FC<Driver>;
}

export const ColumnContext = createContext<Column[]>([]);

export const useColumns = () => useContext(ColumnContext);
