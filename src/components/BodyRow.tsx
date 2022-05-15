import { CSSProperties, memo } from 'react';

import { Flex } from '@chakra-ui/react';
import { areEqual } from 'react-window';

import FlexLayoutCell from './FlexLayoutCell';

import { useColumns } from '@/contexts/column';
import { Driver } from '@/services/driver';

interface BodyRowProps {
  data: Driver[];
  index: number;
  style: CSSProperties;
}

const BodyRow = ({ data, index, style }: BodyRowProps) => {
  const columns = useColumns();
  const item = data[index];

  return item ? (
    <Flex style={style}>
      <FlexLayoutCell flexWidth={10}>{index}</FlexLayoutCell>
      {columns.map(({ accessor, flexWidth, Cell }) => (
        <FlexLayoutCell key={accessor + item.id} flexWidth={flexWidth}>
          {Cell ? <Cell {...item} /> : item[accessor]}
        </FlexLayoutCell>
      ))}
    </Flex>
  ) : null;
};

export default memo(BodyRow, areEqual);
