export const getImageUrl = (imageId: string | number | null | undefined) => {
  if (!imageId) return "/no-image.png";

  const idStr = String(imageId);

  if (idStr.startsWith("http")) return idStr;

  return `http://localhost:8787/${idStr}`;
};