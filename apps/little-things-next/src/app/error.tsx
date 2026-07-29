"use client";

export default function ErrorPage({
  reset,
}: {
  error: globalThis.Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-4">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mb-8 font-light">
          Well, this is awkward. Try again and we'll pretend this never happened.
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-block border border-foreground px-8 py-3 text-sm tracking-widest uppercase text-foreground hover:bg-foreground hover:text-background transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
