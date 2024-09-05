import type { APIContext } from "astro";
import { logout } from "@/lib/auth/utils";

export async function POST(context: APIContext): Promise<Response> {
  return await logout(context);
}
