import { lucia } from "@/lib/auth/lucia";
import { getLogtoClient, codeVerifier } from "@/lib/auth/client";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { db } from "@/lib/db/index";
import { userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { APIContext } from "astro";
import { logtoEndpoint } from "@/lib/auth/utils";

export async function GET(context: APIContext): Promise<Response> {
  const code = context.url.searchParams.get("code");
  const state = context.url.searchParams.get("state");
  const storedState = context.cookies.get("logto_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const { access_token, refresh_token } = await getLogtoClient(
      context.url.origin
    ).validateAuthorizationCode(code, {
      credentials: import.meta.env.LOGTO_APP_SECRET,
      codeVerifier,
    });

    const response = await fetch(`${logtoEndpoint}/oidc/me`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }).then(async (response) => await response.json());

    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.logtoId, response?.sub));

    if (existingUser.length > 0) {
      const session = await lucia.createSession(existingUser[0].id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      context.cookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      return context.redirect("/protected/dashboard");
    }

    const userId = generateIdFromEntropySize(10); // 16 characters long

    await db.insert(userTable).values({
      id: userId,
      logtoId: response?.sub,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return context.redirect("/protected/dashboard");
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
