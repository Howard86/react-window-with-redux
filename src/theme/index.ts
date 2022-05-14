import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';

import styles from './styles';

const theme = extendTheme(
  {
    styles,
    config: {
      initialColorMode: 'light',
      useSystemColorMode: false,
    },
  },
  withDefaultColorScheme({ colorScheme: 'purple' }),
);

export default theme;
