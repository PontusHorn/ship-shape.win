import { createAttachmentKey } from 'svelte/attachments';
import type { HTMLButtonAttributes } from 'svelte/elements';

export function disableUntilHydrated(): Pick<HTMLButtonAttributes, 'disabled' | symbol> {
	return {
		disabled: true,
		[createAttachmentKey()]: (button: HTMLButtonElement) => {
			button.disabled = false;
		}
	};
}
