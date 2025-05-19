// Export all hooks and utilities from the react-query folder

// Export query client singleton
export { queryClient } from "./client";

// Export auth hooks
export * from "./auth-hooks";

// Export API hooks
export * from "./api-hooks";

// Export provider (optional, usually imported directly)
export { default as ReactQueryProvider } from "./provider";
