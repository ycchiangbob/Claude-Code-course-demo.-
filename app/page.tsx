"use client";

import { useState } from "react";

export default function Home() {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setWishlistItems([...wishlistItems, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveItem = (index: number) => {
    setWishlistItems(wishlistItems.filter((_, i) => i !== index));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-800 dark:text-white">
            My Wishlist
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Keep track of everything you wish for
          </p>
        </div>

        <form onSubmit={handleAddItem} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add a new wish..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>
        </form>

        <div className="space-y-2">
          {wishlistItems.length === 0 ? (
            <p className="py-8 text-center text-gray-500 dark:text-gray-400">
              Your wishlist is empty. Add your first wish above!
            </p>
          ) : (
            wishlistItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
              >
                <span className="text-gray-800 dark:text-gray-200">{item}</span>
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="ml-4 rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {wishlistItems.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {wishlistItems.length} {wishlistItems.length === 1 ? "wish" : "wishes"} on your list
          </div>
        )}
      </main>
    </div>
  );
}
