import { FC, useEffect } from 'react';
import {
  Location,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  IngredientPage,
  Login,
  NotFound404,
  OrderPage,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { checkUserAuth } from '../../services/slices/userSlice';
import { selectIngredientsState } from '../../services/selectors';
import '../../index.css';
import styles from './app.module.css';

const IngredientModal: FC = () => {
  const navigate = useNavigate();
  return (
    <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
      <IngredientDetails />
    </Modal>
  );
};

const OrderModal: FC = () => {
  const navigate = useNavigate();
  const { number } = useParams();
  return (
    <Modal
      title={`#${String(number || '').padStart(6, '0')}`}
      onClose={() => navigate(-1)}
    >
      <OrderInfo />
    </Modal>
  );
};

const App: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const backgroundLocation = (
    location.state as { background?: Location } | null
  )?.background;

  const { isLoading, error, items } = useSelector(selectIngredientsState);

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  if (isLoading && !items.length) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <Preloader />
      </div>
    );
  }

  if (error && !items.length) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderPage />} />
        <Route path='/ingredients/:id' element={<IngredientPage />} />

        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path='/ingredients/:id' element={<IngredientModal />} />
          <Route path='/feed/:number' element={<OrderModal />} />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <OrderModal />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
