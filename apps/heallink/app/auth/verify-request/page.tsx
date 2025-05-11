export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h1 className="mt-4 text-3xl font-bold">Check your email</h1>
          <p className="mt-2 text-gray-600">
            A sign in link has been sent to your email address.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            If you don't see it in your inbox, please check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
}