# VGM Frontend (vgm-fe)

VGM (Video Game Market) のフロントエンドアプリケーションです。
Next.js (App Router) と TypeScript で構築され、モダンな UI/UX と PWA 対応を実現しています。

## 🛠 技術スタック

| Category        | Technology               | Version |
| --------------- | ------------------------ | ------- |
| **Framework**   | Next.js (App Router)     | 16.1.5  |
| **Language**    | TypeScript               | 5.x     |
| **Styling**     | Tailwind CSS             | 4.1.17  |
| **Animation**   | Framer Motion, GSAP      | -       |
| **PWA**         | Serwist                  | 9.0.9   |
| **Auth**        | Firebase Authentication  | 12.8.0  |
| **Payment**     | Stripe (React Stripe.js) | -       |
| **Lint/Format** | ESLint, Prettier         | -       |

## ✨ 主な機能

- **モダンな UI デザイン**
  - Tailwind CSS v4 によるスタイリング
  - Framer Motion / GSAP を活用したリッチなアニメーション
  - レスポンシブデザイン

- **PWA 対応 (Progressive Web App)**
  - オフライン対応
  - インストール可能なアプリケーション体験 (@serwist/next)

- **認証機能**
  - メール/パスワード認証
  - ソーシャルログイン (Google, etc.)
  - MFA (多要素認証) UI

- **マーケットプレイス機能**
  - 商品一覧・詳細表示
  - ショッピングカート・決済フロー
  - 画像アップロード (Canvas プレビュー)

## 📂 プロジェクト構成

Next.js App Router の構成に基づいています。

```
vgm-fe/src
├── app/                # ページコンポーネント (ルーティング)
│   ├── auth/           # 認証画面 (login, signup)
│   ├── market/         # マーケット画面
│   └── layout.tsx      # ルートレイアウト
├── components/         # UI コンポーネント
│   ├── ui/             # 汎用 UI コンポーネント (Button, Input etc.)
│   ├── features/       # 機能別コンポーネント (auth, cart etc.)
│   └── layouts/        # レイアウト用コンポーネント (Header, Footer)
├── context/            # React Context (AuthContext etc.)
├── hooks/              # カスタムフック
├── lib/                # ユーティリティ・ライブラリ設定 (firebase, stripe etc.)
├── services/           # API 呼び出しロジック
└── types/              # TypeScript 型定義
```

## 🚀 開発ワークフロー

### 1. 前提条件

- Node.js 18+ (推奨)
- npm

### 2. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成し、必要な値を設定してください。

```bash
cp .env.local.example .env.local
```

### 3. 依存関係のインストール

```bash
npm install
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

`http://localhost:3000` でアプリケーションが起動します。
Serwist のビルドも並行して行われます。

### 5. ビルドと起動 (本番モード)

```bash
# ビルド
npm run build

# 起動
npm run start
```

### 6. コード整形・リント

```bash
# Lint チェック
npm run lint

# Prettier によるフォーマット
npm run format
```

## 🔗 関連リンク

- バックエンド API: [vgm-be](../vgm-be)
- プロキシサーバー: [vgm-proxy](../vgm-proxy)
