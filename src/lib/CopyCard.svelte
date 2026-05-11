<script lang="ts">
	import { copyToClipboard } from '$lib/store';

	let { label, value, ondelete, compact = false }: {
		label: string;
		value: string;
		ondelete?: () => void;
		compact?: boolean;
	} = $props();

	let copied = $state(false);
	let timeout: ReturnType<typeof setTimeout>;

	async function handleCopy() {
		const ok = await copyToClipboard(value);
		if (ok) {
			copied = true;
			clearTimeout(timeout);
			timeout = setTimeout(() => (copied = false), 1200);
		}
	}
</script>

<button
	class="card bg-base-200 hover:bg-base-300 border border-base-content/5 transition-all duration-200 cursor-pointer group text-left w-full active:scale-[0.98] {compact ? 'p-3' : 'p-4'}"
	onclick={handleCopy}
	title="Click to copy"
>
	<div class="flex items-start justify-between gap-3">
		<div class="min-w-0 flex-1">
			<p class="text-xs font-medium uppercase tracking-wider text-base-content/40 mb-1">{label}</p>
			<p class="text-sm text-base-content font-medium whitespace-pre-wrap break-all">{value}</p>
		</div>
		<div class="flex items-center gap-1 shrink-0 pt-0.5">
			{#if copied}
				<span class="badge badge-success badge-sm gap-1 font-medium">
					<svg xmlns="http://www.w3.org/2000/svg" class="size-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
					Copied
				</span>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-base-content/30 group-hover:text-base-content/60 transition-colors" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
			{/if}
			{#if ondelete}
				<button
					class="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity text-error"
					onclick={(e: MouseEvent) => { e.stopPropagation(); ondelete?.(); }}
					title="Delete"
				>✕</button>
			{/if}
		</div>
	</div>
</button>
