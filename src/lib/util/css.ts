export type CssDeclarationBlock = CssDeclaration[];

export type CssDeclaration =
	| { type: 'property'; key: string; value: string }
	| { type: 'comment'; value: string }
	| { type: 'blank-line' }
	| { type: 'statement'; value: string; block: CssDeclarationBlock };

export function cssDeclarationBlockToCss(
	declarationBlock: CssDeclarationBlock,
	indentLevel = 0
): string {
	const indent = '\t'.repeat(indentLevel);
	return declarationBlock
		.map((declaration) => {
			switch (declaration.type) {
				case 'property':
					return `${indent}${declaration.key}: ${declaration.value.replaceAll('\n', `\n${indent}`)};`;
				case 'comment':
					return `${indent}/* ${declaration.value} */`;
				case 'blank-line':
					return '';
				case 'statement':
					return `${indent}${declaration.value} {\n${cssDeclarationBlockToCss(declaration.block, indentLevel + 1)}\n}`;
			}
		})
		.join('\n');
}
