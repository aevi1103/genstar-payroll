# Genstar Payroll - AI Coding Agent Instructions

## Project Overview
Next.js 16 payroll management system with Supabase Auth, PostgreSQL via Prisma, and shadcn/ui. Tracks employee hours, calculates wages, handles deductions, cash advances, and generates reports.

## Architecture Fundamentals

### Database & Authentication
- **Dual-schema Prisma setup**: `auth` schema (Supabase managed) + `public` schema (app data)
- **Connection pooling**: Use `DATABASE_URL` (pooled, port 6543) with `@prisma/adapter-pg` and `pg.Pool`
- **Prisma singleton pattern**: Import from `@/prisma/client`, never instantiate directly
- **Session management**: Always use `getSessionWithRole()` from `lib/session.ts` - it extracts role from JWT `user_role` claim
- **Role-based access**: Roles stored in `app_metadata.role` (admin/user), exposed as JWT custom claims

### Key Data Models
- **user_weekly_payroll**: Aggregates payroll records by week - always query/create via `getUserWeeklyPayroll()`
- **payroll**: Individual clock-in/out entries linked to weekly payroll via `weekly_payroll_id`
- **cash_advances**: Track employee cash advances with `is_paid` flag
- **payroll_deductions**: Yearly SSS, PAG-IBIG, tax deductions (one record per user per year)
- **payroll_settings**: Global config (OT rates, grace periods, break hours, deduction percentages)

### Business Logic Flows

**Clock-In/Out Flow** (`app/payroll/entry/actions.ts`):
1. Check user is active employee (`isActiveEmployee()`)
2. Get/create weekly payroll record (`getUserWeeklyPayroll()`)
3. Find today's payroll record by `clock_in_date`
4. If no record: create with `clock_in_time` and `weekly_payroll_id`
5. If record exists without clock-out: update with `clock_out_time`
6. Prevent double clock-out or clock-out within 1 minute of clock-in

**Weekly Payroll Calculation**:
- Calculate hours worked from `clock_in_time` to `clock_out_time`
- Apply break deductions based on `payroll_settings.apply_break_deduction_after_hour`
- Calculate OT: weekday uses `regular_ot_rate_percent` (1.25x), weekend uses `weekend_ot_rate` (1.3x)
- Deduct cash advances automatically at `cash_advance_weekly_deduction_percent` (default 10%)
- Apply SSS, PAG-IBIG, tax from yearly `payroll_deductions`

### Server/Client Boundaries
- **Server Actions**: All mutations in `app/**/actions.ts` files with `"use server"` directive
- **API Routes**: Read operations in `app/api/**/route.ts` (e.g., `GET /api/payroll/history`)
- **Client Components**: Data fetching via TanStack Query (`@tanstack/react-query`) - see `hooks/use-payroll-history-query.ts`
- **Supabase Clients**: 
  - Server: `lib/supabase/server.ts` (creates per-request client with cookie handling)
  - Client: `lib/supabase/client.ts` (browser client for auth UI)

## Critical Patterns

### Authorization Pattern
```typescript
// Standard pattern for protected server actions/routes
const { session, role } = await getSessionWithRole();
if (role !== 'admin') {
  throw new Error('Forbidden - admin only');
}
```

### Data Serialization
All BigInt fields from Prisma must be serialized to strings for JSON responses:
```typescript
const serializeData = (data: unknown) => 
  JSON.parse(JSON.stringify(data, (_, value) => 
    typeof value === "bigint" ? value.toString() : value
  ));
```

### Weekly Payroll Aggregation
Always ensure a `user_weekly_payroll` record exists before creating payroll entries:
```typescript
const weeklyPayroll = await getUserWeeklyPayroll({ userId, weekStart, weekEnd });
// Then create payroll with weekly_payroll_id: weeklyPayroll.id
```

## Development Workflows

### Running Locally
```bash
pnpm dev  # Runs prisma generate && next dev
```

### Database Changes
1. Modify `prisma/schema.prisma`
2. Run `npx prisma db push` (development) or `npx prisma migrate dev` (production-ready)
3. Prisma Client auto-regenerates on `pnpm dev` or `pnpm build`

### Form Validation
- Zod schemas in `lib/schemas/` (e.g., `manualPayrollEntrySchema`, `payrollSettingsSchema`)
- Integrated with `react-hook-form` via `@hookform/resolvers/zod`

## Project-Specific Conventions

### File Organization
- **Features**: Domain logic in `features/` (e.g., `features/payroll-settings/settings-form.tsx`)
- **DB Queries**: Reusable queries in `lib/db/` (e.g., `get-user-weekly-payroll.ts`)
- **UI Components**: shadcn/ui in `components/ui/`, custom in `components/`

### Naming Conventions
- Prisma models: lowercase_snake_case (e.g., `user_weekly_payroll`)
- React components: PascalCase with feature prefixes (e.g., `ManualPayrollEntryFormDialog`)
- Server actions: camelCase verbs (e.g., `createPayrollEntry`, `updateUserProfile`)

