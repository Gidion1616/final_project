/* Anwani kuu ya API; Vite hupeleka /api kwenda Django wakati wa development. */
const BASE = import.meta.env.VITE_API_URL || "/api";
/* Huhifadhi Token za mtumiaji ili iendelee baada ya page refresh. */
export const session = {
  get: () => JSON.parse(localStorage.getItem("zanhotel_session") || "null"),
  set: (v) => localStorage.setItem("zanhotel_session", JSON.stringify(v)),
  clear: () => localStorage.removeItem("zanhotel_session"),
};
/* Huongeza headers za Token/JSON, husoma majibu na kuonyesha makosa. */
export async function api(path, options = {}) {
  const s = session.get();
  const headers = {
    ...(s?.token ? { Authorization: `Token ${s.token}` } : {}),
  };
  if (!(options.body instanceof FormData))
    headers["Content-Type"] = "application/json";
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });
  let data = {};
  try {
    data = await res.json();
  } catch {}
  if (!res.ok)
    throw new Error(
      data.detail ||
        Object.values(data.errors || {})
          .flat()
          .join(" ") ||
        "Request failed",
    );
  return data;
}

/*
 * AUTHENTICATED FILE DOWNLOAD
 * EN: Reports require a login token, which a normal anchor link cannot attach.
 * EN: This helper fetches the protected file, creates a temporary browser URL,
 * EN: then starts the download and immediately releases that temporary URL.
 */
export async function downloadFile(path, filename) {
  const s = session.get();
  const response = await fetch(`${BASE}${path}`, {
    headers: s?.token ? { Authorization: `Token ${s.token}` } : {},
  });
  if (!response.ok) {
    let message = "The report could not be downloaded.";
    try {
      message = (await response.json()).detail || message;
    } catch {}
    throw new Error(message);
  }
  const objectUrl = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}
export const money = (n) => new Intl.NumberFormat("en-TZ").format(n || 0);
