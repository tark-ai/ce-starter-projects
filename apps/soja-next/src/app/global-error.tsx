"use client";

export default function GlobalError({
  reset,
}: {
  error: globalThis.Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f8f7f3", color: "#333333" }}>
        <main style={{ maxWidth: "36rem", padding: "8rem 1.5rem" }}>
          <h1 style={{ font: "300 2rem/110% Georgia, serif", letterSpacing: "-0.05em", margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ marginTop: "1.5rem", font: "400 0.875rem/1.6 Georgia, serif" }}>
            That didn't load as it should. Try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2.5rem",
              height: "3rem",
              padding: "0 2rem",
              border: 0,
              background: "#333333",
              color: "#ffffff",
              font: "400 0.875rem Georgia, serif",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
