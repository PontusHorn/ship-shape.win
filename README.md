# ship-shape.win

A web app that lets you generate and edit CSS `shape()` values, for use in
`clip-path`, `offset-path`, and other properties that accept shapes.

## Developing

1. Install dependencies with `npm install`.
2. start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of the app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Contributing

If you want to contribute code, it's suggested to use the pre-push hook to run
tests and other validation before pushing changes. You can install the
pre-push hook by running:

```bash
./hooks/install.sh
```
