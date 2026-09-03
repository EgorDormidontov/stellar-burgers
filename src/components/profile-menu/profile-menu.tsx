import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/slices/userSlice';
import { clearOrders } from '../../services/slices/ordersSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser()).finally(() => {
      dispatch(clearOrders());
      navigate('/login', { replace: true });
    });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
