<script lang="ts">
	import { onMount } from 'svelte';
	import CopyCard from '$lib/CopyCard.svelte';
	import {
		type Snippet,
		type AddressData,
		loadSnippets,
		saveSnippets,
		createSnippet,
		formatPhone,
		formatAddress
	} from '$lib/store';

	// --- Snippets ---
	let snippets = $state<Snippet[]>([]);
	let newLabel = $state('');
	let newValue = $state('');

	// --- Phone ---
	let phoneInput = $state('');
	let phoneFormats = $derived(formatPhone(phoneInput));

	// --- Address ---
	let address = $state<AddressData>({ street: '', city: '', state: '', zip: '' });
	let addressFormats = $derived(formatAddress(address));

	onMount(() => {
		snippets = loadSnippets();
	});

	function addSnippet() {
		if (!newLabel.trim() || !newValue.trim()) return;
		const s = createSnippet(newLabel.trim(), newValue.trim());
		snippets = [...snippets, s];
		saveSnippets(snippets);
		newLabel = '';
		newValue = '';
	}

	function deleteSnippet(id: string) {
		snippets = snippets.filter((s) => s.id !== id);
		saveSnippets(snippets);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			addSnippet();
		}
	}
</script>

<svelte:head>
	<title>Cope — Job App Clipboard</title>
	<meta name="description" content="Quick-copy snippets for job applications" />
</svelte:head>

<div class="min-h-screen bg-base-100">
	<!-- Header -->
	<header class="border-b border-base-content/5 bg-base-100/80 backdrop-blur-lg sticky top-0 z-50">
		<div class="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
			<h1 class="text-lg font-bold tracking-tight text-base-content">cope</h1>
			<span class="text-[10px] text-base-content/25">click any card to copy</span>
		</div>
	</header>

	<main class="max-w-xl mx-auto px-4 py-5 flex flex-col gap-6">

		<!-- ═══ SNIPPETS ═══ -->
		<section>
			<h2 class="text-[11px] font-semibold uppercase tracking-widest text-base-content/30 mb-2">Snippets</h2>

			<!-- Add form -->
			<div class="flex gap-2 mb-3">
				<input
					type="text"
					class="input input-bordered input-sm flex-[2] bg-base-200 min-w-0"
					placeholder="Label"
					bind:value={newLabel}
					onkeydown={handleKeydown}
				/>
				<input
					type="text"
					class="input input-bordered input-sm flex-[3] bg-base-200 min-w-0"
					placeholder="Value"
					bind:value={newValue}
					onkeydown={handleKeydown}
				/>
				<button
					class="btn btn-primary btn-sm"
					onclick={addSnippet}
					disabled={!newLabel.trim() || !newValue.trim()}
				>+</button>
			</div>

			{#if snippets.length === 0}
				<p class="text-xs text-base-content/20 text-center py-4">No snippets yet — add your name, email, LinkedIn, etc.</p>
			{:else}
				<div class="flex flex-col gap-1.5">
					{#each snippets as snippet (snippet.id)}
						<CopyCard
							label={snippet.label}
							value={snippet.value}
							ondelete={() => deleteSnippet(snippet.id)}
							compact
						/>
					{/each}
				</div>
			{/if}
		</section>

		<div class="divider my-0"></div>

		<!-- ═══ PHONE ═══ -->
		<section>
			<h2 class="text-[11px] font-semibold uppercase tracking-widest text-base-content/30 mb-2">Phone Formats</h2>
			<input
				type="tel"
				class="input input-bordered input-sm w-full bg-base-200 mb-3"
				placeholder="Enter 10-digit number"
				bind:value={phoneInput}
			/>
			{#if phoneFormats.length > 0}
				<div class="flex flex-col gap-1.5">
					{#each phoneFormats as fmt}
						<CopyCard label={fmt.label} value={fmt.value} compact />
					{/each}
				</div>
			{/if}
		</section>

		<div class="divider my-0"></div>

		<!-- ═══ ADDRESS ═══ -->
		<section>
			<h2 class="text-[11px] font-semibold uppercase tracking-widest text-base-content/30 mb-2">Address Formats</h2>
			<div class="flex flex-col gap-2 mb-3">
				<input type="text" class="input input-bordered input-sm w-full bg-base-200" placeholder="Street" bind:value={address.street} />
				<div class="grid grid-cols-3 gap-2">
					<input type="text" class="input input-bordered input-sm bg-base-200" placeholder="City" bind:value={address.city} />
					<input type="text" class="input input-bordered input-sm bg-base-200 uppercase" placeholder="ST" maxlength={2} bind:value={address.state} />
					<input type="text" class="input input-bordered input-sm bg-base-200" placeholder="ZIP" bind:value={address.zip} />
				</div>
			</div>
			{#if addressFormats.length > 0}
				<div class="flex flex-col gap-1.5">
					{#each addressFormats as fmt}
						<CopyCard label={fmt.label} value={fmt.value} compact />
					{/each}
				</div>
			{/if}
		</section>
	</main>

	<footer class="border-t border-base-content/5 py-3 text-center text-[10px] text-base-content/20">
		made by <a href="https://www.tlo3.com/" target="_blank" rel="noopener noreferrer" class="underline hover:text-base-content/50 transition-colors">Thomas "Trey" Lanier Orr III</a>
	</footer>
</div>
