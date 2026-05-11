import { browser } from '$app/environment';

export interface Snippet {
	id: string;
	label: string;
	value: string;
	category: 'general' | 'phone' | 'address';
}

export interface AddressData {
	street: string;
	city: string;
	state: string;
	zip: string;
}

const STORAGE_KEY = 'cope-snippets';
const PHONE_KEY = 'cope-phone';
const ADDRESS_KEY = 'cope-address';

function generateId(): string {
	return crypto.randomUUID();
}

export function loadSnippets(): Snippet[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

export function saveSnippets(snippets: Snippet[]): void {
	if (!browser) return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
}

export function loadPhone(): string {
	if (!browser) return '';
	return localStorage.getItem(PHONE_KEY) ?? '';
}

export function savePhone(value: string): void {
	if (!browser) return;
	localStorage.setItem(PHONE_KEY, value);
}

export function loadAddress(): AddressData {
	if (!browser) return { street: '', city: '', state: '', zip: '' };
	try {
		const raw = localStorage.getItem(ADDRESS_KEY);
		return raw ? JSON.parse(raw) : { street: '', city: '', state: '', zip: '' };
	} catch {
		return { street: '', city: '', state: '', zip: '' };
	}
}

export function saveAddress(addr: AddressData): void {
	if (!browser) return;
	localStorage.setItem(ADDRESS_KEY, JSON.stringify(addr));
}

export function createSnippet(label: string, value: string, category: Snippet['category'] = 'general'): Snippet {
	return { id: generateId(), label, value, category };
}

const STATE_NAMES: Record<string, string> = {
	AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
	CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
	HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
	KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
	MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
	MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
	NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
	OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
	SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
	VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
	DC: 'District of Columbia',
};

export function stateCodeToName(code: string): string | undefined {
	return STATE_NAMES[code.toUpperCase().trim()];
}

/** Given a raw 10-digit phone input, return the 4 key formats */
export function formatPhone(raw: string): { label: string; value: string }[] {
	const digits = raw.replace(/\D/g, '');
	if (digits.length !== 10) return [];

	const area = digits.slice(0, 3);
	const mid = digits.slice(3, 6);
	const last = digits.slice(6, 10);

	return [
		{ label: 'Digits', value: digits },
		{ label: 'Parentheses', value: `(${area}) ${mid}-${last}` },
		{ label: 'Dashes', value: `${area}-${mid}-${last}` },
		{ label: 'With country', value: `1-${area}-${mid}-${last}` },
	];
}

/** Given address components, return formatted strings */
export function formatAddress(addr: AddressData): { label: string; value: string }[] {
	const { street, city, state, zip } = addr;
	if (!street && !city && !state && !zip) return [];

	const stateUpper = state.toUpperCase().trim();
	const stateName = stateCodeToName(stateUpper);
	const results: { label: string; value: string }[] = [];

	// Combined formats
	if (street && city && stateUpper && zip) {
		results.push({ label: 'Standard', value: `${street}, ${city}, ${stateUpper} ${zip}` });
		results.push({ label: 'Two-line', value: `${street}\n${city}, ${stateUpper} ${zip}` });
	}

	// Individual parts
	if (street) results.push({ label: 'Street', value: street });
	if (city) results.push({ label: 'City', value: city });
	if (stateUpper) results.push({ label: 'State code', value: stateUpper });
	if (stateName) results.push({ label: 'State name', value: stateName });
	if (zip) results.push({ label: 'ZIP', value: zip });
	if (city && stateUpper) results.push({ label: 'City, State', value: `${city}, ${stateUpper}` });
	if (city && stateUpper && zip) results.push({ label: 'City, State ZIP', value: `${city}, ${stateUpper} ${zip}` });

	return results;
}

export async function copyToClipboard(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
}
