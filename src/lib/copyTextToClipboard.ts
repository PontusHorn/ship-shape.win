export function copyTextToClipboard(target: HTMLElement) {
	const textToCopy = target.textContent || target.innerText;
	if (!textToCopy) {
		return;
	}

	navigator.clipboard.writeText(textToCopy).catch((err) => {
		console.error('Failed to copy text: ', err);
	});
}
