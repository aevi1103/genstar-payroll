# Testing Documentation

## Overview
This project uses **Vitest** as the testing framework with React Testing Library for component testing. Vitest is a fast, modern test runner built for Vite-based projects with first-class TypeScript support.

## Test Setup

### Installed Dependencies
- `vitest` - Fast unit test framework powered by Vite
- `@vitest/ui` - Web-based UI for test visualization and debugging
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom DOM matchers (toBeInTheDocument, toHaveClass, etc.)
- `happy-dom` - Lightweight DOM implementation for tests (faster than jsdom)
- `@vitejs/plugin-react` - Vite React plugin for JSX/TSX support

### Configuration Files
- **`vitest.config.ts`** - Main Vitest configuration with React plugin, happy-dom environment, and path aliases
- **`vitest.setup.ts`** - Global test setup that imports jest-dom matchers for all tests

## Running Tests

### Available Commands

```bash
# Run tests in watch mode (recommended for development)
pnpm test

# Run tests with interactive web UI
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage

# Run tests once without watch mode (CI/CD mode)
pnpm test -- --run

# Run specific test file
pnpm test lib/__tests__/adjust-clock-in-time.test.ts

# Run tests matching a pattern
pnpm test -- --grep="clock-in"
```

### Test UI Features
The Vitest UI (`pnpm test:ui`) provides:
- Interactive test exploration
- Real-time test execution
- Coverage visualization
- Module graph inspection
- Test failure debugging

## Test Structure

### Example: `lib/__tests__/adjust-clock-in-time.test.ts`

This test file demonstrates comprehensive testing best practices:

#### 1. **Mocking Dependencies**
```typescript
// Mock database calls to isolate unit under test
vi.mock("../db/get-payroll-settings-data", () => ({
  getPayrollSettingsData: vi.fn(),
}));

// Create typed mock for better IDE support
const mockGetPayrollSettings = vi.mocked(getPayrollSettingsData);
```

#### 2. **Test Organization**
```typescript
describe("adjustClockInTime", () => {
  beforeEach(() => {
    // Reset mocks before each test for isolation
    vi.clearAllMocks();
    
    // Set default mock implementation
    mockGetPayrollSettings.mockResolvedValue({
      late_grace_period_minutes: 5,
      late_deduction_minutes: 30,
    });
  });

  it("should apply grace period for early clock-in", () => {
    // Test implementation
  });
});
```

#### 3. **Test Coverage Areas**
- ✅ Early clock-in scenarios (before shift start)
- ✅ On-time clock-in (within grace period)
- ✅ Late clock-in logic (beyond grace period)
- ✅ Very late clock-in (beyond deduction threshold)
- ✅ Custom payroll settings variations
- ✅ Edge cases (midnight transitions, timezone handling)
- ✅ Return value structure validation

#### 4. **Best Practices Demonstrated**
- **Test Isolation**: `beforeEach` and `afterEach` for cleanup
- **Type Safety**: `vi.mocked()` for typed mocks
- **Descriptive Names**: Clear `it` statements describing expected behavior
- **Timezone Awareness**: Tests use `Asia/Manila` (UTC+8) to match production
- **Arrange-Act-Assert**: Clear separation in each test
- **Edge Case Coverage**: Boundary conditions and unusual inputs

## Writing New Tests

### Basic Test Template

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("MyFunction", () => {
  beforeEach(() => {
    // Setup code - runs before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup code - runs after each test
    vi.restoreAllMocks();
  });

  it("should perform expected behavior", () => {
    // Arrange - Setup test data
    const input = "test";
    
    // Act - Execute the function
    const result = myFunction(input);
    
    // Assert - Verify the result
    expect(result).toBe("expected");
  });
});
```

### Mocking Database Calls

```typescript
// 1. Mock the module at the top of the file
vi.mock("../db/my-query", () => ({
  myQuery: vi.fn(),
}));

// 2. Import the mock and the actual module
import { myQuery } from "../db/my-query";
const mockMyQuery = vi.mocked(myQuery);

