import path from 'path';
import { expect, Page, test } from '@playwright/test';
import {
  expectedOrderNumber,
  expectedUserName,
  mockBun,
  mockMain
} from './fixtures/mock-data';

const harPath = (fileName: string) =>
  path.join(process.cwd(), 'tests', 'hars', fileName);

const addIngredient = async (page: Page, ingredientId: string) => {
  const ingredient = page.getByTestId(`ingredient-${ingredientId}`);

  await expect(ingredient).toBeVisible();
  await ingredient.getByRole('button', { name: 'Добавить' }).click();
};

const useIngredientsHar = async (page: Page) => {
  await page.routeFromHAR(harPath('ingredients.har'), {
    url: '**/api/ingredients'
  });
};

test.beforeEach(async ({ page }) => {
  await useIngredientsHar(page);
});

test('добавляет булку и начинку в конструктор', async ({ page }) => {
  await page.goto('/');

  await addIngredient(page, mockBun._id);
  await addIngredient(page, mockMain._id);

  const constructor = page.getByTestId('burger-constructor');

  await expect(constructor).toContainText(`${mockBun.name} (верх)`);
  await expect(constructor).toContainText(`${mockBun.name} (низ)`);
  await expect(constructor).toContainText(mockMain.name);
});

test('открывает модальное окно ингредиента и закрывает крестиком', async ({
  page
}) => {
  await page.goto('/');

  const ingredientLink = page.getByTestId(`ingredient-link-${mockBun._id}`);

  await expect(ingredientLink).toBeVisible();
  await ingredientLink.click();

  const modal = page.getByTestId('modal');

  await expect(modal).toBeVisible();
  await expect(modal).toContainText('Детали ингредиента');
  await expect(modal).toContainText(mockBun.name);

  await expect(modal).toContainText('Калории, ккал');
  await expect(modal).toContainText(String(mockBun.calories));
  await expect(modal).toContainText('Белки, г');
  await expect(modal).toContainText(String(mockBun.proteins));
  await expect(modal).toContainText('Жиры, г');
  await expect(modal).toContainText(String(mockBun.fat));
  await expect(modal).toContainText('Углеводы, г');
  await expect(modal).toContainText(String(mockBun.carbohydrates));

  await expect(page).toHaveURL(new RegExp(`/ingredients/${mockBun._id}$`));

  await page.getByTestId('modal-close').click();

  await expect(modal).not.toBeVisible();
  await expect(page).toHaveURL('/');
});

test('закрывает модальное окно ингредиента по оверлею', async ({ page }) => {
  await page.goto('/');

  const ingredientLink = page.getByTestId(`ingredient-link-${mockMain._id}`);

  await expect(ingredientLink).toBeVisible();
  await ingredientLink.click();

  const modal = page.getByTestId('modal');

  await expect(modal).toBeVisible();

  await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });

  await expect(modal).not.toBeVisible();
  await expect(page).toHaveURL('/');
});

test('создаёт заказ, показывает его номер и очищает конструктор', async ({
  page
}) => {
  await page.addInitScript(() => {
    document.cookie = 'accessToken=Bearer%20mock-access-token; path=/';
    window.localStorage.setItem('refreshToken', 'mock-refresh-token');
  });

  await page.routeFromHAR(harPath('user.har'), {
    url: '**/api/auth/user'
  });

  await page.routeFromHAR(harPath('feed.har'), {
    url: '**/api/orders/all'
  });

  // В одном HAR лежат оба запроса к /orders:
  // POST создания заказа и GET обновления истории заказов после создания.
  await page.routeFromHAR(harPath('orders.har'), {
    url: '**/api/orders'
  });

  await page.goto('/');

  await expect(page.getByText(expectedUserName)).toBeVisible();

  await addIngredient(page, mockBun._id);
  await addIngredient(page, mockMain._id);

  const orderRequestPromise = page.waitForRequest(
    (request) =>
      request.url().endsWith('/api/orders') && request.method() === 'POST'
  );

  await page.getByRole('button', { name: 'Оформить заказ' }).click();

  const orderRequest = await orderRequestPromise;

  expect(orderRequest.headers().authorization).toBe('Bearer mock-access-token');
  expect(orderRequest.postDataJSON()).toEqual({
    ingredients: [mockBun._id, mockMain._id, mockBun._id]
  });

  const modal = page.getByTestId('modal');

  await expect(modal).toBeVisible();
  await expect(modal).toContainText(String(expectedOrderNumber));
  await expect(modal).toContainText('идентификатор заказа');

  const constructor = page.getByTestId('burger-constructor');

  await expect(constructor.getByText('Выберите начинку')).toBeVisible();
  await expect(constructor.getByText('Выберите булки')).toHaveCount(2);
  await expect(constructor).not.toContainText(mockMain.name);
  await expect(constructor).not.toContainText(`${mockBun.name} (верх)`);

  await page.getByTestId('modal-close').click();
  await expect(modal).not.toBeVisible();
});