### Date Handling
- **Storage**: Always store as UTC timestamps in PostgreSQL `timestamptz`
- **Computation**: Use `dayjs` for date manipulation (installed)
- **Week ranges**: `lib/get-week-date-range.ts` provides standardized week start/end logic

### Admin vs User Access
- Admin routes: `/payroll/settings/*` (user management, payroll settings)
- User routes: `/payroll` (hours tracking, reports)
- Navigation: `lib/routes.ts` defines nav structure with `isAdmin` flags

## Common Tasks

### Adding a New Protected API Route
1. Create `app/api/{feature}/route.ts`
2. Import `getSessionWithRole` from `lib/session.ts`
3. Check role/session at handler start
4. Return serialized data (handle BigInt)

### Adding a New Form
1. Define Zod schema in `lib/schemas/{name}.ts`
2. Create form component using `react-hook-form` + shadcn Form components
3. Server action in `app/{feature}/actions.ts` with `"use server"`
4. Validate with `schema.parse()` in server action

### Querying Payroll Data
- **Always join** `users.user_profiles` for employee names
- **Always join** `users.employee_salary` for wage calculations
- Include `user_weekly_payroll` for week context
- See `app/api/payroll/history/route.ts` for reference query

**Example Query Pattern**:
```typescript
const data = await prisma.payroll.findMany({
  where: isAdmin ? {} : { user_id: userId },
  include: {
    users: {
      select: {
        id: true,
        email: true,
        user_profiles: {
          select: { first_name: true, last_name: true }
        },
        employee_salary: {
          select: { salary_per_day: true }
        }
      }
    },
    user_weekly_payroll: true
  }
});

// Always serialize before returning
return NextResponse.json(serializeData(data));
```

## Reusable DB Queries

All reusable database queries are in `lib/db/`:
- `get-user-weekly-payroll.ts` - Get or create weekly payroll record
- `get-active-employees.ts` - Fetch active employees only
- `is-active-employee.ts` - Check if user is active
- `get-cash-advances.ts` - Fetch cash advances with balances
- `get-payroll-settings.ts` - Get global payroll configuration
- `get-payroll-deductions.ts` - Fetch yearly deductions

**Pattern**: Create new DB queries here for reusability across features.

## Environment Variables
```env
DATABASE_URL=          # Pooled connection (port 6543)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=  # Server-only, admin operations
```

## Testing with Vitest

### Running Tests
```bash
pnpm test          # Watch mode for development
pnpm test:ui       # Interactive web UI
pnpm test:coverage # Generate coverage report
```

### Test Patterns
- Tests in `__tests__/` directories next to source files (e.g., `lib/__tests__/adjust-clock-in-time.test.ts`)
- Mock database calls with `vi.mock("../db/my-query")` and use `vi.mocked()` for type safety
- **Critical**: All BigInt values in mocks must be converted to numbers/strings
- Timezone testing uses `Asia/Manila` (UTC+8) to match production
- See `lib/__tests__/adjust-clock-in-time.test.ts` for comprehensive mocking examples

### Example Test Structure
```typescript
import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../db/get-payroll-settings", () => ({
  getPayrollSettingsData: vi.fn(),
}));

describe("MyFunction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle expected scenario", async () => {
    // Arrange, Act, Assert pattern
  });
});
```

## Email Development

### Email Templates
- Templates in `emails/` using `@react-email/components`
- Development server: `pnpm email:dev`
- Sending via Nodemailer configured in `lib/email/`
- Example: `emails/payroll-email.tsx` for weekly payroll summaries

## Time Zone & Date Handling

### Critical Date Rules
- **Storage**: All dates stored as UTC in PostgreSQL `timestamptz`
- **Computation**: Use `dayjs` with `Asia/Manila` timezone (`TZ = "Asia/Manila"`)
- **Plugins**: Always extend dayjs: `dayjs.extend(utc)`, `dayjs.extend(timezone)`
- **Clock-in Logic**: `lib/adjust-clock-in-time.ts` applies grace periods and late deductions
- **Week Boundaries**: Use `lib/get-week-date-range.ts` for consistent Sunday-Saturday weeks

### Example Pattern
```typescript
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "Asia/Manila";
const now = dayjs().tz(TZ);
const shiftStart = now.hour(8).minute(0).second(0);
```

## Anti-Patterns to Avoid
- ❌ Don't create Prisma client instances - import singleton from `@/prisma/client`
- ❌ Don't skip BigInt serialization in API responses
- ❌ Don't create payroll entries without first ensuring `user_weekly_payroll` exists
- ❌ Don't use `createClient()` from `lib/supabase/server.ts` globally - it must be per-request
- ❌ Don't check auth in middleware - use `getSessionWithRole()` in route handlers/actions
- ❌ Don't forget to extend dayjs with timezone plugins before date operations
- ❌ Don't hardcode shift start times - they're defined in business logic (8:00 AM default)
