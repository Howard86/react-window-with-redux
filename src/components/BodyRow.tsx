import { CSSProperties, memo } from 'react';

import { Flex } from '@chakra-ui/react';
import { areEqual } from 'react-window';

import FlexLayoutCell from './FlexLayoutCell';

import { useColumns } from '@/contexts/column';
import { FakeData } from '@/services/generator';

interface BodyRowProps {
  data: FakeData[];
  index: number;
  style: CSSProperties;
}

const BodyRow = ({ data, index, style }: BodyRowProps) => {
  const columns = useColumns();
  const item = data[index];

  return (
    <Flex style={style}>
      {columns.map((column) => (
        <FlexLayoutCell
          key={column.accessor + item.id}
          flexWidth={column.flexWidth}
        >
          {item[column.accessor]}
        </FlexLayoutCell>
      ))}
    </Flex>
  );
};

export default memo(BodyRow, areEqual);
