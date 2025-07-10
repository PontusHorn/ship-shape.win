export type CssProperties = Record<string, string>;

export function cssPropertiesToCss(properties: CssProperties): string {
	return Object.entries(properties)
		.map(([key, value]) => `${key}: ${value};`)
		.join('\n\t');
}
