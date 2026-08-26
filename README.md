# TurboWarp HTML

[日本語](README.ja.md)

A TurboWarp extension for building HTML as immutable structured fragments and rendering it only at the output boundary.

## What it does

- creates escaped text fragments, elements, attributes, and sibling sequences;
- keeps intermediate values as a structured tree instead of concatenated raw HTML strings;
- rejects unsafe tag names, event-handler attributes, and executable URL schemes;
- offers separate HTML render blocks with and without validation;
- renders void elements such as `img` and `input` with HTML semantics;
- exports a block-free TypeScript composition API from `src/html.ts`.

## Requirements and safety

- Node.js 22 or newer;
- pnpm through Corepack;
- TurboWarp's unsandboxed extension option is not required.

Text node content is escaped by default. Attribute values are quoted and escaped. The initial version intentionally has no raw HTML block.

## Installation

```bash
corepack enable
pnpm install --frozen-lockfile
```

The package is version-pinned when used from npm:

```bash
pnpm add --save-exact @kubohiroya/turbowarp-html@0.1.0
```

## Quick Start

```ts
import {body, concat, h1, html, p, render} from '@kubohiroya/turbowarp-html';

const page = html(body(concat(h1('Server status'), p('ready'))));
const responseBody = render(page);
```

For `turbowarp-http-server`, pass the rendered string as the response body and select `Content-Type: text/html; charset=utf-8`. The HTTP server does not need a package dependency on this extension.

## Block reference

<!-- BEGIN GENERATED BLOCKS -->

### `text [TEXT]`

Creates an escaped HTML text fragment.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `text` |
| `TEXT` | String, default: `Hello <world>` |

### `element [TAG] content [CONTENT]`

Creates a valid HTML element with escaped structured content.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `element` |
| `TAG` | String, default: `section` |
| `CONTENT` | String, default: `` |

### `[ELEMENT] with attribute [NAME] = [VALUE]`

Returns a new element with a safe escaped attribute value.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `withAttribute` |
| `ELEMENT` | String, default: `` |
| `NAME` | String, default: `class` |
| `VALUE` | String, default: `card` |

### `[LEFT] followed by [RIGHT]`

Creates a fragment sequence from two HTML fragments.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `concat` |
| `LEFT` | String, default: `` |
| `RIGHT` | String, default: `` |

### `render HTML [FRAGMENT]`

Renders an HTML fragment to final HTML text without updating stored validation errors.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `render` |
| `FRAGMENT` | String, default: `` |

### `render HTML with validation [FRAGMENT]`

Validates an HTML fragment, stores any validation errors, and renders final HTML text.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `renderWithValidation` |
| `FRAGMENT` | String, default: `` |

### `last HTML validation errors`

Returns validation errors stored by the most recent render HTML block.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `lastValidationErrors` |

### `last rendered HTML has validation errors?`

Reports whether the most recent render HTML block stored validation errors.

| Property | Value |
|---|---|
| Type | Boolean |
| Opcode | `lastRenderHasValidationErrors` |

### `validate HTML [FRAGMENT]`

Returns simple validation diagnostics for an HTML fragment.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `validateHtml` |
| `FRAGMENT` | String, default: `` |

### `HTML [FRAGMENT] is valid?`

Reports whether simple validation found no HTML errors.

| Property | Value |
|---|---|
| Type | Boolean |
| Opcode | `isValidHtml` |
| `FRAGMENT` | String, default: `` |

### `link [CONTENT] URL [URL]`

Creates an anchor with a conservatively validated URL.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `link` |
| `CONTENT` | String, default: `TurboWarp` |
| `URL` | String, default: `https://turbowarp.org/` |

### `image URL [SRC] alt [ALT]`

Creates a void image element with safe src and escaped alt text.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `image` |
| `SRC` | String, default: `/status.png` |
| `ALT` | String, default: `status` |

### `html [CONTENT]`

Creates an html element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `html` |
| `CONTENT` | String, default: `` |

### `head [CONTENT]`

Creates a head element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `head` |
| `CONTENT` | String, default: `` |

### `body [CONTENT]`

Creates a body element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `body` |
| `CONTENT` | String, default: `` |

### `title [CONTENT]`

