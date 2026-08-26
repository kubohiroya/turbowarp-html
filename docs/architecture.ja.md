# アーキテクチャ

[English](architecture.md)

## モデル

HTML は immutable な `text`、`element`、`sequence`、`empty` フラグメントとして表現します。builder 操作は入力を変更せず、新しい値を返します。HTML 文字列は `render` でのみ生成します。

## 安全方針

テキストは `&`、`<`、`>` をエスケープします。属性値は quoted attribute として出力し、`"` もエスケープします。

タグ名と属性名は保守的な名前パターンで検証します。初期版では `script`、`style`、`iframe`、`object`、`embed`、`on*` 属性、`javascript:` などの危険な `href`/`src` URL を拒否します。raw HTML ブロックは v1 では提供しません。

## TurboWarp 境界

reporter block 間では `turbowarp-html:v1:` 接頭辞付きの値を渡します。content 引数に通常文字列が渡された場合は text node として扱い、trusted HTML として解釈しません。
