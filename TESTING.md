# Testing Documentation

## Overview
This project uses **Vitest** as the testing framework with React Testing Library for component testing.

## Test Setup

### Installed Dependencies
- `vitest` - Fast unit test framework
- `@vitest/ui` - Web UI for test visualization
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom matchers for DOM assertions
- `happy-dom` - Lightweight DOM implementation for tests
- `@vitejs/plugin-react` - Vite React plugin for JSX support

### Configuration Files
- `vitest.config.ts` - Main Vitest configuration
- `vitest.setup.ts` - Global test setup (jest-dom matchers)

## Running Tests

### Commands
```bash
# Run tests in watch mode
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage

# Run tests once (CI mode)
pnpm test -- --run
```

## Test Structure

### Example: `lib/__tests__/adjust-clock-in-time.test.ts`

This test file demonstrates comprehensive testing practices:

1. **Mocking Dependencies**
   - Uses `vi.mock()` to mock database calls
   - Mocks `getPayrollSettingsData` from DB layer

2. **Test Organization**
   - Grouped by functionality using `describe` blocks
   - Clear test descriptions with `it` statements
   - Covers edge cases and boundary conditions

3. **Test Coverage Areas**
   - Early clock-in scenarios
   - On-time clock-in (within grace period)
   - Late clock-in logic
   - Very late clock-in (beyond thresholds)
   - Custom payroll settings
   - Edge cases (midnight, timezone handling)
   - Return value structure validation

4. **Best Practices**
   - `beforeEach` for test isolation
   - `afterEach` for cleanup
   - Type-safe mocking with `vi.mocked()`
   - Timezone-aware testing with dayjs

## Writing New Tests

### Basic Test Template
```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("MyFunction", () => {
  beforeEach(() => {
    // Setup code
    vi.clearAllMocks();
  });

  it("should do something", () => {
    // Arrange
    const input = "test";
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe("expected");
  });
});
```

### Mocking Database Calls
```typescript
vi.mock("../db/my-query", () => ({
  myQuery: vi.fn(),
}));

// In your test
const mockMyQuery = vi.mocked(myQuery);
mockMyQuery.mockResolvedValue({ data: "mocked" });
```

## Test Files Location
All test files should be placed in `__tests__` directories next to the code they test:
```
lib/
  adjust-clock-in-time.ts
  __tests__/
    adjust-clock-in-time.test.ts
```

## Notes
- All BigInt values from Prisma need to be converted to regular numbers or strings in mocks
- Timezone testing uses `Asia/Manila` (UTC+8) to match production
- Database mocks should match the actual Prisma schema types
