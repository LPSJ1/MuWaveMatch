# MuWaveMatch

**Music Matching & Event Discovery Platform for Nairobi**

MuWaveMatch connects music enthusiasts in Nairobi by matching them with people who share their music taste and helping them discover local music events tailored to their interests.

---

## Problem Statement

Nairobi has a vibrant and diverse music scene, but music enthusiasts have no dedicated platform to find others who share their specific tastes or to discover events relevant to those interests. Generic social media is too broad, and existing event platforms do not personalise recommendations based on music genre preferences. MuWaveMatch solves this by combining music-interest matching with curated event discovery in one platform built specifically for the Nairobi music community.

---

## Objectives

1. Allow users to register and select their music genre interests
2. Match users with other people who share similar music tastes using the Jaccard Similarity algorithm
3. Enable event organisers to submit music events for admin review
4. Provide a moderation layer ensuring only quality, vetted events reach users
5. Notify relevant users automatically when events matching their genres are approved
6. Allow users to RSVP to events and organizers to manage their attendees

---

## Features

### For Music Enthusiasts
- Register with email/password or sign in with Google
- Select music genre interests from the available catalogue
- Get matched with other users based on shared genres (Jaccard Similarity scoring, 0–100%)
- Browse and search approved music events
- Get personalised event recommendations based on your genre interests
- RSVP to events
- Receive in-app notifications and emails when new matching events go live
- View and manage your interests and registered events from your profile

### For Event Organisers
- Create events with name, description, location, date/time, genres, and optional poster image
- Events go into a pending queue and are reviewed by admins before going live
- Manage event attendees — remove attendees directly when necessary
- Notified when their event is approved and goes live

### For Administrators
- Review and approve or reject pending event submissions
- Approve events trigger automatic in-app notifications and emails to all users whose genres match
- Manage users — view all registered users and promote users to admin
- View and review complaints filed by users about organiser conduct
- Generate printable PDF reports covering event moderation, user activity, matching performance, and event attendance

---

## Technologies Used

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite), React Router v6, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth — JWT, Google OAuth, Magic Link |
| Email | Resend |
| File Storage | Supabase Storage |
| Security | Helmet, express-rate-limit, express-validator, multer |

---

## Folder Structure

```
MuWaveMatch/
├── backend/
│   ├── config/
│   │   └── supabase.js          # Supabase service-role client
│   ├── controllers/
│   │   ├── authController.js    # Signup, login, OAuth, profile completion
│   │   ├── interestController.js
│   │   ├── genreController.js
│   │   ├── matchController.js   # Jaccard Similarity matching
│   │   ├── eventsController.js  # Event CRUD, RSVP, kick attendee
│   │   ├── notificationController.js
│   │   ├── complaintController.js
│   │   └── adminController.js   # Moderation, user management, complaints
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── verifyAdmin.js       # Admin-only gating
│   │   └── validators.js        # express-validator chains
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── interestRoutes.js
│   │   ├── genreRoutes.js
│   │   ├── matchRoutes.js
│   │   ├── eventsRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── complaintRoutes.js
│   │   └── adminRoutes.js
│   ├── index.js                 # Express server entry point
│   └── package.json
├── frontend/
│   ├── public/                  # Static assets and images
│   └── src/
│       ├── components/          # Layout, Navbar, ProtectedRoute, AdminRoute
│       ├── context/             # AuthContext — global auth state
│       ├── data/                # Genre data
│       ├── pages/               # Home, Login, Register, Events, Profile, etc.
│       └── services/
│           ├── api.js           # Centralised API service layer
│           └── supabaseClient.js # Frontend Supabase client (OAuth only)
├── .gitignore
└── README.md
```

---

## Installation Guide

### Prerequisites

