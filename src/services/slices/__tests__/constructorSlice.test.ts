import constructorReducer, {
  addIngredient,
  clearOrderModal,
  createOrder,
  moveIngredient,
  removeIngredient
} from '../constructorSlice';

const mockBun = {
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
};

const mockMain = {
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
};

const secondMain = {
  ...mockMain,
  _id: 'main-2',
  name: 'Вторая начинка'
};

const mockOrder = {
  _id: 'order-1',
  status: 'done',
  name: 'Тестовый бургер',
  createdAt: '2026-09-03T08:00:00.000Z',
  updatedAt: '2026-09-03T08:01:00.000Z',
  number: 777777,
  ingredients: ['bun-1', 'main-1', 'bun-1']
};

const initialState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  orderError: null
};

describe('burgerConstructor reducer', () => {
  test('возвращает начальное состояние для неизвестного экшена', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  test('addIngredient добавляет булку', () => {
    const state = constructorReducer(undefined, addIngredient(mockBun));

    expect(state.bun).toMatchObject(mockBun);
    expect(state.bun).toHaveProperty('id');
    expect(state.ingredients).toEqual([]);
  });

  test('addIngredient добавляет начинку', () => {
    const state = constructorReducer(undefined, addIngredient(mockMain));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(mockMain);
    expect(state.ingredients[0].id).toEqual(expect.any(String));
  });

  test('removeIngredient удаляет начинку по id', () => {
    const state = constructorReducer(
      {
        ...initialState,
        ingredients: [{ ...mockMain, id: 'constructor-id-1' }]
      },
      removeIngredient('constructor-id-1')
    );

    expect(state.ingredients).toEqual([]);
  });

  test('moveIngredient меняет порядок начинок', () => {
    const first = { ...mockMain, id: 'constructor-id-1' };
    const second = { ...secondMain, id: 'constructor-id-2' };

    const state = constructorReducer(
      {
        ...initialState,
        ingredients: [first, second]
      },
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state.ingredients.map((item) => item.id)).toEqual([
      'constructor-id-2',
      'constructor-id-1'
    ]);
  });

  test('clearOrderModal очищает данные модального окна заказа', () => {
    const state = constructorReducer(
      {
        ...initialState,
        orderModalData: mockOrder,
        orderError: 'Ошибка'
      },
      clearOrderModal()
    );

    expect(state.orderModalData).toBeNull();
    expect(state.orderError).toBeNull();
  });

  test('обрабатывает createOrder.pending', () => {
    const state = constructorReducer(
      {
        ...initialState,
        orderModalData: mockOrder,
        orderError: 'Старая ошибка'
      },
      createOrder.pending('request-id', ['bun-1', 'main-1', 'bun-1'])
    );

    expect(state.orderRequest).toBe(true);
    expect(state.orderModalData).toBeNull();
    expect(state.orderError).toBeNull();
  });

  test('обрабатывает createOrder.fulfilled и очищает конструктор', () => {
    const state = constructorReducer(
      {
        ...initialState,
        bun: mockBun,
        ingredients: [{ ...mockMain, id: 'constructor-id-1' }],
        orderRequest: true
      },
      createOrder.fulfilled(mockOrder, 'request-id', [
        'bun-1',
        'main-1',
        'bun-1'
      ])
    );

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockOrder);
    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });

  test('обрабатывает createOrder.rejected', () => {
    const state = constructorReducer(
      {
        ...initialState,
        orderRequest: true
      },
      createOrder.rejected(
        new Error('Не удалось создать заказ'),
        'request-id',
        ['bun-1', 'main-1', 'bun-1']
      )
    );

    expect(state.orderRequest).toBe(false);
    expect(state.orderError).toBe('Не удалось создать заказ');
  });
});
