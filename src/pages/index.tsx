import { useCallback, useEffect, useMemo, useRef } from 'react';

import { Box, CircularProgress, Container } from '@chakra-ui/react';
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
  MAX_API_RETURN_COUNT,
  selectDriverCities,
  selectDriverCityState,
} from '@/redux/driver';
import { useAppSelector } from '@/redux/store';
import { useLazyGetDriversQuery } from '@/services/local';

const MAX = 100;
const ROW_HEIGHT = 24;
const VISIBLE_ROW_COUNT = 5;

const Home = (): JSX.Element => {
  const listRef = useRef<VariableSizeList | null>(null);
  const cityState = useAppSelector(selectDriverCityState);
  const cityDriverIds = useAppSelector(selectDriverCities);
  const [refetch, { isFetching, isUninitialized }] = useLazyGetDriversQuery();

  const table = useMemo<ReactWindowTable>(
    () => ({
      ref: listRef,
      columns: [
        { header: 'ID', accessor: 'id', flexWidth: 10 },
        { header: 'Name', accessor: 'name', flexWidth: 20 },
        { header: 'City', accessor: 'city', flexWidth: 40 },
        { header: 'Address', accessor: 'address', flexWidth: 50 },
        {
          header: 'Delivery',
          accessor: 'deliveryTime',
          flexWidth: 10,
          Cell: DateCell,
        },
        {
          header: 'Available',
          accessor: 'status',
          flexWidth: 5,
          Cell: BooleanCell,
        },
      ],
    }),
    [],
  );

  const isItemLoaded = useCallback(
    (index: number) => index <= cityState.ids.length,
    [cityState.ids.length],
  );

  const loadMoreItems = useCallback(
    async (_startIndex: number, endIndex: number) => {
      if (
        cityState.ids.length >= MAX ||
        cityState.ids.length - endIndex >= VISIBLE_ROW_COUNT
      )
        return;

      refetch(Math.min(MAX_API_RETURN_COUNT, MAX - cityState.ids.length));
    },
    [cityState.ids.length, refetch],
  );

  const getItemSize = useCallback(
    (index: number) => {
      const city = cityState.entities[cityState.ids[index]];

      return ROW_HEIGHT * (city.expanded ? city.driverIds.length : 1);
    },
    [cityState],
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
          maxWidth="container.lg"
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
                      itemCount={cityDriverIds.length}
                      itemSize={getItemSize}
                      itemData={cityDriverIds}
                      onItemsRendered={onItemsRendered}
                    >
                      {BodyRow}
                    </VariableSizeList>
                  )}
                </InfiniteLoader>
              )}
            </AutoSizer>
          </Box>
          <Box position="absolute" bottom="6" right="10">
            {isFetching && <CircularProgress isIndeterminate />}
          </Box>
        </Container>
      </TableContext.Provider>
    </>
  );
};

export default Home;
