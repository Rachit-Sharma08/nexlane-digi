"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Generic error message - don't reveal if email exists or not
        setError(data.error || "Invalid credentials");
        return;
      }

      // Successful login - redirect to dashboard
      const adminRoute = data.adminRoute || "/admin";
      router.push(adminRoute);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          placeholder="Enter your email"
          autoComplete="email"
          disabled={loading}
          required
          aria-describedby={error ? "login-error" : undefined}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={loading}
          required
          aria-describedby={error ? "login-error" : undefined}
        />
      </div>

      {error && (
        <p id="login-error" className="text-sm text-[rgb(239,68,68)]" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}