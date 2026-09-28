# Blog Sitesi

<!-- TODO: screenshot to be added -->

## Description

Blog Sitesi is a full-stack blog application built with ASP.NET Core 8 and React. The backend is a REST API running on Entity Framework Core and Supabase (PostgreSQL); the frontend is a single-page application built with TypeScript, Material UI and Redux Toolkit. Visitors can browse published posts, search, and filter by category; signed-in users can comment. Users with the `admin` role can create, edit and delete posts, update the "About" page content, and manage user roles. Authentication uses JWT; the token is kept in the browser's `localStorage` and attached to every API request by an axios interceptor as an `Authorization` header. For SEO, the app ships Open Graph meta tags, static `robots.txt`/`sitemap.xml` files, and a dynamic XML sitemap endpoint generated from the database.

## Tech stack

| Layer | Used |
| --- | --- |
| Backend | ASP.NET Core 8, Entity Framework Core 8, Npgsql (PostgreSQL), JWT Bearer, Swashbuckle (Swagger) |
| Database | Supabase PostgreSQL (pooler, port 6543) |
| Frontend | React 18, TypeScript, Create React App (`react-scripts` 5), React Router 6 |
| UI | Material UI 5, ReactQuill (rich text editor) |
| State | Redux Toolkit, axios |

## Project structure

```
BlogSitesi/
├── BlogSolution.sln
├── Blog.API/                 # ASP.NET Core 8 Web API
│   ├── Controllers/          # Auth, Blog, Comment, About, User, Sitemap
│   ├── Data/                 # BlogDbContext + EF Core migrations
│   ├── Dtos/                 # Request DTOs and validation rules
│   ├── Models/               # User, BlogPost, Comment, About
│   ├── Services/             # JwtService
│   ├── Migrations/
│   ├── Program.cs
│   ├── appsettings.json
│   └── appsettings.Development.example.json
└── blog-frontend/            # React + TypeScript client
    ├── public/               # index.html, robots.txt, sitemap.xml, manifest
    ├── src/
    │   ├── components/       # Blog, Comments, Category, Layout, Navbar, Search, Share
    │   ├── pages/            # Home, BlogPost, Search, Category, About, Login,
    │   │                     # Register, Admin, UserManagement, BlogForm, NotFound
    │   ├── services/         # axios client and API services
    │   ├── store/            # Redux Toolkit store + auth/blog slices
    │   ├── types/
    │   ├── utils/supabase.ts
    │   └── App.tsx           # Router and route definitions
    ├── .env.example
    └── package.json
```

## Requirements

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) and npm
- A [Supabase](https://supabase.com) project (PostgreSQL database)

## Setup

### 1. Backend

Get the **Session Pooler** connection string from your Supabase project and put it in `Blog.API/appsettings.Development.json`. See `Blog.API/appsettings.Development.example.json` for the template.

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=<POOLER_HOST>;Port=6543;Database=postgres;Username=<USER>.<PROJECT_REF>;Password=<PASSWORD>;SSL Mode=Require;Trust Server Certificate=true"
  },
  "Jwt": {
    "Key": "<SECRET_KEY_OF_AT_LEAST_32_CHARACTERS>"
  }
}
```

You can also pass the connection string via environment variable; `SUPABASE_DB_CONNECTION` takes precedence over the value in `appsettings.json`:

```bash
export SUPABASE_DB_CONNECTION="Host=...;Port=6543;..."
```

The API throws on startup if `Jwt:Key` is still `YOUR_JWT_SIGNING_KEY` or if the connection string still contains a placeholder.

Apply the schema to the database (the app does not auto-migrate on startup):

```bash
dotnet ef database update --project Blog.API
```

Run the API:

```bash
dotnet run --project Blog.API
```

- API: `http://localhost:7123`
- Swagger UI: `http://localhost:7123/swagger` (only in the `Development` environment)

The first migration seeds an `admin@blog.com` / `Admin123!` account. You can also create it via `POST /api/auth/create-admin`.

### 2. Frontend

```bash
cd blog-frontend
cp .env.example .env
npm install
npm start
```

Fill in `.env` with your own values:

```
REACT_APP_API_BASE_URL=http://localhost:7123/api
REACT_APP_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
REACT_APP_SUPABASE_PUBLISHABLE_KEY=<SUPABASE_PUBLISHABLE_KEY>
```

The app runs at `http://localhost:3000`.

## Features

### Public

- Post list on the home page (published posts only)
- Post detail page: content, cover image, comments
- Search across title, content and summary (300 ms debounce)
- Filter by category
- About page
- Login / register pages
- Share buttons (Facebook, Twitter, LinkedIn, WhatsApp)
- Dynamic XML sitemap at `GET /api/sitemap`

### Signed-in users

- Register and log in (JWT, valid 3 hours)
- Add comments to posts
- Edit and delete their own comments

### Admin (`admin` role)

- Author panel: all drafts and published posts
- Create / edit / delete posts (rich text via ReactQuill)
- Mark a post as draft or published
- Edit the About page content
- List users, change roles and active status
- API connection test (`/api/blog/test`)

Edit/delete rights on a post belong to its author or to `admin`. Comment delete rights belong to the comment owner or to `admin`.

## API endpoints

The full schema is available through Swagger. Summary:

| Method | Endpoint | Auth |
| --- | --- | --- |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/create-admin` | Public |
| GET | `/api/blog` | Public (published only) |
| GET | `/api/blog/{id}` | Public |
| GET | `/api/blog/search?q=` | Public |
| GET | `/api/blog/category/{categoryId}` | Public |
| GET | `/api/blog/test` | Public |
| GET | `/api/blog/admin` | Authenticated |
| POST | `/api/blog` | Authenticated |
| PUT | `/api/blog/{id}` | Author or admin |
| DELETE | `/api/blog/{id}` | Author or admin |
| POST | `/api/blog/{postId}/comments` | Authenticated |
| PUT | `/api/blog/comments/{commentId}` | Comment owner |
| DELETE | `/api/blog/comments/{commentId}` | Comment owner or admin |
| GET | `/api/comment/post/{postId}` | Public |
| POST | `/api/comment` | Authenticated |
| DELETE | `/api/comment/{id}` | Comment owner |
| GET | `/api/about` | Public |
| PUT | `/api/about` | Admin |
| GET | `/api/user` | Admin |
| PUT | `/api/user/{id}/role` | Admin |
| PUT | `/api/user/{id}/status` | Admin |
| GET | `/api/sitemap` | Public (XML) |

## Known issues

- `ProtectedRoute` only checks whether the user is signed in; role enforcement happens in the backend via `[Authorize(Roles = "admin")]`. Any signed-in user can therefore open the `/admin` UI, but the data requests are rejected.
- Comment CRUD lives under both `/api/comment/*` (`CommentController`) and `/api/blog/*/comments` (`BlogController`); the frontend currently uses the `BlogController` routes.
- The Supabase client in `src/utils/supabase.ts` is not used anywhere. The Supabase connection is currently established only through the backend's Npgsql provider. Importing that file throws if the environment variables are missing.
- The `@uiw/react-md-editor` dependency in `package.json` is unused; ReactQuill is the editor in use.
- `src/App.test.tsx` still contains the Create React App template "learn react" test and will fail.
- `ParentCommentId` on comments and the `About` table are defined in the schema, but there is no nested-comment UI in the frontend yet.
- The CORS policy allows any origin (`AllowAnyOrigin`); this is development-only.
- `Jwt:ExpiresInHours` (24) in `appsettings.json` is never read; `JwtService` hardcodes the lifetime as `AddHours(3)`. The token lifetime is 3 hours.
