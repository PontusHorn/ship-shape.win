export class CopyButton extends HTMLElement {
	constructor() {
		super();

		const shadowRoot = this.attachShadow({ mode: 'open' });
		const button = document.createElement('button');
		button.part = 'button';
		button.textContent = 'Copy to clipboard';
		shadowRoot.appendChild(button);
		button.addEventListener('click', this);
	}

	handleEvent(event) {
		if (event.type === 'click') {
			this.copyToClipboard();
		}
	}

	copyToClipboard() {
		const targetId = this.getAttribute('target');
		if (!targetId) {
			console.error('No target specified for copy button');
			return;
		}

		const targetElement = document.getElementById(targetId);
		if (!targetElement) {
			console.error(`Target element with ID ${targetId} not found`);
			return;
		}

		const textToCopy = targetElement.textContent || targetElement.innerText;
		if (!textToCopy) {
			return;
		}

		navigator.clipboard.writeText(textToCopy).catch((err) => {
			console.error('Failed to copy text: ', err);
		});
	}
}

customElements.define('copy-button', CopyButton);
