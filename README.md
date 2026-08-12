# LACI — Backend

Backend application for **LACI**, a web application designed to manage and store product information and prices for a small retail shop.

The backend provides a REST API that handles application logic, data validation, and communication with the database.

## Tech Stack

- [NestJS](https://nestjs.com/)
- TypeScript
- REST API
- Supabase PostgreSQL
- ESLint

## Responsibilities

The backend is responsible for:

- Providing REST API endpoints
- Managing product data
- Managing product categories
- Validating incoming requests
- Handling business logic
- Communicating with the PostgreSQL database
- Handling application errors
- Providing consistent API responses

## Architecture

The backend follows a modular architecture based on NestJS.

```text
                    ┌──────────────────┐
                    │     Next.js      │
                    │     Frontend     │
                    └────────┬─────────┘
                             │
                             │ HTTP / REST API
                             ▼
                    ┌──────────────────┐
                    │     NestJS       │
                    │     Backend      │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │     Service      │
                    │  Business Logic  │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │    Database      │
                    │ Supabase / PGSQL │
                    └──────────────────┘
```

## Backend Module Structure

The application will use NestJS modules to separate application features.

Planned structure:

```text
backend/
└── src/
    ├── products/
    │   ├── dto/
    │   ├── products.controller.ts
    │   ├── products.service.ts
    │   └── products.module.ts
    │
    ├── categories/
    │   ├── dto/
    │   ├── categories.controller.ts
    │   ├── categories.service.ts
    │   └── categories.module.ts
    │
    ├── app.controller.ts
    ├── app.service.ts
    ├── app.module.ts
    └── main.ts
```

Additional modules and folders may be added as the application grows.

## API

The backend exposes REST API endpoints.

### Products

| Method   | Endpoint            | Description        |
| -------- | ------------------- | ------------------ |
| `GET`    | `/api/products`     | Get products       |
| `GET`    | `/api/products/:id` | Get product detail |
| `POST`   | `/api/products`     | Create product     |
| `PATCH`  | `/api/products/:id` | Update product     |
| `DELETE` | `/api/products/:id` | Delete product     |

### Categories

| Method   | Endpoint              | Description         |
| -------- | --------------------- | ------------------- |
| `GET`    | `/api/categories`     | Get categories      |
| `GET`    | `/api/categories/:id` | Get category detail |
| `POST`   | `/api/categories`     | Create category     |
| `PATCH`  | `/api/categories/:id` | Update category     |
| `DELETE` | `/api/categories/:id` | Delete category     |

## API Response Format

Successful responses follow a consistent structure:

```json
{
  "success": true,
  "data": {}
}
```

List responses may include pagination metadata:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Product not found"
}
```

## Database

The application uses **Supabase PostgreSQL** as its database.

Initial database entities:

```text
categories
    │
    │ 1:N
    ▼
products
```

### Categories

Stores product categories.

### Products

Stores product information including:

- Product name
- Category
- Purchase price
- Selling price
- Unit
- Active status
- Created timestamp
- Updated timestamp

Additional tables may be introduced as the application evolves.

## Environment Variables

Create a `.env` file in the root of the backend project.

```env
PORT=3001

SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

| Variable                    | Description                     |
| --------------------------- | ------------------------------- |
| `PORT`                      | Port used by the NestJS server  |
| `SUPABASE_URL`              | Supabase project URL            |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase credential |

> **Important:** Never expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend or commit it to Git.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env`:

```env
PORT=3001
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run development server

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3001
```

## Available Scripts

```bash
npm run start:dev
```

Run the development server with watch mode.

```bash
npm run build
```

Build the application.

```bash
npm run start
```

Run the production build.

```bash
npm run lint
```

Run ESLint.

```bash
npm run test
```

Run unit tests.

```bash
npm run test:e2e
```

Run end-to-end tests.

## API Development

The backend will be developed incrementally.

Current planned development order:

```text
Database
    ↓
Products Module
    ↓
Categories Module
    ↓
Validation
    ↓
Error Handling
    ↓
Search & Filtering
    ↓
Pagination
```

## Development Status

This project is currently under development.

Current development phase:

```text
Phase 1 — Project Setup
```

Planned development phases:

- Project Setup
- Database Setup
- NestJS Foundation
- Product API
- Category API
- API Testing
- Frontend Integration
- Testing & Improvement
- Deployment

## License

This project is currently intended for personal learning and development.
