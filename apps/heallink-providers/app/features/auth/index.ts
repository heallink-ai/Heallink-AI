// Public exports for the auth feature
// Page components (full page layouts)
export { LoginPage } from './containers/LoginPage';
export { SignupPage } from './containers/SignupPage';
export { VerifyOTPPage } from './containers/VerifyOTPPage';

// Form containers (business logic wrappers)
export { LoginFormContainer } from './containers/LoginFormContainer';
export { SignupFormContainer } from './containers/SignupFormContainer';

// Presentation components
export { LoginForm } from './components/LoginForm';
export { SignupForm } from './components/SignupForm';

// Shared components
export { LogoSection } from './components/LogoSection';
export { ThemeToggle } from './components/ThemeToggle';

// Hooks and services
export { useAuth } from './hooks/useAuth';
export { authService } from './services/auth.service';

// Types
export type { AuthMode, Provider, AuthState } from './types/auth.types';