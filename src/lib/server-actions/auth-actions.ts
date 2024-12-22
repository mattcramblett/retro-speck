"use server"
import { createServerActionClient, User } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function loginWithOtp(email: string) {
  const supabase = createServerActionClient({ cookies });
  const { error } = await supabase.auth.signInWithOtp({ email });
  const cookiesList = await cookies();

  // TODO: Use this cookie to remember email? This would make it easier to put OTP in a separate form.
  cookiesList.set('email', email, { 
    maxAge: 60 * 60,
    path: '/',       // Cookie is accessible from the entire domain (optional)
    sameSite: 'strict' // Prevents CSRF attacks
  }); 

  if (error) {
    console.error(error);
    throw "Unable to send one time password!";
  }
}

export async function verifyOtp(email: string, token: string): Promise<string> {
  const supabase = createServerActionClient({ cookies });
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (error) {
    console.error(error);
    throw "Unable to login."
  }
  return (await cookies()).get("forwardUrl")?.value || "/";
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createServerActionClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user;
}

export async function getUserOrThrow(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw "Unauthorized";
  return user;
}
