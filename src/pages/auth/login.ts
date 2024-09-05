import { state, getAuthorizationUrl } from "@/lib/auth/client";
import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response> {
  context.cookies.set("logto_oauth_state", state, {
    path: "/",
    secure: import.meta.env.PROD,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  const authorizationUrl = await getAuthorizationUrl(context.url.origin);

  return context.redirect(authorizationUrl.toString());
}
