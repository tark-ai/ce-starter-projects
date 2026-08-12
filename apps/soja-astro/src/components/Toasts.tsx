import { Toaster as Sonner } from "@ce/soja-ui/components/ui/sonner";

// Mounted once from Layout.astro. Every island wraps its own <Providers>, so
// rendering this there would mount it per island and sonner's global bus would
// fire duplicate toasts.
export default function Toasts() {
  return <Sonner />;
}
