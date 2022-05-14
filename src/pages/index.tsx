import {
  Box,
  Container,
  Heading,
  Link,
  SimpleGrid,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import Head from 'next/head';

import Image from '@/components/Image';
import RouteLink from '@/components/RouteLink';
import { useGetNameQuery } from '@/services/local';

const Home = (): JSX.Element => {
  const { data, isSuccess, fulfilledTimeStamp } = useGetNameQuery();

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
        <Box
          as="main"
          py="8"
          display="flex"
          flexDir="column"
          alignItems="center"
          flex={1}
        >
          <Heading as="h1">
            Welcome to{' '}
            <Link href="https://nextjs.org" isExternal>
              Next.js!
            </Link>
          </Heading>
          <Text fontWeight="semibold" fontSize="lg">
            Go to <RouteLink href="/new-page">New Page</RouteLink>
          </Text>

          <Skeleton isLoaded={isSuccess}>
            {data && fulfilledTimeStamp && (
              <Text>
                Local API <Text as="code">/hello</Text> processed within{' '}
                {fulfilledTimeStamp - data.timestamp}ms
              </Text>
            )}
          </Skeleton>

          <Text mt="8">
            Get started by editing <Text as="code">src/pages/index.tsx</Text>
          </Text>

          <SimpleGrid spacing={4} columns={[1, 2]} mt={[4, 12, 16]}>
            <Link href="https://nextjs.org/docs" isExternal>
              <Heading as="h3">Documentation &rarr;</Heading>
              <Text>
                Find in-depth information about Next.js features and API.
              </Text>
            </Link>

            <Link href="https://nextjs.org/learn" isExternal>
              <Heading as="h3">Learn &rarr;</Heading>
              <Text>
                Learn about Next.js in an interactive course with quizzes!
              </Text>
            </Link>

            <Link
              href="https://github.com/vercel/next.js/tree/master/examples"
              isExternal
            >
              <Heading as="h3">Examples &rarr;</Heading>
              <Text>
                Discover and deploy boilerplate example Next.js projects.
              </Text>
            </Link>

            <Link
              href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              isExternal
            >
              <Heading as="h3">Deploy &rarr;</Heading>
              <Text>
                Instantly deploy your Next.js site to a public URL with Vercel.
              </Text>
            </Link>
          </SimpleGrid>
        </Box>

        <Box
          as="footer"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderTop="1px"
          borderTopStyle="solid"
          borderTopColor="gray.300"
          py="2"
        >
          <Link
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexGrow={1}
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            isExternal
          >
            Powered by{' '}
            <Image src="/vercel.svg" alt="Vercel Logo" width={64} height={64} />
          </Link>
        </Box>
      </Container>
    </>
  );
};

export default Home;
