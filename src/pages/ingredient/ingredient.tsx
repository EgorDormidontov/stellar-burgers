import { FC } from 'react';
import { IngredientDetails } from '@components';
import styles from './ingredient.module.css';

export const IngredientPage: FC = () => (
  <main className={styles.main}>
    <h1 className='text text_type_main-large'>Детали ингредиента</h1>
    <IngredientDetails />
  </main>
);
