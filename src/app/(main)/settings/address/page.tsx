import Link from "next/link";
import SettingsTitle from "@/components/features3/settings/ui/SettingsTitle";

export default function AddressSettingsPage() {
  return (
    <div className="pb-8">
      <SettingsTitle>住所設定</SettingsTitle>

      <div className="space-y-3">
        <Link
          href="/settings/address/deliveryaddress"
          className="block rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
        >
          <p className="font-semibold text-gray-900">発送先住所</p>
          <p className="mt-1 text-sm text-gray-500">購入時に使う配送先住所を設定</p>
        </Link>

        <Link
          href="/settings/address/senderaddress"
          className="block rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
        >
          <p className="font-semibold text-gray-900">発送元住所</p>
          <p className="mt-1 text-sm text-gray-500">出品時に使う発送元住所を設定</p>
        </Link>
      </div>
    </div>
  );
}
