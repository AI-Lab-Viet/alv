import LoginForm from "@/components/login-form";
import { supabase } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  // If Supabase is not configured, show setup message directly
  if (!supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">
          Connect Supabase to get started
        </h1>
      </div>
    );
  }

  // Check if user is already logged in
  const {
    data: { session },
  } = await supabase.auth.getSession();


  // If user is logged in, redirect to home page
  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4 py-12 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
}