// 3. In your test, set the mock implementation
describe("MyFeature", () => {
  beforeEach(() => {
    mockMyQuery.mockResolvedValue({ 
      id: 1, 
      data: "mocked" 
    });
  });

  it("should use mocked data", async () => {
    const result = await myFunction();
    
    expect(mockMyQuery).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ id: 1, data: "mocked" });
  });
});
```

### Testing React Components

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("should render correctly", () => {
    render(<MyComponent title="Test" />);
    
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("should handle button click", () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole("button"));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Async Functions

```typescript
it("should handle async operations", async () => {
  const mockFetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve({ data: "test" }),
  });
  
  global.fetch = mockFetch;
  
  const result = await fetchData();
  
  expect(mockFetch).toHaveBeenCalled();
  expect(result).toEqual({ data: "test" });
});
```

### Testing Error Handling

```typescript
it("should throw error for invalid input", () => {
  expect(() => {
    myFunction(null);
  }).toThrow("Invalid input");
});

it("should handle async errors", async () => {
  mockQuery.mockRejectedValue(new Error("Database error"));
  
  await expect(myAsyncFunction()).rejects.toThrow("Database error");
});
```

## Test Files Organization

All test files should be placed in `__tests__` directories next to the code they test:

```
lib/
├── adjust-clock-in-time.ts
├── get-week-date-range.ts
└── __tests__/
    ├── adjust-clock-in-time.test.ts
    └── get-week-date-range.test.ts

features/
└── manual-payroll-entry/
    ├── manual-payroll-form.tsx
    └── __tests__/
        └── manual-payroll-form.test.tsx
```

### File Naming Conventions
- Test files: `*.test.ts` or `*.test.tsx`
- Test directories: `__tests__/`
- Mirror the source file name with `.test` suffix

## Common Testing Patterns

### Testing with Prisma

```typescript
import { prisma } from "@/prisma/client";

// Mock Prisma client
vi.mock("@/prisma/client", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// In tests
const mockPrisma = vi.mocked(prisma);

it("should create user", async () => {
  mockPrisma.user.create.mockResolvedValue({
    id: "123",
    email: "test@example.com",
  });
  
  const user = await createUser({ email: "test@example.com" });
  
  expect(mockPrisma.user.create).toHaveBeenCalledWith({
    data: { email: "test@example.com" },
  });
});
```

### Testing with BigInt

When working with database models that use BigInt (common with Prisma):

```typescript
it("should handle BigInt values", () => {
  const mockData = {
    id: 1n,  // BigInt literal
    value: BigInt(100),
  };
  
  // Convert to number for assertions
  expect(Number(mockData.id)).toBe(1);
  
  // Or serialize as done in production
  const serialized = JSON.parse(
    JSON.stringify(mockData, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
  
  expect(serialized.id).toBe("1");
});
```

### Testing with Dates/Timezones

```typescript
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

it("should handle timezone correctly", () => {
  // Use Asia/Manila to match production
  const date = dayjs.tz("2024-01-15 09:00", "Asia/Manila");
  
  expect(date.format()).toBe("2024-01-15T09:00:00+08:00");
});
```

### Testing Server Actions

```typescript
import { createPayrollEntry } from "@/app/payroll/actions";
import { getSessionWithRole } from "@/lib/session";

vi.mock("@/lib/session");
const mockGetSession = vi.mocked(getSessionWithRole);

it("should require admin role", async () => {
  mockGetSession.mockResolvedValue({
    session: { user: { id: "123" } },
    role: "user",
  });
  
  await expect(
    createPayrollEntry({ /* data */ })
  ).rejects.toThrow("Forbidden");
});
```

### Testing React Query Hooks

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { usePayrollHistoryQuery } from "@/hooks/use-payroll-history-query";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

it("should fetch payroll history", async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([{ id: "1", hours: 8 }]),
  });
  
  const { result } = renderHook(() => usePayrollHistoryQuery(), {
    wrapper: createWrapper(),
  });
  
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  
  expect(result.current.data).toHaveLength(1);
});
```

## Coverage Reports

Generate coverage reports to identify untested code:

```bash
pnpm test:coverage
```

Coverage thresholds can be configured in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
      ],
      // Optional: enforce coverage thresholds
      // statements: 80,
      // branches: 80,
      // functions: 80,
      // lines: 80,
    },
  },
});
```

Coverage reports are generated in `coverage/` directory.

## Testing Best Practices

### Do's ✅

1. **Write descriptive test names** - Test names should describe what is being tested and expected outcome
2. **Test one thing per test** - Keep tests focused and atomic
3. **Use AAA pattern** - Arrange, Act, Assert for clear test structure
4. **Mock external dependencies** - Database, API calls, external services
5. **Test edge cases** - Null, undefined, empty strings, boundary values
6. **Clean up after tests** - Use `afterEach` to restore mocks and state
7. **Use type-safe mocks** - `vi.mocked()` for better TypeScript support
8. **Test error paths** - Don't just test happy paths
9. **Keep tests independent** - Tests should not depend on each other's state
10. **Use meaningful assertions** - Prefer specific matchers over generic `toBe`

### Don'ts ❌

1. **Don't test implementation details** - Focus on behavior, not internals
2. **Don't write overly complex tests** - If test is complex, function might need refactoring
3. **Don't rely on test execution order** - Tests should run independently
4. **Don't mock everything** - Only mock external dependencies and side effects
5. **Don't ignore failing tests** - Fix or remove broken tests immediately
6. **Don't test third-party libraries** - Trust well-tested libraries
7. **Don't use real database connections** - Always mock database calls in unit tests
8. **Don't forget to restore mocks** - Use `vi.clearAllMocks()` or `vi.restoreAllMocks()`

## Common Vitest Matchers

```typescript
// Basic matchers
expect(value).toBe(expected);           // Strict equality (===)
expect(value).toEqual(expected);        // Deep equality
expect(value).toBeTruthy();             // Truthy value
expect(value).toBeFalsy();              // Falsy value
expect(value).toBeNull();               // null
expect(value).toBeUndefined();          // undefined

