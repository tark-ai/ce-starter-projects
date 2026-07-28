import { Toaster as Sonner } from "@ce/little-things-ui/components/ui/sonner";
import { Toaster } from "@ce/little-things-ui/components/ui/toaster";

// Rendered exactly once, from Layout.astro. Every island wraps its own
// <Providers>, so rendering the toasters there would mount them multiple times
// per page — with sonner's global event bus a single toast.error() would fire
// duplicate toasts. Both toasters read from module-level stores/buses, so they
// need no provider context and belong in a single dedicated island.
export default function Toasts() {
  return (
    <>
      <Toaster />
      <Sonner />
    </>
  );
}
