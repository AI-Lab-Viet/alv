"use server";

import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  if (!formData) {
    return { error: "Form data is missing" };
  }

  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.toString(),
    password: password.toString(),
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  if (!formData) {
    return { error: "Form data is missing" };
  }

  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      // options: {
      //   emailRedirectTo:
      //     process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL ||
      //     `${
      //       process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      //     }/auth/callback`,
      // },
    });

    if (error) {
      return { error: error.message };
    }

    // Use the user data from the signUp response
    const user = data?.user;
    if (!user) {
      return { error: "User not found after sign up." };
    }

    const { error: insertError } = await supabase
      .from("users")
      .insert({ id: user.id, email: user.email });

    if (insertError) {
      return { error: insertError.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Sign up error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
