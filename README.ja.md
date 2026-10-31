# TurboWarp HTML

<img src="assets/block-icon.svg" alt="" width="48" height="48">

[English](README.md) | 日本語

TurboWarp 上で HTML を immutable な構造化フラグメントとして組み立て、最後の出力境界でだけ HTML 文字列へレンダリングする拡張です。

## 実行できるサンプル

[**TurboWarp Editorでデモを開く**](https://turbowarp.org/editor?project_url=https%3A%2F%2Fkubohiroya.github.io%2Fturbowarp-html%2Fsamples%2Fbuild-html-card.sb3) · [SB3をダウンロード](https://kubohiroya.github.io/turbowarp-html/samples/build-html-card.sb3)

**Allow**で読み込みを許可し、緑の旗を押します。
`h1`・`p`・`render`で小さなカードのHTML文字列を生成。サンプルの元データと期待結果は[`samples/README.md`](samples/README.md)に記載しています。

`pnpm run samples:build`でSB3を再生成し、`pnpm run samples:check`で更新漏れと生成処理を確認します。

## 概要

- エスケープ済みテキスト、要素、属性、兄弟フラグメント列を作れます。
- 中間値は raw HTML 文字列ではなく、構造化ツリーとして保持します。
- 危険なタグ名、`on*` 属性、実行可能 URL scheme を拒否します。
- validation なしの HTML 化と、validation して直近 error を保持する HTML 化を選べます。
- `img` や `input` などの void element を HTML セマンティクスに沿って出力します。
- 教育用途の CSS は専用の `style [CSS]` ブロックで記述できます。
- Scratch、TurboWarp、同一サイト上の TurboWarp Packager HTML 作品を再生する専用 iframe ブロックを提供します。
- ブロックなしで使える TypeScript composition API も `src/html.ts` から提供します。

CSS を使う場合は、要素に `class` 属性を付け、`head` 内の `style [CSS]` で class を定義する構成を推奨します。JavaScript や `on*` event handler 属性は引き続きサポートしません。CSS は要素を隠したり UI を模倣したりできるため、信頼できるプロジェクトだけを読み込んでください。

汎用の `iframe` 要素は引き続きサポートしません。作品を再生する場合は、Scratch、TurboWarp、または同一サイト上の Packager HTML 作品向けの専用 iframe ブロックを使ってください。

## HTTP Server 連携

`turbowarp-http-server` とは npm パッケージ依存では結合しません。HTML 拡張で作ったフラグメントを `render HTML` で文字列化し、HTTP レスポンス本文として渡してください。content type は `text/html; charset=utf-8` を明示する想定です。

## Document Dataで解析・読み取りする

`turbowarp-html:v1:`の値は組み立て用の形式で、読み取るための木ではありません。`ul`などの子要素が入れ子の`sequence`にまとまったまま入ることがあります。組み立てた文書の一部を読み取ったり置き換えたり、構造を順にたどったりするときは、`render HTML`で文字列にして[TurboWarp Document Data](https://github.com/kubohiroya/turbowarp-document-data)へ渡してください。

```text
parse HTML (render HTML (fragment)) as document [doc]
```

Document Dataは解析したHTMLをelement・text・commentのノードの木として保持し、子は常に平らな`children`配列に並びます。位置を指定してtextを読み取り・置き換えるblockがあります。2つの拡張はnpmパッケージ依存を持たず、描画した文字列だけを受け渡すため、この拡張はサンドボックス内のまま動作します。Document Data自体はサンドボックスなしで動作します。

## 開発

```bash
npm install --global corepack@latest
corepack enable
pnpm install --frozen-lockfile
pnpm run check
```

## ライセンス

SPDX-License-Identifier: MPL-2.0
