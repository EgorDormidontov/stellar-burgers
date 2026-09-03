import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/slices/feedSlice';
import { selectFeed } from '../../services/selectors';

const REFRESH_INTERVAL = 5000;

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector(selectFeed);

  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  useEffect(() => {
    handleGetFeeds();
    const timer = window.setInterval(handleGetFeeds, REFRESH_INTERVAL);
    return () => window.clearInterval(timer);
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error && !orders.length) {
    return <p className='text text_type_main-medium'>{error}</p>;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
