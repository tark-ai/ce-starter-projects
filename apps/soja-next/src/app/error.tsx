"use client";

export default function ErrorPage({
  reset,
}: {
  error: globalThis.Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="soja-container py-32 tablet:py-48">
      <h1 className="font-display text-[2rem] tracking-display tablet:text-display">
        Something went wrong
      </h1>
      <p className="mt-6 max-w-[420px] text-meta leading-relaxed text-muted-foreground">
        That didn't load as it should. Try again in a moment.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-10 h-12 bg-primary px-8 text-meta text-primary-foreground transition-colors duration-300 ease-soja hover:bg-primary-hover"
      >
        Try again
      </button>
    </main>
  );
}
