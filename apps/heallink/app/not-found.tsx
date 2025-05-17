import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <span className="text-4xl text-red-500">404</span>
        </div>

        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>

        <p className="text-muted-foreground mb-8">
          Sorry, the page you are looking for doesn&apos;t exist or has been
          moved.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span>Back to Home</span>
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center py-2 px-4 rounded-lg border border-border hover:bg-muted/20 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
