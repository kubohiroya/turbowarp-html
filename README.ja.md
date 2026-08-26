# TurboWarp HTML

[English](README.md)

TurboWarp 上で HTML を immutable な構造化フラグメントとして組み立て、最後の出力境界でだけ HTML 文字列へレンダリングする拡張です。

## 概要

- エスケープ済みテキスト、要素、属性、兄弟フラグメント列を作れます。
- 中間値は raw HTML 文字列ではなく、構造化ツリーとして保持します。
- 危険なタグ名、`on*` 属性、実行可能 URL scheme を拒否します。
- `img` や `input` などの void element を HTML セマンティクスに沿って出力します。
- ブロックなしで使える TypeScript composition API も `src/html.ts` から提供します。

## HTTP Server 連携

`turbowarp-http-server` とは npm パッケージ依存では結合しません。HTML 拡張で作ったフラグメントを `render HTML` で文字列化し、HTTP レスポンス本文として渡してください。content type は `text/html; charset=utf-8` を明示する想定です。

## 開発

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm run check
```

## ライセンス

SPDX-License-Identifier: MPL-2.0
