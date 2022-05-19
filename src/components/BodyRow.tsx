import { CSSProperties, memo, useCallback } from 'react';

import { Box, Flex } from '@chakra-ui/react';
import { EntityId } from '@reduxjs/toolkit';
import get from 'lodash.get';
import { areEqual } from 'react-window';

import FlexLayoutCell from './FlexLayoutCell';

import { useTables } from '@/contexts/table';
import { citySelector, driverSelector, toggleExpanded } from '@/redux/driver';
import { useAppDispatch, useAppSelector } from '@/redux/store';

interface BodyRowProps {
  data: EntityId[];
  index: number;
  style: CSSProperties;
}

const BodyRow = ({ data, index, style }: BodyRowProps) => {
  const dispatch = useAppDispatch();
  const { columns, ref } = useTables();
  const driverEntities = useAppSelector(driverSelector.selectEntities);
  const city = useAppSelector((state) =>
    citySelector.selectById(state, data[index]),
  );

  const handleExpand = useCallback(() => {
    if (!ref.current || !city || city.driverIds.length <= 1) return;

    dispatch(toggleExpanded(city.name));
    ref.current.resetAfterIndex(index);
  }, [city, dispatch, index, ref]);

  if (!city) return null;

  return (
    <Box style={style}>
      <Flex bg={city.expanded ? 'purple.100' : 'white'} onClick={handleExpand}>
        <FlexLayoutCell flexWidth={10}>
          {index} ({city.driverIds.length})
        </FlexLayoutCell>
        {columns.map(({ cityAccessor: accessor, flexWidth, Cell }) => (
          <FlexLayoutCell key={accessor + city.name} flexWidth={flexWidth}>
            {Cell ? <Cell id={city.primaryDriver.id} /> : get(city, accessor)}
          </FlexLayoutCell>
        ))}
      </Flex>
      {city.expanded &&
        city.driverIds.map((driverId) => {
          const item = driverEntities[driverId];

          return (
            <Flex key={driverId} bg="gray.100">
              <FlexLayoutCell flexWidth={10} />
              {columns.map(({ driverAccessor, flexWidth, Cell }) => (
                <FlexLayoutCell
                  key={driverAccessor + driverId}
                  flexWidth={flexWidth}
                >
                  {Cell ? <Cell id={driverId} /> : get(item, driverAccessor)}
                </FlexLayoutCell>
              ))}
            </Flex>
          );
        })}
    </Box>
  );
};

export default memo(BodyRow, areEqual);
