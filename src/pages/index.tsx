import { useCallback, useMemo } from 'react';

import { Box, CircularProgress, Container } from '@chakra-ui/react';
import Head from 'next/head';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import BodyRow from '@/components/BodyRow';
import DateCell from '@/components/DateCell';
import HeaderRow from '@/components/HeaderRow';
import { Column, ColumnContext } from '@/contexts/column';
import { MAX_API_RETURN_COUNT, selectDriverIds } from '@/redux/driver';
import { useAppSelector } from '@/redux/store';
import { useLazyGetDriversQuery } from '@/services/local';

const MAX = 1000;
const VISIBLE_ROW_COUNT = 5;

const Home = (): JSX.Element => {
  const driversIds = useAppSelector(selectDriverIds);
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
    (index: number) => index <= driversIds.length,
    [driversIds.length],
  );

  const loadMoreItems = useCallback(
    async (_startIndex: number, endIndex: number) => {
      if (
        driversIds.length >= MAX ||
        driversIds.length - endIndex >= VISIBLE_ROW_COUNT
      )
        return;

      refetch(Math.min(MAX_API_RETURN_COUNT, MAX - driversIds.length));
    },
    [driversIds.length, refetch],
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
                      itemCount={driversIds.length}
                      itemSize={40}
                      itemData={driversIds}
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
