import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  const cookieStore = await cookies();
  
  // NextAuth cookies can have different names based on environment (Secure prefix in production)
  const token = 
    cookieStore.get("next-auth.session-token")?.value || 
    cookieStore.get("__Secure-next-auth.session-token")?.value;

  if (token) {
    // Redirect to the app with the session token
    return redirect(`eldokanhapp://auth-callback?token=${token}`);
  }
  
  // Fallback if no token is found
  return redirect("eldokanhapp://auth-callback?error=no_token");
}
