# Cheemba Web App (Supabase Demo)

This demo uses **Supabase Auth** (sign-in only), role-based access, an admin portal, Kigali waste bin monitoring, and a traffic-aware shortest path map.

## 1) Supabase setup

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. In **Authentication > Providers > Email**, keep Email enabled.
3. In **Authentication > Email templates / settings**, disable mandatory email confirmations for this demo (or use admin-created users with confirmed email).
4. Copy your project values from **Project Settings > API**:
  - Project URL
  - `anon` key
  - `service_role` key
5. Create a local env file:
  - Copy `.env.example` to `.env.local`
  - Fill in those three values.

## 2) Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 3) Admin login credentials (seeded in app)

- Email: `admin@cheemba.rw`
- Password: `07983846666`

On first admin login attempt, the app auto-seeds this admin account (for demo speed).

## 4) What is live now

- Public app flow is **sign-in only**.
- Admin can create:
  - Waste collection company users
  - Individual household users
- Admin has a dedicated portal with analytics cards.
- Bins page shows multiple Kigali bins and fill levels.
- Bin detail page shows a shortest-route map that avoids marked traffic jam segments.
- Dashboard messaging indicates the platform is live while still developing more modules.

