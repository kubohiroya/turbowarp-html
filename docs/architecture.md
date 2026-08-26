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
