# Genstar Payroll

A modern payroll management system built with Next.js 16, Supabase, and Prisma for tracking employee hours, calculating wages, managing deductions, and generating payroll reports.

## Features

- **Employee Time Tracking**: Clock in/out with GPS location tracking
- **Payroll Management**: Automated wage calculations with overtime, deductions, and cash advances
- **Weekly Payroll Aggregation**: Organize and track payroll by week
- **Role-Based Access Control**: Admin and user roles with JWT-based authentication
- **13th Month Pay**: Calculate and track mandatory 13th month compensation
- **Reports & Analytics**: Generate comprehensive payroll reports
- **QR Code Clock-In**: Quick employee check-in via QR codes

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Database**: PostgreSQL via [Prisma ORM](https://www.prisma.io) (dual-schema: `auth` + `public`)
- **Authentication**: [Supabase Auth](https://supabase.com/auth) with custom JWT claims
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Forms**: [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Date Handling**: [dayjs](https://day.js.org)

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
├── api/              # API routes (GET operations)
├── auth/             # Authentication pages
├── payroll/          # Payroll features
│   ├── actions.ts    # Server actions (mutations)
│   ├── entry/        # Manual payroll entry
│   ├── reports/      # Payroll reports
│   └── settings/     # Admin settings
components/
├── ui/               # shadcn/ui components
└── ...               # Custom components
features/             # Feature-specific components
lib/
├── db/               # Database query utilities
├── schemas/          # Zod validation schemas
├── supabase/         # Supabase client configuration
└── ...               # Utilities
prisma/
├── client.ts         # Prisma singleton with connection pooling
└── schema.prisma     # Database schema
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

### BigInt Serialization
Always serialize BigInt fields for JSON responses:
```typescript
const serializeData = (data: unknown) => 
  JSON.parse(JSON.stringify(data, (_, value) => 
    typeof value === "bigint" ? value.toString() : value
  ));
```

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
  - User routes: `/payroll` (hours tracking, reports)
  - Admin routes: `/payroll/settings/*` (user management, payroll settings)

### Important Notes

- Roles are stored in `auth.users.app_metadata.role`
- Roles are exposed as `user_role` in JWT custom claims
- Users must **re-login** after role changes to get updated JWT
- All protected routes use `getSessionWithRole()` for authorization

## Development Workflows

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
  field: z.string().min(1),
});

// 2. Create server action (app/feature/actions.ts)
"use server";
export async function submitExample(data: z.infer<typeof exampleSchema>) {
  const validated = exampleSchema.parse(data);
  // ... database operations
}

// 3. Use in component with react-hook-form
const form = useForm<z.infer<typeof exampleSchema>>({
  resolver: zodResolver(exampleSchema),
});
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables Checklist
- ✅ `DATABASE_URL` (use pooled connection, port 6543)
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

## Contributing

1. Create a feature branch
2. Make your changes following project conventions
3. Test thoroughly
4. Submit a pull request

## License

Private - Genstar Corporation

## Support

For issues or questions, contact the development team or create an issue in the repository.
