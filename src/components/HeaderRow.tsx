import { Flex, FlexProps } from '@chakra-ui/react';

import FlexLayoutCell from './FlexLayoutCell';

import { useColumns } from '@/contexts/column';

const HeaderRow = (props: FlexProps) => {
  const columns = useColumns();

  return (
    <Flex py="2" {...props}>
      {columns.map((column) => (
        <FlexLayoutCell key={column.accessor} flexWidth={column.flexWidth}>
          {column.header}
        </FlexLayoutCell>
      ))}
    </Flex>
  );
};

export default HeaderRow;
