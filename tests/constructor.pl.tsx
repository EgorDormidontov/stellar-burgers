import fs from 'fs';
import path from 'path';
import { expect, Page, test } from '@playwright/test';

import {
  emptyFeedResponse,
  mockBun,
  mockMain,
  mockOrderResponse,
  mockUserResponse
} from './fixtures/mock-data';

const ingredientsHar = path.join(
  process.cwd(),
  'tests',
  'fixtures',
  'ingredients.har'
);

type THar = {
  log: {
    entries: Array<{
      response: {
        content: {
          text: string;
        };
      };
    }>;
  };
};

const harData = JSON.parse(fs.readFileSync(ingredientsHar, 'utf-8')) as THar;

const ingredientsResponse = JSON.parse(
  harData.log.entries[0].response.content.text
);

const mockIngredientsRequest = async (page: Page) => {
  await page.route('**/ingredients', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(ingredientsResponse)
    });
  });
};

const addIngredient = async (page: Page, ingredientId: string) => {
  const ingredient = page.getByTestId(`ingredient-${ingredientId}`);

  await expect(ingredient).toBeVisible();

  await ingredient
    .getByRole('button', {
      name: 'Добавить'
    })
    .click();
};

test.beforeEach(async ({ page }) => {
  await mockIngredientsRequest(page);
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

  await page.getByTestId('modal-overlay').click({
    position: {
      x: 5,
      y: 5
    }
  });

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

  let userRequestCalled = false;

  await page.route('**/auth/user', async (route) => {
    userRequestCalled = true;

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUserResponse)
    });
  });

  await page.route('**/orders/all', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(emptyFeedResponse)
    });
  });

  await page.route('**/orders', async (route) => {
    const request = route.request();

    if (request.method() === 'POST') {
      expect(request.headers().authorization).toBe('Bearer mock-access-token');

      expect(request.postDataJSON()).toEqual({
        ingredients: [mockBun._id, mockMain._id, mockBun._id]
      });

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOrderResponse)
      });

      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        orders: []
      })
    });
  });

  await page.goto('/');

  await expect(page.getByText(mockUserResponse.user.name)).toBeVisible();

  expect(userRequestCalled).toBe(true);

  await addIngredient(page, mockBun._id);

  await addIngredient(page, mockMain._id);

  await page
    .getByRole('button', {
      name: 'Оформить заказ'
    })
    .click();

  const modal = page.getByTestId('modal');

  await expect(modal).toBeVisible();

  await expect(modal).toContainText(String(mockOrderResponse.order.number));

  await expect(modal).toContainText('идентификатор заказа');

  const constructor = page.getByTestId('burger-constructor');

  await expect(constructor.getByText('Выберите начинку')).toBeVisible();

  await expect(constructor.getByText('Выберите булки')).toHaveCount(2);

  await expect(constructor).not.toContainText(mockMain.name);

  await expect(constructor).not.toContainText(`${mockBun.name} (верх)`);

  await page.getByTestId('modal-close').click();

  await expect(modal).not.toBeVisible();
});
