import dayjs from 'dayjs';

import { CellProps } from '@/contexts/table';
import { driverSelector } from '@/redux/driver';
import { useAppSelector } from '@/redux/store';

const DateCell = ({ id }: CellProps) => {
  const item = useAppSelector((state) => driverSelector.selectById(state, id));

  if (!item) return null;

  return <>{dayjs(item.deliveryTime).format('HH:mm')}</>;
};

export default DateCell;
