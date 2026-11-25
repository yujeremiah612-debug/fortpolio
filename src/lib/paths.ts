/** Prefix a public asset path with Vite's base (needed for GitHub Pages). */
export function withBase(path: string) {
  if (!path || /^https?:\/\//i.test(path)) return path
  const base = import.meta.env.BASE_URL
  return `${base}${path.replace(/^\//, '')}`
}
