import { EntityId } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import { selectDriverEntities } from '@/redux/driver';
import { useAppSelector } from '@/redux/store';

const DateCell = ({ id }: { id: EntityId }) => {
  const item = useAppSelector(selectDriverEntities)[id];

  if (!item) return null;

  return <>{dayjs(item.deliveryTime).format('HH:mm')}</>;
};

export default DateCell;
