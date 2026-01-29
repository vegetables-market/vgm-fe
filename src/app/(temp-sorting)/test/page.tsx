import React from "react";
import Link from "next/link";

export default function TestIndexPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Test Pages Index</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/test/cart"
          className="p-4 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <h2 className="font-bold">Cart</h2>
          <p className="text-sm text-gray-500">/test/cart</p>
        </Link>
        <Link
          href="/test/checkout"
          className="p-4 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <h2 className="font-bold">Checkout</h2>
          <p className="text-sm text-gray-500">/test/checkout</p>
        </Link>
        <Link
          href="/test/items"
          className="p-4 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <h2 className="font-bold">Items</h2>
          <p className="text-sm text-gray-500">/test/items</p>
        </Link>
        <Link
          href="/test/profile"
          className="p-4 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <h2 className="font-bold">Profile</h2>
          <p className="text-sm text-gray-500">/test/profile</p>
        </Link>
        <Link
          href="/test/page-test"
          className="p-4 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <h2 className="font-bold">PageTest</h2>
          <p className="text-sm text-gray-500">/test/page-test</p>
        </Link>
      </div>
    </div>
  );
}
