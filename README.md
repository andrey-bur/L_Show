# Проектная документация

## Использованные материалы
- https://swagger.io/ — структура OpenAPI и визуальная документация API.
- https://jsdoc.app/ — формат JSDoc и описание типизированных тегов.
- https://www.youtube.com/watch?v=dhMlXoTD3mQ — практический пример по документации API/Swagger.

## Бэкенд

### Визуальная документация API
- Подключен Swagger UI.
- Доступные endpoints:
  - `GET /docs` — UI документации.
  - `GET /docs.json` — OpenAPI JSON.
- OpenAPI-спека описывает все действующие роуты:
  - `/users/*`
  - `/product/*`

### Типизация в документации
- В OpenAPI добавлены схемы `User`, `Product`, `CartItem`.
- Для request/response добавлены typed payload-схемы (`LoginPayload`, `RegisterPayload`, `UpdateUserPayload`, `ApiError`).

### JSDoc для утилитарных функций
- Добавлены JSDoc-комментарии с типами (`@template`, `@param`, `@returns`) для утилит хранения данных:
  - `back/src/servires/database.servires.ts`
- Также JSDoc добавлен в служебные функции контроллеров:
  - `back/src/controllers/users/users.controller.ts`
  - `back/src/controllers/products/products.controller.ts`

## Фронтенд

### Стандартизация компонентов
- Введен общий UI-kit кнопок: `front/src/styles/ui-kit.ts`.
- Стандартные button-варианты:
  - `.ui-btn`
  - `.ui-btn--primary`
  - `.ui-btn--secondary`
  - `.ui-btn--accent`
  - `.ui-btn--icon`
  - `.ui-btn--full`
- Базовый `Component` автоматически подключает UI-kit стили, чтобы кнопки были единообразны между страницами.

### JSDoc для независимых и утилитарных функций
- Добавлены JSDoc-комментарии в:
  - `front/src/api/http.ts`
  - `front/src/api/user.ts`
  - `front/src/api/product.ts`
  - `front/src/utils/helper/auth.ts`
  - `front/src/utils/helper/auth-page.ts`
  - `front/src/utils/router/Router.ts`
  - `front/src/utils/router/router-instance.ts`
  - `front/src/utils/Component/Component.ts`

### Типизация данных, приходящих с API
- Введены DTO-типы:
  - `ProductDTO` (`front/src/interface/Product.ts`)
  - `UserDTO` (`front/src/interface/User.ts`)
- API-сервисы получают DTO и маппят их в доменные модели (`new Product(...)`, `new User(...)`).
- Обновление пользователя (`PATCH /users/:id`) теперь возвращает типизированного пользователя и используется в UI напрямую.

## Запуск

### Backend
1. Установить зависимости:
   - `cd back && npm install`
2. Запустить:
   - `npm start`
3. Открыть Swagger UI:
   - http://localhost:3000/docs

### Frontend
1. Установить зависимости:
   - `cd front && npm install`
2. Запустить:
   - `npm start`
