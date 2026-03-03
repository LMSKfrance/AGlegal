export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-\u10A0-\u10FF]+/g, "") // allow Georgian
    .replace(/\-\-+/g, "-")
    .replace(/^-|-$/g, "");
}
