import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/ordersSlice';

const REFRESH_INTERVAL = 5000;

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const {
    items: orders,
    isLoading,
    error
  } = useSelector((state) => state.orders);

  useEffect(() => {
    const loadOrders = () => dispatch(fetchUserOrders());
    loadOrders();
    const timer = window.setInterval(loadOrders, REFRESH_INTERVAL);
    return () => window.clearInterval(timer);
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error && !orders.length) {
    return <p className='text text_type_main-medium'>{error}</p>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
