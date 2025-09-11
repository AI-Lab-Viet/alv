import SignUpForm from "@/components/sign-up-form";
import { supabase } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
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

  // Check if user is already logged in;
  let session = null;

  if (supabase) {
    const {
      data: { session: supabaseSession },
    } = await supabase.auth.getSession();
    session = supabaseSession;
    // console.log("Session from Supabase:", session);
  }

  // If user is logged in, redirect to home page
  if (session) {
    redirect("/skill-hub");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4 py-12 sm:px-6 lg:px-8">
      <SignUpForm />
    </div>
  );
}
