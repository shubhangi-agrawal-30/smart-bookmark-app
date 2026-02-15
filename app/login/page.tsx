"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

/**
 * Login Page
 *
 * Responsibilities:
 * - Redirect authenticated users to dashboard
 * - Trigger Google OAuth login
 * - Handle loading state
 */
export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ==============================
  // 🔐 Redirect if already logged in
  // ==============================
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        router.push("/dashboard");
      }
    };

    checkSession();
  }, [router]);

  // ==============================
  // 🔑 Google OAuth Login
  // ==============================
  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setErrorMessage("Login failed. Please try again.");
      console.error("Login error:", error.message);
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow text-center space-y-6 w-80">
        <h1 className="text-2xl font-bold">
          Smart Bookmark App
        </h1>

        {errorMessage && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Redirecting..." : "Sign in with Google"}
        </button>
      </div>
    </main>
  );
}
