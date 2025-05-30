// Types
export * from "./types/admin.types";

// Services
export { adminService } from "./services/admin.service";

// Hooks
export * from "./hooks/use-admin-queries";

// Presentation Components
export { default as AdminListPresentation } from "./components/AdminListPresentation";
export { default as AdminFormPresentation } from "./components/AdminFormPresentation";
export { default as AdminViewPresentation } from "./components/AdminViewPresentation";

// Container Components
export { default as AdminListContainer } from "./containers/AdminListContainer";
export { default as AdminFormContainer } from "./containers/AdminFormContainer";
export { default as AdminViewContainer } from "./containers/AdminViewContainer";

// Legacy components (backward compatibility)
export { default as AdminTable } from "./components/AdminTable";
export { default as AdminForm } from "./components/AdminForm";
export { default as AdminManagementContainer } from "./containers/AdminManagementContainer";
