"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { normalizeUrl } from "@/lib/utils";

interface Props {
  userId: string;
  onBookmarkAdded: () => void;
}

export default function BookmarkForm({ userId, onBookmarkAdded }: Props) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !url.trim()) {
      setErrorMessage("Please enter both title and URL.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const cleanedUrl = normalizeUrl(url);

    const { error } = await supabase.from("bookmarks").insert([
      {
        user_id: userId,
        title: title.trim(),
        url: cleanedUrl,
      },
    ]);

    if (error) {
      if (error.message.includes("unique_user_url")) {
        setErrorMessage("You already saved this bookmark.");
      } else {
        setErrorMessage("Something went wrong.");
        console.error(error.message);
      }
    } else {
      setTitle("");
      setUrl("");
      onBookmarkAdded(); // SIMPLE refresh
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
      <input
        type="text"
        placeholder="Bookmark Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border rounded"
      />

      <input
        type="text"
        placeholder="Bookmark URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-3 border rounded"
      />

      {errorMessage && (
        <p className="text-red-500 text-sm">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full p-3 rounded text-white ${
          loading
            ? "bg-gray-400"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Adding..." : "Add Bookmark"}
      </button>
    </form>
  );
}
