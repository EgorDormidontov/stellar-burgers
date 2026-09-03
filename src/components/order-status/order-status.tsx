import { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  cancelled: 'Отменён',
  canceled: 'Отменён',
  created: 'Создан'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  let textStyle = '#F2F2F3';

  if (status === 'done') {
    textStyle = '#00CCCC';
  } else if (status === 'cancelled' || status === 'canceled') {
    textStyle = '#E52B1A';
  }

  return (
    <OrderStatusUI textStyle={textStyle} text={statusText[status] || status} />
  );
};
