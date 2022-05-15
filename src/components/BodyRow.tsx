import { CSSProperties, memo } from 'react';

import { Flex } from '@chakra-ui/react';
import { EntityId } from '@reduxjs/toolkit';
import { areEqual } from 'react-window';

import FlexLayoutCell from './FlexLayoutCell';

import { useColumns } from '@/contexts/column';
import { selectDriverEntities } from '@/redux/driver';
import { useAppSelector } from '@/redux/store';

interface BodyRowProps {
  data: EntityId[];
  index: number;
  style: CSSProperties;
}

const BodyRow = ({ data, index, style }: BodyRowProps) => {
  const columns = useColumns();
  const item = useAppSelector(selectDriverEntities)[data[index]];

  if (!item) return null;

  return (
    <Flex style={style}>
      <FlexLayoutCell flexWidth={10}>{index}</FlexLayoutCell>
      {columns.map(({ accessor, flexWidth, Cell }) => (
        <FlexLayoutCell key={accessor + item.id} flexWidth={flexWidth}>
          {Cell ? <Cell {...item} /> : item[accessor]}
        </FlexLayoutCell>
      ))}
    </Flex>
  );
};

export default memo(BodyRow, areEqual);
