import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { OrderInfo } from '@components';
import styles from './order.module.css';

export const OrderPage: FC = () => {
  const { number } = useParams();

  return (
    <main className={styles.main}>
      <p className='text text_type_digits-default'>
        #{String(number || '').padStart(6, '0')}
      </p>
      <OrderInfo />
    </main>
  );
};
