/**
 * Same-origin fetch helper. /api/* is proxied to the NestJS backend by
 * next.config rewrites; the session lives in an httpOnly cookie, so no
 * Authorization header is needed in the browser.
 */
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      ...(typeof init.body === "string"
        ? { "Content-Type": "application/json" }
        : {}),
      ...init.headers,
    },
    credentials: "same-origin",
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (body as { error?: string; message?: string }).error ??
        (body as { message?: string }).message ??
        `Request gagal (${res.status})`,
    );
  }
  return body as T;
}
