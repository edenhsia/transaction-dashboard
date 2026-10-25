# PrimeVue Vite Starter

A Vue 3 starter template with TypeScript, Vite, PrimeVue, Tailwind CSS, and auto imports already configured.

## Stack

- Vue 3
- Vite
- TypeScript
- PrimeVue
- Tailwind CSS
- unplugin-auto-import
- unplugin-vue-components

## Features

- PrimeVue theme setup with Aura
- Auto-imported Vue APIs such as `ref` and `computed`
- Auto-imported PrimeVue components with the `Prime` prefix
- Auto-imported local components and views
- Tailwind CSS utilities
- ESLint and Prettier scripts

## Getting Started

Install dependencies:

```sh
pnpm install
```

Start the development server:

```sh
pnpm dev
```

Build for production:

```sh
pnpm build
```

Run lint:

```sh
pnpm lint
```

Format files:

```sh
pnpm format
```

## Auto Imports

Vue APIs are configured in `vite.config.ts` through `unplugin-auto-import`.

PrimeVue components are configured through `unplugin-vue-components` and `@primevue/auto-import-resolver`.

Use PrimeVue components in templates with the `Prime` prefix:

```vue
<template>
  <PrimeButton label="Save" />
  <PrimeCard>
    <template #title>Card title</template>
  </PrimeCard>
</template>
```

Local components and views are scanned from:

- `src/components`
- `src/views`
