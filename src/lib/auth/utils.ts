import { lucia } from "@/lib/auth/lucia";
import type { APIContext } from "astro";
import { generateSignOutUri } from "@logto/js";

// Remove the trailing slash from the Logto endpoint URL if it exists
const endpoint = import.meta.env.LOGTO_ENDPOINT;
export const logtoEndpoint = endpoint?.endsWith("/")
  ? endpoint.slice(0, -1)
  : endpoint;

// Get the Logto access token for API requests
export async function getLogtoAccessToken() {
  return await fetch(`${logtoEndpoint}/oidc/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${import.meta.env.LOGTO_M2M_APP_ID}:${
          import.meta.env.LOGTO_M2M_APP_SECRET
        }`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      resource: `${logtoEndpoint}/api`,
      scope: "all",
    }).toString(),
  })
    .then((response) => response.json())
    .then((data) => data.access_token);
}

export async function logout(context: APIContext) {
  if (!context.locals.session) {
    return new Response(null, {
      status: 401,
    });
  }

  await lucia.invalidateSession(context.locals.session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  const signoutUrl = generateSignOutUri({
    endSessionEndpoint: `${logtoEndpoint}/oidc/session/end`,
    clientId: import.meta.env.LOGTO_APP_ID,
    postLogoutRedirectUri: context.url.origin,
  });

  return context.redirect(signoutUrl);
}

export async function getLogtoUser(
  logtoUserId: string | undefined,
  token: string
) {
  return await fetch(`${logtoEndpoint}/api/users/${logtoUserId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}
