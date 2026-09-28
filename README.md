# Blog Sitesi

<!-- TODO: ekran görüntüsü eklenecek -->

## Açıklama

Blog Sitesi, ASP.NET Core 8 ve React ile yazılmış tam yığın (full-stack) bir blog uygulamasıdır. Backend tarafında Entity Framework Core ve Supabase (PostgreSQL) üzerinde çalışan bir REST API, frontend tarafında ise TypeScript, Material UI ve Redux Toolkit ile kurulmuş bir tek sayfa uygulaması bulunur. Ziyaretçiler yalnızca yayınlanmış yazıları görüntüler, arama yapar ve kategoriye göre filtreler; giriş yapan kullanıcılar yorum yazar. `admin` rolündeki kullanıcılar yazı oluşturur, düzenler, siler, "Hakkında" sayfasının içeriğini günceller ve kullanıcı rollerini yönetir. Kimlik doğrulama JWT ile yapılır, token tarayıcının `localStorage` alanında tutulur ve her API isteğine axios interceptor tarafından `Authorization` başlığı olarak eklenir. SEO için Open Graph etiketleri, statik `robots.txt`/`sitemap.xml` dosyaları ve veritabanından dinamik olarak üretilen bir XML sitemap endpoint'i sunulur.

## Teknolojiler

| Katman | Kullanılanlar |
| --- | --- |
| Backend | ASP.NET Core 8, Entity Framework Core 8, Npgsql (PostgreSQL), JWT Bearer, Swashbuckle (Swagger) |
| Veritabanı | Supabase PostgreSQL (pooler, port 6543) |
| Frontend | React 18, TypeScript, Create React App (`react-scripts` 5), React Router 6 |
| UI | Material UI 5, ReactQuill (zengin metin editörü) |
| State | Redux Toolkit, axios |

## Proje yapısı

```
BlogSitesi/
├── BlogSolution.sln
├── Blog.API/                 # ASP.NET Core 8 Web API
│   ├── Controllers/          # Auth, Blog, Comment, About, User, Sitemap
│   ├── Data/                 # BlogDbContext + EF Core migrations
│   ├── Dtos/                 # Request DTO'ları ve doğrulama kuralları
│   ├── Models/               # User, BlogPost, Comment, About
│   ├── Services/             # JwtService
│   ├── Migrations/
│   ├── Program.cs
│   ├── appsettings.json
│   └── appsettings.Development.example.json
└── blog-frontend/            # React + TypeScript istemci
    ├── public/               # index.html, robots.txt, sitemap.xml, manifest
    ├── src/
    │   ├── components/       # Blog, Comments, Category, Layout, Navbar, Search, Share
    │   ├── pages/            # Home, BlogPost, Search, Category, About, Login,
    │   │                     # Register, Admin, UserManagement, BlogForm, NotFound
    │   ├── services/         # axios istemcisi ve API servisleri
    │   ├── store/            # Redux Toolkit store + auth/blog slice'ları
    │   ├── types/
    │   ├── utils/supabase.ts
    │   └── App.tsx           # Router ve rota tanımları
    ├── .env.example
    └── package.json
```

## Gereksinimler

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) ve npm
- Bir [Supabase](https://supabase.com) projesi (PostgreSQL veritabanı)

## Kurulum

### 1. Backend

Supabase projenizden **Session Pooler** bağlantı dizesini alın ve `Blog.API/appsettings.Development.json` içine yazın. Şablon için `Blog.API/appsettings.Development.example.json` dosyasına bakabilirsiniz.

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=<POOLER_HOST>;Port=6543;Database=postgres;Username=<USER>.<PROJECT_REF>;Password=<PASSWORD>;SSL Mode=Require;Trust Server Certificate=true"
  },
  "Jwt": {
    "Key": "<EN_AZ_32_KARAKTERLIK_GIZLI_ANAHTAR>"
  }
}
```

Bağlantı dizesini ortam değişkeniyle de verebilirsiniz; `SUPABASE_DB_CONNECTION` tanımlıysa `appsettings.json` içindeki değeri ezer:

```bash
export SUPABASE_DB_CONNECTION="Host=...;Port=6543;..."
```

`appsettings.json` içindeki `Jwt:Key` alanı hâlâ `YOUR_JWT_SIGNING_KEY` ise ya da bağlantı dizesi yer tutucu içeriyorsa API başlatıldığında hata fırlatır.

Şemayı veritabanına uygulayın (uygulama açılışta otomatik migrate etmez):

```bash
dotnet ef database update --project Blog.API
```

API'yi çalıştırın:

```bash
dotnet run --project Blog.API
```

- API: `http://localhost:7123`
- Swagger UI: `http://localhost:7123/swagger` (yalnızca `Development` ortamında)

İlk migration çalıştırıldığında `admin@blog.com` / `Admin123!` hesabı seed olarak eklenir. Alternatif olarak `POST /api/auth/create-admin` ile de oluşturulabilir.

### 2. Frontend

```bash
cd blog-frontend
cp .env.example .env
npm install
npm start
```

