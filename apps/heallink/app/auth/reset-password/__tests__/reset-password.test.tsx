import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ResetPasswordPage from "../page";
import { useResetPassword } from "@/app/hooks/auth/use-auth";
import { useRouter, useSearchParams } from "next/navigation";

// Mock the hooks and modules
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("@/app/hooks/auth/use-auth", () => ({
  useResetPassword: jest.fn(),
}));

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// Helper to render with React Query provider
function renderWithClient(ui: React.ReactElement) {
  const testQueryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={testQueryClient}>
          {rerenderUi}
        </QueryClientProvider>
      ),
  };
}

describe("ResetPasswordPage", () => {
  const mockRouter = {
    push: jest.fn(),
  };
  const mockSearchParams = {
    get: jest.fn(),
  };
  const mockResetMutation = {
    mutate: jest.fn(),
    isPending: false,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    (useResetPassword as jest.Mock).mockReturnValue(mockResetMutation);

    // Set the token by default
    mockSearchParams.get.mockReturnValue("valid-token");
  });

  test("renders reset password form", () => {
    renderWithClient(<ResetPasswordPage />);

    expect(screen.getByText("Reset Your Password")).toBeInTheDocument();
    expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reset Password" })
    ).toBeInTheDocument();
  });

  test("redirects to forgot password page if no token is provided", () => {
    mockSearchParams.get.mockReturnValue(null);

    renderWithClient(<ResetPasswordPage />);

    expect(mockRouter.push).toHaveBeenCalledWith("/auth/forgot-password");
  });

  test("validates password requirements", async () => {
    renderWithClient(<ResetPasswordPage />);

    const passwordInput = screen.getByLabelText("New Password");
    const confirmInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: "Reset Password" });

    // Test short password
    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.change(confirmInput, { target: { value: "short" } });
    fireEvent.click(submitButton);

    expect(
      screen.getByText("Password must be at least 8 characters")
    ).toBeInTheDocument();

    // Test password without requirements
    fireEvent.change(passwordInput, { target: { value: "longpassword" } });
    fireEvent.change(confirmInput, { target: { value: "longpassword" } });
    fireEvent.click(submitButton);

    expect(
      screen.getByText(
        "Password must include uppercase, lowercase letters, and at least one number or special character"
      )
    ).toBeInTheDocument();

    // Test password mismatch
    fireEvent.change(passwordInput, { target: { value: "ValidPassword123!" } });
    fireEvent.change(confirmInput, {
      target: { value: "DifferentPassword123!" },
    });
    fireEvent.click(submitButton);

    expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
  });

  test("submits form with valid input", async () => {
    renderWithClient(<ResetPasswordPage />);

    const passwordInput = screen.getByLabelText("New Password");
    const confirmInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: "Reset Password" });

    fireEvent.change(passwordInput, { target: { value: "ValidPassword123!" } });
    fireEvent.change(confirmInput, { target: { value: "ValidPassword123!" } });
    fireEvent.click(submitButton);

    expect(mockResetMutation.mutate).toHaveBeenCalledWith(
      { token: "valid-token", newPassword: "ValidPassword123!" },
      expect.any(Object)
    );
  });

  test("displays API error message when reset fails", async () => {
    const mockError = { message: "Invalid or expired reset token" };
    (useResetPassword as jest.Mock).mockReturnValue({
      ...mockResetMutation,
      error: mockError,
    });

    renderWithClient(<ResetPasswordPage />);

    expect(
      screen.getByText("Invalid or expired reset token")
    ).toBeInTheDocument();
  });

  test("displays success message after password reset", async () => {
    // Setup the success callback to run immediately
    (useResetPassword as jest.Mock).mockReturnValue({
      ...mockResetMutation,
      mutate: jest.fn().mockImplementation((_, options) => {
        if (options && options.onSuccess) {
          options.onSuccess();
        }
      }),
    });

    renderWithClient(<ResetPasswordPage />);

    const passwordInput = screen.getByLabelText("New Password");
    const confirmInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: "Reset Password" });

    fireEvent.change(passwordInput, { target: { value: "ValidPassword123!" } });
    fireEvent.change(confirmInput, { target: { value: "ValidPassword123!" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Password Reset Complete")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Sign In" })
      ).toBeInTheDocument();
    });
  });
});
