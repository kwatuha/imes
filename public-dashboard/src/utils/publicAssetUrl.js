/**
 * Resolve paths to files in `public/` for the current Vite base (e.g. /citizen/).
 * Root-absolute URLs like /images/x.jpg bypass the base and 404 when mounted under /citizen/.
 */
export function publicAssetUrl(relativePath) {
  const p = String(relativePath).replace(/^\/+/, '');
  return `${import.meta.env.BASE_URL}${p}`;
}