`.env` dosyasını kendi değerlerinizle doldurun:

```
REACT_APP_API_BASE_URL=http://localhost:7123/api
REACT_APP_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
REACT_APP_SUPABASE_PUBLISHABLE_KEY=<SUPABASE_PUBLISHABLE_KEY>
```

Uygulama `http://localhost:3000` adresinde açılır.

## Özellikler

### Herkese açık

- Ana sayfada yayınlanmış yazıların listelenmesi
- Yazı detay sayfası: içerik, kapak görseli, yorumlar
- Arama (başlık, içerik ve özet alanlarında; 300 ms debounce)
- Kategoriye göre filtreleme
- Hakkında sayfası
- Hakkında / giriş / kayıt sayfaları
- Paylaşım butonları (Facebook, Twitter, LinkedIn, WhatsApp)
- `GET /api/sitemap` ile dinamik XML sitemap

### Giriş yapmış kullanıcı

- Kayıt olma ve giriş yapma (JWT, 3 saat geçerli)
- Yazıya yorum ekleme
- Kendi yorumunu düzenleme ve silme

### Admin (`admin` rolü)

- Yazar paneli: taslak ve yayınlanmış tüm yazılar
- Yazı oluşturma / düzenleme / silme (ReactQuill ile zengin metin)
- Yazıyı taslak veya yayınlanmış olarak işaretleme
- Hakkında sayfası içeriğini düzenleme
- Kullanıcı listeleme, rol ve aktiflik durumu güncelleme
- API bağlantı testi (`/api/blog/test`)

Yazı silme/düzenleme yetkisi yazının yazarında veya `admin` rolündedir. Yorum silme yetkisi yorumun sahibinde veya `admin` rolündedir.

## API endpoint'leri

Swagger üzerinden tüm şema görülebilir. Özet:

| Method | Endpoint | Yetki |
| --- | --- | --- |
| POST | `/api/auth/register` | Herkese açık |
| POST | `/api/auth/login` | Herkese açık |
| POST | `/api/auth/create-admin` | Herkese açık |
| GET | `/api/blog` | Herkese açık (yalnızca yayınlanmış) |
| GET | `/api/blog/{id}` | Herkese açık |
| GET | `/api/blog/search?q=` | Herkese açık |
| GET | `/api/blog/category/{categoryId}` | Herkese açık |
| GET | `/api/blog/test` | Herkese açık |
| GET | `/api/blog/admin` | Giriş yapmış |
| POST | `/api/blog` | Giriş yapmış |
| PUT | `/api/blog/{id}` | Yazar veya admin |
| DELETE | `/api/blog/{id}` | Yazar veya admin |
| POST | `/api/blog/{postId}/comments` | Giriş yapmış |
| PUT | `/api/blog/comments/{commentId}` | Yorum sahibi |
| DELETE | `/api/blog/comments/{commentId}` | Yorum sahibi veya admin |
| GET | `/api/comment/post/{postId}` | Herkese açık |
| POST | `/api/comment` | Giriş yapmış |
| DELETE | `/api/comment/{id}` | Yorum sahibi |
| GET | `/api/about` | Herkese açık |
| PUT | `/api/about` | Admin |
| GET | `/api/user` | Admin |
| PUT | `/api/user/{id}/role` | Admin |
| PUT | `/api/user/{id}/status` | Admin |
| GET | `/api/sitemap` | Herkese açık (XML) |

## Bilinen durumlar

- `ProtectedRoute` yalnızca giriş yapılıp yapılmadığını kontrol eder; rol kontrolü backend'de `[Authorize(Roles = "admin")]` ile yapılır. Yani giriş yapmış herhangi bir kullanıcı `/admin` arayüzünü açabilir, ancak veri istekleri reddedilir.
- Yorum CRUD işlemleri hem `/api/comment/*` (`CommentController`) hem de `/api/blog/*/comments` (`BlogController`) altında bulunur; frontend şu an `BlogController` uçlarını kullanıyor.
- `src/utils/supabase.ts` içindeki Supabase istemcisi hiçbir sayfada kullanılmıyor. Supabase ile bağlantı şu an sadece backend'in Npgsql sağlayıcısı üzerinden kuruluyor. Bu dosya import edilirse eksik ortam değişkeni hata fırlatır.
- `package.json` içindeki `@uiw/react-md-editor` bağımlılığı kodda kullanılmıyor; metin editörü olarak ReactQuill kullanılıyor.
- `src/App.test.tsx` hâlâ Create React App şablonundan gelen "learn react" testini içeriyor ve başarısız olur.
- Yorumlar için `ParentCommentId` alanı ve `About` tablosu şemada tanımlı; iç içe yorum arayüzü henüz frontend'de yok.
- CORS politikası tüm kaynaklara açık (`AllowAnyOrigin`), bu yalnızca geliştirme içindir.
- `appsettings.json` içindeki `Jwt:ExpiresInHours` (24) okunmuyor; `JwtService` süreyi kodda `AddHours(3)` olarak sabitliyor. Token ömrü 3 saattir.
