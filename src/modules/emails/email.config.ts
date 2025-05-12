import { registerAs } from "@nestjs/config";

export default registerAs("email", () => ({
  resendApiKey: process.env.RESEND_API_KEY,
  from: process.env.EMAIL_FROM || "Heallink <noreply@heallink.com>",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  adminFrontendUrl: process.env.ADMIN_FRONTEND_URL || "http://localhost:3002",
  passwordResetExpiryMinutes: 30,
}));
