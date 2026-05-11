import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log("Mobile Success Route hit with params:", searchParams.toString());
  const cookieStore = await cookies();

  // NextAuth cookies can have different names based on environment (Secure prefix in production)
  const token =
    cookieStore.get("next-auth.session-token")?.value ||
    cookieStore.get("__Secure-next-auth.session-token")?.value;

  const redirectUrl = new URL("com.eldokanh.app://callback");

  if (token) {
    console.log("Found token, adding to redirect");
    redirectUrl.searchParams.set("token", token);
  } else {
    console.log("No token found in cookies");
    redirectUrl.searchParams.set("error", "no_token");
  }

  // Forward any other query parameters (like cart data)
  searchParams.forEach((value, key) => {
    if (key !== "token") {
      redirectUrl.searchParams.set(key, value);
    }
  });

  console.log("Redirecting to:", redirectUrl.toString());
  return redirect(redirectUrl.toString());
}