// Numbers
expect(number).toBeGreaterThan(3);
expect(number).toBeLessThan(5);
expect(number).toBeCloseTo(4.2, 1);     // Floating point precision

// Strings
expect(string).toMatch(/pattern/);
expect(string).toContain("substring");

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Objects
expect(obj).toHaveProperty("key");
expect(obj).toMatchObject({ key: "value" });

// Functions
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledTimes(2);
expect(fn).toHaveBeenCalledWith(arg1, arg2);

// Promises
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow(error);

// DOM (from @testing-library/jest-dom)
expect(element).toBeInTheDocument();
expect(element).toHaveClass("className");
expect(element).toHaveTextContent("text");
expect(input).toHaveValue("value");
```

## Debugging Tests

### Using Console Logs

```typescript
it("should debug test", () => {
  const value = myFunction();
  console.log("Debug value:", value);  // Appears in terminal
  expect(value).toBe(expected);
});
```

### Using Vitest UI

```bash
pnpm test:ui
```

The UI provides:
- Test execution timeline
- Stack traces for failures
- Module dependency graph
- Real-time test watching

### Using Debugger

Add `debugger` statement in your test:

```typescript
it("should debug with breakpoint", () => {
  debugger;  // Execution pauses here
  const result = myFunction();
  expect(result).toBe(expected);
});
```

Run with Node inspector:

```bash
node --inspect-brk ./node_modules/.bin/vitest --run
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm test -- --run
      - run: pnpm test:coverage
      
      # Upload coverage to Codecov (optional)
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

## Resources

- [Vitest Documentation](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Jest-DOM](https://github.com/testing-library/jest-dom)
- [Happy DOM](https://github.com/capricorn86/happy-dom)

## Important Notes

- All BigInt values from Prisma must be converted to regular numbers or strings in test mocks
- Timezone testing uses `Asia/Manila` (UTC+8) to match production environment
- Database mocks should match the actual Prisma schema types for type safety
- Always clean up mocks between tests using `beforeEach(() => vi.clearAllMocks())`
- React component tests require a test environment with DOM support (happy-dom is configured)

## Getting Help

If you encounter testing issues:

1. Check the [Vitest documentation](https://vitest.dev)
2. Review existing test files for patterns
3. Run tests with `--reporter=verbose` for detailed output
4. Use Vitest UI (`pnpm test:ui`) for visual debugging
5. Ask the development team or create an issue

---

**Last Updated**: January 2026  
**Vitest Version**: 4.0.16  
**React Testing Library**: 16.3.1
