# 🌍 TravelTribe

> A full-stack Airbnb-inspired travel listing platform where users can discover, list, and review unique stays around the world — from mountain cabins to beachside villas.

**🔗 Live Demo:** [project-traveltribe.onrender.com/listings](https://project-traveltribe.onrender.com/listings) &nbsp;|&nbsp; **⭐ GitHub:** [tajindervirk/Project_TravelTribe](https://github.com/tajindervirk/Project_TravelTribe)

---

## ✨ Features

- 🏠 **Browse & Search Listings** — Explore thousands of stays filtered by category (beach, mountains, castles, camping, arctic, and more) or search by title, location, and country
- 📝 **Create & Manage Listings** — Authenticated users can create, edit, and delete their own property listings with image uploads
- 🗺️ **Interactive Maps** — Each listing page shows an interactive Mapbox map pinpointing the exact location via geocoding
- 🌅 **Image Uploads** — Property images are uploaded and stored on Cloudinary with automatic transformation on display
- ⭐ **Reviews & Ratings** — Users can leave 1–5 star rated reviews on listings, with author-only deletion
- 🔐 **Authentication & Authorization** — Secure user registration, login, and session management via Passport.js; owners can only edit/delete their own listings
- 🔒 **Input Validation** — Server-side validation with Joi schemas on both listings and reviews
- 📱 **Responsive Design** — Mobile-friendly UI built with Bootstrap 5 and EJS templating
- ⚡ **Flash Notifications** — User-friendly success and error flash messages across all actions

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js `v20.17.0` |
| **Framework** | Express.js `v4.x` |
| **Templating** | EJS + EJS-Mate (layout engine) |
| **Database** | MongoDB Atlas (via Mongoose `v8.x`) |
| **Authentication** | Passport.js + passport-local + passport-local-mongoose |
| **Session Store** | connect-mongo (MongoDB-backed sessions) |
| **Image Storage** | Cloudinary + multer-storage-cloudinary |
| **Maps & Geocoding** | Mapbox GL JS + @mapbox/mapbox-sdk |
| **Validation** | Joi |
| **Deployment** | Render |

---

## 📁 Project Structure

```
Project_TravelTribe/
├── app.js                  # Express app entry point — middleware, routes, error handling
├── cloudConfig.js          # Cloudinary & Multer storage configuration
├── middleware.js           # Custom middleware: auth guards, input validators, ownership checks
├── schema.js               # Joi validation schemas for listings and reviews
│
├── models/
│   ├── listing.js          # Listing schema (title, description, image, price, location, category, geometry, owner, reviews)
│   ├── review.js           # Review schema (rating, comment, author)
│   └── user.js             # User schema (email, username) + passport-local-mongoose plugin
│
├── controllers/
│   ├── listings.js         # CRUD logic + search + Mapbox geocoding + Cloudinary cleanup
│   ├── reviews.js          # Create & delete reviews logic
│   └── users.js            # Signup, login, logout handlers
│
├── routes/
│   ├── listing.js          # RESTful listing routes with multer upload middleware
│   ├── review.js           # Review routes nested under listings
│   └── user.js             # Auth routes: /signup, /login, /logout
│
├── views/
│   ├── layouts/            # EJS-Mate boilerplate layout
│   ├── includes/           # Reusable partials (navbar, footer, flash messages)
│   ├── listings/           # index, show, new, edit EJS pages
│   └── users/              # signup, login EJS pages
│
├── public/                 # Static assets (CSS, JS, images)
├── init/                   # Database seed scripts
│   ├── data.js             # Sample listings data
│   └── index.js            # Seed runner
│
├── utils/
│   ├── ExpressError.js     # Custom error class with statusCode
│   └── wrapAsync.js        # Async error wrapper for route handlers
│
├── .env                    # Environment variables (not committed)
├── .gitignore
└── package.json
```

---

## 🏗️ Architecture

TravelTribe follows the **MVC (Model-View-Controller)** pattern:

```
HTTP Request
    │
    ▼
Express Router (routes/)
    │  applies middleware (isLoggedIn, isOwner, validateListing, multer upload)
    ▼
Controller (controllers/)
    │  business logic, geocoding, Cloudinary ops
    ▼
Model (models/)
    │  Mongoose ODM ↔ MongoDB Atlas
    ▼
View (views/*.ejs)
    │  rendered with EJS-Mate layout
    ▼
HTTP Response
```

### Request Lifecycle for Creating a Listing

1. `POST /listings` — user submits the listing form
2. `isLoggedIn` middleware verifies active session via Passport
3. `multer` uploads image to **Cloudinary**, returns `url` & `filename`
4. `validateListing` checks fields against **Joi schema**
5. `createListing` controller calls **Mapbox Geocoding API** to get GeoJSON coordinates
6. New `Listing` document saved to **MongoDB Atlas** with owner reference & geometry
7. Flash success message → redirect to `/listings`

---

## 🗃️ Data Models

### Listing
| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Listing name (required) |
| `description` | String | About the place |
| `image` | `{url, filename}` | Cloudinary image reference |
| `price` | Number | Nightly rate |
| `location` | String | City/area |
| `country` | String | Country name |
| `category` | String (enum) | trending, beach, mountains, camping, arctic, castles, lake, river, farms, iconic-cities, amazing-pools |
| `geometry` | GeoJSON Point | Mapbox geocoded coordinates |
| `owner` | ObjectId → User | Listing creator |
| `reviews` | [ObjectId → Review] | Associated reviews |

### Review
| Field | Type | Description |
|-------|------|-------------|
| `rating` | Number (1–5) | Star rating |
| `comment` | String | Written review |
| `author` | ObjectId → User | Review creator |

### User
| Field | Type | Description |
|-------|------|-------------|
| `email` | String | User's email |
| `username` | String | Auto-managed by passport-local-mongoose |
| `hash` / `salt` | String | Password hashing (by passport-local-mongoose) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20+ — [Download](https://nodejs.org/)
- **MongoDB Atlas** account — [Sign up free](https://www.mongodb.com/atlas)
- **Cloudinary** account — [Sign up free](https://cloudinary.com/)
- **Mapbox** account — [Sign up free](https://www.mapbox.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/tajindervirk/Project_TravelTribe.git
cd Project_TravelTribe
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
# MongoDB
ATLASDB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/travelTribe

# Session secret (any long random string)
SECRET=your_super_secret_key_here

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Mapbox
MAP_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6InlvdXJ0b2tlbiJ9.yourtokenhere
```

### 4. (Optional) Seed the Database

Populate the database with sample listings:

```bash
node init/index.js
```

### 5. Start the Development Server

```bash
node app.js
```

Open [http://localhost:8080/listings](http://localhost:8080/listings) in your browser.

---

## 🌐 API Routes

### Listings

| Method | Route | Auth Required | Description |
|--------|-------|:-------------:|-------------|
| `GET` | `/listings` | ❌ | Browse all listings (supports `?filter=beach`) |
| `GET` | `/listings/search` | ❌ | Search listings by title, location, country |
| `GET` | `/listings/new` | ✅ | Render create listing form |
| `POST` | `/listings` | ✅ | Create a new listing |
| `GET` | `/listings/:id` | ❌ | Show listing details + map |
| `GET` | `/listings/:id/edit` | ✅ Owner only | Render edit form |
| `PUT` | `/listings/:id` | ✅ Owner only | Update listing |
| `DELETE` | `/listings/:id` | ✅ Owner only | Delete listing + Cloudinary image |

### Reviews

| Method | Route | Auth Required | Description |
|--------|-------|:-------------:|-------------|
| `POST` | `/listings/:id/reviews` | ✅ | Post a review |
| `DELETE` | `/listings/:id/reviews/:reviewId` | ✅ Author only | Delete a review |

### Users / Auth

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/signup` | Render signup page |
| `POST` | `/signup` | Register new user |
| `GET` | `/login` | Render login page |
| `POST` | `/login` | Authenticate user |
| `GET` | `/logout` | Log out current user |

---

## 🔐 Security Features

- **Session encryption** — Sessions stored in MongoDB with AES encryption (`crypto.secret`)
- **HTTP-only cookies** — Prevents XSS access to session cookies; 7-day expiry
- **Ownership guards** — `isOwner` and `isReviewAuthor` middleware prevent unauthorized edits/deletes
- **Server-side validation** — All user inputs validated with Joi before database operations
- **Redirect URL preservation** — Login redirects back to the originally intended page

---

## ⚙️ Environment Variables Reference

| Variable | Required | Description |
|----------|:--------:|-------------|
| `ATLASDB_URL` | ✅ | Full MongoDB Atlas connection string |
| `SECRET` | ✅ | Session & cookie encryption secret |
| `CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUD_API_KEY` | ✅ | Cloudinary API key |
| `CLOUD_API_SECRET` | ✅ | Cloudinary API secret |
| `MAP_TOKEN` | ✅ | Mapbox public access token |
| `NODE_ENV` | — | Set to `production` on deployment (skips dotenv) |

---

## 🚀 Deployment

This project is deployed on **[Render](https://render.com)**. Live at:
👉 **[https://project-traveltribe.onrender.com/listings](https://project-traveltribe.onrender.com/listings)**

### Deploy Your Own Instance on Render

1. Push your code to a GitHub repository
2. Go to [render.com](https://render.com) → **New Web Service** → Connect your repo
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node app.js`
   - **Node Version:** `20.17.0`
4. Add all environment variables from the table above in the Render dashboard
5. Deploy 🎉

---

## 🐛 Troubleshooting

### `MongooseServerSelectionError` on startup
- Check your `ATLASDB_URL` is correct
- Ensure your current IP is whitelisted in MongoDB Atlas → Network Access

### Images not uploading
- Verify all three Cloudinary environment variables (`CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET`) are set correctly
- Check that Cloudinary folder `travelTribe_DEV` is accessible

### Map not rendering / location not found
- Ensure your `MAP_TOKEN` is a valid Mapbox **public** token
- If geocoding fails, check if the location string entered is specific enough

### Session not persisting after restart
- This is expected in development. MongoDB session store persists sessions across restarts in production.

---

## 🧰 Key Concepts Implemented

This project was built as a learning exercise covering:

- ✅ **RESTful API design** with full CRUD operations
- ✅ **MVC architecture** (Models, Views, Controllers pattern)
- ✅ **Authentication & Authorization** with Passport.js + sessions
- ✅ **File uploads** with Multer + cloud storage (Cloudinary)
- ✅ **Third-party API integration** (Mapbox Geocoding)
- ✅ **Server-side validation** with Joi
- ✅ **MongoDB relationships** (owner references, review population)
- ✅ **Middleware composition** (custom auth guards, validators)
- ✅ **Error handling** (custom ExpressError class, async wrappers)
- ✅ **Secure session management** with encrypted MongoDB store

---

## 👤 Author

**Tajinder Singh**
- GitHub: [@tajindervirk](https://github.com/tajindervirk)
- LinkedIn: [linkedin.com/in/tajsingh21](https://www.linkedin.com/in/tajsingh21/)

> *Built while learning full-stack web development. Inspired by Airbnb.*