- Node.js v18 or higher
- npm
- A [Supabase](https://supabase.com) project
- A [Resend](https://resend.com) account (for email notifications)

### 1. Clone the Repository

```bash
git clone https://github.com/LPSJ1/MuWaveMatch.git
cd MuWaveMatch
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
PORT=3000
```

> **Important:** Use the **service role key**, not the anon key, for the backend. The service role key bypasses Row Level Security and is required for the backend to function correctly.

Start the backend server:

```bash
npm run dev
```

The API will be running at `http://localhost:3000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend/` folder:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3000
```

> The frontend uses the **anon key** only — and exclusively for Google OAuth. All other data operations go through the Express backend.

Start the frontend:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## Database Setup

Create the following tables in your Supabase project via the SQL editor.

```sql
-- Profiles table (separate from Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Genres
CREATE TABLE genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL
);

-- User genre interests
CREATE TABLE user_genres (
  user_id UUID REFERENCES profiles(id),
  genre_id UUID REFERENCES genres(id),
  PRIMARY KEY (user_id, genre_id)
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  date TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  poster_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Event genre tags
CREATE TABLE event_genres (
  event_id UUID REFERENCES events(id),
  genre_id UUID REFERENCES genres(id),
  PRIMARY KEY (event_id, genre_id)
);

-- Event RSVPs
CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (event_id, user_id)
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Complaints
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  reported_by UUID REFERENCES profiles(id),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

Seed the genres table with the initial data:

```sql
INSERT INTO genres (name) VALUES
  ('Pop'), ('Amapiano'), ('Jazz'), ('Alternative'), ('Gengetone');
```

Create your first admin user manually after registering via the app:

```sql
UPDATE profiles SET is_admin = true WHERE username = 'your_username';
```

Also create a **public Storage bucket** named `event-posters` in your Supabase project (Storage → New bucket → Public).

---

## API Documentation

All protected endpoints require a Bearer token in the `Authorization` header.

### Auth — `/api`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/signup` | None | Register a new user |
| POST | `/api/login` | None | Login with username + password |
| POST | `/api/magic-link` | None | Send a magic link to email |
| GET | `/api/me` | Required | Get the current user's profile |
| POST | `/api/complete-profile` | Required | Set username for Google OAuth users |

### Genres — `/api/genres`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/genres` | Required | Get all available genres |

### Interests — `/api/interests`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/interests` | Required | Save a genre interest |
| GET | `/api/interests/me` | Required | Get current user's interests |
| DELETE | `/api/interests/:genre_id` | Required | Remove a genre interest |

### Events — `/api/events`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/events` | Required | Get all approved events |
| GET | `/api/events/recommended` | Required | Get events matching your genres |
| POST | `/api/events` | Required | Create a new event (multipart/form-data) |
| POST | `/api/events/:id/rsvp` | Required | RSVP to an event |
| DELETE | `/api/events/:id/attendees/:userId` | Required (organiser only) | Remove an attendee from your event |

### Matching — `/api/match`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/match` | Required | Get user matches using Jaccard Similarity |

### Notifications — `/api/notifications`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/notifications` | Required | Get your notifications |
| POST | `/api/notifications/read` | Required | Mark a notification as read |

### Complaints — `/api/complaints`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/complaints` | Required | File a complaint about an organiser |

### Admin — `/api/admin`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/events/pending` | Admin | Get all pending events |
| PATCH | `/api/admin/events/:id/approve` | Admin | Approve an event (triggers notifications + emails) |
| PATCH | `/api/admin/events/:id/reject` | Admin | Reject an event |
| GET | `/api/admin/users` | Admin | Get all users |
| PATCH | `/api/admin/users/:id/promote` | Admin | Promote a user to admin |
| GET | `/api/admin/complaints` | Admin | Get all complaints |
| PATCH | `/api/admin/complaints/:id/review` | Admin | Mark a complaint as reviewed |

---

## Usage Instructions

1. **Register** at `/register` using email/password or Google
2. **Select your genres** at `/genres` — choose at least 2 from the available catalogue
3. **Browse events** at `/events` — view approved events or get personalised recommendations
4. **Find matches** at `/matches` — see other users with shared music interests and compatibility scores
5. **Create an event** — click "Create New" on the Events page to submit an event for admin review
6. **Admin moderation** — admin users access `/admin` to approve/reject pending events and manage the platform

---

## Screenshots

> _Screenshots to be added — see `/docs/screenshots/`_

---

## Known Limitations

- The main event listing currently renders placeholder data; full wiring to the live events API is in progress
- Profile editing (name/bio update) is UI-complete but the backend update endpoint is pending implementation
- Cancelling an RSVP (un-registering from an event) is planned but not yet implemented
- Mapbox integration for map-based event location is in progress — backend lat/lng columns are ready, frontend map picker is pending
- The "Event Visibility" (Public/Private) toggle in the create-event form has no backend support yet
- Navbar dark mode and mobile responsive layout are being improved in the next sprint
- Google OAuth is configured but requires the user's Google account to be added as a test user until the app completes Google's verification process

---

## Deployment

### Frontend — Vercel (Recommended)
1. Push the repository to GitHub
2. Connect the repo to [Vercel](https://vercel.com)
3. Set the root directory to `frontend/`
4. Add the environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`)
5. Deploy

### Backend — Railway or Render (Recommended)
1. Connect the repo to [Railway](https://railway.app) or [Render](https://render.com)
2. Set the root directory to `backend/`
3. Add the environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `PORT`)
4. Deploy — the server starts with `npm run dev` (or configure `node index.js` for production)

---

## Contributors

| Name | Role | GitHub |
|---|---|---|
| Victor Imani Mwakisagu | Backend development, API architecture, authentication, all API wiring | [@LPSJ1](https://github.com/LPSJ1) |
| Eric Ghati | Frontend UI design, page layout, component design | [@ericghati](https://github.com/ericghati) |

---

## License

This project is licensed under the MIT License.
