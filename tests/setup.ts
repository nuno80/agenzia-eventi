import { vi } from "vitest";
import { jest } from "@jest/globals";

// Mock per Clerk auth
vi.mock("@clerk/nextjs/server", () => ({
  currentUser: vi.fn(),
  auth: vi.fn(),
}));

// Mock per Next.js cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

// Mock per database
vi.mock("@/lib/db", () => ({
  getDbInstance: vi.fn(),
}));

// Mock per role utilities
vi.mock("@/lib/auth/role-utils", () => ({
  isAdminUser: vi.fn(() => true),
  requireUser: vi.fn(),
  requireAdmin: vi.fn(),
}));

// Setup global test environment
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock di ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock di IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Setup test timeout
vi.setConfig({
  testTimeout: 10000,
});

// Global test utilities
declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      toBeInTheDocument(): T;
      toBeVisible(): T;
      toHaveClass(className: string): T;
      toHaveTextContent(text: string | RegExp): T;
    }
  }
}

// Custom matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null && received !== undefined;
    return {
      message: () => `expected element ${pass ? "not " : ""}to be in the document`,
      pass,
    };
  },
  toBeVisible(received) {
    if (!received) return { message: () => `element is null`, pass: false };
    
    const style = window.getComputedStyle(received);
    const isVisible = style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
    
    return {
      message: () => `expected element ${isVisible ? "not " : ""}to be visible`,
      pass: isVisible,
    };
  },
  toHaveClass(received, className) {
    const pass = received && received.classList?.contains(className);
    return {
      message: () => `expected element ${pass ? "not " : ""}to have class ${className}`,
      pass: Boolean(pass),
    };
  },
  toHaveTextContent(received, text) {
    const content = received?.textContent || "";
    const pass = typeof text === "string" ? content.includes(text) : text.test(content);
    return {
      message: () => `expected element to have text content ${pass ? "not " : ""}containing ${text}`,
      pass,
    };
  },
});

// Clean environment reset
afterEach(() => {
  vi.clearAllMocks();
});
