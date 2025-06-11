# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server
- `npm run dev -- --open` - Start dev server and open in browser
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run check` - Run Svelte type checking
- `npm run lint` - Run Prettier and ESLint checks
- `npm run format` - Format code with Prettier

## Architecture

This is a SvelteKit web application for generating CSS `shape()` values. The app provides both parametric shape generators and a visual editor.

### Core Shape System

The shape system is built around these key classes:

- `Shape` - Represents a complete CSS shape() function with commands and optional fill rule
- `Drawing` - Collection of vertices that can be converted to a Shape
- `Vertex` - Point in the drawing with position and dimensions
- Command classes (`From`, `Line`, `Move`, `Curve`, `Close`) - Individual shape path commands

### Application Structure

- `/` - Homepage with links to generators
- `/generators/[type]` - Parametric shape generators (regular-polygon, star, squircle)
- `/editor` - Visual drag-and-drop shape editor

Parametric shapes implement the `ParametricShape` interface and generate shapes programmatically. The visual editor uses `Drawing` class with draggable vertices that convert to shape commands.

### Key Libraries

- SvelteKit with TypeScript
- `@neodrag/svelte` for drag-and-drop functionality in the editor
- CSS custom properties for theming
