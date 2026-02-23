export const uploadImageDirect = async (
  token: string,
  filename: string,
  file: File,
): Promise<void> => {
  const formData = new FormData();
  formData.append("file", file);

  const uploadUrl =
    process.env.NEXT_PUBLIC_MEDIA_UPLOAD_URL || "http://localhost:8787/upload";

  await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Filename": filename,
    },
    body: formData,
  });
};
