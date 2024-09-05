import { OAuth2Client, generateState, generateCodeVerifier } from "oslo/oauth2";
import { logtoEndpoint } from "@/lib/auth/utils";
import { withReservedScopes } from "@logto/js";

const clientId = import.meta.env.LOGTO_APP_ID;
const authorizeEndpoint = `${logtoEndpoint}/oidc/auth`;
const tokenEndpoint = `${logtoEndpoint}/oidc/token`;

export function getLogtoClient(baseUrl: string) {
  return new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
    redirectURI: `${baseUrl}/callback`,
  });
}

export const state = generateState();
export const codeVerifier = generateCodeVerifier();

export async function getAuthorizationUrl(baseUrl: string) {
  return await getLogtoClient(baseUrl).createAuthorizationURL({
    state,
    scopes: withReservedScopes().split(" "),
    codeVerifier,
  });
}
