import { CSSProperties, memo } from 'react';

import { Flex } from '@chakra-ui/react';
import { areEqual } from 'react-window';

import FlexLayoutCell from './FlexLayoutCell';

import { FakeData } from '@/services/generator';

interface RowProps {
  data: FakeData[];
  index: number;
  style: CSSProperties;
}

const Row = ({ data, index, style }: RowProps) => {
  const item = data[index];

  return (
    <Flex style={style}>
      <FlexLayoutCell flexWidth={10}>{index}</FlexLayoutCell>
      <FlexLayoutCell flexWidth={20}>{item.name}</FlexLayoutCell>
      <FlexLayoutCell>{item.address}</FlexLayoutCell>
    </Flex>
  );
};

export default memo(Row, areEqual);
