import type { Preview } from '@storybook/sveltekit';
import '../src/routes/reset.css';
import '../src/routes/tokens.css';
import '../src/routes/core.css';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},

		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: 'error'
		}
	}
};

export default preview;
