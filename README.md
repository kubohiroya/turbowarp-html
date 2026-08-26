# TurboWarp HTML Builder

`@kubohiroya/turbowarp-html` provides safe immutable Builder-pattern-style HTML fragments for TurboWarp and TypeScript.

## TurboWarp model

Blocks create opaque fragment handles. Fragments can be nested, combined, decorated with attributes, and rendered only at the output boundary:

```text
h1 (text "Server status")
  followed by p (text "Running")
  -> div
  -> with attribute class = "card"
  -> render HTML
```

Result:

```html
<div class="card"><h1>Server status</h1><p>Running</p></div>
```

Plain text is escaped. Ordinary blocks do not accept raw HTML.

## TypeScript API

```ts
import {append, div, h1, p, renderHtml, text, withAttribute} from '@kubohiroya/turbowarp-html/core';

const content = append(h1(text('Server status')), p(text('Running')));
const card = withAttribute(div(content), 'class', 'card');
console.log(renderHtml(card));
```

## HTTP response example

The package is intentionally independent of `turbowarp-http-server`. Render the fragment to a string and return it with:

```text
Content-Type: text/html; charset=utf-8
```

## Safety model

- Text nodes and attribute values are escaped.
- `on*` event-handler attributes are rejected.
- `script`, `iframe`, `object`, and `embed` are rejected by the safe generic element builder.
- URL-bearing attributes reject executable schemes such as `javascript:`.
- Raw HTML is intentionally not part of the initial API.

This is a safe construction boundary, not a general-purpose HTML sanitizer for arbitrary pre-existing HTML.

## License

MPL-2.0
