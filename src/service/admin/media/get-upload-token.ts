import { fetchApi } from "@/lib/api/fetch";

/**
 * アップロード用トークン取得 (Admin)
 */
export async function getAdminUploadToken(filename: string): Promise<{
  token: string;
  filename: string;
}> {
  return fetchApi<{ token: string; filename: string }>(
    `/v1/admin/media/upload-token?filename=${filename}`,
    {
      method: "GET",
    },
  );
}

