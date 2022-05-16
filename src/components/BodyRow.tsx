import { CSSProperties, memo } from 'react';

import { Box, Flex } from '@chakra-ui/react';
import { areEqual } from 'react-window';

import FlexLayoutCell from './FlexLayoutCell';

import { useTables } from '@/contexts/table';
import {
  CityState,
  selectDriverEntities,
  toggleExpanded,
} from '@/redux/driver';
import { useAppDispatch, useAppSelector } from '@/redux/store';

interface BodyRowProps {
  data: CityState[];
  index: number;
  style: CSSProperties;
}

const BodyRow = ({ data, index, style }: BodyRowProps) => {
  const dispatch = useAppDispatch();
  const { columns, ref } = useTables();
  const driverEntities = useAppSelector(selectDriverEntities);
  const cityState = data[index];

  const handleExpand = () => {
    dispatch(toggleExpanded(cityState.id));
    if (ref.current) {
      ref.current.resetAfterIndex(index);
    }
  };

  if (cityState.driverIds.length === 0) return null;

  const firstItem = driverEntities[cityState.driverIds[0]];

  if (!firstItem) return null;

  if (cityState.driverIds.length === 1)
    return (
      <Flex style={style}>
        <FlexLayoutCell flexWidth={10}>
          {index} ({cityState.driverIds.length})
        </FlexLayoutCell>
        {columns.map(({ accessor, flexWidth, Cell }) => (
          <FlexLayoutCell key={accessor + firstItem.id} flexWidth={flexWidth}>
            {Cell ? <Cell {...firstItem} /> : firstItem[accessor]}
          </FlexLayoutCell>
        ))}
      </Flex>
    );

  return (
    <Box style={style}>
      <Flex
        bg={cityState.expanded ? 'gray.100' : 'white'}
        onClick={handleExpand}
      >
        <FlexLayoutCell flexWidth={10}>
          {index} ({cityState.driverIds.length})
        </FlexLayoutCell>
        {columns.map(({ accessor, flexWidth, Cell }) => (
          <FlexLayoutCell key={accessor + firstItem.id} flexWidth={flexWidth}>
            {Cell ? <Cell {...firstItem} /> : firstItem[accessor]}
          </FlexLayoutCell>
        ))}
      </Flex>
      {cityState.driverIds.slice(1).map((driverId) => {
        const item = driverEntities[driverId];

        if (!item || !cityState.expanded) return null;

        return (
          <Flex bg="gray.100" key={driverId}>
            <FlexLayoutCell flexWidth={10}>{index}</FlexLayoutCell>
            {columns.map(({ accessor, flexWidth, Cell }) => (
              <FlexLayoutCell key={accessor + item.id} flexWidth={flexWidth}>
                {Cell ? <Cell {...item} /> : item[accessor]}
              </FlexLayoutCell>
            ))}
          </Flex>
        );
      })}
    </Box>
  );
};

export default memo(BodyRow, areEqual);
