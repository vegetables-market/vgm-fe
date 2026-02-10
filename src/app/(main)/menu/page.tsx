import Link from "next/link";

export default function MenuPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Menu</h1>
      <Link href="/login">login</Link>
      <br />
      <Link href="/signup">新規登録</Link>
      <br />
      <Link href="/settings">設定</Link>
    </div>
  );
}
