export function extractShapeCommands(cssText: string): string[] {
	return (
		cssText
			// Trim everything except the contents of the shape() function
			.replace(/^.+: shape\(/, '')
			.replace(/\);\s*$/, '')
			// Split into an array of individual commands
			.split(',')
			// Normalize whitespace for simpler, stabler assertions
			.map((s) => s.trim().replace(/\s+/g, ' '))
	);
}
