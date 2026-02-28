export const getImageUrl = (imageId: string | number | null | undefined) => {
  if (!imageId) return "/no-image.png";
  const idStr = String(imageId);
  if (idStr.startsWith("http")) return idStr;

  if (idStr.startsWith("avatar_")) {
    return `http://localhost:8080/uploads/avatars/${idStr}`;
  }

  return `http://localhost:8787/${idStr}`;
};