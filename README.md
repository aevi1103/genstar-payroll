# Genstar Payroll

A modern payroll management system built with Next.js 16, Supabase, and Prisma for tracking employee hours, calculating wages, managing deductions, and generating payroll reports.

## Features

- **Employee Time Tracking**: Clock in/out with GPS location tracking and automatic time adjustments
- **Manual Payroll Entry**: Admin capability to manually create/edit payroll entries with validation
- **Payroll Management**: Automated wage calculations with overtime, deductions, and cash advances
- **Weekly Payroll Aggregation**: Organize and track payroll by week with automated weekly summaries
- **Cash Advances**: Track employee cash advances with automatic weekly deductions and payment logs
- **Payroll Deductions**: Manage SSS, PAG-IBIG, and tax deductions on a yearly basis
- **Role-Based Access Control**: Admin and user roles with JWT-based authentication
- **13th Month Pay**: Calculate and track mandatory 13th month compensation
- **Reports & Analytics**: Generate comprehensive payroll reports with PDF export
- **QR Code Clock-In**: Quick employee check-in via dynamically generated QR codes
- **Email Notifications**: Send payroll summaries via email with React Email templates

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Server Actions, React 19)
- **Database**: PostgreSQL via [Prisma ORM](https://www.prisma.io) (dual-schema: `auth` + `public`)
- **Authentication**: [Supabase Auth](https://supabase.com/auth) with custom JWT claims for RBAC
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Forms**: [React Hook Form](https://react-hook-form.com) + [Zod 4](https://zod.dev)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query) (React Query)
- **Date Handling**: [dayjs](https://day.js.org)
- **Email**: [React Email](https://react.email) + Nodemailer
- **PDF Generation**: [@react-pdf/renderer](https://react-pdf.org)
- **Data Grid**: [AG Grid Community](https://www.ag-grid.com)
- **Testing**: [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com)

## Getting Started

### Prerequisites

- Node.js 20+ and pnpm
- PostgreSQL database (or Supabase project)
- Supabase account for authentication

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aevi1103/genstar-payroll.git
cd genstar-payroll
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables (create `.env.local`):
```env
# Database (use pooled connection, port 6543)
DATABASE_URL="postgresql://user:password@host:6543/database"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"  # Server-only
```

4. Initialize the database:
```bash
npx prisma db push
```

5. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
app/
├── api/              # API routes (read operations)
│   ├── admin/        # Admin-only endpoints
│   ├── payroll/      # Payroll history, weekly summary
│   └── email/        # Email sending endpoints
├── auth/             # Authentication pages (login, signup, reset password)
├── payroll/          # Payroll features
│   ├── actions.ts    # Server actions (mutations)
│   ├── entry/        # Manual payroll entry
│   ├── reports/      # Payroll reports & PDF generation
│   ├── settings/     # Admin settings (users, payroll config)
│   ├── deductions/   # SSS, PAG-IBIG, tax management
│   ├── qrcode/       # QR code generation for clock-in
│   └── 13monthpay/   # 13th month pay calculations
components/
├── ui/               # shadcn/ui components
├── app-sidebar.tsx   # Main navigation sidebar
├── login-form.tsx    # Authentication forms
└── ...               # Custom reusable components
features/             # Feature-specific components
├── manual-payroll-entry/  # Payroll entry dialogs
├── cash-advances/         # Cash advance management
├── payroll-deductions/    # Deduction forms
├── payroll-settings/      # Settings forms
├── qr-code/              # QR code generation
├── weekly-history/       # Weekly payroll views
└── 13month/              # 13th month calculations
lib/
├── db/               # Database query utilities
├── schemas/          # Zod validation schemas
├── supabase/         # Supabase client (server/client)
├── session.ts        # Session & role extraction
├── routes.ts         # Route definitions with RBAC
├── email/            # Email templates & sending
└── ...               # Utilities
prisma/
├── client.ts         # Prisma singleton with pg connection pooling
└── schema.prisma     # Database schema (dual-schema: auth + public)
emails/
├── payroll-email.tsx # React Email payroll template
└── ...               # Other email templates
```

## Key Patterns

### Server Actions vs API Routes
- **Server Actions** (`app/**/actions.ts`): All mutations (create, update, delete)
- **API Routes** (`app/api/**/route.ts`): Read operations, especially for TanStack Query

### Database Access
Always use the Prisma singleton:
```typescript
import { prisma } from "@/prisma/client";
// Never: new PrismaClient()
```

### Authentication
Use `getSessionWithRole()` for protected routes:
```typescript
import { getSessionWithRole } from "@/lib/session";

const { session, role } = await getSessionWithRole();
if (role !== 'admin') {
  throw new Error('Forbidden');
}
```

### Weekly Payroll Pattern
Always ensure a `user_weekly_payroll` record exists before creating payroll entries:
```typescript
import { getUserWeeklyPayroll } from "@/lib/db/get-user-weekly-payroll";

const weeklyPayroll = await getUserWeeklyPayroll({ 
  userId, 
  weekStart, 
  weekEnd 
});

// Then create payroll with weekly_payroll_id
await prisma.payroll.create({
  data: {
    user_id: userId,
    weekly_payroll_id: weeklyPayroll.id,
    // ... other fields
  }
});
```

### BigInt Serialization
Always serialize BigInt fields for JSON responses:
```typescript
const serializeData = (data: unknown) => 
  JSON.parse(JSON.stringify(data, (_, value) => 
    typeof value === "bigint" ? value.toString() : value
  ));
```

## Database Models

### Core Payroll Models

#### `payroll`
Individual clock-in/out entries with GPS tracking:
- `clock_in_time`, `clock_out_time`: Timestamptz fields for time tracking
- `original_clock_in_time`: Stores original time before adjustments
- `weekly_payroll_id`: Links to weekly aggregation (required)
- `is_manual`: Indicates if entry was manually created by admin
- `gps_location`, `gps_location_clock_out`: GPS coordinates

#### `user_weekly_payroll`
Weekly payroll aggregation and payment tracking:
- `week_start`, `week_end`: Week boundaries (timestamptz)
- `is_paid`: Payment status flag
- `paid_at`: Payment timestamp
- `paid_cash_advance`, `paid_sss`, `paid_pagibig`: Deduction tracking
- `current_cash_advance_balance`: Running cash advance balance
- One-to-many with `payroll` entries

#### `employee_salary`
Employee wage configuration:
- `salary_per_day`: Daily wage rate
- `user_id`: Links to auth.users

#### `cash_advances`
Employee cash advance management:
- `cash_advance`: Total advance amount
- `is_paid`: Payment status
- `paid_amount`: Amount paid back
- Links to `cash_advance_payments_log` for payment history

#### `payroll_deductions`
Yearly deduction records (SSS, PAG-IBIG, tax):
- `sss`, `pag_ibig`, `tax`: Deduction amounts
- `year`: Deduction year (for 13th month calculations)
- One record per user per year

#### `payroll_settings`
Global payroll configuration:
- `working_day_hours_per_week`: Standard hours (e.g., 40)
- `regular_ot_rate_percent`: Overtime multiplier (1.25)
- `weekend_ot_rate`: Weekend OT multiplier (1.3)
- `late_grace_period_minutes`: Grace period before late deduction (5)
- `late_deduction_minutes`: Time deducted when late (30)
- `break_hours`: Daily break duration (1)
- `apply_break_deduction_after_hour`: When to apply break (4)
- `cash_advance_weekly_deduction_percent`: Weekly CA deduction rate (10%)

### User Management Models

#### `user_profiles` (public schema)
Extended user information:
- `first_name`, `last_name`, `middle_name`
- `hire_date`, `position`, `employment_role`
- `phone`, `address`
- `active`: Employment status
- Emergency contact fields
- Links to `auth.users` via `user_id`

#### `user_roles` (public schema)
Role assignments (links to `app_role` enum):
- `admin`: Full access to all features
- `user`: Clock in/out and view own payroll

### Authentication Schema (`auth`)
Managed by Supabase - includes:
- `users`: Core user authentication
- `sessions`, `refresh_tokens`: Session management
- `identities`: OAuth/email identity providers
- Role stored in `app_metadata.role`, exposed as JWT claim

## Database Management

### Applying Schema Changes
```bash
# Development (quick iteration)
npx prisma db push

# Production (with migrations)
npx prisma migrate dev --name your_migration_name
```

### Viewing Data
```bash
npx prisma studio
```

## Setting Up Authentication & RBAC

### Initial Supabase Configuration

1. **Create Supabase Project** at [supabase.com](https://supabase.com)

2. **Configure RBAC** by running this SQL in the Supabase SQL Editor:

```sql
-- Default every new user to "user" role
create or replace function public.handle_new_user()
returns trigger as $$
begin
  update auth.users
  set app_metadata = coalesce(app_metadata, '{}'::jsonb) || jsonb_build_object('role', 'user')
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Expose role as JWT custom claim for RLS
create or replace function auth.jwt_custom_claims()
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'role',
    coalesce((select app_metadata ->> 'role' from auth.users where id = auth.uid()), 'user')
  );
$$;
```

3. **Set Environment Variables** as shown in the Installation section above

### Role Management

- **Default Role**: New users are automatically assigned the `user` role
- **Admin Promotion**: Use the Supabase Dashboard to update `app_metadata.role` to `admin`
- **Role Enforcement**: Roles are extracted from JWT claims via `getSessionWithRole()` in `lib/session.ts`
- **Route Protection**: 
  - User routes: `/payroll` (hours tracking, view own reports)
  - Admin routes: 
    - `/payroll/settings/*` (user management, payroll settings)
    - `/payroll/entry` (manual payroll entry)
    - `/payroll/deductions` (manage SSS, PAG-IBIG, tax)
    - `/payroll/reports` (view all employee reports)

### Important Notes

- Roles are stored in `auth.users.app_metadata.role`
- Roles are exposed as `user_role` in JWT custom claims
- Users must **re-login** after role changes to get updated JWT
- All protected routes/actions use `getSessionWithRole()` for authorization
- Row Level Security (RLS) policies should be configured in Supabase for data protection

## Development Workflows

### Adding a New Form with Server Actions

1. **Create Zod Schema** in `lib/schemas/`:
```typescript
import { z } from "zod";

export const myFormSchema = z.object({
  field1: z.string().min(1, "Required"),
  field2: z.number().positive(),
});

export type MyFormData = z.infer<typeof myFormSchema>;
```

2. **Create Server Action** in `app/{feature}/actions.ts`:
```typescript
"use server";

import { getSessionWithRole } from "@/lib/session";
import { myFormSchema } from "@/lib/schemas/my-form";
import { prisma } from "@/prisma/client";

export async function createMyRecord(data: unknown) {
  const { session, role } = await getSessionWithRole();
  
  if (role !== "admin") {
    throw new Error("Forbidden");
  }
  
  const validated = myFormSchema.parse(data);
  
  await prisma.myTable.create({
    data: {
      ...validated,
      created_by: session.user.email,
    },
  });
  
  revalidatePath("/my-feature");
}
```

3. **Create Form Component** with React Hook Form:
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { myFormSchema, type MyFormData } from "@/lib/schemas/my-form";
import { createMyRecord } from "@/app/my-feature/actions";

export function MyForm() {
  const form = useForm<MyFormData>({
    resolver: zodResolver(myFormSchema),
  });
  
  const onSubmit = async (data: MyFormData) => {
    await createMyRecord(data);
    form.reset();
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields using shadcn/ui Form components */}
      </form>
    </Form>
  );
}
```

### Adding a New API Route with TanStack Query

1. **Create API Route** in `app/api/{feature}/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { getSessionWithRole } from "@/lib/session";
import { prisma } from "@/prisma/client";

export async function GET(request: Request) {
  const { session, role } = await getSessionWithRole();
  
  const data = await prisma.myTable.findMany({
    where: role === "admin" ? {} : { user_id: session.user.id },
  });
  
  // Serialize BigInt fields
  const serialized = JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
  
  return NextResponse.json(serialized);
}
```

2. **Create React Query Hook** in `hooks/use-my-data-query.ts`:
```typescript
import { useQuery } from "@tanstack/react-query";

export function useMyDataQuery() {
  return useQuery({
    queryKey: ["my-data"],
    queryFn: async () => {
      const res = await fetch("/api/my-feature");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });
}
```

### Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

See [TESTING.md](./TESTING.md) for comprehensive testing documentation.

### Working with Email Templates

```bash
# Start email development server
pnpm email:dev
```

Edit templates in `emails/` directory using React Email components.

### Adding a New Feature

1. **Define Data Model** in `prisma/schema.prisma`
2. **Create Server Actions** in `app/{feature}/actions.ts`
3. **Build UI Components** in `features/{feature}/`
4. **Add API Routes** (if needed) in `app/api/{feature}/route.ts`
5. **Create Zod Schemas** in `lib/schemas/{feature}.ts`

### Working with Forms

```typescript
// 1. Define schema (lib/schemas/example.ts)
export const exampleSchema = z.object({
### Adding a New Feature

Follow the patterns established in the codebase:

1. **Plan the feature** - Consider data models, auth requirements, and user flows
2. **Update Prisma schema** if needed - Run `npx prisma db push`
3. **Create database queries** in `lib/db/` for reusable data access
4. **Define Zod schemas** in `lib/schemas/` for validation
5. **Build Server Actions** in `app/{feature}/actions.ts` for mutations
6. **Create API routes** in `app/api/{feature}/route.ts` for reads (if using React Query)
7. **Build UI components** in `features/{feature}/` or `components/`
8. **Add navigation** in `lib/routes.ts` and update `app-sidebar.tsx`
9. **Write tests** for critical business logic
10. **Update documentation** (this README)

### Common Utilities

**Date/Time Handling:**
- `lib/get-week-date-range.ts` - Get week boundaries (Sunday-Saturday)
- `lib/adjust-clock-in-time.ts` - Apply grace period/late deductions
- Always use `dayjs` for date manipulation
- Store all dates as UTC (`timestamptz` in Postgres)

**Data Serialization:**
- `lib/utils/serialize-data.ts` - Handle BigInt serialization for API responses

**Session/Auth:**
- `lib/session.ts` - `getSessionWithRole()` for protected routes
- `lib/supabase/server.ts` - Server-side Supabase client (per-request)
- `lib/supabase/client.ts` - Client-side Supabase client (browser)

## Testing

This project uses **Vitest** with React Testing Library. See [TESTING.md](./TESTING.md) for detailed documentation.

```bash
# Run tests
pnpm test

# Run with UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

### Test Structure
- Tests located in `__tests__/` directories next to source files
- Comprehensive mocking of database calls
- Timezone-aware testing (Asia/Manila UTC+8)
- Type-safe mocks with `vi.mocked()`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` (pooled connection, port 6543)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy automatically on push to main

### Database Migration Strategy

**Development:**
```bash
npx prisma db push  # Quick iteration without migrations
```

**Production:**
```bash
npx prisma migrate dev --name descriptive_name
npx prisma migrate deploy  # In CI/CD
```

### Pre-Deployment Checklist
- ✅ Run `pnpm build` locally to check for build errors
- ✅ Run `pnpm test` to ensure all tests pass
- ✅ Verify environment variables are set
- ✅ Test authentication flows (login, signup, role-based access)
- ✅ Verify database migrations are applied
- ✅ Check BigInt serialization in all API responses
- ✅ Test email sending functionality (if applicable)

## Architecture Decisions

### Why Dual Schema (auth + public)?
- **Separation of Concerns**: Supabase manages `auth` schema, app manages `public`
- **RLS Compatibility**: Allows Supabase Row Level Security on auth tables
- **Migration Safety**: Prevents accidental modification of Supabase-managed tables

### Why Prisma with Supabase Auth?
- **Type Safety**: Full TypeScript types from database schema
- **Developer Experience**: Excellent migrations and introspection
- **Flexibility**: Not locked into Supabase's Postgres extension ecosystem
- **Connection Pooling**: `@prisma/adapter-pg` enables efficient connection management

### Why Server Actions + API Routes?
- **Server Actions**: Mutations with automatic revalidation (`revalidatePath`)
- **API Routes**: Read operations optimized for TanStack Query caching
- **Progressive Enhancement**: Forms work without JavaScript
- **Type Safety**: End-to-end TypeScript with proper error handling

### Why TanStack Query?
- **Caching**: Reduces unnecessary database queries
- **Optimistic Updates**: Better UX for mutations
- **Devtools**: Excellent debugging experience
- **Background Refetching**: Keeps data fresh automatically

## Known Limitations & Gotcas

1. **BigInt Serialization**: All database responses with BigInt IDs must be serialized before returning as JSON
2. **Session Updates**: Users must re-login after role changes (JWT doesn't auto-refresh)
3. **Weekly Payroll**: Always create `user_weekly_payroll` before creating `payroll` entries
4. **Timezone**: All dates stored as UTC, client-side formatting needed for display
5. **Connection Pooling**: Use `DATABASE_URL` with port 6543 (pooled), not direct connection
6. **Prisma Generate**: Run `npx prisma generate` after schema changes or on fresh install

## FAQ

**Q: How do I add a new admin user?**  
A: Use Supabase Dashboard → Authentication → Users → Select user → Update `app_metadata.role` to `"admin"`. User must re-login.

**Q: Why are my API routes returning 500 errors?**  
A: Check if you're serializing BigInt fields. Use the serialization utility for all database responses.

**Q: How do I change payroll settings?**  
A: Admin users can access `/payroll/settings/payroll` to update global payroll configuration.

**Q: Can users edit their own payroll entries?**  
A: No, only admins can create/edit payroll entries via `/payroll/entry`. Users can only view their own data.

**Q: How is overtime calculated?**  
A: Based on `payroll_settings`: weekday OT uses `regular_ot_rate_percent` (1.25x), weekend OT uses `weekend_ot_rate` (1.3x).

**Q: How do cash advances work?**  
A: Admins create cash advances in `/payroll/settings/cash-advances`. Weekly deductions are automatically calculated based on `cash_advance_weekly_deduction_percent` setting.

## Contributing

1. Fork or create a feature branch from `main`
2. Follow the established patterns and conventions
3. Write tests for business logic
4. Ensure `pnpm build` and `pnpm test` pass
5. Submit a pull request with a clear description

### Code Style Guidelines
- Use TypeScript strict mode
- Prefer `const` over `let`, avoid `var`
- Use functional components and hooks
- Follow shadcn/ui component patterns
- Use Zod for all input validation
- Document complex business logic with comments

## License

Private - Genstar Corporation

## Support

For issues or questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check [TESTING.md](./TESTING.md) for testing documentation

---

**Last Updated**: January 2026  
**Next.js Version**: 16.1.1  
**React Version**: 19.2.3  
**Prisma Version**: 7.2.0
