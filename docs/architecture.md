# Architecture

[日本語](architecture.ja.md)

## Model

HTML is represented as immutable fragments:

```text
HtmlFragment
  -> text
  -> element(tagName, attributes, children)
  -> sequence(children)
  -> empty
```

Builder operations return new fragment values. Rendering is the only operation that produces final HTML text.

## Safety Policy

Text content escapes `&`, `<`, and `>`. Attribute values are always quoted and also escape `"`.

Tag and attribute names must match a conservative HTML-name pattern. The initial release rejects `script`, `style`, `iframe`, `object`, and `embed` elements, rejects `on*` attributes, and rejects unsafe `href`/`src` URL schemes such as `javascript:`.

There is no raw HTML block in v1.

## Validation

The validator is a lightweight tree check. `render HTML [FRAGMENT]` renders without validation. `render HTML with validation [FRAGMENT]` runs validation before rendering and stores the validation result from the most recent validated render. The stored error text is available through `last HTML validation errors`, and the boolean state is available through `last rendered HTML has validation errors?`.

This is intended as the integration point for HTTP response handling: a server extension can use the validated render block, inspect the stored validation errors, and replace the response body with an explanatory error page while logging the same diagnostics.

The validator reports errors for issues that make the generated structure clearly wrong, such as void elements with children, `li` outside `ul`/`ol`, table cells outside rows, rows outside tables or table sections, and nested forms. It reports warnings for likely authoring problems such as empty fragments, multiple document roots, `head`/`body` placement, missing `body`, `img` without `alt`, anchors without `href`, and inputs without `type`.

Validation does not replace a browser or full HTML conformance checker.

## TurboWarp Boundary

Reporter blocks serialize fragments with a `turbowarp-html:v1:` prefix. Plain strings passed into content arguments are treated as text nodes, so arbitrary user strings are not interpreted as trusted HTML fragments.

## Build Outputs

```text
src/index.ts + src/extension.ts + src/html.ts
  -> vite-plugin-turbowarp-extension
  -> dist/turbowarp-html.js

src/config.ts + src/block-definitions.json
  -> extension-api-manifest Vite plugin
  -> dist/extension-manifest.json
```
