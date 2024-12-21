"use server"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
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

export async function verifyOtp(email: string, token: string) {
  const supabase = createServerActionClient({ cookies });
  const {
    data: { session },
    error,
  } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  console.log(session);

  if (error) {
    console.error(error);
    throw "Unable to login."
  }
}
