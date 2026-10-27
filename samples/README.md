# Htmlの最小デモ

- 配布: [`build-html-card.sb3`](https://kubohiroya.github.io/turbowarp-html/samples/build-html-card.sb3)
- 起動: [TurboWarp Editor](https://turbowarp.org/editor?project_url=https%3A%2F%2Fkubohiroya.github.io%2Fturbowarp-html%2Fsamples%2Fbuild-html-card.sb3)
- 操作: **Allow**で読み込みを許可し、緑の旗を押します。
- 内容: `h1`・`p`・`render`で小さなカードのHTML文字列を生成
- 期待結果: HTML outputは`<h1>Demo</h1><p>Hello &lt;world&gt;</p>`になります。

`manifest.json`に拡張ID・JSパス・sandbox条件・期待結果を記録しています。
`build-html-card/project.json`と自作SVGを編集し、次のコマンドで再生成します。

```bash
pnpm run samples:build
pnpm run samples:check
pnpm run pages:build
```

Node.jsは`.nvmrc`指定版を使います。サンプル生成に追加依存はありません。
生成したSB3もコミットし、`_site/`のdocs・dist・SB3をPagesへ公開します。
unsandboxed拡張は検証対象JSをSB3へ同梱し、利用者が通常の同意画面で許可します。
sandbox互換の拡張はPages上のJSを参照します。

緑の旗で毎回入力から結果を生成します。停止してから再実行できます。

切戻しはサンプル・READMEリンク・Pages配信設定の追加をrevertします。
