<script lang="ts">
import { type SojaRoute, routeToHref } from "$lib/soja-routing";
import { cn } from "$lib/utils";

interface Props {
  label: string;
  route: SojaRoute;
  class?: string;
}

let { label, route, class: className = "" }: Props = $props();
</script>

<a
	href={routeToHref(route)}
	class={cn(
		"group inline-flex items-center gap-2 text-meta transition-opacity duration-300 ease-soja hover:opacity-60",
		className
	)}
>
	{label}
	<span
		aria-hidden="true"
		class="h-1.5 w-1.5 bg-current transition-transform duration-500 ease-soja group-hover:translate-x-1"
	></span>
</a>
