import { useCallback, useMemo } from 'react';

import { Box, CircularProgress, Container } from '@chakra-ui/react';
import dayjs from 'dayjs';
import Head from 'next/head';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import BodyRow from '@/components/BodyRow';
import HeaderRow from '@/components/HeaderRow';
import { Column, ColumnContext } from '@/contexts/column';
import { MAX_API_RETURN_COUNT, selectDrivers } from '@/redux/driver';
import { useAppSelector } from '@/redux/store';
import { Driver } from '@/services/driver';
import { useLazyGetDriversQuery } from '@/services/local';

const MAX = 1000;
const VISIBLE_ROW_COUNT = 5;

const DateCell = ({ deliveryTime }: Driver) => (
  <>{dayjs(deliveryTime).format('HH:mm')}</>
);

const Home = (): JSX.Element => {
  const drivers = useAppSelector(selectDrivers);
  const [refetch, { isFetching }] = useLazyGetDriversQuery();

  const columns = useMemo<Column[]>(
    () => [
      { header: 'ID', accessor: 'id', flexWidth: 10 },
      { header: 'Name', accessor: 'name', flexWidth: 20 },
      { header: 'Address', accessor: 'address', flexWidth: 50 },
      {
        header: 'Available Time',
        accessor: 'deliveryTime',
        flexWidth: 20,
        Cell: DateCell,
      },
    ],
    [],
  );

  const isItemLoaded = useCallback(
    (index: number) => index <= drivers.length,
    [drivers.length],
  );

  const loadMoreItems = useCallback(
    async (_startIndex: number, endIndex: number) => {
      if (
        drivers.length >= MAX ||
        drivers.length - endIndex >= VISIBLE_ROW_COUNT
      )
        return;

      refetch(Math.min(MAX_API_RETURN_COUNT, MAX - drivers.length));
    },
    [drivers.length, refetch],
  );

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ColumnContext.Provider value={columns}>
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
                    <FixedSizeList
                      ref={ref}
                      height={height}
                      width={width}
                      itemCount={drivers.length}
                      itemSize={40}
                      itemData={drivers}
                      onItemsRendered={onItemsRendered}
                    >
                      {BodyRow}
                    </FixedSizeList>
                  )}
                </InfiniteLoader>
              )}
            </AutoSizer>
          </Box>
          <Box position="absolute" bottom="6" right="10">
            {isFetching && <CircularProgress isIndeterminate />}
          </Box>
        </Container>
      </ColumnContext.Provider>
    </>
  );
};

export default Home;
