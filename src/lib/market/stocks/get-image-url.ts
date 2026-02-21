export function getStockImageUrl(raw: string | null | undefined): string {
  const imagePath = raw?.trim();
  if (!imagePath) return "/images/no-image.png";
  if (imagePath.startsWith("http")) return imagePath;

  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:8787";
  const baseUrl = mediaUrl.endsWith("/") ? mediaUrl.slice(0, -1) : mediaUrl;
  const cleanedPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;

  return `${baseUrl}/${cleanedPath}`;
}

