# データ可視化ツール

CSVやJSONファイルをアップロードして、グラフや表でデータを可視化できるWebアプリケーションです。

## 機能

- **ファイルアップロード**: CSV/JSONファイルのドラッグ＆ドロップ対応
- **データプレビュー**: アップロードしたデータの表形式表示
- **グラフ生成**: 折れ線グラフ、棒グラフ、散布図、円グラフ
- **軸選択**: X軸・Y軸を自由に選択可能
- **レスポンシブデザイン**: モバイル・デスクトップ対応

## 対応ファイル形式

### CSVファイル
```csv
日付,売上,利益,顧客数
2024-01-01,120000,24000,45
2024-01-02,135000,27000,52
```

### JSONファイル
```json
[
  {
    "月": "1月",
    "気温": 5.2,
    "降水量": 45.3
  }
]
```

## 使用方法

1. `index.html`をブラウザで開く
2. CSVまたはJSONファイルをアップロード
3. グラフタイプと軸を選択
4. 「グラフ生成」ボタンをクリック

## サンプルデータ

- `sample-data.csv`: 売上データのサンプル
- `sample-data.json`: 気象データのサンプル

## GitHub Pagesでの公開方法

### 1. リポジトリの作成
```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. GitHubにプッシュ
```bash
git remote add origin https://github.com/yourusername/data-visualizer.git
git branch -M main
git push -u origin main
```

### 3. GitHub Pagesの設定
1. GitHubリポジトリのページを開く
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: main
5. Save

### 4. 公開URL
`https://yourusername.github.io/data-visualizer/`

## 技術仕様

- **HTML5**: セマンティックマークアップ
- **CSS3**: Bootstrap 5 + カスタムスタイル
- **JavaScript**: ES6+ (Chart.js, PapaParse)
- **ライブラリ**:
  - Chart.js: グラフ描画
  - PapaParse: CSV解析
  - Bootstrap: UIフレームワーク
  - Font Awesome: アイコン

## ブラウザ対応

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。

## 更新履歴

- v1.0.0: 初期リリース
  - CSV/JSONファイル対応
  - 4種類のグラフタイプ
  - ドラッグ＆ドロップ機能 