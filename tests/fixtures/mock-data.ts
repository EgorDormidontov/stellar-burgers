export const mockBun = {
  _id: 'mock-bun-id',
  name: 'Космическая тестовая булка',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 30,
  calories: 200,
  price: 100,
  image:
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
  image_large:
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
  image_mobile:
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
};

export const mockMain = {
  _id: 'mock-main-id',
  name: 'Галактическая тестовая начинка',
  type: 'main',
  proteins: 20,
  fat: 10,
  carbohydrates: 5,
  calories: 150,
  price: 200,
  image:
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
  image_large:
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
  image_mobile:
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
};

export const mockSauce = {
  _id: 'mock-sauce-id',
  name: 'Тестовый межзвёздный соус',
  type: 'sauce',
  proteins: 2,
  fat: 3,
  carbohydrates: 8,
  calories: 70,
  price: 50,
  image:
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
  image_large:
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
  image_mobile:
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
};

export const mockUserResponse = {
  success: true,
  user: {
    email: 'test@example.com',
    name: 'Тестовый пользователь'
  }
};

export const mockOrderResponse = {
  success: true,
  name: 'Космический тестовый бургер',
  order: {
    _id: 'mock-order-id',
    status: 'done',
    name: 'Космический тестовый бургер',
    owner: {
      name: 'Тестовый пользователь',
      email: 'test@example.com',
      createdAt: '2026-09-03T08:00:00.000Z',
      updatedAt: '2026-09-03T08:00:00.000Z'
    },
    createdAt: '2026-09-03T08:00:00.000Z',
    updatedAt: '2026-09-03T08:01:00.000Z',
    number: 777777,
    price: 400
  }
};

export const emptyFeedResponse = {
  success: true,
  orders: [],
  total: 0,
  totalToday: 0
};
