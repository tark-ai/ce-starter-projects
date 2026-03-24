<script lang="ts">
let rating = $state(0);
let review = $state("");
let isOpen = $state(false);

function submitReview() {
  isOpen = false;
  rating = 0;
  review = "";
}
</script>

<button
	type="button"
	onclick={() => (isOpen = true)}
	class="w-full h-12 font-light border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
>
	Review product
</button>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<button
			type="button"
			class="absolute inset-0 bg-black/80"
			onclick={() => (isOpen = false)}
			aria-label="Close dialog"
		></button>
		<div class="relative bg-background p-6 w-full max-w-md">
			<h2 class="font-light text-xl mb-6">Review product</h2>
			<div class="space-y-6">
				<fieldset class="space-y-3">
					<legend class="text-sm font-light text-foreground">Rating</legend>
					<div class="flex items-center gap-1">
						{#each [1, 2, 3, 4, 5] as star (star)}
							<button
								type="button"
								onclick={() => (rating = star)}
								class="cursor-pointer"
								aria-label={star <= rating ? 'Filled star' : 'Empty star'}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="w-5 h-5 {star <= rating
										? 'text-foreground'
										: 'text-muted-foreground/30'}"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
										clip-rule="evenodd"
									/>
								</svg>
							</button>
						{/each}
					</div>
				</fieldset>

				<div class="space-y-3">
					<label for="review-textarea" class="text-sm font-light text-foreground">
						Your review
					</label>
					<textarea
						id="review-textarea"
						bind:value={review}
						placeholder="Share your thoughts about this product..."
						class="w-full min-h-24 resize-none font-light border border-border bg-background p-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
					></textarea>
				</div>

				<button
					type="button"
					onclick={submitReview}
					disabled={rating === 0 || review.trim() === ''}
					class="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Submit review
				</button>
			</div>
		</div>
	</div>
{/if}
