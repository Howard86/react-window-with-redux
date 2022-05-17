import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { EntityId } from '@reduxjs/toolkit';

import { driverSelector } from '@/redux/driver';
import { useAppSelector } from '@/redux/store';

const BooleanCell = ({ id }: { id: EntityId }) => {
  const item = useAppSelector(driverSelector.selectEntities)[id];

  return item?.status ? (
    <CheckCircleIcon color="green.400" />
  ) : (
    <WarningIcon color="red.400" />
  );
};

export default BooleanCell;