Creates a title element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `title` |
| `CONTENT` | String, default: `Status` |

### `h1 [CONTENT]`

Creates an h1 element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `h1` |
| `CONTENT` | String, default: `Server status` |

### `h2 [CONTENT]`

Creates an h2 element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `h2` |
| `CONTENT` | String, default: `Heading` |

### `h3 [CONTENT]`

Creates an h3 element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `h3` |
| `CONTENT` | String, default: `Heading` |

### `h4 [CONTENT]`

Creates an h4 element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `h4` |
| `CONTENT` | String, default: `Heading` |

### `h5 [CONTENT]`

Creates an h5 element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `h5` |
| `CONTENT` | String, default: `Heading` |

### `h6 [CONTENT]`

Creates an h6 element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `h6` |
| `CONTENT` | String, default: `Heading` |

### `p [CONTENT]`

Creates a paragraph element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `p` |
| `CONTENT` | String, default: `Ready` |

### `div [CONTENT]`

Creates a div element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `div` |
| `CONTENT` | String, default: `` |

### `span [CONTENT]`

Creates a span element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `span` |
| `CONTENT` | String, default: `` |

### `ul [CONTENT]`

Creates an unordered list element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `ul` |
| `CONTENT` | String, default: `` |

### `ol [CONTENT]`

Creates an ordered list element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `ol` |
| `CONTENT` | String, default: `` |

### `li [CONTENT]`

Creates a list item element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `li` |
| `CONTENT` | String, default: `item` |

### `table [CONTENT]`

Creates a table element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `table` |
| `CONTENT` | String, default: `` |

### `tr [CONTENT]`

Creates a table row element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `tr` |
| `CONTENT` | String, default: `` |

### `th [CONTENT]`

Creates a table header cell element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `th` |
| `CONTENT` | String, default: `Name` |

### `td [CONTENT]`

Creates a table data cell element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `td` |
| `CONTENT` | String, default: `Value` |

### `form [CONTENT]`

Creates a form element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `form` |
| `CONTENT` | String, default: `` |

### `label [CONTENT]`

Creates a label element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `label` |
| `CONTENT` | String, default: `Name` |

### `input`

Creates a void input element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `input` |

### `textarea [CONTENT]`

Creates a textarea element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `textarea` |
| `CONTENT` | String, default: `` |

### `select [CONTENT]`

Creates a select element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `select` |
| `CONTENT` | String, default: `` |

### `option [CONTENT]`

Creates an option element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `option` |
| `CONTENT` | String, default: `Choice` |

### `button [CONTENT]`

Creates a button element.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `button` |
| `CONTENT` | String, default: `Submit` |

<!-- END GENERATED BLOCKS -->

## Important behavior

Scratch reporter blocks exchange opaque `turbowarp-html:v1:` values while builder blocks are chained. Ordinary strings passed into content positions become escaped text nodes. The final HTML string is produced only by `render HTML [FRAGMENT]`.

The TypeScript API exposes `text`, `element`, common element factories, `withAttribute`, `concat`, `render`, `renderWithValidation`, and `validate`. All builder functions return new values and do not mutate their inputs.

Use `render HTML [FRAGMENT]` when validation is not needed. Use `render HTML with validation [FRAGMENT]` when the final Builder-pattern output should also run validation and store validation errors from that render. Other extensions can read those errors with `last HTML validation errors` or check `last rendered HTML has validation errors?` after rendering. This lets an HTTP extension choose to return an explanatory error page and log the same diagnostics.

Validation is intentionally lightweight. It catches common mistakes such as void elements with children, misplaced `li`/table cells, nested forms, missing important `img` attributes, and unusual `html`/`head`/`body` structure. It is not a full HTML conformance checker.

## Development

```bash
pnpm run check
```

The check runs type checking, linting, tests, generated README validation, `dist/` reproducibility, repository policy validation, and an npm package dry run.

## Release

Keep `package.json` as the version source of truth. Before publishing, run:

```bash
pnpm run check
npm pack --dry-run --ignore-scripts
```

Release artifacts include `dist/turbowarp-html.js`, `dist/extension-manifest.json`, `README.md`, `README.ja.md`, and `LICENSE`.

## License

SPDX-License-Identifier: MPL-2.0
