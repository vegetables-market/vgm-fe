'use client';

import { useEffect, useState } from 'react';
import { fetchTestItems, type TestItem, ApiError } from '@/lib/api';

export default function Home() {
  const [items, setItems] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const data = await fetchTestItems();
        setItems(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(`API Error: ${err.status}`);
        } else {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl">
        <h1 className="text-4xl font-bold">Welcome to VGM Frontend</h1>

        {loading && <p className="mt-4 text-gray-500">Loading...</p>}
        {error && <p className="mt-4 text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-semibold">Items from Backend</h2>
            {items.length > 0 ? (
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.id} className="border-l-4 border-blue-500 pl-4">
                    <span className="font-semibold">ID {item.id}:</span> {item.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No items found</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
