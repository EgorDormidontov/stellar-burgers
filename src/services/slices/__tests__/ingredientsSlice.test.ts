import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';

const mockIngredients = [
  {
    _id: 'bun-1',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 30,
    calories: 200,
    price: 100,
    image: 'bun.png',
    image_large: 'bun-large.png',
    image_mobile: 'bun-mobile.png'
  },
  {
    _id: 'main-1',
    name: 'Тестовая начинка',
    type: 'main',
    proteins: 20,
    fat: 10,
    carbohydrates: 5,
    calories: 150,
    price: 200,
    image: 'main.png',
    image_large: 'main-large.png',
    image_mobile: 'main-mobile.png'
  }
];

describe('ingredientsSlice reducer', () => {
  test('возвращает начальное состояние для неизвестного экшена', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: null
    });
  });

  test('обрабатывает fetchIngredients.pending', () => {
    const previousState = {
      items: mockIngredients,
      isLoading: false,
      error: 'Старая ошибка'
    };

    const state = ingredientsReducer(
      previousState,
      fetchIngredients.pending('request-id', undefined)
    );

    expect(state).toEqual({
      items: mockIngredients,
      isLoading: true,
      error: null
    });
  });

  test('обрабатывает fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.fulfilled(mockIngredients, 'request-id', undefined)
    );

    expect(state).toEqual({
      items: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  test('обрабатывает fetchIngredients.rejected', () => {
    const state = ingredientsReducer(
      {
        items: mockIngredients,
        isLoading: true,
        error: null
      },
      fetchIngredients.rejected(
        new Error('Ошибка загрузки'),
        'request-id',
        undefined
      )
    );

    expect(state.items).toEqual(mockIngredients);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
