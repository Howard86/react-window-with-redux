import { useCallback, useMemo, useState } from 'react';

import { Box, Container } from '@chakra-ui/react';
import Head from 'next/head';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import BodyRow from '@/components/BodyRow';
import HeaderRow from '@/components/HeaderRow';
import { Column, ColumnContext } from '@/contexts/column';
import { generateData } from '@/services/generator';

const MAX = 1000;
const VISIBLE_ROW_COUNT = 5;

const Home = (): JSX.Element => {
  const [items, setItems] = useState(() => generateData(30));

  const columns = useMemo<Column[]>(
    () => [
      { header: '#', accessor: 'id', flexWidth: 10 },
      { header: 'Name', accessor: 'name', flexWidth: 20 },
      { header: 'Address', accessor: 'address', flexWidth: 50 },
    ],
    [],
  );

  const isItemLoaded = useCallback(
    (index: number) => index <= items.length,
    [items.length],
  );

  const loadMoreItems = useCallback(
    async (_startIndex: number, endIndex: number) => {
      if (items.length >= MAX || items.length - endIndex >= VISIBLE_ROW_COUNT)
        return;

      setItems((state) => [
        ...state,
        ...generateData(Math.min(30, MAX - items.length)),
      ]);
    },
    [items.length],
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
                      itemCount={items.length}
                      itemSize={40}
                      itemData={items}
                      onItemsRendered={onItemsRendered}
                    >
                      {BodyRow}
                    </FixedSizeList>
                  )}
                </InfiniteLoader>
              )}
            </AutoSizer>
          </Box>
        </Container>
      </ColumnContext.Provider>
    </>
  );
};

export default Home;
