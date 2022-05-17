import { EntityId } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import { driverSelector } from '@/redux/driver';
import { useAppSelector } from '@/redux/store';

const DateCell = ({ id }: { id: EntityId }) => {
  const item = useAppSelector(driverSelector.selectEntities)[id];

  if (!item) return null;

  return <>{dayjs(item.deliveryTime).format('HH:mm')}</>;
};

export default DateCell;
