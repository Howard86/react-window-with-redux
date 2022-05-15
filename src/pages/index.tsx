import { useCallback, useState } from 'react';

import { Box, Container, Flex } from '@chakra-ui/react';
import Head from 'next/head';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import FlexLayoutCell from '@/components/FlexLayoutCell';
import Row from '@/components/Row';
import { generateData } from '@/services/generator';

const MAX = 1000;
const VISIBLE_ROW_COUNT = 5;

const Home = (): JSX.Element => {
  const [items, setItems] = useState(() => generateData(30));

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
      <Container
        display="flex"
        flexDir="column"
        h="full"
        maxWidth="container.lg"
      >
        <Flex py="2">
          <FlexLayoutCell flexWidth={10}>#</FlexLayoutCell>
          <FlexLayoutCell flexWidth={20}>Name</FlexLayoutCell>
          <FlexLayoutCell>Address</FlexLayoutCell>
        </Flex>
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
                    {Row}
                  </FixedSizeList>
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>
        </Box>
      </Container>
    </>
  );
};

export default Home;
