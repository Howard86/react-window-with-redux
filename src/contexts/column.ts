import { createContext, useContext } from 'react';

import { FakeData } from '@/services/generator';

export interface Column {
  header: string;
  accessor: keyof FakeData;
  flexWidth?: number;
}

export const ColumnContext = createContext<Column[]>([]);

export const useColumns = () => useContext(ColumnContext);
