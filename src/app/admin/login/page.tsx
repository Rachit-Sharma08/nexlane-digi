import { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login | Nexlane admin",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="glass p-8 space-y-6">
          <div className="text-center">
            <h1 className="font-display text-2xl font-semibold mb-2 text-[var(--text)]">Admin login</h1>
            <p className="text-[var(--muted)] text-sm">Enter the admin password to continue</p>
          </div>
          <LoginForm />
        </div>
        <p className="mt-4 text-center text-xs text-[var(--muted)]">
          Changes save to blog.json and go live on the next deploy.
        </p>
      </div>
    </main>
  );
}