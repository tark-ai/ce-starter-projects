<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "$lib/utils";

interface Props {
  children: Snippet;
  delay?: number;
  class?: string;
  as?: "div" | "section" | "li" | "article";
}

let { children, delay = 0, class: className = "", as = "div" }: Props = $props();

let node = $state<HTMLElement | null>(null);
let shown = $state(false);

$effect(() => {
  if (!node || shown) return;

  // Older browsers: show at once rather than staying blank.
  if (typeof IntersectionObserver === "undefined") {
    shown = true;
    return;
  }

  // Anything already on screen reveals synchronously; the observer's first
  // callback is async, which would leave above-the-fold content invisible.
  const rect = node.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    shown = true;
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        shown = true;
        observer.disconnect();
      }
    },
    { rootMargin: "0px 0px -12% 0px" }
  );

  observer.observe(node);
  return () => observer.disconnect();
});

const classes = $derived(
  cn(
    "transition-[opacity,transform] duration-[1100ms] ease-soja motion-reduce:transition-none",
    shown ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0",
    className
  )
);
const style = $derived(shown && delay ? `transition-delay:${delay}ms` : undefined);
</script>

<svelte:element this={as} bind:this={node} data-reveal class={classes} {style}>
	{@render children()}
</svelte:element>
