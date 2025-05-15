import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ForgotPasswordPage from "../page";
import { useForgotPassword } from "@/app/hooks/auth/use-auth";
import { useRouter } from "next/navigation";

// Mock the hooks and modules
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/hooks/auth/use-auth", () => ({
  useForgotPassword: jest.fn(),
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

describe("ForgotPasswordPage", () => {
  const mockRouter = {
    push: jest.fn(),
  };
  const mockForgotPasswordMutation = {
    mutate: jest.fn(),
    isPending: false,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useForgotPassword as jest.Mock).mockReturnValue(
      mockForgotPasswordMutation
    );
  });

  test("renders forgot password form", () => {
    renderWithClient(<ForgotPasswordPage />);

    expect(screen.getByText("Reset Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send Reset Link" })
    ).toBeInTheDocument();
  });

  test("submits form with email", async () => {
    renderWithClient(<ForgotPasswordPage />);

    const emailInput = screen.getByLabelText("Email address");
    const submitButton = screen.getByRole("button", {
      name: "Send Reset Link",
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    expect(mockForgotPasswordMutation.mutate).toHaveBeenCalledWith(
      { email: "test@example.com" },
      expect.any(Object)
    );
  });

  test("displays loading state during submission", async () => {
    (useForgotPassword as jest.Mock).mockReturnValue({
      ...mockForgotPasswordMutation,
      isPending: true,
    });

    renderWithClient(<ForgotPasswordPage />);

    expect(screen.getByText("Sending...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sending..." })).toBeDisabled();
  });

  test("displays API error message when request fails", async () => {
    const mockError = { message: "Network error. Please try again." };
    (useForgotPassword as jest.Mock).mockReturnValue({
      ...mockForgotPasswordMutation,
      error: mockError,
    });

    renderWithClient(<ForgotPasswordPage />);

    expect(
      screen.getByText("Network error. Please try again.")
    ).toBeInTheDocument();
  });

  test("displays success message after submission", async () => {
    // Setup the success callback to run immediately
    (useForgotPassword as jest.Mock).mockReturnValue({
      ...mockForgotPasswordMutation,
      mutate: jest.fn().mockImplementation((_, options) => {
        if (options && options.onSuccess) {
          options.onSuccess();
        }
      }),
    });

    renderWithClient(<ForgotPasswordPage />);

    const emailInput = screen.getByLabelText("Email address");
    const submitButton = screen.getByRole("button", {
      name: "Send Reset Link",
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Check your email")).toBeInTheDocument();
      expect(
        screen.getByText(/we've sent a password reset link to/i)
      ).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Back to Sign In" })
      ).toBeInTheDocument();
    });
  });

  test("navigates to sign in page when cancel button is clicked", () => {
    renderWithClient(<ForgotPasswordPage />);

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);

    expect(mockRouter.push).toHaveBeenCalledWith("/auth/signin");
  });

  test("allows retrying when try again is clicked on success screen", async () => {
    // Setup initial success state
    (useForgotPassword as jest.Mock).mockReturnValue({
      ...mockForgotPasswordMutation,
      mutate: jest.fn().mockImplementation((_, options) => {
        if (options && options.onSuccess) {
          options.onSuccess();
        }
      }),
    });

    renderWithClient(<ForgotPasswordPage />);

    const emailInput = screen.getByLabelText("Email address");
    const submitButton = screen.getByRole("button", {
      name: "Send Reset Link",
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    // Now we're in success state
    await waitFor(() => {
      expect(screen.getByText("Check your email")).toBeInTheDocument();
    });

    // Now click "try again"
    const tryAgainButton = screen.getByText("try again");
    fireEvent.click(tryAgainButton);

    // Check if mutate was called again
    expect(mockForgotPasswordMutation.mutate).toHaveBeenCalledTimes(2);
  });
});
