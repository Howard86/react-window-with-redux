import { useCallback, useEffect, useMemo, useRef } from 'react';

import { DownloadIcon } from '@chakra-ui/icons';
import {
  Box,
  CircularProgress,
  Container,
  Flex,
  IconButton,
  Text,
} from '@chakra-ui/react';
import Head from 'next/head';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import BodyRow from '@/components/BodyRow';
import BooleanCell from '@/components/BooleanCell';
import DateCell from '@/components/DateCell';
import HeaderRow from '@/components/HeaderRow';
import { ReactWindowTable, TableContext } from '@/contexts/table';
import {
  citySelector,
  driverSelector,
  MAX_API_RETURN_COUNT,
} from '@/redux/driver';
import { useAppSelector } from '@/redux/store';
import { useLazyGetDriversQuery } from '@/services/local';

const MAX = 100;
const ROW_HEIGHT = 24;
const VISIBLE_ROW_COUNT = 5;

const Home = (): JSX.Element => {
  const listRef = useRef<VariableSizeList | null>(null);
  const cityEntity = useAppSelector(citySelector.selectEntities);
  const cityIds = useAppSelector(citySelector.selectIds);
  const driverCount = useAppSelector(driverSelector.selectTotal);
  const [refetch, { isFetching, isUninitialized }] = useLazyGetDriversQuery();

  const table = useMemo<ReactWindowTable>(
    () => ({
      ref: listRef,
      columns: [
        {
          header: 'ID',
          cityAccessor: 'primaryDriver.id',
          driverAccessor: 'id',
          flexWidth: 10,
        },
        {
          header: 'Name',
          cityAccessor: 'primaryDriver.name',
          driverAccessor: 'name',
          flexWidth: 20,
        },
        {
          header: 'City',
          cityAccessor: 'name',
          driverAccessor: 'city',
          flexWidth: 40,
        },
        {
          header: 'Address',
          cityAccessor: 'primaryDriver.address',
          driverAccessor: 'address',
          flexWidth: 50,
        },
        {
          header: 'Delivery',
          cityAccessor: 'primaryDriver.deliveryTime',
          driverAccessor: 'deliveryTime',
          flexWidth: 10,
          Cell: DateCell,
        },
        {
          header: 'Available',
          cityAccessor: 'primaryDriver.status',
          driverAccessor: 'status',
          flexWidth: 5,
          Cell: BooleanCell,
        },
      ],
    }),
    [],
  );

  const fetchMoreDrivers = useCallback(() => {
    refetch(Math.min(MAX_API_RETURN_COUNT, MAX - cityIds.length));
  }, [cityIds.length, refetch]);

  const isItemLoaded = useCallback(
    (index: number) => cityIds.length >= MAX || index <= cityIds.length,
    [cityIds.length],
  );

  const loadMoreItems = useCallback(
    async (_startIndex: number, endIndex: number) => {
      if (cityIds.length - endIndex >= VISIBLE_ROW_COUNT) return;

      fetchMoreDrivers();
    },
    [cityIds.length, fetchMoreDrivers],
  );

  const getItemSize = useCallback(
    (index: number) => {
      const city = cityEntity[cityIds[index]];

      return city?.expanded
        ? ROW_HEIGHT * (city.driverIds.length + 1)
        : ROW_HEIGHT;
    },
    [cityEntity, cityIds],
  );

  useEffect(() => {
    if (isUninitialized) {
      refetch(MAX_API_RETURN_COUNT);
    }
  }, [isUninitialized, refetch]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TableContext.Provider value={table}>
        <Container
          display="flex"
          position="relative"
          flexDir="column"
          h="full"
          maxWidth="container.xl"
        >
          <HeaderRow />
          <Box flexGrow={1}>
            <AutoSizer>
              {({ width, height }) => (
                <InfiniteLoader
                  isItemLoaded={isItemLoaded}
                  itemCount={MAX}
                  loadMoreItems={loadMoreItems}
                >
                  {({ onItemsRendered, ref }) => (
                    <VariableSizeList
                      ref={(list) => {
                        ref(list);
                        listRef.current = list;
                      }}
                      height={height}
                      width={width}
                      itemCount={cityIds.length}
                      itemSize={getItemSize}
                      itemData={cityIds}
                      onItemsRendered={onItemsRendered}
                    >
                      {BodyRow}
                    </VariableSizeList>
                  )}
                </InfiniteLoader>
              )}
            </AutoSizer>
          </Box>
          <Flex alignItems="center" justify="flex-end" p="4" gap="2">
            <Text as="caption">
              {cityIds.length} cities - {driverCount} drivers
            </Text>
            <IconButton
              variant="ghost"
              rounded="full"
              aria-label="fetch more drivers"
              onClick={fetchMoreDrivers}
            >
              <DownloadIcon />
            </IconButton>
          </Flex>
          <Box position="absolute" bottom="6" right="10">
            {isFetching && <CircularProgress isIndeterminate />}
          </Box>
        </Container>
      </TableContext.Provider>
    </>
  );
};

export default Home;
