import { Flex, FlexProps } from '@chakra-ui/react';

import FlexLayoutCell from './FlexLayoutCell';

import { useTables } from '@/contexts/table';

const HeaderRow = (props: FlexProps) => {
  const { columns } = useTables();

  return (
    <Flex py="2" {...props}>
      <FlexLayoutCell flexWidth={10}>#</FlexLayoutCell>
      {columns.map((column) => (
        <FlexLayoutCell key={column.accessor} flexWidth={column.flexWidth}>
          {column.header}
        </FlexLayoutCell>
      ))}
    </Flex>
  );
};

export default HeaderRow;
