import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cookieStore = await cookies();

  // NextAuth cookies can have different names based on environment (Secure prefix in production)
  const token =
    cookieStore.get("next-auth.session-token")?.value ||
    cookieStore.get("__Secure-next-auth.session-token")?.value;

  const redirectUrl = new URL("com.eldokanh.app://callback");

  if (token) {
    redirectUrl.searchParams.set("token", token);
  } else {
    redirectUrl.searchParams.set("error", "no_token");
  }

  // Forward any other query parameters (like cart data)
  searchParams.forEach((value, key) => {
    if (key !== "token") {
      redirectUrl.searchParams.set(key, value);
    }
  });

  return redirect(redirectUrl.toString());
}
