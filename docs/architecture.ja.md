# アーキテクチャ

[English](architecture.md)

## モデル

HTML は immutable な `text`、`element`、`sequence`、`empty` フラグメントとして表現します。builder 操作は入力を変更せず、新しい値を返します。HTML 文字列は `render` でのみ生成します。

## 安全方針

テキストは `&`、`<`、`>` をエスケープします。属性値は quoted attribute として出力し、`"` もエスケープします。

タグ名と属性名は保守的な名前パターンで検証します。汎用の `script`、`iframe`、`object`、`embed` 要素、`on*` 属性、`javascript:` などの危険な `href`/`src` URL は拒否します。

Scratch、TurboWarp、同一サイト上の TurboWarp Packager HTML 作品の再生用 iframe は、汎用 element builder ではなく専用 builder からだけ作ります。Scratch/TurboWarp 用 builder は数値の project ID から既知の embed URL を組み立てます。Packager 用 builder は相対 URL だけを受け付け、任意の外部ページ埋め込みにならないようにします。raw HTML ブロックは v1 では提供しません。

## バリデーション

validator は軽量なツリーチェックです。`render HTML [FRAGMENT]` は validation なしでレンダリングします。`render HTML with validation [FRAGMENT]` はレンダリング前に validation を実行し、直近の validated render の validation 結果を保持します。保持された error 文字列は `last HTML validation errors`、boolean 状態は `last rendered HTML has validation errors?` から取得できます。

これは HTTP レスポンス処理との連携点です。server 拡張は validation 付き render ブロックを使い、その後で保持済み error を確認し、必要ならレスポンス本文を説明付きエラーページに差し替え、同じ診断をログに出せます。

void element の子、`ul`/`ol` 外の `li`、`tr` 外の `th`/`td`、table/table section 外の `tr`、nested form などは error として報告します。空フラグメント、複数 root、`head`/`body` の配置、`body` 不足、`img` の `alt` 不足、`a` の `href` 不足、`input` の `type` 不足などは warning として報告します。

完全な HTML conformance checker の代替ではありません。

## TurboWarp 境界

reporter block 間では `turbowarp-html:v1:` 接頭辞付きの値を渡します。content 引数に通常文字列が渡された場合は text node として扱い、trusted HTML として解釈しません。
