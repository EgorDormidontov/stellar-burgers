import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearCurrentOrder,
  fetchOrderByNumber
} from '../../services/slices/currentOrderSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const {
    data: orderData,
    isLoading,
    error
  } = useSelector((state) => state.currentOrder);
  const ingredients = useSelector((state) => state.ingredients.items);

  useEffect(() => {
    const orderNumber = Number(number);
    if (Number.isFinite(orderNumber)) {
      dispatch(fetchOrderByNumber(orderNumber));
    }

    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading || (!orderInfo && !error)) {
    return <Preloader />;
  }

  if (error || !orderInfo) {
    return (
      <p className='text text_type_main-medium'>{error || 'Заказ не найден'}</p>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
