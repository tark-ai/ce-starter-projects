import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-background px-6">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold tracking-tight text-foreground">404</h1>
        <p className="mb-6 text-xl font-light text-muted-foreground">
          Well, this page doesn't exist. But plenty of good things do.
        </p>
        <Link
          href="/"
          className="text-sm font-medium text-brand underline transition-opacity hover:opacity-80"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
