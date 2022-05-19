import { Box, BoxProps } from '@chakra-ui/react';

interface FlexLayoutCellProps extends BoxProps {
  flexWidth?: number;
}

const FlexLayoutCell = ({ flexWidth = 50, ...props }: FlexLayoutCellProps) => (
  <Box noOfLines={1} flexBasis={flexWidth} flexGrow={flexWidth} {...props} />
);

export default FlexLayoutCell;
