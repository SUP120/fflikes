# FF Paid Likes

A modern web application for Free Fire players to purchase profile likes. Built with Next.js, Supabase, and Cashfree payment integration.

## Features

- 🎮 Free Fire profile likes purchasing system
- 💳 Secure payment processing with Cashfree
- 🔒 Safe and reliable delivery system
- ⚡ Multiple package options:
  - Instant Package: 19 likes for ₹50
  - Standard Package: 700 likes for ₹500
  - Premium Package: 1500 likes for ₹1000
- 📱 Responsive modern UI
- 👑 Admin dashboard for order management

## Tech Stack

- Next.js 13 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Database & Auth)
- Cashfree Payment Gateway

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fflikes.git
cd fflikes
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
CASHFREE_APP_ID=your-cashfree-app-id
CASHFREE_SECRET_KEY=your-cashfree-secret-key
CASHFREE_WEBHOOK_URL=your-webhook-url
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses Supabase with the following table structure:

### Orders Table
```sql
create table orders (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  order_id text not null unique,
  name text not null,
  email text not null,
  ff_uid text not null,
  ff_nickname text not null,
  package_type text not null,
  amount integer not null,
  likes_count integer not null,
  status text not null default 'pending'
);
```

## Deployment

The project is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel and add the required environment variables in your project settings.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 