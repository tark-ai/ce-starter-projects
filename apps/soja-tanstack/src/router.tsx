import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { routeTree } from "./routeTree.gen";

function DefaultErrorComponent() {
  return (
    <main className="soja-container py-32 tablet:py-48">
      <h1 className="font-display text-[2rem] tracking-display tablet:text-display">
        Something went wrong
      </h1>
      <p className="mt-6 max-w-[420px] text-meta leading-relaxed text-muted-foreground">
        That didn't load as it should. Try again in a moment.
      </p>
      <a
        href="/"
        className="mt-10 inline-flex items-center gap-2 text-meta transition-opacity duration-300 ease-soja hover:opacity-60"
      >
        Return home
        <span aria-hidden className="h-1.5 w-1.5 bg-current" />
      </a>
    </main>
  );
}

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000 } },
  });

  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      scrollRestoration: true,
      context: { queryClient },
      defaultPreload: "intent",
      defaultErrorComponent: DefaultErrorComponent,
    }),
    queryClient
  );
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
